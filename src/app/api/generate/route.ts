import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { UserProfile } from '@/types/profile'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const gemini    = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

const FREE_DAILY_LIMIT = 5
const FREE_MODEL       = 'gemini-2.0-flash'
const PRO_MODEL        = 'claude-sonnet-4-5'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Fetch user + profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*, profiles(*)')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found. Please complete onboarding.' },
        { status: 404 }
      )
    }

    const profile: UserProfile | null = user.profiles

    if (!profile || !profile.completed) {
      return NextResponse.json(
        { error: 'Please complete your freelancer profile before generating proposals.', profileIncomplete: true },
        { status: 400 }
      )
    }

    // Reset daily counter if new day
    const today = new Date().toISOString().split('T')[0]
    if (user.last_reset_date !== today) {
      await supabase
        .from('users')
        .update({ generations_today: 0, last_reset_date: today })
        .eq('clerk_id', userId)
      user.generations_today = 0
    }

    // Free tier limit
    if (user.plan === 'free' && user.generations_today >= FREE_DAILY_LIMIT) {
      return NextResponse.json({
        error:           'Daily limit reached.',
        upgradeRequired: true,
        message:         `Free plan allows ${FREE_DAILY_LIMIT} generations per day. Upgrade to Pro for unlimited.`,
      }, { status: 429 })
    }

    // Parse input
    const body = await req.json()
    const { jobTitle, jobDescription, jobBudget, platform, extraContext } = body

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Paste the full description for best results.' },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt(profile)
    const userPrompt   = buildUserPrompt({ jobTitle, jobDescription, jobBudget, platform, extraContext })

    let rawResult: string

    if (user.plan === 'pro') {
      const message = await anthropic.messages.create({
        model:     PRO_MODEL,
        max_tokens: 2048,
        system:    systemPrompt,
        messages:  [{ role: 'user', content: userPrompt }],
      })
      rawResult = (message.content[0] as { type: 'text'; text: string }).text
    } else {
      const model = gemini.getGenerativeModel({
        model:             FREE_MODEL,
        systemInstruction: systemPrompt,
        generationConfig:  { responseMimeType: 'application/json' },
      })
      const response = await model.generateContent(userPrompt)
      rawResult = response.response.text()
    }

    // Parse JSON safely
    let parsed: {
      proposal:      string
      pricing:       Array<{ item: string; hours: number; rate: number; total: number; notes: string }>
      timeline:      Array<{ phase: string; duration: string; deliverables: string[] }>
      followup:      string
      humanise_tips: string[]
    }

    try {
      const cleaned = rawResult
        .replace(/^```json\s*/m, '')
        .replace(/^```\s*/m, '')
        .replace(/```\s*$/m, '')
        .trim()
      parsed = JSON.parse(cleaned)
    } catch {
      parsed = {
        proposal:      rawResult,
        pricing:       [],
        timeline:      [],
        followup:      '',
        humanise_tips: [],
      }
    }

    // Increment free tier usage
    if (user.plan === 'free') {
      await supabase
        .from('users')
        .update({ generations_today: user.generations_today + 1 })
        .eq('clerk_id', userId)
    }

    // Save to history
    const { data: saved } = await supabase
      .from('proposals')
      .insert({
        user_id:         user.id,
        job_title:       jobTitle || null,
        job_description: jobDescription,
        job_budget:      jobBudget || null,
        platform:        platform || 'general',
        extra_context:   extraContext || null,
        proposal_text:   parsed.proposal,
        pricing_table:   parsed.pricing,
        timeline:        parsed.timeline,
        followup_text:   parsed.followup,
        humanise_tips:   parsed.humanise_tips,
        model_used:      user.plan === 'pro' ? PRO_MODEL : FREE_MODEL,
        word_count:      parsed.proposal?.split(' ').length ?? 0,
      })
      .select('id')
      .single()

    return NextResponse.json({
      success:         true,
      proposalId:      saved?.id,
      output:          parsed,
      modelUsed:       user.plan === 'pro' ? 'Claude Sonnet 4.5' : 'Gemini 2.0 Flash',
      generationsLeft: user.plan === 'free'
        ? FREE_DAILY_LIMIT - (user.generations_today + 1)
        : null,
    })

  } catch (error) {
    console.error('[/api/generate]', error)
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}

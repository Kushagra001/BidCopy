import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase'
import OpenAI from 'openai'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { UserProfile } from '@/types/profile'


const FREE_MODEL = 'gpt-4o-mini'
const PRO_MODEL  = 'gpt-4.1'
const PRO_DAILY_LIMIT = 150

export async function POST(req: NextRequest) {
  try {
    const openai  = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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
        { error: 'User not found. Please complete onboarding.', profileIncomplete: true },
        { status: 404 }
      )
    }

    if (user.plan === 'pro' && user.pro_expires_at && new Date(user.pro_expires_at) < new Date()) {
      user.plan = 'free'
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

    // Enforce daily limits: 15 for Free, and PRO_DAILY_LIMIT for Pro plan (fair use)
    if (user.plan !== 'pro' && user.generations_today >= 15) {
      return NextResponse.json(
        { error: 'Daily limit reached. Upgrade to Pro for unlimited generations.', upgradeRequired: true },
        { status: 403 }
      )
    }

    if (user.plan === 'pro' && user.generations_today >= PRO_DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Fair use policy limit reached (${PRO_DAILY_LIMIT} generations/day). Please try again tomorrow.` },
        { status: 403 }
      )
    }

    // Parse input
    const body = await req.json()
    const { jobTitle, jobDescription, jobBudget, platform, extraContext, model, budgetType } = body

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Paste the full description for best results.' },
        { status: 400 }
      )
    }

    if (user.plan !== 'pro' && platform !== 'upwork' && platform !== 'general') {
      return NextResponse.json(
        { error: `Generating proposals for ${platform} is a Pro feature.`, upgradeRequired: true },
        { status: 403 }
      )
    }

    const systemPrompt = buildSystemPrompt(profile, platform)
    const userPrompt   = buildUserPrompt({ jobTitle, jobDescription, jobBudget, platform, extraContext, budgetType })

    let rawResult: string

    // Both plans use OpenAI — Pro gets gpt-4.1 (or free if requested), Free gets gpt-4o-mini
    const requestedModel = model === 'gpt-4.1' && user.plan === 'pro' ? PRO_MODEL : FREE_MODEL

    const response = await openai.chat.completions.create({
      model:           requestedModel,
      max_tokens:      2048,
      messages:        [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    })
    // eslint-disable-next-line prefer-const
    rawResult = response.choices[0].message.content || ''

    // Parse JSON safely
    let parsed: {
      proposal:      string
      pricing:       Array<{ item: string; hours: number; rate: number; total: number; notes: string }>
      timeline:      Array<{ phase: string; duration: string; deliverables: string[] }>
      followup:      string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      humanise_tips: any[]
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

    // Track usage (no hard limit)
    await supabase
      .from('users')
      .update({ generations_today: user.generations_today + 1 })
      .eq('clerk_id', userId)

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
        model_used:      requestedModel,
        word_count:      parsed.proposal?.split(' ').length ?? 0,
      })
      .select('id')
      .single()

    const generationsLeft = user.plan === 'pro' ? null : Math.max(0, 15 - (user.generations_today + 1))

    return NextResponse.json({
      success:         true,
      proposalId:      saved?.id,
      output:          parsed,
      modelUsed:       requestedModel === PRO_MODEL ? 'GPT-4.1' : 'GPT-4o mini',
      generationsLeft,
    })

  } catch (error) {
    console.error('[/api/generate]', error)
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}

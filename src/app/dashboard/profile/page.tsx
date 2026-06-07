'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { UserProfile } from '@/types/profile'

// ── Zod schema ──────────────────────────────────────────────
const profileSchema = z.object({
  name:          z.string().min(2, 'Enter your name'),
  headline:      z.string().min(10, 'Enter a headline (e.g. Full-stack developer · 5 yrs)'),
  bio:           z.string().min(50, 'Bio should be at least 50 characters'),
  skills:        z.string().min(3, 'Add at least one skill'),
  hourly_rate:   z.string().min(1, 'Enter your hourly rate'),
  currency:      z.enum(['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD']),
  portfolio_url: z.string().url('Enter a valid URL').or(z.literal('')),
  tone:          z.enum(['professional', 'friendly', 'technical', 'bold']),
  speciality:    z.string().min(2, 'Enter your main speciality'),
  projects: z.array(z.object({
    name:        z.string().min(1, 'Project name required'),
    description: z.string().min(10, 'Describe the project'),
    result:      z.string().min(5, 'What was the result?'),
    url:         z.string().optional(),
  })).min(1, 'Add at least one project'),
})

type ProfileForm = z.infer<typeof profileSchema>

// ── Step config ──────────────────────────────────────────────
const STEPS = [
  { title: 'About you',      description: 'Tell us who you are' },
  { title: 'Skills & rates', description: 'Your expertise and pricing' },
  { title: 'Your projects',  description: 'Add 1–3 past projects for context' },
  { title: 'Tone & style',   description: 'How should your proposals sound?' },
]

const TONES = [
  { id: 'professional', label: 'Professional', desc: 'Formal but warm. Measured confidence.' },
  { id: 'friendly',     label: 'Friendly',     desc: 'Conversational and approachable.' },
  { id: 'technical',    label: 'Technical',    desc: 'Precise, detail-oriented.' },
  { id: 'bold',         label: 'Bold',         desc: 'Direct and punchy. No hedging.' },
] as const

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'] as const

export default function ProfilePage() {
  const [step, setStep]     = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProfileForm>({
    resolver:      zodResolver(profileSchema),
    defaultValues: {
      currency: 'USD',
      tone:     'professional',
      projects: [{ name: '', description: '', result: '', url: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'projects' })
  const selectedTone = watch('tone')

  // Load existing profile
  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then(({ profile }) => {
        if (profile) {
          setValue('name',          profile.name ?? '')
          setValue('headline',      profile.headline ?? '')
          setValue('bio',           profile.bio ?? '')
          setValue('skills',        (profile.skills ?? []).join(', '))
          setValue('hourly_rate',   String(profile.hourly_rate ?? 50))
          setValue('currency',      profile.currency ?? 'USD')
          setValue('portfolio_url', profile.portfolio_url ?? '')
          setValue('tone',          profile.tone ?? 'professional')
          setValue('speciality',    profile.speciality ?? '')
          if (profile.projects?.length) setValue('projects', profile.projects)
        }
      })
      .finally(() => setLoading(false))
  }, [setValue])

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    try {
      const payload: Partial<UserProfile> = {
        ...data,
        hourly_rate: Number(data.hourly_rate),
        skills:    data.skills.split(',').map((s) => s.trim()).filter(Boolean),
        completed: true,
      }
      const res = await fetch('/api/profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => (window.location.href = '/dashboard'), 1500)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-bc-surface]">
        <div className="w-8 h-8 border-2 border-[--color-bc-blue] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--color-bc-surface]">
      <header className="bg-white border-b border-[--color-bc-border] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-[--color-bc-blue] text-xl">BidCopy</a>
          <a href="/dashboard" className="text-sm text-[--color-bc-muted] hover:text-[--color-bc-ink]">← Back to dashboard</a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i <= step ? 'bg-[--color-bc-blue]' : 'bg-[--color-bc-border]'}`} />
              <p className={`text-xs mt-2 font-medium ${i === step ? 'text-[--color-bc-blue]' : 'text-[--color-bc-faint]'}`}>
                {s.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[--color-bc-ink]">{STEPS[step].title}</h1>
          <p className="text-[--color-bc-muted] mt-1">{STEPS[step].description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* STEP 0 — About you */}
          {step === 0 && (
            <>
              <Input label="Your name" id="name" {...register('name')} error={errors.name?.message} placeholder="e.g. Rahul Sharma" />
              <Input label="Headline" id="headline" {...register('headline')} error={errors.headline?.message} placeholder="Full-stack developer · 5 years · React, Node.js" />
              <Textarea label="Bio" id="bio" {...register('bio')} error={errors.bio?.message} rows={4}
                placeholder="Write a short bio that captures your expertise. This goes directly into the AI prompt." />
              <Input label="Speciality" id="speciality" {...register('speciality')} error={errors.speciality?.message} placeholder="e.g. SaaS products, e-commerce, mobile apps" />
            </>
          )}

          {/* STEP 1 — Skills & rates */}
          {step === 1 && (
            <>
              <Textarea label="Skills (comma-separated)" id="skills" {...register('skills')} error={errors.skills?.message} rows={3}
                placeholder="React, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind CSS" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Hourly rate" id="hourly_rate" type="number" {...register('hourly_rate')} error={errors.hourly_rate?.message} placeholder="50" min="1" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">Currency</label>
                  <select {...register('currency')} className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] focus:outline-none focus:ring-2 focus:ring-[--color-bc-blue]/20 focus:border-[--color-bc-blue] transition-all">
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <Input label="Portfolio URL" id="portfolio_url" {...register('portfolio_url')} error={errors.portfolio_url?.message} placeholder="https://yourportfolio.com" />
            </>
          )}

          {/* STEP 2 — Projects */}
          {step === 2 && (
            <div className="space-y-6">
              {fields.map((field, i) => (
                <div key={field.id} className="border border-[--color-bc-border] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[--color-bc-ink]">Project {i + 1}</h3>
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    )}
                  </div>
                  <Input label="Project name" {...register(`projects.${i}.name`)} error={errors.projects?.[i]?.name?.message} placeholder="e.g. Medica Health Dashboard" />
                  <Textarea label="What you built" rows={2} {...register(`projects.${i}.description`)} error={errors.projects?.[i]?.description?.message}
                    placeholder="e.g. Built a React + Node.js dashboard for a healthcare startup tracking 10k patients" />
                  <Input label="Result / outcome" {...register(`projects.${i}.result`)} error={errors.projects?.[i]?.result?.message}
                    placeholder="e.g. Reduced reporting time by 40%, client raised Series A" />
                  <Input label="URL (optional)" {...register(`projects.${i}.url`)} placeholder="https://example.com" />
                </div>
              ))}
              {fields.length < 3 && (
                <button type="button" onClick={() => append({ name: '', description: '', result: '', url: '' })}
                  className="w-full border-2 border-dashed border-[--color-bc-border] rounded-xl py-3 text-sm text-[--color-bc-muted] hover:border-[--color-bc-blue] hover:text-[--color-bc-blue] transition-colors">
                  + Add another project
                </button>
              )}
            </div>
          )}

          {/* STEP 3 — Tone */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {TONES.map((t) => (
                <button key={t.id} type="button" onClick={() => setValue('tone', t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTone === t.id
                      ? 'border-[--color-bc-blue] bg-[--color-bc-blue-light]'
                      : 'border-[--color-bc-border] hover:border-[--color-bc-blue]/40'
                  }`}>
                  <div className="font-semibold text-sm text-[--color-bc-ink] mb-1">{t.label}</div>
                  <div className="text-xs text-[--color-bc-muted]">{t.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
                ← Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)} className="flex-1">
                Continue →
              </Button>
            ) : (
              <Button type="submit" loading={saving} className="flex-1">
                {saved ? '✓ Saved! Redirecting…' : 'Save profile & start generating'}
              </Button>
            )}
          </div>

        </form>
      </main>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  platform:       z.enum(['upwork', 'freelancer', 'contra', 'general']),
  jobTitle:       z.string().optional(),
  budgetType:     z.enum(['fixed', 'hourly']),
  jobBudget:      z.string().optional(),
  jobDescription: z.string().min(50, 'Paste the full job description (min 50 chars)'),
  extraContext:   z.string().optional(),
})

export type InputFormData = z.infer<typeof schema>

interface InputPanelProps {
  onGenerate:      (data: InputFormData) => void
  isGenerating:    boolean
  generationsLeft: number | null
  initialValues?:  Partial<InputFormData>
  plan?:           'free' | 'pro'
}

const PLATFORMS = [
  { id: 'upwork',     label: 'Upwork',     dotColor: 'bg-[--color-upwork]' },
  { id: 'freelancer', label: 'Freelancer', dotColor: 'bg-[--color-freelancer]' },
  { id: 'contra',     label: 'Contra',     dotColor: 'bg-[--color-contra]' },
  { id: 'general',    label: 'General',    dotColor: 'bg-[--color-general]' },
] as const

const PLATFORM_STYLES: Record<string, { selected: string; unselected: string }> = {
  upwork: {
    selected: 'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-750 dark:text-emerald-400 ring-2 ring-emerald-500/10',
    unselected: 'border-[--color-bc-border] text-[--color-bc-muted] hover:border-emerald-500/40 hover:text-emerald-700 dark:hover:text-emerald-400',
  },
  freelancer: {
    selected: 'border-blue-500/80 bg-blue-50/50 dark:bg-blue-950/20 text-blue-750 dark:text-blue-400 ring-2 ring-blue-500/10',
    unselected: 'border-[--color-bc-border] text-[--color-bc-muted] hover:border-blue-500/40 hover:text-blue-700 dark:hover:text-blue-400',
  },
  contra: {
    selected: 'border-teal-500/80 bg-teal-50/50 dark:bg-teal-950/20 text-teal-750 dark:text-teal-400 ring-2 ring-teal-500/10',
    unselected: 'border-[--color-bc-border] text-[--color-bc-muted] hover:border-teal-500/40 hover:text-teal-700 dark:hover:text-teal-400',
  },
  general: {
    selected: 'border-slate-500/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-750 dark:text-slate-300 ring-2 ring-slate-500/10',
    unselected: 'border-[--color-bc-border] text-[--color-bc-muted] hover:border-slate-500/40 hover:text-slate-700 dark:hover:text-slate-300',
  },
}

export function InputPanel({ onGenerate, isGenerating, generationsLeft, initialValues, plan = 'free' }: InputPanelProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InputFormData>({
    resolver:      zodResolver(schema),
    defaultValues: { platform: 'upwork', budgetType: 'fixed' },
  })

  useEffect(() => {
    if (initialValues) {
      reset({ budgetType: 'fixed', ...initialValues })
    }
  }, [initialValues, reset])

  const loadSampleData = () => {
    reset({
      platform: 'upwork',
      jobTitle: 'Senior React Developer for Healthcare Dashboard',
      budgetType: 'fixed',
      jobBudget: '$2,500',
      jobDescription: 'We are seeking an experienced React developer to help us polish and build out our new patient analytics dashboard. The design is mostly done in Figma, but we need someone to build the frontend, hook up the charting library (Recharts), and implement smooth, premium transitions. Must have 3+ years experience with Next.js, TypeScript, and Tailwind CSS. Responsive design and WCAG AA accessibility compliance are highly important. The project needs to be delivered in 2 weeks.',
      extraContext: 'Focus on my extensive experience with Recharts and pixel-perfect UI execution.',
    })
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedPlatform = watch('platform')
  const budgetType = watch('budgetType') || 'fixed'

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(onGenerate)()
    }
  }

  return (
    <form onSubmit={handleSubmit(onGenerate)} onKeyDown={handleKeyDown} className="flex flex-col gap-5 h-full">
      <input type="hidden" {...register('budgetType')} />

      {/* Platform */}
      <div>
        <p className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide mb-2">
          Platform
        </p>
        <div role="radiogroup" aria-label="Platform selection" className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PLATFORMS.map((p) => {
            const isLocked = plan !== 'pro' && p.id !== 'upwork' && p.id !== 'general'
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selectedPlatform === p.id}
                onClick={() => {
                  if (isLocked) {
                    window.location.href = '/dashboard/upgrade'
                    return
                  }
                  setValue('platform', p.id)
                }}
                className={`relative py-3 sm:py-2.5 px-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedPlatform === p.id
                    ? PLATFORM_STYLES[p.id].selected
                    : PLATFORM_STYLES[p.id].unselected
                } ${isLocked ? 'opacity-50 cursor-not-allowed hover:border-[--color-bc-border] hover:text-[--color-bc-muted]' : ''}`}
              >
                {isLocked && <span className="absolute -top-1.5 -right-1.5 bg-[--color-bc-surface] border border-[--color-bc-border] text-[8px] rounded px-1 text-[--color-bc-ink-2]">PRO</span>}
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${p.dotColor} ${
                  selectedPlatform === p.id ? 'scale-110 opacity-100' : 'opacity-60'
                }`} />
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Title + Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center h-7">
            <label htmlFor="jobTitle" className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
              Job title <span className="text-[--color-bc-faint] normal-case font-normal">(optional)</span>
            </label>
          </div>
          <input
            {...register('jobTitle')}
            id="jobTitle"
            placeholder="e.g. Next.js developer needed"
            className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder-bc-faint bg-[--color-bc-white] focus:outline-none focus:ring-2 focus:ring-bc-blue/20 focus:border-bc-blue transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between h-7">
            <label htmlFor="jobBudget" className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
              Budget <span className="text-[--color-bc-faint] normal-case font-normal">(optional)</span>
            </label>
            <div role="radiogroup" aria-label="Budget type" className="flex bg-[--color-bc-surface] p-0.5 rounded-md text-[10px] font-bold">
              <button
                type="button"
                role="radio"
                aria-checked={budgetType === 'fixed'}
                onClick={() => setValue('budgetType', 'fixed')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  budgetType === 'fixed'
                    ? 'bg-[--color-bc-white] text-[--color-bc-ink] shadow-sm'
                    : 'text-[--color-bc-muted] hover:text-[--color-bc-ink]'
                }`}
              >
                Fixed
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={budgetType === 'hourly'}
                onClick={() => setValue('budgetType', 'hourly')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  budgetType === 'hourly'
                    ? 'bg-[--color-bc-white] text-[--color-bc-ink] shadow-sm'
                    : 'text-[--color-bc-muted] hover:text-[--color-bc-ink]'
                }`}
              >
                Hourly
              </button>
            </div>
          </div>
          <input
            {...register('jobBudget')}
            id="jobBudget"
            placeholder={budgetType === 'hourly' ? "e.g. $15 - $25 / hr" : "e.g. $500 or $1000 - $3000"}
            className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder-bc-faint bg-[--color-bc-white] focus:outline-none focus:ring-2 focus:ring-bc-blue/20 focus:border-bc-blue transition-all"
          />
        </div>
      </div>

      {/* Job description */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="jobDescription" className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
            Job description <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={loadSampleData}
            className="text-[10px] font-bold text-[--color-bc-blue] hover:underline uppercase tracking-wider transition-colors cursor-pointer"
          >
            💡 Load Sample Job
          </button>
        </div>
        <textarea
          {...register('jobDescription')}
          id="jobDescription"
          placeholder="Paste the full job description here. The more detail, the better the proposal."
          className={`flex-1 min-h-[200px] border rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder-bc-faint bg-[--color-bc-white] resize-none focus:outline-none focus:ring-2 focus:ring-bc-blue/20 focus:border-bc-blue transition-all ${
            errors.jobDescription ? 'border-red-400' : 'border-[--color-bc-border]'
          }`}
        />
        {errors.jobDescription && (
          <p className="text-xs text-red-500">{errors.jobDescription.message}</p>
        )}
      </div>

      {/* Extra context */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="extraContext" className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
          Any extra context? <span className="text-[--color-bc-faint] normal-case font-normal">(optional)</span>
        </label>
        <textarea
          {...register('extraContext')}
          id="extraContext"
          rows={2}
          placeholder="e.g. 'Stress my Shopify experience' or 'Keep it under 300 words'"
          className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder-bc-faint bg-[--color-bc-white] resize-none focus:outline-none focus:ring-2 focus:ring-bc-blue/20 focus:border-bc-blue transition-all"
        />
      </div>

      {/* Submit */}
      <div>
        <Button
          type="submit"
          loading={isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? 'Generating your bid…' : 'Generate bid package →'}
        </Button>

        <div className="mt-2 text-[10px] text-[--color-bc-faint] text-center flex items-center justify-center gap-1">
          <span>Press</span>
          <kbd className="font-mono text-[9px] bg-[--color-bc-surface] border border-[--color-bc-border] px-1 py-0.5 rounded text-[--color-bc-ink-2]">Ctrl</kbd>
          <span>/</span>
          <kbd className="font-mono text-[9px] bg-[--color-bc-surface] border border-[--color-bc-border] px-1 py-0.5 rounded text-[--color-bc-ink-2]">⌘</kbd>
          <span>+</span>
          <kbd className="font-mono text-[9px] bg-[--color-bc-surface] border border-[--color-bc-border] px-1 py-0.5 rounded text-[--color-bc-ink-2]">Enter</kbd>
          <span>to generate</span>
        </div>

        {generationsLeft !== null && (
          <div className="mt-3 flex items-center justify-between text-xs text-[--color-bc-muted]">
            <span>
              <span className={`font-semibold ${generationsLeft <= 1 ? 'text-amber-600' : 'text-[--color-bc-ink]'}`}>
                {generationsLeft}
              </span>{' '}
              of 15 free generations remaining today
            </span>
            <a href="/dashboard/upgrade" className="text-[--color-bc-blue] hover:underline font-semibold">
              Go Pro →
            </a>
          </div>
        )}
      </div>

    </form>
  )
}

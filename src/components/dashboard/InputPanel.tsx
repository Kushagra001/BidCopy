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
}

const PLATFORMS = [
  { id: 'upwork',     label: 'Upwork' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'contra',     label: 'Contra' },
  { id: 'general',    label: 'General' },
] as const

export function InputPanel({ onGenerate, isGenerating, generationsLeft, initialValues }: InputPanelProps) {
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

  const selectedPlatform = watch('platform')
  const budgetType = watch('budgetType') || 'fixed'

  return (
    <form onSubmit={handleSubmit(onGenerate)} className="flex flex-col gap-5 h-full">
      <input type="hidden" {...register('budgetType')} />

      {/* Platform */}
      <div>
        <p className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide mb-2">
          Platform
        </p>
        <div className="grid grid-cols-4 gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setValue('platform', p.id)}
              className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                selectedPlatform === p.id
                  ? 'border-[--color-bc-blue] bg-[--color-bc-blue-light] text-[--color-bc-blue]'
                  : 'border-[--color-bc-border] text-[--color-bc-muted] hover:border-[--color-bc-blue]/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title + Budget */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
            Job title <span className="text-[--color-bc-faint] normal-case font-normal">(optional)</span>
          </label>
          <input
            {...register('jobTitle')}
            placeholder="e.g. Next.js developer needed"
            className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder:text-[--color-bc-faint] focus:outline-none focus:ring-2 focus:ring-[--color-bc-blue]/20 focus:border-[--color-bc-blue] transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
              Budget <span className="text-[--color-bc-faint] normal-case font-normal">(optional)</span>
            </label>
            <div className="flex bg-gray-100 p-0.5 rounded-md text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setValue('budgetType', 'fixed')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  budgetType === 'fixed'
                    ? 'bg-white text-[--color-bc-ink] shadow-sm'
                    : 'text-[--color-bc-muted] hover:text-[--color-bc-ink]'
                }`}
              >
                Fixed
              </button>
              <button
                type="button"
                onClick={() => setValue('budgetType', 'hourly')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  budgetType === 'hourly'
                    ? 'bg-white text-[--color-bc-ink] shadow-sm'
                    : 'text-[--color-bc-muted] hover:text-[--color-bc-ink]'
                }`}
              >
                Hourly
              </button>
            </div>
          </div>
          <input
            {...register('jobBudget')}
            placeholder={budgetType === 'hourly' ? "e.g. $15 - $25 / hr" : "e.g. $500 or $1000 - $3000"}
            className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder:text-[--color-bc-faint] focus:outline-none focus:ring-2 focus:ring-[--color-bc-blue]/20 focus:border-[--color-bc-blue] transition-all"
          />
        </div>
      </div>

      {/* Job description */}
      <div className="flex-1 flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
          Job description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('jobDescription')}
          placeholder="Paste the full job description here. The more detail, the better the proposal."
          className={`flex-1 min-h-[200px] border rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder:text-[--color-bc-faint] resize-none focus:outline-none focus:ring-2 focus:ring-[--color-bc-blue]/20 focus:border-[--color-bc-blue] transition-all ${
            errors.jobDescription ? 'border-red-400' : 'border-[--color-bc-border]'
          }`}
        />
        {errors.jobDescription && (
          <p className="text-xs text-red-500">{errors.jobDescription.message}</p>
        )}
      </div>

      {/* Extra context */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[--color-bc-ink-2] uppercase tracking-wide">
          Any extra context? <span className="text-[--color-bc-faint] normal-case font-normal">(optional)</span>
        </label>
        <textarea
          {...register('extraContext')}
          rows={2}
          placeholder="e.g. 'Stress my Shopify experience' or 'Keep it under 300 words'"
          className="border border-[--color-bc-border] rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder:text-[--color-bc-faint] resize-none focus:outline-none focus:ring-2 focus:ring-[--color-bc-blue]/20 focus:border-[--color-bc-blue] transition-all"
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

        {generationsLeft !== null && (
          <div className="mt-3 flex items-center justify-between text-xs text-[--color-bc-muted]">
            <span>
              <span className={`font-semibold ${generationsLeft <= 1 ? 'text-amber-600' : 'text-[--color-bc-ink]'}`}>
                {generationsLeft}
              </span>{' '}
              of 5 free generations remaining today
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

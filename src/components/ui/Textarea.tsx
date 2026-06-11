'use client'

import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?:  string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-[--color-bc-ink-2] uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full border rounded-lg px-3 py-2.5 text-sm text-[--color-bc-ink] placeholder:text-[--color-bc-faint] bg-[--color-bc-white] resize-none transition-all focus:outline-none focus:ring-2 focus:ring-bc-blue/20 focus:border-bc-blue',
            error ? 'border-red-400' : 'border-[--color-bc-border]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-[--color-bc-muted]">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

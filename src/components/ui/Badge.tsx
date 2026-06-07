import { cn } from '@/lib/utils'

interface BadgeProps {
  children:  React.ReactNode
  variant?:  'default' | 'blue' | 'green' | 'amber' | 'red'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[--color-bc-surface] border-[--color-bc-border] text-[--color-bc-muted]',
    blue:    'bg-[--color-bc-blue-light] border-[--color-bc-blue-mid] text-[--color-bc-blue]',
    green:   'bg-green-50 border-green-200 text-green-700',
    amber:   'bg-amber-50 border-amber-200 text-amber-700',
    red:     'bg-red-50 border-red-200 text-red-600',
  }

  return (
    <span className={cn('inline-flex items-center text-xs font-medium border rounded-full px-2.5 py-0.5', variants[variant], className)}>
      {children}
    </span>
  )
}

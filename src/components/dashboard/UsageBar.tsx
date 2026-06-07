'use client'

interface UsageBarProps {
  used:  number
  total: number
}

export function UsageBar({ used, total }: UsageBarProps) {
  const pct      = Math.min((used / total) * 100, 100)
  const remaining = total - used
  const isLow    = remaining <= 1

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[--color-bc-border] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-[--color-bc-blue]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-[--color-bc-muted] whitespace-nowrap">
        {remaining} left today
      </span>
    </div>
  )
}

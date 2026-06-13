/**
 * humanise.ts
 * Utilities for the "Humanise Checklist" feature.
 * The actual tips come from the AI — this file provides
 * client-side helpers for rendering and managing the checklist state.
 */

export interface HumaniseTip {
  id:          string
  original:    string
  replacement: string
  explanation: string
  checked:     boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildChecklist(tips: any[]): HumaniseTip[] {
  if (!Array.isArray(tips)) return []
  return tips.map((tip, i) => {
    if (typeof tip === 'string') {
      return {
        id:          `tip-${i}`,
        original:    '',
        replacement: '',
        explanation: tip,
        checked:     false,
      }
    }
    return {
      id:          `tip-${i}`,
      original:    tip.original || '',
      replacement: tip.replacement || '',
      explanation: tip.explanation || tip.reason || '',
      checked:     false,
    }
  })
}

export function countChecked(tips: HumaniseTip[]): number {
  return tips.filter((t) => t.checked).length
}

export function allChecked(tips: HumaniseTip[]): boolean {
  return tips.length > 0 && tips.every((t) => t.checked)
}

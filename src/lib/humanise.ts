/**
 * humanise.ts
 * Utilities for the "Humanise Checklist" feature.
 * The actual tips come from the AI — this file provides
 * client-side helpers for rendering and managing the checklist state.
 */

export interface HumaniseTip {
  id:      string
  text:    string
  checked: boolean
}

export function buildChecklist(tips: string[]): HumaniseTip[] {
  return tips.map((text, i) => ({
    id:      `tip-${i}`,
    text,
    checked: false,
  }))
}

export function countChecked(tips: HumaniseTip[]): number {
  return tips.filter((t) => t.checked).length
}

export function allChecked(tips: HumaniseTip[]): boolean {
  return tips.length > 0 && tips.every((t) => t.checked)
}

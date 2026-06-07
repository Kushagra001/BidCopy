'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { buildChecklist, countChecked, type HumaniseTip } from '@/lib/humanise'
import type { ProposalOutput } from '@/types/proposal'

interface OutputPanelProps {
  output:      ProposalOutput | null
  modelUsed:   string | null
  proposalId:  string | null
  onRegenerate: () => void
  isGenerating: boolean
}

type TabId = 'proposal' | 'pricing' | 'timeline' | 'followup'

const TABS: { id: TabId; label: string }[] = [
  { id: 'proposal', label: 'Proposal' },
  { id: 'pricing',  label: 'Pricing' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'followup', label: 'Follow-up' },
]

export function OutputPanel({ output, modelUsed, onRegenerate, isGenerating }: OutputPanelProps) {
  const [activeTab, setActiveTab]   = useState<TabId>('proposal')
  const [copied, setCopied]         = useState<string | null>(null)
  const [rating, setRating]         = useState(0)
  const [checklist, setChecklist]   = useState<HumaniseTip[]>([])

  // Rebuild checklist when output changes
  const [lastOutputKey, setLastOutputKey] = useState<string | null>(null)
  const outputKey = output?.proposal?.slice(0, 20) ?? null
  if (outputKey !== lastOutputKey) {
    setLastOutputKey(outputKey)
    setChecklist(output ? buildChecklist(output.humanise_tips) : [])
    setActiveTab('proposal')
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleTip = (id: string) => {
    setChecklist((prev) => prev.map((t) => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  const totalPrice = output?.pricing.reduce((s, r) => s + r.total, 0) ?? 0

  if (!output) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-[--color-bc-border] rounded-xl p-12">
        <div className="text-5xl mb-5">✍️</div>
        <h3 className="font-semibold text-[--color-bc-ink] text-lg mb-2">Your bid package will appear here</h3>
        <p className="text-sm text-[--color-bc-muted] max-w-xs leading-relaxed">
          Paste a job description on the left and click generate. You'll get a complete proposal, pricing breakdown, timeline, and follow-up message.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Badge variant="blue">{modelUsed}</Badge>
          <span className="text-xs text-[--color-bc-faint]">
            {output.proposal.split(' ').length} words
          </span>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 text-xs text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors disabled:opacity-40"
        >
          <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} />
          Regenerate
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[--color-bc-border] mb-4 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-[--color-bc-blue] text-[--color-bc-blue]'
                : 'border-transparent text-[--color-bc-muted] hover:text-[--color-bc-ink]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">

        {/* PROPOSAL */}
        {activeTab === 'proposal' && (
          <div className="space-y-4">
            <div className="text-sm text-[--color-bc-ink] leading-relaxed whitespace-pre-wrap">
              {output.proposal}
            </div>
            <button
              onClick={() => copy(output.proposal, 'proposal')}
              className="flex items-center gap-2 text-xs bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg hover:bg-[--color-bc-blue-dark] transition-colors"
            >
              {copied === 'proposal' ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy proposal</>}
            </button>
          </div>
        )}

        {/* PRICING */}
        {activeTab === 'pricing' && (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-bc-border]">
                  {['Item', 'Hours', 'Rate', 'Total'].map((h) => (
                    <th key={h} className={`py-2 text-xs font-semibold text-[--color-bc-muted] uppercase tracking-wide ${h === 'Item' ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {output.pricing.map((row, i) => (
                  <tr key={i} className="border-b border-[--color-bc-border]/50">
                    <td className="py-3">
                      <div className="font-medium text-[--color-bc-ink]">{row.item}</div>
                      {row.notes && <div className="text-xs text-[--color-bc-muted] mt-0.5">{row.notes}</div>}
                    </td>
                    <td className="py-3 text-right text-[--color-bc-ink-2]">{row.hours}h</td>
                    <td className="py-3 text-right text-[--color-bc-ink-2]">${row.rate}</td>
                    <td className="py-3 text-right font-semibold text-[--color-bc-ink]">${row.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 font-bold text-[--color-bc-ink]">Total</td>
                  <td className="pt-4 text-right font-bold text-[--color-bc-blue] text-base">${totalPrice.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            <button
              onClick={() => copy(
                output.pricing.map((r) => `${r.item}\t${r.hours}h\t$${r.rate}/hr\t$${r.total}`).join('\n') + `\n\nTotal: $${totalPrice}`,
                'pricing'
              )}
              className="mt-4 flex items-center gap-2 text-xs bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg hover:bg-[--color-bc-blue-dark] transition-colors"
            >
              {copied === 'pricing' ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy pricing table</>}
            </button>
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {output.timeline.map((phase, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[--color-bc-blue-light] text-[--color-bc-blue] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < output.timeline.length - 1 && (
                    <div className="w-px flex-1 bg-[--color-bc-border] mt-1" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h4 className="font-semibold text-sm text-[--color-bc-ink]">{phase.phase}</h4>
                    <Badge>{phase.duration}</Badge>
                  </div>
                  <ul className="space-y-1">
                    {phase.deliverables.map((d, j) => (
                      <li key={j} className="text-sm text-[--color-bc-ink-2] flex gap-2">
                        <span className="text-[--color-bc-blue] mt-0.5 flex-shrink-0">→</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOLLOW-UP */}
        {activeTab === 'followup' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              💡 Send this message <strong>48 hours</strong> after submitting your proposal if you haven't heard back.
            </div>
            <p className="text-sm text-[--color-bc-ink] leading-relaxed">{output.followup}</p>
            <button
              onClick={() => copy(output.followup, 'followup')}
              className="flex items-center gap-2 text-xs bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg hover:bg-[--color-bc-blue-dark] transition-colors"
            >
              {copied === 'followup' ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy follow-up</>}
            </button>
          </div>
        )}

      </div>

      {/* Humanise checklist */}
      {checklist.length > 0 && (
        <div className="flex-shrink-0 mt-4 border-t border-[--color-bc-border] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[--color-bc-ink] uppercase tracking-wide flex items-center gap-2">
              <span className="text-base">🎯</span> Before you send — humanise it
            </h4>
            <span className="text-xs text-[--color-bc-muted]">
              {countChecked(checklist)}/{checklist.length} done
            </span>
          </div>
          <ul className="space-y-2">
            {checklist.map((tip) => (
              <li key={tip.id} className="flex items-start gap-2.5 cursor-pointer group" onClick={() => toggleTip(tip.id)}>
                <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  tip.checked
                    ? 'bg-[--color-bc-blue] border-[--color-bc-blue]'
                    : 'border-[--color-bc-border] group-hover:border-[--color-bc-blue]'
                }`}>
                  {tip.checked && <Check size={10} className="text-white" />}
                </div>
                <span className={`text-xs leading-relaxed transition-colors ${
                  tip.checked ? 'text-[--color-bc-faint] line-through' : 'text-[--color-bc-ink-2]'
                }`}>
                  {tip.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rating */}
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-[--color-bc-border] flex items-center gap-3">
        <span className="text-xs text-[--color-bc-muted]">Rate this output:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className={`transition-colors ${star <= rating ? 'text-amber-400' : 'text-[--color-bc-border] hover:text-amber-300'}`}>
              <Star size={16} fill={star <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

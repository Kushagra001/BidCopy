'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw, Star, Edit3, Eye, Clipboard } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { buildChecklist, countChecked, type HumaniseTip } from '@/lib/humanise'
import type { ProposalOutput } from '@/types/proposal'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
  const [loadingStep, setLoadingStep] = useState(0)

  // Local proposal states to allow direct inline editing
  const [editedProposal, setEditedProposal] = useState<string>('')
  const [isEditingProposal, setIsEditingProposal] = useState(false)

  useEffect(() => {
    if (isGenerating) {
      setLoadingStep(0)
      const interval = setInterval(() => {
        setLoadingStep((s) => (s < 3 ? s + 1 : s))
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  // Rebuild checklist & local proposal when output changes
  const [lastOutputKey, setLastOutputKey] = useState<string | null>(null)
  const outputKey = output?.proposal?.slice(0, 20) ?? null
  if (outputKey !== lastOutputKey) {
    setLastOutputKey(outputKey)
    setChecklist(output ? buildChecklist(output.humanise_tips) : [])
    setEditedProposal(output ? output.proposal : '')
    setIsEditingProposal(false)
    setActiveTab('proposal')
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleApplyTip = (tip: HumaniseTip) => {
    if (!tip.original || !tip.replacement) return
    if (editedProposal.includes(tip.original)) {
      setEditedProposal((prev) => prev.replace(tip.original, tip.replacement))
      setChecklist((prev) =>
        prev.map((t) => (t.id === tip.id ? { ...t, checked: true } : t))
      )
    }
  }

  const handleRevertTip = (tip: HumaniseTip) => {
    if (!tip.original || !tip.replacement) return
    if (editedProposal.includes(tip.replacement)) {
      setEditedProposal((prev) => prev.replace(tip.replacement, tip.original))
      setChecklist((prev) =>
        prev.map((t) => (t.id === tip.id ? { ...t, checked: false } : t))
      )
    }
  }

  const [copiedTipId, setCopiedTipId] = useState<string | null>(null)

  const handleCopyTipText = async (tipId: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedTipId(tipId)
    setTimeout(() => setCopiedTipId(null), 2000)
  }

  const totalPrice = output?.pricing.reduce((s, r) => s + r.total, 0) ?? 0

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[--color-bc-blue]/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[--color-bc-blue] rounded-full animate-spin" />
        </div>
        <h3 className="font-semibold text-[--color-bc-ink] text-lg mb-2">Generating your bid package</h3>
        <p className="text-sm text-[--color-bc-muted] max-w-xs leading-relaxed mb-8">
          Our AI is writing your proposal, calculating project milestones, and tailoring the pricing.
        </p>
        <div className="w-full max-w-xs bg-gray-50 border border-[--color-bc-border] rounded-xl p-5 space-y-4">
          <LoadingStep step={0} currentStep={loadingStep} label="Analyzing job details..." />
          <LoadingStep step={1} currentStep={loadingStep} label="Selecting relevant projects..." />
          <LoadingStep step={2} currentStep={loadingStep} label="Polishing tone & style..." />
          <LoadingStep step={3} currentStep={loadingStep} label="Drafting proposal & pricing..." />
        </div>
      </div>
    )
  }

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
            {editedProposal.split(/\s+/).filter(Boolean).length} words
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
            {/* Read / Edit Toggle Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 flex-shrink-0">
              <span className="text-xs text-[--color-bc-muted] font-medium">Refine your proposal below</span>
              <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setIsEditingProposal(false)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                    !isEditingProposal
                      ? 'bg-white text-[--color-bc-ink] font-semibold shadow-sm'
                      : 'text-[--color-bc-muted] hover:text-[--color-bc-ink]'
                  }`}
                >
                  <Eye size={12} />
                  Preview
                </button>
                <button
                  onClick={() => setIsEditingProposal(true)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer ${
                    isEditingProposal
                      ? 'bg-white text-[--color-bc-ink] font-semibold shadow-sm'
                      : 'text-[--color-bc-muted] hover:text-[--color-bc-ink]'
                  }`}
                >
                  <Edit3 size={12} />
                  Edit
                </button>
              </div>
            </div>

            {/* Proposal Content Area */}
            {isEditingProposal ? (
              <textarea
                value={editedProposal}
                onChange={(e) => setEditedProposal(e.target.value)}
                className="w-full min-h-[400px] p-4 text-sm text-[--color-bc-ink] leading-relaxed border border-[--color-bc-border] rounded-xl focus:ring-1 focus:ring-[--color-bc-blue] focus:border-[--color-bc-blue] outline-none font-mono resize-y"
                placeholder="Write or edit your proposal..."
              />
            ) : (
              <div className="text-sm text-[--color-bc-ink] leading-relaxed border border-transparent px-1 min-h-[400px]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-lg font-bold text-[--color-bc-ink] mt-4 mb-2 first:mt-0" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-base font-bold text-[--color-bc-ink] mt-4 mb-2 first:mt-0" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-sm font-bold text-[--color-bc-ink] mt-3 mb-1 first:mt-0" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed text-[--color-bc-ink-2]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1.5" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1.5" {...props} />,
                    li: ({node, ...props}) => <li className="text-sm text-[--color-bc-ink-2]" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-[--color-bc-ink]" {...props} />,
                  }}
                >
                  {editedProposal}
                </ReactMarkdown>
              </div>
            )}

            <button
              onClick={() => copy(editedProposal, 'proposal')}
              className="flex items-center gap-2 text-xs bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg hover:bg-[--color-bc-blue-dark] transition-colors font-semibold"
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
                    <td className="py-3 text-right text-[--color-bc-ink-2]">
                      {row.hours > 0 ? `${row.hours}h` : '—'}
                    </td>
                    <td className="py-3 text-right text-[--color-bc-ink-2]">
                      {row.hours > 0 ? `$${row.rate}` : '—'}
                    </td>
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

      {/* Humanise Assistant */}
      {checklist.length > 0 && (
        <div className="flex-shrink-0 mt-6 border-t border-[--color-bc-border] pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-[--color-bc-ink] uppercase tracking-wide flex items-center gap-1.5">
                <span className="text-base">🎯</span> AI Humaniser Assistant
              </h4>
              <p className="text-[10px] text-[--color-bc-muted]">Rewrite robotic phrasing to increase client response rate</p>
            </div>
            <span className="text-xs font-semibold text-[--color-bc-blue] bg-[--color-bc-blue-light] px-2.5 py-0.5 rounded-full font-mono">
              {countChecked(checklist)}/{checklist.length} Replaced
            </span>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {checklist.map((tip) => {
              const hasOriginal = tip.original && editedProposal.includes(tip.original)
              const hasReplacement = tip.replacement && editedProposal.includes(tip.replacement)
              const isApplied = tip.checked || hasReplacement

              return (
                <div key={tip.id} className="bg-gray-50/70 border border-[--color-bc-border] rounded-xl p-3.5 hover:shadow-sm transition-all duration-200">
                  <p className="text-xs font-medium text-[--color-bc-ink] mb-2 leading-relaxed">
                    💡 {tip.explanation}
                  </p>
                  
                  {tip.original && tip.replacement ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="bg-red-50/50 border border-red-100 rounded-lg p-2.5">
                        <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider block mb-1">Robotic Draft</span>
                        <p className={`text-xs text-red-800 leading-relaxed ${isApplied ? 'line-through opacity-50' : ''}`}>
                          "{tip.original}"
                        </p>
                      </div>
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block mb-1">Human Rewrite</span>
                        <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                          "{tip.replacement}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 mb-2">
                      <p className="text-xs text-blue-800 leading-relaxed">
                        "{tip.explanation}"
                      </p>
                    </div>
                  )}

                  {tip.original && tip.replacement && (
                    <div className="flex justify-end">
                      {isApplied ? (
                        <button
                          onClick={() => handleRevertTip(tip)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-[--color-bc-ink] bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          Undo Revision
                        </button>
                      ) : hasOriginal ? (
                        <button
                          onClick={() => handleApplyTip(tip)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-white bg-[--color-bc-blue] hover:bg-[--color-bc-blue-dark] px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          Apply Rewrite
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCopyTipText(tip.id, tip.replacement)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-[--color-bc-blue] hover:text-[--color-bc-blue-dark] bg-[--color-bc-blue-light] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          {copiedTipId === tip.id ? (
                            <><Check size={10} /> Copied!</>
                          ) : (
                            <><Clipboard size={10} /> Copy Alternative</>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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

function LoadingStep({ step, currentStep, label }: { step: number; currentStep: number; label: string }) {
  const isDone = currentStep > step
  const isActive = currentStep === step
  return (
    <div className="flex items-center gap-3 w-full text-left">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 ${
        isDone ? 'bg-green-100 text-green-600 font-semibold' :
        isActive ? 'bg-[--color-bc-blue-light] text-[--color-bc-blue] animate-pulse font-bold' :
        'bg-gray-100 text-gray-400'
      }`}>
        {isDone ? '✓' : step + 1}
      </div>
      <span className={`text-xs transition-all duration-300 ${
        isDone ? 'text-gray-500 font-medium' :
        isActive ? 'text-[--color-bc-ink] font-semibold' :
        'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  )
}

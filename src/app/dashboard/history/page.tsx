'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncate } from '@/lib/utils'
import type { Proposal } from '@/types/proposal'

type HistoryItem = Pick<Proposal, 'id' | 'job_title' | 'platform' | 'word_count' | 'model_used' | 'rating' | 'is_saved' | 'created_at'>

const PLATFORM_LABELS: Record<string, string> = {
  upwork:     'Upwork',
  freelancer: 'Freelancer',
  contra:     'Contra',
  general:    'General',
}

const getModelLabel = (model: string | null | undefined) => {
  if (!model) return '—'
  const lower = model.toLowerCase()
  if (lower.includes('gpt-4o-mini')) return 'GPT-4o mini'
  if (lower.includes('gpt-4.1')) return 'GPT-4.1 (Pro)'
  if (lower.includes('gpt-4o')) return 'GPT-4o'
  if (lower.includes('gemini')) return 'Gemini Flash'
  if (lower.includes('claude')) return 'Claude Sonnet'
  return model
}

export default function HistoryPage() {
  const [proposals, setProposals] = useState<HistoryItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [total, setTotal]         = useState(0)
  const LIMIT = 20

  useEffect(() => {
    setLoading(true)
    fetch(`/api/history?page=${page}&limit=${LIMIT}`)
      .then((r) => r.json())
      .then(({ proposals: p, total: t }) => {
        setProposals(p ?? [])
        setTotal(t ?? 0)
      })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="min-h-screen bg-[--color-bc-surface]">
      <header className="bg-white border-b border-[--color-bc-border] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-[--color-bc-blue] text-xl">BidCopy</a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/dashboard" className="text-[--color-bc-muted] hover:text-[--color-bc-ink]">← Generate</a>
            <a href="/dashboard/profile" className="text-[--color-bc-muted] hover:text-[--color-bc-ink]">Profile</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[--color-bc-ink]">Proposal history</h1>
          <p className="text-[--color-bc-muted] text-sm mt-1">{total} proposal{total !== 1 ? 's' : ''} generated</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[--color-bc-blue] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="font-semibold text-[--color-bc-ink] mb-2">No proposals yet</h3>
            <p className="text-sm text-[--color-bc-muted] mb-6">Generate your first bid to see it here.</p>
            <a href="/dashboard" className="inline-flex items-center gap-2 bg-[--color-bc-blue] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[--color-bc-blue-dark] transition-colors">
              Generate a bid →
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white border border-[--color-bc-border] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--color-bc-border] bg-[--color-bc-surface]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[--color-bc-muted] uppercase tracking-wide">Job</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[--color-bc-muted] uppercase tracking-wide">Platform</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[--color-bc-muted] uppercase tracking-wide">Model</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[--color-bc-muted] uppercase tracking-wide">Words</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[--color-bc-muted] uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-bc-border]">
                  {proposals.map((p) => (
                    <tr key={p.id} className="hover:bg-[--color-bc-surface] transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/dashboard?proposal=${p.id}`}>
                      <td className="px-5 py-4">
                        <span className="font-medium text-[--color-bc-ink]">
                          {truncate(p.job_title ?? 'Untitled proposal', 48)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={p.platform === 'upwork' ? 'blue' : 'default'}>
                          {PLATFORM_LABELS[p.platform] ?? p.platform}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-[--color-bc-muted]">
                        {getModelLabel(p.model_used)}
                      </td>
                      <td className="px-5 py-4 text-[--color-bc-muted]">{p.word_count ?? '—'}</td>
                      <td className="px-5 py-4 text-[--color-bc-muted]">{formatDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > LIMIT && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 text-sm border border-[--color-bc-border] rounded-lg text-[--color-bc-muted] hover:text-[--color-bc-ink] disabled:opacity-40 transition-colors">
                  ← Previous
                </button>
                <span className="text-sm text-[--color-bc-muted]">
                  Page {page} of {Math.ceil(total / LIMIT)}
                </span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}
                  className="px-4 py-2 text-sm border border-[--color-bc-border] rounded-lg text-[--color-bc-muted] hover:text-[--color-bc-ink] disabled:opacity-40 transition-colors">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

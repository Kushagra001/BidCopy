'use client'

import { useState, useCallback } from 'react'
import { InputPanel, type InputFormData } from '@/components/dashboard/InputPanel'
import { OutputPanel } from '@/components/dashboard/OutputPanel'
import type { ProposalOutput } from '@/types/proposal'

export default function DashboardPage() {
  const [output, setOutput]               = useState<ProposalOutput | null>(null)
  const [modelUsed, setModelUsed]         = useState<string | null>(null)
  const [proposalId, setProposalId]       = useState<string | null>(null)
  const [isGenerating, setIsGenerating]   = useState(false)
  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null)
  const [error, setError]                 = useState<string | null>(null)
  const [lastInput, setLastInput]         = useState<InputFormData | null>(null)

  const generate = useCallback(async (data: InputFormData) => {
    setIsGenerating(true)
    setError(null)
    setLastInput(data)

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.upgradeRequired) {
          setError('Daily limit reached. Upgrade to Pro for unlimited generations.')
        } else if (json.profileIncomplete) {
          window.location.href = '/dashboard/profile'
        } else {
          setError(json.error ?? 'Generation failed. Please try again.')
        }
        return
      }

      setOutput(json.output)
      setModelUsed(json.modelUsed)
      setProposalId(json.proposalId)
      if (json.generationsLeft !== null) {
        setGenerationsLeft(json.generationsLeft)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const regenerate = useCallback(() => {
    if (lastInput) generate(lastInput)
  }, [lastInput, generate])

  return (
    <div className="min-h-screen bg-[--color-bc-surface]">
      {/* Nav */}
      <header className="bg-white border-b border-[--color-bc-border] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-[--color-bc-blue] text-xl tracking-tight">
            BidCopy
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/dashboard/history" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">History</a>
            <a href="/dashboard/profile" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">Profile</a>
            <a href="/dashboard/upgrade" className="bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[--color-bc-blue-dark] transition-colors">
              Go Pro
            </a>
          </nav>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <div className="flex gap-3">
              {error.includes('Daily limit') && (
                <a href="/dashboard/upgrade" className="text-sm font-semibold text-red-700 underline">Upgrade →</a>
              )}
              <button onClick={() => setError(null)} className="text-sm text-red-500 hover:text-red-700">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--color-bc-ink]">Generate a bid</h1>
          <p className="text-[--color-bc-muted] text-sm mt-1">Paste a job description → get a complete bid package in 30 seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: input */}
          <div className="bg-white border border-[--color-bc-border] rounded-xl p-6 flex flex-col min-h-[600px]">
            <InputPanel
              onGenerate={generate}
              isGenerating={isGenerating}
              generationsLeft={generationsLeft}
            />
          </div>

          {/* Right: output */}
          <div className="bg-white border border-[--color-bc-border] rounded-xl p-6 flex flex-col min-h-[600px]">
            <OutputPanel
              output={output}
              modelUsed={modelUsed}
              proposalId={proposalId}
              onRegenerate={regenerate}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

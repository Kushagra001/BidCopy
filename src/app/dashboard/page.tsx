'use client'

import { useState, useCallback, useEffect } from 'react'
import { InputPanel, type InputFormData } from '@/components/dashboard/InputPanel'
import { OutputPanel } from '@/components/dashboard/OutputPanel'
import type { ProposalOutput } from '@/types/proposal'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function DashboardPage() {
  const [output, setOutput]               = useState<ProposalOutput | null>(null)
  const [modelUsed, setModelUsed]         = useState<string | null>(null)
  const [proposalId, setProposalId]       = useState<string | null>(null)
  const [isGenerating, setIsGenerating]   = useState(false)
  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null)
  const [error, setError]                 = useState<string | null>(null)
  const [lastInput, setLastInput]         = useState<InputFormData | null>(null)
  const [initialInputValues, setInitialInputValues] = useState<Partial<InputFormData> | undefined>(undefined)
  const [inputKey, setInputKey]           = useState(0)

  // Plan & Model selector states
  const [plan, setPlan]                   = useState<'free' | 'pro'>('free')
  const [selectedModel, setSelectedModel] = useState<'gpt-4o-mini' | 'gpt-4.1'>('gpt-4o-mini')
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)

  // Load plan and initial proposal if passed in URL query parameter
  useEffect(() => {
    // Fetch profile to get plan
    fetch('/api/profile')
      .then((r) => r.json())
      .then(({ plan: p }) => {
        if (p) {
          setPlan(p)
          if (p === 'pro') {
            setSelectedModel('gpt-4.1')
          }
        }
      })
      .catch(console.error)

    const params = new URLSearchParams(window.location.search)
    const proposalIdParam = params.get('proposal')
    if (proposalIdParam) {
      fetch(`/api/history?id=${proposalIdParam}`)
        .then((r) => r.json())
        .then(({ proposal }) => {
          if (proposal) {
            const loadedInput: InputFormData = {
              platform:       (proposal.platform || 'upwork') as any,
              jobTitle:       proposal.job_title || '',
              budgetType:     (proposal.job_budget?.toLowerCase().includes('hr') || proposal.job_budget?.toLowerCase().includes('hour')) ? 'hourly' : 'fixed',
              jobBudget:      proposal.job_budget || '',
              jobDescription: proposal.job_description || '',
              extraContext:   proposal.extra_context || '',
            }
            setInitialInputValues(loadedInput)
            setLastInput(loadedInput)

            // Set selected model state to match the loaded proposal
            if (proposal.model_used?.includes('gpt-4.1')) {
              setSelectedModel('gpt-4.1')
            } else {
              setSelectedModel('gpt-4o-mini')
            }

            setOutput({
              proposal:      proposal.proposal_text ?? '',
              pricing:       proposal.pricing_table ?? [],
              timeline:      proposal.timeline ?? [],
              followup:      proposal.followup_text ?? '',
              humanise_tips: proposal.humanise_tips ?? [],
            })
            const modelLabel = proposal.model_used?.includes('gpt-4.1')
              ? 'GPT-4.1 (Pro)'
              : proposal.model_used?.includes('gpt-4o-mini')
              ? 'GPT-4o mini'
              : proposal.model_used?.includes('gemini')
              ? 'Gemini Flash'
              : proposal.model_used || 'GPT-4o mini'
            setModelUsed(modelLabel)
            setProposalId(proposal.id)
          }
        })
        .catch(console.error)
    }
  }, [])

  const generate = useCallback(async (data: InputFormData) => {
    setIsGenerating(true)
    setError(null)
    setLastInput(data)

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, model: selectedModel }),
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
  }, [selectedModel])

  const regenerate = useCallback(() => {
    if (lastInput) generate(lastInput)
  }, [lastInput, generate])

  const handleNewBid = useCallback(() => {
    setOutput(null)
    setModelUsed(null)
    setProposalId(null)
    setError(null)
    setLastInput(null)
    setInitialInputValues(undefined)
    setInputKey((k) => k + 1)
  }, [])

  return (
    <div className="min-h-screen bg-[--color-bc-surface]">
      {/* Nav */}
      <header className="bg-[--color-bc-white] border-b border-[--color-bc-border] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-[--color-bc-blue] text-xl tracking-tight">
            BidCopy
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/dashboard/history" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">History</a>
            <a href="/dashboard/profile" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">Profile</a>
            <ThemeToggle />
            <a href="/dashboard/upgrade" className="bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[--color-bc-blue-dark] transition-colors">
              Go Pro
            </a>
          </nav>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900/30 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <div className="flex gap-3">
              {error.includes('Daily limit') && (
                <a href="/dashboard/upgrade" className="text-sm font-semibold text-red-700 dark:text-red-400 underline">Upgrade →</a>
              )}
              <button onClick={() => setError(null)} className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[--color-bc-ink]">Generate a bid</h1>
            <p className="text-[--color-bc-muted] text-sm mt-1">Paste a job description → get a complete bid package in 30 seconds.</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleNewBid}
              className="flex items-center gap-1.5 px-4 py-2 border border-[--color-bc-border] rounded-xl text-sm font-semibold text-[--color-bc-ink] bg-[--color-bc-white] hover:bg-[--color-bc-surface] shadow-sm transition-all cursor-pointer"
            >
              <span className="text-xs">+</span> New bid
            </button>

            {/* Model Selector Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[--color-bc-white] border border-[--color-bc-border] rounded-xl text-sm font-semibold text-[--color-bc-ink] hover:bg-[--color-bc-surface] shadow-sm transition-all cursor-pointer"
              >
                <span>{selectedModel === 'gpt-4.1' ? 'GPT-4.1 (Pro)' : 'GPT-4o mini'}</span>
                <span className="text-gray-400 text-xs">▼</span>
              </button>

            {isModelDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsModelDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-[--color-bc-white] border border-[--color-bc-border] rounded-2xl shadow-xl z-50 p-2 space-y-1">
                  
                  {/* GPT-4.1 Pro Option */}
                  <div
                    onClick={() => {
                      if (plan === 'pro') {
                        setSelectedModel('gpt-4.1')
                        setIsModelDropdownOpen(false)
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      plan === 'pro'
                        ? 'cursor-pointer hover:bg-[--color-bc-surface]'
                        : 'bg-[--color-bc-surface]/50'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-sm text-[--color-bc-ink] flex items-center gap-1.5">
                        GPT-4.1 (Pro)
                        {selectedModel === 'gpt-4.1' && (
                          <span className="text-xs text-[--color-bc-blue]">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[--color-bc-muted]">Our smartest model for complex challenges</p>
                    </div>
                    {plan !== 'pro' && (
                      <a
                        href="/dashboard/upgrade"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[--color-bc-blue] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-semibold hover:bg-[--color-bc-blue-dark] transition-colors flex-shrink-0 ml-2"
                      >
                        Upgrade
                      </a>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[--color-bc-border] my-1" />

                  {/* GPT-4o Mini Option */}
                  <div
                    onClick={() => {
                      setSelectedModel('gpt-4o-mini')
                      setIsModelDropdownOpen(false)
                    }}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[--color-bc-surface] transition-all"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-sm text-[--color-bc-ink] flex items-center gap-1.5">
                        GPT-4o mini
                        {selectedModel === 'gpt-4o-mini' && (
                          <span className="text-xs text-[--color-bc-blue]">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[--color-bc-muted]">Fastest model for quick drafts</p>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: input */}
          <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-xl p-6 flex flex-col min-h-[600px]">
            <InputPanel
              key={inputKey}
              onGenerate={generate}
              isGenerating={isGenerating}
              generationsLeft={generationsLeft}
              initialValues={initialInputValues}
            />
          </div>

          {/* Right: output */}
          <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-xl p-6 flex flex-col min-h-[600px]">
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

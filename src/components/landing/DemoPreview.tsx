'use client'

import { useEffect, useState, useRef } from 'react'

const JOB_DESC = `Looking for a React developer to build a client dashboard for our SaaS product. We need data visualization charts, real-time updates via WebSocket, and a clean responsive UI. Timeline: 3 weeks. Budget: $2,500.`

const PROPOSAL = `Hi Sarah,

Your dashboard challenge is exactly the kind of problem I've solved before — most recently for a fintech SaaS where I rebuilt their analytics view using React + Recharts, cutting load time by 60%.

For your project I'd use React with Recharts for the data viz, a WebSocket hook for real-time sync, and Tailwind for a pixel-perfect responsive layout.

Here's my suggested approach:
• Week 1: Core dashboard shell + chart components
• Week 2: WebSocket integration + real-time data layer  
• Week 3: Polish, responsive QA, handoff

My rate is $85/hr and I can start Monday. One question — do you have a design mockup, or would you like me to propose the layout?`

const TIPS = [
  'Replace "solved before" with your Medica project name specifically',
  'Client mentioned WebSocket — add your preferred library (socket.io vs native)',
  'Remove "pixel-perfect" — it screams template. Say "matches your brand" instead',
]

const PRICING = [
  { item: 'Dashboard shell + routing', hours: 12, rate: 85, total: 1020 },
  { item: 'Recharts data viz components', hours: 10, rate: 85, total: 850 },
  { item: 'WebSocket real-time layer', hours: 6, rate: 85, total: 510 },
  { item: 'Responsive QA + handoff', hours: 2, rate: 85, total: 170 },
]

type Phase = 'typing' | 'generating' | 'streaming' | 'checklist' | 'done'

export function DemoPreview() {
  const [phase, setPhase] = useState<Phase>('typing')
  const [typedText, setTypedText] = useState('')
  const [streamedProposal, setStreamedProposal] = useState('')
  const [visibleTips, setVisibleTips] = useState(0)
  const [activeTab, setActiveTab] = useState<'proposal' | 'pricing'>('proposal')
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimers() {
    if (cycleRef.current) clearTimeout(cycleRef.current)
    if (frameRef.current) clearTimeout(frameRef.current)
  }

  function runCycle() {
    clearTimers()
    setPhase('typing')
    setTypedText('')
    setStreamedProposal('')
    setVisibleTips(0)
    setActiveTab('proposal')

    // Phase 1: type job description
    let i = 0
    function typeNext() {
      if (i <= JOB_DESC.length) {
        setTypedText(JOB_DESC.slice(0, i))
        i++
        frameRef.current = setTimeout(typeNext, i < 20 ? 40 : 18)
      } else {
        // Phase 2: generating spinner
        cycleRef.current = setTimeout(() => {
          setPhase('generating')

          // Phase 3: stream proposal
          cycleRef.current = setTimeout(() => {
            setPhase('streaming')
            let j = 0
            const words = PROPOSAL.split('')
            function streamNext() {
              if (j <= words.length) {
                setStreamedProposal(PROPOSAL.slice(0, j))
                j += 3
                frameRef.current = setTimeout(streamNext, 18)
              } else {
                // Phase 4: checklist
                setPhase('checklist')
                setVisibleTips(0)
                ;[0, 1, 2].forEach((idx) => {
                  cycleRef.current = setTimeout(
                    () => setVisibleTips((v) => v + 1),
                    600 + idx * 700,
                  )
                })
                // Phase 5: restart after pause
                cycleRef.current = setTimeout(() => {
                  setPhase('done')
                  cycleRef.current = setTimeout(runCycle, 1800)
                }, 4000)
              }
            }
            streamNext()
          }, 1200)
        }, 600)
      }
    }
    typeNext()
  }

  useEffect(() => {
    const t = setTimeout(runCycle, 400)
    return () => {
      clearTimeout(t)
      clearTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showOutput = phase === 'streaming' || phase === 'checklist' || phase === 'done'

  return (
    <div className="mt-14 relative select-none">
      {/* Fade-out gradient at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: '45%',
          background: 'linear-gradient(to bottom, transparent, white)',
        }}
      />

      {/* Browser chrome */}
      <div className="rounded-2xl border border-[--color-bc-border] bg-white shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[--color-bc-surface] border-b border-[--color-bc-border]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white border border-[--color-bc-border] rounded-md px-3 py-1 text-xs text-[--color-bc-faint] text-center max-w-xs mx-auto">
              bidcopy.com/dashboard
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="grid grid-cols-2 min-h-[340px]">

          {/* Left — Input panel */}
          <div className="p-5 border-r border-[--color-bc-border] flex flex-col gap-4">
            {/* Platform */}
            <div className="flex gap-2">
              {['Upwork', 'Freelancer', 'Contra'].map((p) => (
                <span key={p}
                  className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    p === 'Upwork'
                      ? 'bg-[--color-bc-blue-light] text-[--color-bc-blue] border-[--color-bc-blue-mid]'
                      : 'bg-[--color-bc-surface] text-[--color-bc-faint] border-[--color-bc-border]'
                  }`}>
                  {p}
                </span>
              ))}
            </div>

            {/* Job description */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-semibold text-[--color-bc-ink-2]">Job description</label>
              <div className="flex-1 relative rounded-xl border border-[--color-bc-border] bg-[--color-bc-surface] p-3 text-xs text-[--color-bc-ink-2] leading-relaxed font-mono overflow-hidden"
                style={{ minHeight: 120 }}>
                {typedText}
                {/* blinking cursor */}
                {(phase === 'typing') && (
                  <span className="inline-block w-0.5 h-3.5 bg-[--color-bc-blue] ml-0.5 align-middle animate-pulse" />
                )}
              </div>
            </div>

            {/* Generate button */}
            <button
              className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all ${
                phase === 'generating'
                  ? 'bg-[--color-bc-blue] opacity-80'
                  : 'bg-[--color-bc-blue]'
              }`}>
              {phase === 'generating' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generating bid…
                </span>
              ) : (
                'Generate Bid →'
              )}
            </button>
          </div>

          {/* Right — Output panel */}
          <div className={`p-5 flex flex-col gap-3 transition-opacity duration-700 ${showOutput ? 'opacity-100' : 'opacity-0'}`}>
            {/* Tabs */}
            <div className="flex gap-1">
              {(['proposal', 'pricing'] as const).map((tab) => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-[--color-bc-blue-light] text-[--color-bc-blue] border border-[--color-bc-blue-mid]'
                      : 'text-[--color-bc-faint] hover:text-[--color-bc-ink]'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'proposal' && (
              <div className="flex-1 overflow-hidden">
                <div className="text-xs text-[--color-bc-ink-2] leading-relaxed whitespace-pre-line" style={{ maxHeight: 160, overflow: 'hidden' }}>
                  {streamedProposal}
                  {phase === 'streaming' && (
                    <span className="inline-block w-0.5 h-3 bg-[--color-bc-blue] ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && showOutput && (
              <div className="flex-1 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[--color-bc-faint] border-b border-[--color-bc-border]">
                      <th className="text-left pb-1.5 font-medium">Item</th>
                      <th className="text-right pb-1.5 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING.map((row) => (
                      <tr key={row.item} className="border-b border-[--color-bc-border]">
                        <td className="py-1.5 text-[--color-bc-ink-2]">{row.item}</td>
                        <td className="py-1.5 text-right font-semibold text-[--color-bc-ink]">${row.total}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="pt-2 font-bold text-[--color-bc-ink]">Total</td>
                      <td className="pt-2 text-right font-bold text-[--color-bc-blue]">$2,550</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Humanise checklist */}
            {(phase === 'checklist' || phase === 'done') && activeTab === 'proposal' && (
              <div className="border-t border-[--color-bc-border] pt-3 mt-1">
                <div className="text-xs font-bold text-[--color-bc-ink] mb-2 flex items-center gap-1.5">
                  <span>🎯</span> Before you send
                </div>
                <div className="space-y-1.5">
                  {TIPS.slice(0, visibleTips).map((tip, i) => (
                    <div key={i}
                      className="flex gap-2 items-start text-xs text-[--color-bc-muted] transition-all animate-in fade-in slide-in-from-bottom-1 duration-400">
                      <div className="w-3.5 h-3.5 rounded border border-[--color-bc-border] flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

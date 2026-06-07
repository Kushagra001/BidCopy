import Link from 'next/link'

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Social proof chip */}
        <div className="inline-flex items-center gap-2 bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] text-[--color-bc-blue] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[--color-bc-blue] rounded-full animate-pulse" />
          Used by freelancers on Upwork · Freelancer · Contra
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-[--color-bc-ink] leading-tight tracking-tight mb-6">
          Write bids that win.
        </h1>
        <p className="text-xl text-[--color-bc-muted] max-w-2xl mx-auto leading-relaxed mb-10">
          Paste a job description. Get a complete bid package — proposal, pricing breakdown, timeline, and follow-up — in <strong className="text-[--color-bc-ink]">30 seconds.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
          <Link href="/sign-up"
            className="bg-[--color-bc-blue] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[--color-bc-blue-dark] transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
            Start for free →
          </Link>
          <Link href="#how-it-works"
            className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors text-sm flex items-center gap-2">
            See how it works ↓
          </Link>
        </div>

        <p className="text-xs text-[--color-bc-faint]">
          5 free generations daily · No credit card · Cancel anytime
        </p>

        {/* Demo preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10 pointer-events-none" style={{ top: '70%' }} />
          <div className="bg-[--color-bc-surface] border border-[--color-bc-border] rounded-2xl p-6 text-left shadow-xl">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[--color-bc-border]">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-[--color-bc-faint]">bidcopy.com/dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-3 bg-[--color-bc-border] rounded-full w-24" />
                <div className="h-20 bg-[--color-bc-border] rounded-xl" />
                <div className="h-3 bg-[--color-bc-border] rounded-full w-32" />
                <div className="h-10 bg-[--color-bc-blue] rounded-lg opacity-80" />
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {['Proposal', 'Pricing', 'Timeline', 'Follow-up'].map((t) => (
                    <div key={t} className={`px-3 py-1 rounded-md text-xs font-medium ${t === 'Proposal' ? 'bg-[--color-bc-blue-light] text-[--color-bc-blue] border border-[--color-bc-blue]' : 'bg-[--color-bc-border] text-[--color-bc-faint]'}`}>{t}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[90, 70, 85, 60, 75].map((w, i) => (
                    <div key={i} className="h-2.5 bg-[--color-bc-border] rounded-full" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[--color-bc-border]">
                  <div className="text-xs font-bold text-[--color-bc-ink] mb-2">🎯 Before you send</div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2 mb-1.5">
                      <div className="w-3 h-3 border border-[--color-bc-border] rounded flex-shrink-0 mt-0.5" />
                      <div className="h-2.5 bg-[--color-bc-border] rounded-full flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

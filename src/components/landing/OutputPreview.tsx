import Link from 'next/link'

const DIFFERENTIATORS = [
  { label: 'Proposal only',         others: true,  bidcopy: true  },
  { label: 'Pricing breakdown',     others: false, bidcopy: true  },
  { label: 'Project timeline',      others: false, bidcopy: true  },
  { label: 'Follow-up message',     others: false, bidcopy: true  },
  { label: 'Humanise Checklist',    others: false, bidcopy: true  },
  { label: 'Platform-specific rules', others: false, bidcopy: true },
  { label: 'Powered by Claude',     others: false, bidcopy: true  },
]

export function OutputPreview() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-bc-ink] mb-4">
            Why BidCopy beats every other proposal tool
          </h2>
          <p className="text-[--color-bc-muted] max-w-xl mx-auto">
            Other tools give you a proposal. BidCopy gives you everything you need to win the project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Comparison table */}
          <div className="bg-[--color-bc-surface] border border-[--color-bc-border] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-[--color-bc-ink] text-white text-xs font-semibold px-5 py-3">
              <div>Feature</div>
              <div className="text-center text-[--color-bc-faint]">Others</div>
              <div className="text-center text-[--color-bc-blue-mid]">BidCopy</div>
            </div>
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className={`grid grid-cols-3 px-5 py-3.5 text-sm border-b border-[--color-bc-border] ${i % 2 === 0 ? 'bg-white' : 'bg-[--color-bc-surface]'}`}>
                <div className="text-[--color-bc-ink-2]">{d.label}</div>
                <div className="text-center">{d.others ? '✓' : <span className="text-[--color-bc-faint]">✕</span>}</div>
                <div className="text-center text-[--color-bc-blue]">✓</div>
              </div>
            ))}
          </div>

          {/* Humanise highlight */}
          <div className="space-y-6">
            <div className="bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] rounded-2xl p-8">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-bold text-xl text-[--color-bc-ink] mb-3">The Humanise Checklist</h3>
              <p className="text-[--color-bc-ink-2] text-sm leading-relaxed mb-4">
                No other tool has this. After every generation, BidCopy gives you 5 <strong>specific tips</strong> tailored to that job — telling you exactly what to change to make the proposal sound authentically like you.
              </p>
              <div className="space-y-2">
                {[
                  'Replace \'extensive experience\' with your Medica project example',
                  'The client mentioned React — add your preferred React patterns',
                  'Remove \'as per your requirements\' — it screams template',
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2.5 items-start bg-white rounded-lg px-3 py-2.5 border border-[--color-bc-blue-mid]">
                    <div className="w-3.5 h-3.5 border border-[--color-bc-blue] rounded flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-[--color-bc-ink-2]">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/sign-up"
              className="block w-full text-center bg-[--color-bc-blue] text-white py-4 rounded-xl font-bold hover:bg-[--color-bc-blue-dark] transition-all">
              Try it free →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

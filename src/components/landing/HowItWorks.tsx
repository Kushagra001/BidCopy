import { ClipboardList, Zap, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    number:      '01',
    title:       'Paste the job description',
    description: 'Copy and paste the full job post from Upwork, Freelancer.com, Contra, or anywhere else. The more detail, the better the output.',
    icon:        ClipboardList,
    iconColor:   'text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/45',
  },
  {
    number:      '02',
    title:       'BidCopy generates your complete package',
    description: 'In 30 seconds you get a tailored proposal, pricing breakdown, project timeline, and a follow-up message.',
    icon:        Zap,
    iconColor:   'text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/45',
  },
  {
    number:      '03',
    title:       'Personalise with the Humanise Checklist',
    description: 'BidCopy generates 5 specific tips to make your proposal sound like you, not a template. Check them off and send with confidence.',
    icon:        CheckCircle2,
    iconColor:   'text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/45',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[--color-bc-surface]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-bc-ink] mb-4">How it works</h2>
          <p className="text-[--color-bc-muted] max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            From job post to ready-to-send bid in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => {
            const IconComponent = step.icon
            return (
              <div key={i} className="relative group">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-[--color-bc-border] z-0" style={{ width: 'calc(100% - 2rem)', left: 'calc(100% - 0rem)' }} />
                )}
                <div className="relative z-10 bg-[--background] border border-[--color-bc-border] rounded-2xl p-7 h-full hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-300 flex flex-col">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 shrink-0 transition-all duration-300 group-hover:scale-110 ${step.iconColor}`}>
                    <IconComponent className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-[10px] font-bold text-[--color-bc-blue] mb-2 tracking-widest uppercase">{step.number}</div>
                  <h3 className="font-bold text-lg text-[--color-bc-ink] mb-3 group-hover:text-[--color-bc-blue] transition-colors">{step.title}</h3>
                  <p className="text-[--color-bc-muted] text-sm leading-relaxed flex-1">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

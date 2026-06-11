const TESTIMONIALS = [
  {
    quote: 'I used to spend 30 to 45 minutes writing each proposal. BidCopy cuts that to under 2 minutes. My win rate went from 8% to 21% in the first month.',
    name:  'Arjun Mehta',
    role:  'Full-stack developer · Upwork Top Rated',
    avatar: 'AM',
  },
  {
    quote: 'The Humanise Checklist is the feature no other tool has. It tells me exactly what to change so clients can\'t tell it\'s AI. I\'ve won 6 projects this week.',
    name:  'Priya Nair',
    role:  'UI/UX Designer · Contra creator',
    avatar: 'PN',
  },
  {
    quote: 'My proposals were generic and got ignored. BidCopy personalises them with my actual past projects. Three clients said my proposal stood out from 40+ others.',
    name:  'Sam Adewale',
    role:  'Copywriter · Freelancer.com',
    avatar: 'SA',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[--color-bc-surface]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-bc-ink] mb-4">Freelancers who are winning more</h2>
          <p className="text-[--color-bc-muted]">Real results from real freelancers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-[--background] border border-[--color-bc-border] rounded-2xl p-7">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-[--color-bc-ink-2] leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[--color-bc-blue-light] text-[--color-bc-blue] font-bold text-xs flex items-center justify-center">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[--color-bc-ink]">{t.name}</div>
                  <div className="text-xs text-[--color-bc-muted]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

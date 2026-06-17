import Link from 'next/link'
import { Check } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'

const PLANS = [
  {
    name:        'Free',
    price:       '$0',
    period:      'forever',
    description: 'Everything you need to get started',
    features: [
      '15 generations per day',
      'GPT-4o mini AI',
      'Proposal + pricing + timeline',
      'Humanise checklist',
      'Follow-up message',
    ],
    missing: [
      'GPT-4.1 AI (best quality)',
      'Proposal history',
    ],
    cta:     'Start for free',
    href:    '/sign-up',
    variant: 'default',
  },
  {
    name:        'Pro Monthly',
    price:       '$2.99',
    period:      'per month',
    description: 'For serious freelancers',
    features: [
      'Unlimited generations',
      'GPT-4.1 AI (best quality)',
      'Full proposal history',
      'Humanise checklist',
      'Priority generation speed',
      'All platforms supported',
    ],
    missing: [],
    cta:     'Go Pro →',
    href:    '/sign-up',
    variant: 'monthly',
  },
  {
    name:        'Pro Lifetime',
    price:       '$19.99',
    period:      'one time',
    description: 'Pay once, yours forever',
    features: [
      'Unlimited generations',
      'GPT-4.1 AI (best quality)',
      'Full proposal history',
      'Humanise checklist',
      'Priority generation speed',
      'All platforms supported',
    ],
    missing: [],
    cta:     'Get Lifetime →',
    href:    '/sign-up',
    variant: 'lifetime',
  },
]

export async function Pricing() {
  const { userId } = await auth()

  return (
    <section id="pricing" className="py-24 px-6 bg-[--background]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-bc-ink] mb-4">Simple pricing</h2>
          <p className="text-[--color-bc-muted]">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-center">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 transition-transform duration-300 ${
                plan.variant === 'lifetime'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white border-2 border-blue-500 shadow-2xl lg:scale-105 z-10'
                  : plan.variant === 'monthly'
                    ? 'bg-[--color-bc-surface] dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-500/50 shadow-lg'
                    : 'bg-[--background] dark:bg-slate-800/80 border border-[--color-bc-border]'
              }`}>

              {plan.variant === 'lifetime' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Best Value
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${plan.variant === 'lifetime' ? 'text-white' : 'text-[--color-bc-ink]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-bold ${plan.variant === 'lifetime' ? 'text-white' : 'text-[--color-bc-ink]'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.variant === 'lifetime' ? 'text-white/60' : 'text-[--color-bc-muted]'}`}>
                    {plan.period === 'one time' ? ` ${plan.period}` : `/${plan.period}`}
                  </span>
                </div>
                <p className={`text-sm ${plan.variant === 'lifetime' ? 'text-white/70' : 'text-[--color-bc-muted]'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start text-sm">
                    <Check size={16} className={`flex-shrink-0 mt-0.5 ${plan.variant === 'lifetime' ? 'text-blue-400' : 'text-green-500'}`} />
                    <span className={plan.variant === 'lifetime' ? 'text-white/90' : 'text-[--color-bc-ink-2]'}>{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex gap-3 items-start text-sm opacity-60">
                    <span className="flex-shrink-0 mt-0.5 text-xs">✕</span>
                    <span className={plan.variant === 'lifetime' ? 'text-white' : 'text-[--color-bc-muted]'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={userId ? (plan.name !== 'Free' ? `/dashboard/upgrade?type=${plan.name.includes('Lifetime') ? 'lifetime' : 'monthly'}` : '/dashboard') : plan.href}
                className={`block w-full mt-auto text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.variant === 'lifetime'
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                    : plan.variant === 'monthly'
                      ? 'bg-[--color-bc-blue] text-white hover:bg-[--color-bc-blue-dark] shadow-sm'
                      : 'bg-[--color-bc-surface] border border-[--color-bc-border] text-[--color-bc-ink] hover:bg-[--color-bc-border]'
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

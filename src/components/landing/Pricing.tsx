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
    popular: false,
  },
  {
    name:        'Pro',
    price:       '$6',
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
    popular: true,
  },
]

export async function Pricing() {
  const { userId } = await auth()

  return (
    <section id="pricing" className="py-24 px-6 bg-[--background]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-bc-ink] mb-4">Simple pricing</h2>
          <p className="text-[--color-bc-muted]">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-[--color-bc-dark-card] text-white border-2 border-[--color-bc-blue] shadow-xl'
                  : 'bg-[--background] border border-[--color-bc-border]'
              }`}>

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${plan.popular ? 'text-white' : 'text-[--color-bc-ink]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-[--color-bc-ink]'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-[--color-bc-muted]'}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.popular ? 'text-white/70' : 'text-[--color-bc-muted]'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start text-sm">
                    <Check size={16} className={`flex-shrink-0 mt-0.5 ${plan.popular ? 'text-[--color-bc-blue-mid]' : 'text-green-500'}`} />
                    <span className={plan.popular ? 'text-white/90' : 'text-[--color-bc-ink-2]'}>{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex gap-3 items-start text-sm opacity-60">
                    <span className="flex-shrink-0 mt-0.5 text-xs">✕</span>
                    <span className={plan.popular ? 'text-white' : 'text-[--color-bc-muted]'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={userId ? (plan.popular ? '/dashboard/upgrade' : '/dashboard') : plan.href}
                className={`block w-full mt-auto text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? 'bg-[--color-bc-blue] text-white hover:bg-[--color-bc-blue-dark]'
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

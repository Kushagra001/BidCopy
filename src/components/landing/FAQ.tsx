'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Will clients know my proposal is AI-generated?',
    a: 'Not if you use the Humanise Checklist. After generating, BidCopy gives you 5 specific tips tailored to that job. For example, it might suggest replacing a generic phrase with a reference to one of your past projects. The checklist tells you exactly what to change to make it sound genuinely like you.',
  },
  {
    q: 'Does it work for non-developer freelancers?',
    a: 'Yes. BidCopy works for any type of freelancer, including designers, writers, marketers, video editors, and consultants. You set your profile with your skills and speciality, and the AI adapts its language accordingly.',
  },
  {
    q: 'What platforms does it support?',
    a: 'BidCopy supports Upwork, Freelancer.com, Contra, and any other platform (use "General" mode). Each platform has different rules. For example, Upwork proposals must be under 450 words with no markdown, while Contra allows more personality. BidCopy handles these rules automatically.',
  },
  {
    q: 'How is this different from just using ChatGPT?',
    a: 'ChatGPT gives you a generic proposal. BidCopy gives you a complete bid package: proposal, pricing breakdown, timeline, and a follow-up message. It\'s trained specifically for freelance bids, knows platform-specific rules, and the Humanise Checklist is something no other tool has.',
  },
  {
    q: 'How does the pricing breakdown work?',
    a: 'BidCopy breaks the project into 4 to 6 logical line items with realistic hours and your hourly rate. If the job has a budget, it tries to stay within 10% of it. If not, it prices at your standard rate. You can copy the pricing table with one click.',
  },
  {
    q: 'What are the free plan limits?',
    a: '5 generations per day on the free plan, using GPT-4o mini. That\'s enough to apply for 5 jobs daily. The counter resets at midnight. Pro plan is unlimited, uses GPT-4.1 (better quality), and includes proposal history.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6 bg-[--background]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[--color-bc-ink] mb-4">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-[--color-bc-border] rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-sm text-[--color-bc-ink] pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-[--color-bc-muted] transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-[--color-bc-ink-2] leading-relaxed border-t border-[--color-bc-border] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title:       'Free AI Proposal Generator for Freelancers — BidCopy',
  description: 'The best free AI proposal generator for freelancers. Generate a complete bid package — proposal, pricing, timeline, follow-up — in 30 seconds. No credit card.',
  keywords:    ['free AI proposal generator', 'free proposal generator for freelancers', 'AI bid writer free'],
}

export default function FreeProposalGeneratorPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[--color-bc-ink] mb-4">Free AI Proposal Generator for Freelancers</h1>
            <p className="text-lg text-[--color-bc-muted] leading-relaxed">
              BidCopy is the most complete free AI proposal generator for freelancers. Get a full bid package — proposal, pricing breakdown, project timeline, and a follow-up message — in under 30 seconds. No credit card required.
            </p>
          </div>
          <div className="bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] rounded-2xl p-8 mb-16 text-center">
            <p className="text-[--color-bc-ink] font-semibold mb-4">Start generating proposals for free</p>
            <Link href="/sign-up"
              className="inline-block bg-[--color-bc-blue] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[--color-bc-blue-dark] transition-colors">
              Generate free proposals →
            </Link>
            <p className="text-xs text-[--color-bc-muted] mt-3">5 free proposals per day · Forever free tier available</p>
          </div>
          <div className="prose prose-slate max-w-none">
            <h2>What does the free plan include?</h2>
            <p>The BidCopy free plan gives you 5 complete bid packages per day. Each includes a tailored proposal, itemised pricing breakdown, project timeline, and follow-up message — plus the Humanise Checklist with 5 specific tips to personalise it.</p>
            <h2>Is the free AI proposal generator good enough?</h2>
            <p>The free plan uses Gemini 2.0 Flash, which produces high-quality proposals for most jobs. Upgrade to Pro for Claude Sonnet — better at nuance, complex technical projects, and jobs requiring a specific voice.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

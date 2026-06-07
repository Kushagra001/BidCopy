import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title:       'Free Contra Proposal Generator — BidCopy',
  description: 'Generate a winning Contra proposal in 30 seconds. AI bid writer for Contra freelancers. Show personality, values, and craft.',
  keywords:    ['contra proposal generator', 'contra bid writer', 'contra freelance proposal'],
}

export default function ContraProposalGeneratorPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] text-[--color-bc-blue] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Contra-optimised · Values-forward · Craft-focused
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[--color-bc-ink] mb-4">Free Contra Proposal Generator</h1>
            <p className="text-lg text-[--color-bc-muted] leading-relaxed">
              Contra clients value personality and craft. BidCopy generates proposals that show your values, mention why you love the work, and connect your past projects to their vision.
            </p>
          </div>
          <div className="bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] rounded-2xl p-8 mb-16 text-center">
            <p className="text-[--color-bc-ink] font-semibold mb-4">Generate your Contra proposal now</p>
            <Link href="/sign-up?platform=contra"
              className="inline-block bg-[--color-bc-blue] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[--color-bc-blue-dark] transition-colors">
              Generate proposal →
            </Link>
            <p className="text-xs text-[--color-bc-muted] mt-3">5 free proposals per day · No credit card</p>
          </div>
          <div className="prose prose-slate max-w-none">
            <h2>What makes a great Contra proposal</h2>
            <p>Contra is different from Upwork and Freelancer.com. The platform attracts clients who value independent creators, not just task-completers. Your proposal should feel like a genuine conversation, not a pitch deck.</p>
            <h2>Contra proposal tips</h2>
            <ul>
              <li>Show genuine interest in their project — mention something specific about their vision</li>
              <li>Mention your values and why you do this work</li>
              <li>Reference past projects with the story, not just the output</li>
              <li>Contra allows slightly longer proposals — use the space to build connection</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

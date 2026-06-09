import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title:       'Free Freelancer.com Proposal Generator — BidCopy',
  description: 'Generate a winning Freelancer.com proposal in 30 seconds. AI-powered bid writer for Freelancer.com. Direct, fast, mention experience early.',
  keywords:    ['freelancer proposal generator', 'freelancer.com bid generator', 'AI proposal writer freelancer'],
}

export default function FreelancerProposalGeneratorPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] text-[--color-bc-blue] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Freelancer.com-optimised · Under 350 words · Direct
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[--color-bc-ink] mb-4">Free Freelancer.com Proposal Generator</h1>
            <p className="text-lg text-[--color-bc-muted] leading-relaxed">
              Generate concise, direct Freelancer.com bids that get noticed. BidCopy keeps proposals under 350 words, mentions your experience early, and leads with the solution — not your CV.
            </p>
          </div>
          <div className="bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] rounded-2xl p-8 mb-16 text-center">
            <p className="text-[--color-bc-ink] font-semibold mb-4">Generate your Freelancer.com bid now</p>
            <Link href="/sign-up?platform=freelancer"
              className="inline-block bg-[--color-bc-blue] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[--color-bc-blue-dark] transition-colors">
              Generate proposal →
            </Link>
            <p className="text-xs text-[--color-bc-muted] mt-3">Unlimited generations · No credit card</p>
          </div>
          <div className="text-[--color-bc-ink-2] text-lg leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[--color-bc-ink] [&>h2]:mt-12 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>strong]:text-[--color-bc-ink]">
            <h2>Freelancer.com proposal tips</h2>
            <p>Freelancer.com clients see hundreds of bids. The ones that win are direct, reference the client&apos;s project specifically, and show relevant experience in the first two lines. Avoid generic openers and long introductions.</p>
            <h2>What makes a Freelancer.com bid stand out</h2>
            <ul>
              <li>Lead with your most relevant experience for this specific project</li>
              <li>Keep it under 350 words — shorter bids get more attention</li>
              <li>Mention one specific result from a past project</li>
              <li>Include your timeline estimate upfront</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

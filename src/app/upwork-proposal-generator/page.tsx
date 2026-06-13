import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title:       'Free Upwork Proposal Generator | BidCopy',
  description: 'Generate a winning Upwork proposal in 30 seconds. Free AI-powered bid writer for Upwork freelancers. Includes pricing breakdown, timeline, and follow-up.',
  keywords:    ['upwork proposal generator', 'upwork bid generator', 'AI proposal writer upwork', 'free upwork proposal'],
}

export default function UpworkProposalGeneratorPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 bg-[--background]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] text-[--color-bc-blue] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Upwork-optimised · Under 450 words · No markdown
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[--color-bc-ink] mb-4">Free Upwork Proposal Generator</h1>
            <p className="text-lg text-[--color-bc-muted] leading-relaxed">
              Generate a personalised, winning Upwork proposal in 30 seconds. BidCopy knows Upwork&apos;s rules: it keeps proposals under 450 words, strips markdown, and ends with a question to encourage replies.
            </p>
          </div>

          {/* Embedded CTA */}
          <div className="bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] rounded-2xl p-8 mb-16 text-center">
            <p className="text-[--color-bc-ink] font-semibold mb-4">Get your Upwork proposal now. It&apos;s free.</p>
            <Link href="/sign-up?platform=upwork"
              className="inline-block bg-[--color-bc-blue] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[--color-bc-blue-dark] transition-colors">
              Generate Upwork proposal →
            </Link>
            <p className="text-xs text-[--color-bc-muted] mt-3">15 free generations daily · No credit card</p>
          </div>

          {/* SEO content */}
          <div className="text-[--color-bc-ink-2] text-lg leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[--color-bc-ink] [&>h2]:mt-12 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>strong]:text-[--color-bc-ink]">
            <h2>How to write a winning Upwork proposal</h2>
            <p>The best Upwork proposals do three things: address the client&apos;s problem directly in the first line, reference a relevant past project, and end with a specific question. Most freelancers open with &quot;I am a skilled developer with 5 years of experience&quot;. Clients ignore this.</p>
            <p>BidCopy generates proposals that open with the client&apos;s problem, reference your actual projects (from your profile), and end with a low-friction question that encourages a reply.</p>

            <h2>Upwork proposal examples that work</h2>
            <p>A winning Upwork proposal for a React developer job might open: &quot;Your current site is losing sales because the cart checkout is slow. I rebuilt a similar flow for HealthTrack and cut load time from 4.2s to 0.8s.&quot;</p>
            <p>Notice how it names a specific result, references a project, and connects directly to the client&apos;s problem. BidCopy generates this level of specificity using your profile.</p>

            <h2>Common Upwork proposal mistakes</h2>
            <ul>
              <li><strong>Opening with yourself</strong>: &quot;I am an experienced developer&quot; tells the client nothing about their problem</li>
              <li><strong>Too long</strong>: Upwork research shows proposals over 400 words get lower response rates</li>
              <li><strong>Using markdown</strong>: Upwork strips formatting, so bullets and headers look like broken text</li>
              <li><strong>No call to action</strong>: End with a question to start a conversation</li>
              <li><strong>Generic template language</strong>: Phrases like &quot;As per your requirements&quot; signal a copy-paste job</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

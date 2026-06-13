import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { OutputPreview } from '@/components/landing/OutputPreview'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <OutputPreview />
        <Testimonials />
        <Pricing />
        <FAQ />

        {/* Final CTA */}
        <section className="py-24 px-6 bg-[--color-bc-blue]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to win more bids?
            </h2>
            <p className="text-white mb-8 text-lg">
              Free forever. Upgrade for GPT-4.1 quality.
            </p>
            <Link href="/sign-up"
              className="inline-block bg-white text-[--color-bc-blue] px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Start for free →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

import Link from 'next/link'
import { DemoPreview } from './DemoPreview'
import { auth } from '@clerk/nextjs/server'

export async function Hero() {
  const { userId } = await auth()

  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Social proof chip */}
        <div className="inline-flex items-center gap-2 bg-[--color-bc-blue-light] border border-[--color-bc-blue-mid] text-[--color-bc-blue] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[--color-bc-blue] rounded-full animate-pulse" />
          Used by freelancers on Upwork · Freelancer · Contra
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-[--color-bc-ink] leading-tight tracking-tight mb-6">
          Write bids that win.
        </h1>
        <p className="text-xl text-[--color-bc-muted] max-w-2xl mx-auto leading-relaxed mb-10">
          Paste a job description. Get a complete bid package — proposal, pricing breakdown, timeline, and follow-up — in <strong className="text-[--color-bc-ink]">30 seconds.</strong>
        </p>

        {!userId ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
              <Link href="/sign-up"
                className="bg-[--color-bc-blue] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[--color-bc-blue-dark] transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
                Start for free →
              </Link>
              <Link href="#how-it-works"
                className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors text-sm flex items-center gap-2">
                See how it works ↓
              </Link>
            </div>

            {/* Auth options hint */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-[--color-bc-faint]">
                <svg width="14" height="14" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google in one click
              </div>
              <span className="text-[--color-bc-border]" aria-hidden>·</span>
              <span className="text-xs text-[--color-bc-faint]">Unlimited generations · No credit card</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Link href="/dashboard"
              className="bg-[--color-bc-blue] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[--color-bc-blue-dark] transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              Go to Dashboard →
            </Link>
          </div>
        )}

        <DemoPreview />
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export default function UnauthorizedPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center bg-[--color-bc-surface]">
        <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-3xl p-12 max-w-lg shadow-sm">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-4 block">401 Error</span>
          <h1 className="text-4xl font-bold text-[--color-bc-ink] mb-4">Unauthorized access</h1>
          <p className="text-lg text-[--color-bc-muted] mb-8">
            You must be signed in to access this page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-in"
              className="inline-block bg-[--color-bc-blue] text-white font-medium px-8 py-3 rounded-xl hover:bg-[--color-bc-blue-dark] transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/"
              className="inline-block bg-[--color-bc-white] text-[--color-bc-ink] border border-[--color-bc-border] font-medium px-8 py-3 rounded-xl hover:border-[--color-bc-ink] transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

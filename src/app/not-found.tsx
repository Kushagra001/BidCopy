import Link from 'next/link'
import { Nav } from '@/components/shared/Nav'
import { Footer } from '@/components/shared/Footer'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center bg-[--color-bc-surface]">
        <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-3xl p-12 max-w-lg shadow-sm">
          <span className="text-sm font-semibold uppercase tracking-widest text-[--color-bc-blue] mb-4 block">404 Error</span>
          <h1 className="text-4xl font-bold text-[--color-bc-ink] mb-4">Page not found</h1>
          <p className="text-lg text-[--color-bc-muted] mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link 
            href="/"
            className="inline-block bg-[--color-bc-blue] text-white font-medium px-8 py-3 rounded-xl hover:bg-[--color-bc-blue-dark] transition-colors"
          >
            Go back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

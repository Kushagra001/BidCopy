'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center bg-[--color-bc-surface]">
      <div className="bg-[--color-bc-white] border border-[--color-bc-border] rounded-3xl p-12 max-w-lg shadow-sm">
        <span className="text-sm font-semibold uppercase tracking-widest text-red-500 mb-4 block">500 Error</span>
        <h1 className="text-4xl font-bold text-[--color-bc-ink] mb-4">Something went wrong</h1>
        <p className="text-lg text-[--color-bc-muted] mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-block bg-[--color-bc-ink] text-white font-medium px-8 py-3 rounded-xl hover:bg-[--color-bc-ink-2] transition-colors"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="inline-block bg-[--color-bc-white] text-[--color-bc-ink] border border-[--color-bc-border] font-medium px-8 py-3 rounded-xl hover:border-[--color-bc-ink] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}

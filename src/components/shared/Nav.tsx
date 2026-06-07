import Link from 'next/link'

export function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-[--color-bc-border]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-[--color-bc-blue] text-xl tracking-tight">
          BidCopy
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="#pricing" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">Pricing</Link>
          <Link href="#faq" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">FAQ</Link>
          <Link href="/sign-in" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">Sign in</Link>
          <Link href="/sign-up" className="bg-[--color-bc-blue] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[--color-bc-blue-dark] transition-colors">
            Start free →
          </Link>
        </div>
      </div>
    </nav>
  )
}

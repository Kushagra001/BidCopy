import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export async function Nav() {
  const { userId } = await auth()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[--background]/80 backdrop-blur-md border-b border-[--color-bc-border]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileMenu userId={userId} />
          <Link href="/" className="font-bold text-[--color-bc-blue] text-xl tracking-tight flex items-center gap-2">
            <Image src="/icon.svg" alt="BidCopy Logo" width={19} height={24} className="rounded-sm" />
            BidCopy
          </Link>
        </div>
        <div className="flex items-center gap-3 md:gap-6 text-sm">
          <div className="hidden md:flex items-center gap-6">
            <Link href="#pricing" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">Pricing</Link>
            <Link href="#faq" className="text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">FAQ</Link>
          </div>
          <ThemeToggle />
          
          {!userId ? (
            <>
              <Link href="/sign-in" className="hidden sm:block text-[--color-bc-muted] hover:text-[--color-bc-ink] transition-colors">Sign in</Link>
              <Link href="/sign-up" className="bg-[--color-bc-blue] text-white px-3 md:px-4 py-2 rounded-lg font-semibold hover:bg-[--color-bc-blue-dark] transition-colors whitespace-nowrap">
                Start free →
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hidden sm:block text-[--color-bc-ink] font-medium hover:text-[--color-bc-blue] transition-colors">Dashboard</Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

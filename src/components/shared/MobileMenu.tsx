'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface MobileMenuProps {
  userId: string | null
}

export function MobileMenu({ userId }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-[--color-bc-ink] hover:bg-[--color-bc-surface] rounded-lg cursor-pointer">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[--color-bc-white] border-b border-[--color-bc-border] p-4 flex flex-col gap-4 shadow-xl z-50">
          <Link href="/#pricing" onClick={() => setIsOpen(false)} className="text-[--color-bc-ink] font-medium hover:text-[--color-bc-blue]">Pricing</Link>
          <Link href="/#faq" onClick={() => setIsOpen(false)} className="text-[--color-bc-ink] font-medium hover:text-[--color-bc-blue]">FAQ</Link>
          {!userId ? (
            <Link href="/sign-in" onClick={() => setIsOpen(false)} className="text-[--color-bc-ink] font-medium hover:text-[--color-bc-blue]">Sign in</Link>
          ) : (
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-[--color-bc-ink] font-medium hover:text-[--color-bc-blue]">Dashboard</Link>
          )}
        </div>
      )}
    </div>
  )
}

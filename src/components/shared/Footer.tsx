import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[--color-bc-dark-card] text-[--color-bc-muted] py-16 px-6 border-t border-[--color-bc-border]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="font-bold text-white text-xl mb-3 flex items-center gap-2"><Image src="/icon.svg" alt="BidCopy Logo" width={19} height={24} className="rounded-sm" />BidCopy</div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400 dark:text-[--color-bc-muted]">
              AI-powered bid proposal generator for freelancers. Write bids that win — in 30 seconds.
            </p>
            <p className="text-xs mt-4 text-slate-400 dark:text-[--color-bc-faint]">hello@bidcopy.com</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Generator</Link></li>
              <li><Link href="/dashboard/upgrade" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/upwork-proposal-generator" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Upwork Proposal Generator</Link></li>
              <li><Link href="/freelancer-proposal-generator" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Freelancer Proposal Generator</Link></li>
              <li><Link href="/contra-proposal-generator" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Contra Proposal Generator</Link></li>
              <li><Link href="/free-proposal-generator" className="text-slate-400 dark:text-[--color-bc-muted] hover:text-white dark:hover:text-[--color-bc-ink] transition-colors">Free AI Proposal Generator</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[--color-bc-border] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[--color-bc-faint]">
          <p>© {new Date().getFullYear()} BidCopy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-slate-400 dark:text-[--color-bc-faint] hover:text-slate-300 dark:hover:text-[--color-bc-ink] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-400 dark:text-[--color-bc-faint] hover:text-slate-300 dark:hover:text-[--color-bc-ink] transition-colors">Terms</Link>
            <Link href="/refund" className="text-slate-400 dark:text-[--color-bc-faint] hover:text-slate-300 dark:hover:text-[--color-bc-ink] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

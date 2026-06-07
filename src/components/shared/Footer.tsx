import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[--color-bc-ink] text-[--color-bc-faint] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="font-bold text-white text-xl mb-3">BidCopy</div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered bid proposal generator for freelancers. Write bids that win — in 30 seconds.
            </p>
            <p className="text-xs mt-4">hello@bidcopy.com</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Generator</Link></li>
              <li><Link href="/dashboard/upgrade" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/upwork-proposal-generator" className="hover:text-white transition-colors">Upwork Proposal Generator</Link></li>
              <li><Link href="/freelancer-proposal-generator" className="hover:text-white transition-colors">Freelancer Proposal Generator</Link></li>
              <li><Link href="/contra-proposal-generator" className="hover:text-white transition-colors">Contra Proposal Generator</Link></li>
              <li><Link href="/free-proposal-generator" className="hover:text-white transition-colors">Free AI Proposal Generator</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} BidCopy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

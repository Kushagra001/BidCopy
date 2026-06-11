import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BidCopy — Write bids that win.',
    template: '%s | BidCopy',
  },
  description:
    'AI-powered bid proposal generator for freelancers. Paste a job description, get a complete bid package in 30 seconds.',
  keywords: ['freelance proposal generator', 'AI bid writer', 'upwork proposal', 'freelancer proposal'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://bidcopy.com'),
  openGraph: {
    type: 'website',
    siteName: 'BidCopy',
    title: 'BidCopy — Write bids that win.',
    description: 'AI-powered bid proposal generator for freelancers.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="font-sans">
        <ClerkProvider>
          {children}
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}

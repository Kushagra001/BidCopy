'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const PRO_FEATURES = [
  'Unlimited bid generations',
  'GPT-4.1 AI — best quality',
  'Full proposal history',
  'Priority generation speed',
  'All 4 platforms supported',
  'Humanise Checklist on every bid',
  'Pricing breakdown + timeline + follow-up',
]

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      // Load Razorpay script
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Razorpay'))
          document.body.appendChild(script)
        })
      }

      const res = await fetch('/api/create-order', { method: 'POST' })
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Order creation failed:', errorData)
        alert('Payment gateway error. Please ensure your Razorpay keys are correct.')
        setLoading(false)
        return
      }
      
      const { orderId, amount, currency, keyId } = await res.json()

      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency,
        name:        'BidCopy',
        description: 'Pro Plan — Unlimited bid generations',
        order_id:    orderId,
        handler: async (response: { razorpay_payment_id: string }) => {
          // The database is securely updated via background webhook.
          // We just handle the client-side UI redirect here.
          if (response.razorpay_payment_id) {
            setSuccess(true)
            setTimeout(() => (window.location.href = '/dashboard'), 2000)
          }
        },
        theme: { color: '#2563eb' },
      })

      rzp.open()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[--color-bc-surface] dark:bg-[--background] flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="font-bold text-[--color-bc-blue] text-xl">BidCopy</Link>
          <h1 className="text-3xl font-bold text-[--color-bc-ink] mt-6 mb-2">Upgrade to Pro</h1>
          <p className="text-[--color-bc-muted]">Unlimited generations. Better AI. Full history.</p>
        </div>

        <div className="bg-[--color-bc-dark-card] text-white rounded-2xl p-8">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-5xl font-bold">$6</span>
            <span className="text-white/60">/month</span>
          </div>
          <p className="text-white/60 text-sm mb-8">Cancel anytime. Billed monthly.</p>

          <ul className="space-y-3 mb-10">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-[--color-bc-blue-mid] flex-shrink-0" />
                <span className="text-white/90">{f}</span>
              </li>
            ))}
          </ul>

          {success ? (
            <div className="text-center text-green-400 font-semibold">
              ✓ You&apos;re now Pro! Redirecting…
            </div>
          ) : (
            <Button onClick={handleUpgrade} loading={loading} className="w-full" size="lg">
              Upgrade now →
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-[--color-bc-muted] mt-6">
          Secure payment via Razorpay. Cancel anytime from your profile.
        </p>
      </div>
    </main>
  )
}

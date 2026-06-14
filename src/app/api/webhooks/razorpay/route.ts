import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const bodyText = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(bodyText)
    .digest('hex')

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event
  try {
    event = JSON.parse(bodyText)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload.payment.entity
    const clerkId = payment.notes?.clerk_id
    
    // Strict validation of the payment amount to prevent spoofing
    if (payment.amount === 49900 && payment.status === 'captured' && clerkId) {
      const supabase = createAdminClient()
      
      const { error } = await supabase
        .from('users')
        .update({ plan: 'pro', updated_at: new Date().toISOString() })
        .eq('clerk_id', clerkId)
        
      if (error) {
        console.error('[/api/webhooks/razorpay] DB Error:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }
    } else {
      console.warn('[/api/webhooks/razorpay] Ignored valid signature with invalid conditions:', { amount: payment.amount, status: payment.status, clerkId })
    }
  }

  return NextResponse.json({ received: true })
}

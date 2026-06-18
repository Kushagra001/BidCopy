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
    const planType = payment.notes?.plan_type || 'monthly'
    const promoCode = payment.notes?.promo_code || ''
    
    // Strict validation of the payment amount to prevent spoofing
    const isMonthlyValid = planType === 'monthly' && payment.amount === 24900
    
    let expectedLifetimeAmount = 149900
    if (promoCode === 'PH10OFF') expectedLifetimeAmount = 134910
    const isLifetimeValid = planType === 'lifetime' && payment.amount === expectedLifetimeAmount

    if ((isMonthlyValid || isLifetimeValid) && payment.status === 'captured' && clerkId) {
      const supabase = createAdminClient()

      let newExpiresAt: string | null = null
      if (planType === 'monthly') {
        const { data: user } = await supabase.from('users').select('pro_expires_at').eq('clerk_id', clerkId).single()
        
        let baseDate = new Date()
        if (user && user.pro_expires_at) {
          const currentExp = new Date(user.pro_expires_at)
          if (currentExp > baseDate) baseDate = currentExp
        }
        
        baseDate.setDate(baseDate.getDate() + 30) // add 30 days
        newExpiresAt = baseDate.toISOString()
      }
      
      const { error } = await supabase
        .from('users')
        .update({ 
          plan: 'pro', 
          updated_at: new Date().toISOString(),
          pro_expires_at: newExpiresAt
        })
        .eq('clerk_id', clerkId)
        
      if (error) {
        console.error('[/api/webhooks/razorpay] DB Error:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }
    } else {
      console.warn('[/api/webhooks/razorpay] Ignored valid signature with invalid conditions:', { amount: payment.amount, status: payment.status, clerkId, planType })
    }
  }

  return NextResponse.json({ received: true })
}

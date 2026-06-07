import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('users')
    .update({ plan: 'pro', updated_at: new Date().toISOString() })
    .eq('clerk_id', userId)

  if (error) {
    console.error('[/api/verify-payment]', error)
    return NextResponse.json({ error: 'Failed to upgrade plan' }, { status: 500 })
  }

  return NextResponse.json({ success: true, plan: 'pro' })
}

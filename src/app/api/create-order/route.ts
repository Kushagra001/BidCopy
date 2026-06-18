import Razorpay from 'razorpay'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

function getRazorpay() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID ?? 'placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'placeholder',
  })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let planType = 'monthly'
  let promoCode = ''
  try {
    const body = await req.json()
    if (body.type === 'lifetime') planType = 'lifetime'
    if (body.promoCode) promoCode = body.promoCode
  } catch (e) {}

  let amount = planType === 'lifetime' ? 149900 : 24900

  // Apply 10% discount for PH10OFF on lifetime plan
  if (planType === 'lifetime' && promoCode === 'PH10OFF') {
    amount = 134910 // 149900 - 10%
  }

  try {
    const rz = getRazorpay()
    const order = await rz.orders.create({
      amount,
      currency: 'INR',
      receipt:  `bc_${Date.now()}`,
      notes:    { clerk_id: userId, plan_type: planType, promo_code: promoCode },
    })

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[/api/create-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

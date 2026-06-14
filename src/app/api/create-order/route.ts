import Razorpay from 'razorpay'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

function getRazorpay() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID ?? 'placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'placeholder',
  })
}

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const rz = getRazorpay()
    const order = await rz.orders.create({
      amount:   600,
      currency: 'USD',
      receipt:  `bc_${Date.now()}`,
      notes:    { clerk_id: userId },
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

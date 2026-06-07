import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { Webhook } from 'svix'

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const svixId        = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()

  let event: { type: string; data: Record<string, unknown> }
  try {
    const wh = new Webhook(webhookSecret)
    event = wh.verify(body, {
      'svix-id':        svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: Record<string, unknown> }
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event

  if (type === 'user.created' || type === 'user.updated') {
    const clerkId = data.id as string
    const email   = (data.email_addresses as Array<{ email_address: string; id: string; primary?: boolean }>)
      ?.find((e) => e.id === data.primary_email_address_id)?.email_address
    const name    = [data.first_name, data.last_name].filter(Boolean).join(' ') || null

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    await supabase
      .from('users')
      .upsert({ clerk_id: clerkId, email, name, updated_at: new Date().toISOString() }, { onConflict: 'clerk_id' })
  }

  if (type === 'user.deleted') {
    const clerkId = data.id as string
    await supabase.from('users').delete().eq('clerk_id', clerkId)
  }

  return NextResponse.json({ received: true })
}

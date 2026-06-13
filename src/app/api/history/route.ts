import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, plan')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (user.plan !== 'pro') {
    return NextResponse.json({ error: 'Proposal history is a Pro feature.' }, { status: 403 })
  }

  if (id) {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ proposal })
  }

  const page  = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const from  = (page - 1) * limit
  const to    = from + limit - 1

  const { data, error, count } = await supabase
    .from('proposals')
    .select('id, job_title, platform, word_count, model_used, rating, is_saved, created_at', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ proposals: data, total: count, page, limit })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createAdminClient()
  const body = await req.json()
  const { id, rating, is_saved } = body

  const { data: user } = await supabase
    .from('users')
    .select('id, plan')
    .eq('clerk_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (user.plan !== 'pro') {
    return NextResponse.json({ error: 'Proposal history is a Pro feature.' }, { status: 403 })
  }

  const update: Record<string, unknown> = {}
  if (rating    !== undefined) update.rating   = rating
  if (is_saved  !== undefined) update.is_saved = is_saved

  const { error } = await supabase
    .from('proposals')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

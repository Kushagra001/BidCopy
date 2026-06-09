import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase'

async function getOrCreateUser(supabase: any, clerkUserId: string) {
  let { data: user } = await supabase
    .from('users')
    .select('id, name, plan')
    .eq('clerk_id', clerkUserId)
    .single()

  if (!user) {
    try {
      const clerkUser = await currentUser()
      if (clerkUser) {
        const email = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null

        if (email) {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ clerk_id: clerkUserId, email, name, updated_at: new Date().toISOString() })
            .select('id, name, plan')
            .single()

          if (!insertError && newUser) {
            user = newUser
          } else if (insertError) {
            console.error('Failed to create user in db:', insertError)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching/creating user from Clerk:', err)
    }
  }

  return user
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createAdminClient()

  const user = await getOrCreateUser(supabase, userId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ profile: profile ?? null, defaultName: user.name ?? null, plan: user.plan })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createAdminClient()

  const user = await getOrCreateUser(supabase, userId)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { ...body, user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ profile: data })
}


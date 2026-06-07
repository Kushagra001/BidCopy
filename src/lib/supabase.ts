import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://placeholder.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'
const SUPABASE_SVC  = process.env.SUPABASE_SERVICE_KEY ?? 'placeholder'

// Browser-safe client (uses anon key)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// Server-side admin client (uses service key — never expose to browser)
export function createAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SVC, { auth: { persistSession: false } })
}

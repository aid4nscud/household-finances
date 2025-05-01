import { createClient as createServiceSupabaseClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient as createBrowserClient } from '@/utils/supabase/client'
import { SESSION_EXPIRY } from './constants'

// Check if Supabase URL and anon key are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  )
}

console.log(`[Supabase] Creating client with URL: ${supabaseUrl}`)

// Export the modern client creators
export const createClient = createBrowserClient
export const createServerSupabaseClient = createServerClient

/**
 * @deprecated Use createClient() from utils/supabase/client.ts instead
 */
export const supabase = createBrowserClient()

// Log client creation
console.log('[Supabase] Client created successfully')
console.log('[Supabase] Session persistence enabled with cookies')

// Log Supabase URL to debug (don't include in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('[Supabase] URL:', supabaseUrl)
}

/**
 * Creates a Supabase client with the service role key for admin operations
 * IMPORTANT: Only use this on the server side, never expose this in client-side code
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createServiceSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} 
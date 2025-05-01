import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        storageKey: 'supabase-auth-token',
        // Add debug option to turn off excessive logging
        debug: false
      },
      global: {
        // Add fetch options to reduce frequency of checks
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            cache: 'no-store'
          })
        }
      }
    }
  )
} 
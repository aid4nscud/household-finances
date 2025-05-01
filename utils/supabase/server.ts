import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'

/**
 * Creates a Supabase client for Server Components, API Routes, and Route Handlers
 * with automatic cookie handling
 */
export const createClient = () => {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          console.log('[Server Supabase] Getting cookie:', name);
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: Record<string, any>) {
          console.log('[Server Supabase] Setting cookie:', name);
          try {
            // Parse options to ensure they're valid
            const cookieOptions = {
              ...options,
              // Ensure the cookie is accessible client-side
              httpOnly: false,
            }
            
            // Set cookie with parsed options
            cookieStore.set({ name, value, ...cookieOptions })
          } catch (error) {
            console.error('[Server Supabase] Error setting cookie:', error);
          }
        },
        remove(name: string, options: Record<string, any>) {
          console.log('[Server Supabase] Removing cookie:', name);
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch (error) {
            console.error('[Server Supabase] Error removing cookie:', error);
          }
        },
      },
    }
  )
} 
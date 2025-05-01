import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for Server Components, API Routes, and Route Handlers
 * with automatic cookie handling
 */
export const createClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true
      },
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true
            })
          } catch (error) {
            // This will fail silently during static generation or 
            // when cookies cannot be modified, which is expected
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              maxAge: 0,
              path: '/'
            })
          } catch (error) {
            // This will fail silently during static generation or
            // when cookies cannot be modified, which is expected
          }
        },
      },
    }
  )
} 
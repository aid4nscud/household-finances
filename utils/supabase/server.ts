import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'

/**
 * Creates a Supabase client for Server Components, API Routes, and Route Handlers
 * with automatic cookie handling
 */
export const createClient = () => {
  const cookieStore = cookies()
  
  // Add debug logging
  const allCookies = cookieStore.getAll()
  console.log('[Server] Available cookies:', allCookies.map(c => c.name))

  // Check for PKCE cookie specifically
  const hasCodeVerifier = allCookies.some(c => 
    c.name.includes('code-verifier') || c.name.startsWith('sb-'))
  console.log('[Server] Has code verifier cookie:', hasCodeVerifier)
  
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true
      },
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          console.log(`[Server] Getting cookie: ${name}, exists: ${!!cookie}`)
          return cookie?.value
        },
        set(name: string, value: string, options: Record<string, any>) {
          console.log(`[Server] Setting cookie: ${name}`)
          try {
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: false
            })
          } catch (error) {
            console.error('[Server] Error setting cookie:', error);
          }
        },
        remove(name: string, options: Record<string, any>) {
          console.log(`[Server] Removing cookie: ${name}`)
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              maxAge: 0,
              path: '/'
            })
          } catch (error) {
            console.error('[Server] Error removing cookie:', error);
          }
        },
      },
    }
  )
} 
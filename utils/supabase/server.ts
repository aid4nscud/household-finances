import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for Server Components, API Routes, and Route Handlers
 * with automatic cookie handling
 */
export const createClient = () => {
  const cookieStore = cookies()
  
  // Add debug logging in development
  if (process.env.NODE_ENV !== 'production') {
    const allCookies = cookieStore.getAll()
    console.log('[Server] Auth-related cookies:', 
      allCookies
        .filter(c => c.name.includes('code-verifier') || 
                   c.name.startsWith('sb-') || 
                   c.name.includes('supabase'))
        .map(c => c.name)
    )
  }
  
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
          const cookie = cookieStore.get(name)
          if (process.env.NODE_ENV !== 'production' && 
              (name.includes('code-verifier') || name.startsWith('sb-'))) {
            console.log(`[Server] Getting auth cookie: ${name}, exists: ${!!cookie}`)
          }
          return cookie?.value
        },
        set(name, value, options) {
          try {
            if (process.env.NODE_ENV !== 'production' && 
                (name.includes('code-verifier') || name.startsWith('sb-'))) {
              console.log(`[Server] Setting auth cookie: ${name}`)
            }
            
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
              // Leave domain undefined to use the current domain automatically
            })
          } catch (error) {
            console.error('[Server] Error setting cookie:', error)
            // This will fail silently during static generation or 
            // when cookies cannot be modified, which is expected
          }
        },
        remove(name, options) {
          try {
            if (process.env.NODE_ENV !== 'production' && 
                (name.includes('code-verifier') || name.startsWith('sb-'))) {
              console.log(`[Server] Removing auth cookie: ${name}`)
            }
            
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
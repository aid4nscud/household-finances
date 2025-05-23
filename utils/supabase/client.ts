import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser contexts
 * This function creates a new client on each invocation, so it's best
 * to create a single instance and reuse it if possible
 */
export const createClient = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          if (!isBrowser) return ''
          
          const cookies = document.cookie.split(';')
          const cookie = cookies.find(cookie => cookie.trim().startsWith(`${name}=`))
          return cookie ? cookie.split('=')[1] : ''
        },
        set(name, value, options) {
          if (!isBrowser) return
          
          document.cookie = `${name}=${value}; path=${options?.path || '/'}`
        },
        remove(name, options) {
          if (!isBrowser) return
          
          document.cookie = `${name}=; path=${options?.path || '/'};  max-age=0`
        },
      },
    }
  )
} 
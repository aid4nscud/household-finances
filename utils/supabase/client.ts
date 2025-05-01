import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser contexts
 * This function creates a new client on each invocation, so it's best
 * to create a single instance and reuse it if possible
 */
export function createClient() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
  
  // Get the current URL for domain-related settings
  const currentUrl = isBrowser ? window.location.hostname : ''
  // Determine if we're on localhost
  const isLocalhost = currentUrl === 'localhost' || currentUrl === '127.0.0.1'
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true
      },
      cookies: {
        get(name) {
          if (!isBrowser) return null
          
          const cookies = document.cookie.split(';').map(cookie => cookie.trim());
          const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
          if (!cookie) return null;
          return cookie.split('=')[1];
        },
        set(name, value, options) {
          if (!isBrowser) return
          
          // Ensure secure cookies in production
          const cookieOptions = {
            // Set secure attribute unless we're on localhost
            secure: !isLocalhost,
            // Path should always be root to be accessible across the site
            path: '/',
            // Use sameSite=Lax to allow redirects for auth
            sameSite: 'Lax' as const,
            ...options
          }
          
          // Build the cookie string with provided options
          let cookieString = `${name}=${value}`;
          
          if (cookieOptions.domain) cookieString += `; domain=${cookieOptions.domain}`;
          if (cookieOptions.maxAge) cookieString += `; max-age=${cookieOptions.maxAge}`;
          if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`;
          if (cookieOptions.sameSite) cookieString += `; samesite=${cookieOptions.sameSite}`;
          if (cookieOptions.secure) cookieString += `; secure`;
          
          // Set the cookie
          document.cookie = cookieString;
        },
        remove(name, options) {
          if (!isBrowser) return
          
          // Ensure we remove the cookie from the correct path
          const cookieString = `${name}=; max-age=0; path=${options?.path || '/'};`;
          document.cookie = cookieString;
        }
      }
    }
  )
} 
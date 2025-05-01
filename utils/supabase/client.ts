import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser contexts
 * This function creates a new client on each invocation, so it's best
 * to create a single instance and reuse it if possible
 */
export function createClient() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          console.log('[Client Supabase] Getting cookie:', name);
          if (!isBrowser) return null
          
          const cookies = document.cookie.split(';').map(cookie => cookie.trim());
          const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
          if (!cookie) return null;
          return cookie.split('=')[1];
        },
        set(name, value, options) {
          console.log('[Client Supabase] Setting cookie:', name);
          if (!isBrowser) return
          
          // Set the cookie with the provided options
          let cookieString = `${name}=${value}`;
          
          if (options.domain) cookieString += `; domain=${options.domain}`;
          if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
          if (options.path) cookieString += `; path=${options.path}`;
          if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
          if (options.secure) cookieString += `; secure`;
          
          document.cookie = cookieString;
        },
        remove(name, options) {
          console.log('[Client Supabase] Removing cookie:', name);
          if (!isBrowser) return
          
          // Remove the cookie by setting its expiry in the past
          const cookieString = `${name}=; max-age=0; path=${options?.path || '/'}`;
          document.cookie = cookieString;
        }
      }
    }
  )
} 
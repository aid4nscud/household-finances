import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser contexts
 * This function creates a new client on each invocation, so it's best
 * to create a single instance and reuse it if possible
 */
export function createClient() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
  
  // Add client ID for tracing in logs
  const clientId = Math.random().toString(36).substring(2, 8)
  
  // Get the current URL for domain-related settings
  const currentUrl = isBrowser ? window.location.hostname : ''
  // Determine if we're on localhost
  const isLocalhost = currentUrl === 'localhost' || currentUrl === '127.0.0.1'
  
  console.log(`[Client ${clientId}] Creating Supabase client, browser: ${isBrowser}, host: ${currentUrl}`);
  
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
          if (!isBrowser) {
            console.log(`[Client ${clientId}] Not in browser, skipping cookie get:`, name);
            return null;
          }
          
          const cookies = document.cookie.split(';').map(cookie => cookie.trim());
          const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
          console.log(`[Client ${clientId}] Getting cookie: ${name}, exists: ${!!cookie}`);
          if (!cookie) return null;
          return cookie.split('=')[1];
        },
        set(name, value, options) {
          if (!isBrowser) {
            console.log(`[Client ${clientId}] Not in browser, skipping cookie set:`, name);
            return;
          }
          
          // Ensure secure cookies in production
          const cookieOptions = {
            // Set secure attribute unless we're on localhost
            secure: !isLocalhost,
            // Path should always be root to be accessible across the site
            path: '/',
            // Use sameSite=lax to allow redirects for auth (lowercase per spec)
            sameSite: 'lax',
            ...options
          }
          
          console.log(`[Client ${clientId}] Setting cookie: ${name} with options:`, {
            secure: cookieOptions.secure,
            path: cookieOptions.path,
            maxAge: cookieOptions.maxAge,
            sameSite: cookieOptions.sameSite
          });
          
          // Build the cookie string with provided options
          let cookieString = `${name}=${value}`;
          
          if (cookieOptions.domain) cookieString += `; domain=${cookieOptions.domain}`;
          if (cookieOptions.maxAge) cookieString += `; max-age=${cookieOptions.maxAge}`;
          if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`;
          if (cookieOptions.sameSite) cookieString += `; samesite=${cookieOptions.sameSite}`;
          if (cookieOptions.secure) cookieString += `; secure`;
          
          // Set the cookie
          document.cookie = cookieString;
          
          // Verify cookie was set
          setTimeout(() => {
            const cookies = document.cookie.split(';').map(cookie => cookie.trim());
            const wasSet = cookies.some(cookie => cookie.startsWith(`${name}=`));
            console.log(`[Client ${clientId}] Cookie set verification for ${name}: ${wasSet ? 'Success' : 'Failed'}`);
          }, 50);
        },
        remove(name, options) {
          if (!isBrowser) {
            console.log(`[Client ${clientId}] Not in browser, skipping cookie remove:`, name);
            return;
          }
          
          console.log(`[Client ${clientId}] Removing cookie:`, name);
          
          // Ensure we remove the cookie from the correct path
          const cookieString = `${name}=; max-age=0; path=${options?.path || '/'};`;
          document.cookie = cookieString;
        }
      }
    }
  )
} 
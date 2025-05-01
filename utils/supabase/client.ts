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
        autoRefreshToken: true,
        // Use localStorage instead of cookies for more reliable persistence
        storage: isBrowser ? localStorage : undefined
      },
      // Custom debug logger
      global: {
        headers: {
          'x-client-id': clientId
        }
      }
    }
  )
} 
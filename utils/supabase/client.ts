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
  
  // Browser-specific auth settings
  const authSettings = {
    flowType: 'pkce' as const,
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    // Storage settings for more reliable session persistence
    storage: isBrowser ? {
      getItem: (key: string) => {
        try {
          // Try localStorage first (default)
          const value = localStorage.getItem(key);
          if (value) {
            return value;
          }
          
          // Fall back to sessionStorage
          return sessionStorage.getItem(key);
        } catch (e) {
          console.error(`[Client ${clientId}] Storage error:`, e);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          // Store in both localStorage and sessionStorage for redundancy
          localStorage.setItem(key, value);
          sessionStorage.setItem(key, value);
        } catch (e) {
          console.error(`[Client ${clientId}] Storage error:`, e);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          console.error(`[Client ${clientId}] Storage error:`, e);
        }
      }
    } : undefined
  };
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: authSettings,
      global: {
        headers: {
          'x-client-id': clientId
        }
      }
    }
  )
} 
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
    // Enhanced cookie options for better persistence
    cookieOptions: {
      sameSite: 'lax' as const,
      secure: !isLocalhost,
      path: '/',
      domain: isLocalhost ? undefined : currentUrl,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    },
    // Storage settings for more reliable session persistence
    storage: isBrowser ? {
      getItem: (key: string) => {
        try {
          // Try localStorage first (default)
          const value = localStorage.getItem(key);
          if (value) {
            console.log(`[Client ${clientId}] Retrieved ${key} from localStorage`);
            return value;
          }
          
          // Fall back to sessionStorage
          const sessionValue = sessionStorage.getItem(key);
          if (sessionValue) {
            console.log(`[Client ${clientId}] Retrieved ${key} from sessionStorage`);
            return sessionValue;
          }
          
          // As a last resort, try to get the value from cookies
          if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
              const [cookieName, cookieValue] = cookie.trim().split('=');
              if (cookieName === key && cookieValue) {
                console.log(`[Client ${clientId}] Retrieved ${key} from cookies`);
                return decodeURIComponent(cookieValue);
              }
            }
          }
          
          console.log(`[Client ${clientId}] No value found for ${key}`);
          return null;
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
          
          // Also set as a cookie for cross-tab persistence
          if (typeof document !== 'undefined') {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7); // 1 week
            document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/; ${isLocalhost ? '' : 'secure; '}samesite=lax`;
          }
          
          console.log(`[Client ${clientId}] Stored ${key} in multiple locations`);
        } catch (e) {
          console.error(`[Client ${clientId}] Storage error:`, e);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
          
          // Also remove cookie
          if (typeof document !== 'undefined') {
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${isLocalhost ? '' : 'secure; '}samesite=lax`;
          }
          
          console.log(`[Client ${clientId}] Removed ${key} from all storage locations`);
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
      },
      // Force cookies to be sent in all requests, even across domains
      cookies: {
        get(key) {
          if (typeof document === 'undefined') return null;
          const cookies = document.cookie.split(';');
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === key) return decodeURIComponent(value || '');
          }
          return null;
        },
        set(key, value, options) {
          if (typeof document === 'undefined') return;
          document.cookie = `${key}=${encodeURIComponent(value)}; path=${options?.path || '/'}; max-age=${options?.maxAge || 60 * 60 * 24 * 7}; ${options?.secure || !isLocalhost ? 'secure; ' : ''}samesite=${options?.sameSite || 'lax'}`;
          console.log(`[Client ${clientId}] Set cookie: ${key}`);
        },
        remove(key, options) {
          if (typeof document === 'undefined') return;
          document.cookie = `${key}=; path=${options?.path || '/'}; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${!isLocalhost ? 'secure; ' : ''}samesite=lax`;
          console.log(`[Client ${clientId}] Removed cookie: ${key}`);
        }
      }
    }
  )
} 
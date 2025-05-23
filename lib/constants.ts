/**
 * Site configuration
 */
export const SITE_NAME = 'Household Finances'
export const SITE_DESCRIPTION = 'Manage your household finances with ease'

// Explicitly define the URLs for each environment
export const PRODUCTION_URL = 'https://household-finances.vercel.app'
export const LOCAL_URL = 'http://localhost:3000'

/**
 * Get current environment base URL
 */
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In browser, always use the current origin
    return window.location.origin
  }
  
  // In server context, determine based on environment
  return process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
    (process.env.NODE_ENV === 'production' ? PRODUCTION_URL : LOCAL_URL))
}

// URL without trailing slash
export const SITE_URL = getBaseUrl()

// Supabase configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Navigation
 */
export const NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Transactions', href: '/transactions' },
  { name: 'Categories', href: '/categories' },
]

// Define explicit callback URLs for each environment
export const PRODUCTION_REDIRECT_URL = `${PRODUCTION_URL}/auth/callback`
export const LOCAL_REDIRECT_URL = `${LOCAL_URL}/auth/callback`

/**
 * Get the appropriate redirect URL based on the current environment
 */
export function getRedirectUrl() {
  if (typeof window !== 'undefined') {
    // In browser, determine based on current host
    const host = window.location.host
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    return isLocalhost ? LOCAL_REDIRECT_URL : PRODUCTION_REDIRECT_URL
  }
  
  // In server context, use environment variables or default to production
  const isLocal = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview'
  return isLocal ? LOCAL_REDIRECT_URL : PRODUCTION_REDIRECT_URL
}

// Convenient export for direct usage
export const REDIRECT_URL = getRedirectUrl()

// Session expiry time (in seconds)
export const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 days 
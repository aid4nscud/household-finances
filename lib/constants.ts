/**
 * Site configuration
 */
export const SITE_NAME = 'Household Finances'
export const SITE_DESCRIPTION = 'Manage your household finances with ease'

// Ensure this matches your deployed site URL without trailing slash
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://household-finances.vercel.app' 
    : 'http://localhost:3000')

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
  { name: 'Reports', href: '/reports' },
]

// Authentication redirect URL - must be an absolute URL to work in production
// The URL Supabase will redirect to after authentication
export const REDIRECT_URL = typeof window !== 'undefined' 
  ? `${window.location.origin}/auth/callback`
  : `${SITE_URL}/auth/callback`;

// Log the redirect URL for debugging
if (typeof window !== 'undefined') {
  console.log('[Constants] Auth callback URL:', REDIRECT_URL);
}

// Session expiry time (in seconds)
export const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 days 
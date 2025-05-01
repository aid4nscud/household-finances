/**
 * Site configuration
 */
export const SITE_NAME = 'Household Finances'
export const SITE_DESCRIPTION = 'Manage your household finances with ease'

// Ensure this matches your deployed site URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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

// Authentication redirect URLs
export const REDIRECT_URL = `${SITE_URL}/auth/callback`;

// Session expiry time (in seconds)
export const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 days 
// Site URL configuration
// In development, we use localhost
// In production, we use the NEXT_PUBLIC_BASE_URL environment variable or default to the deployment URL
export const SITE_URL = 
  process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000');

// Authentication redirect URLs
export const REDIRECT_URL = `${SITE_URL}/auth/callback`;

// Session expiry time (in seconds)
export const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 7 days 
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object that we'll modify and return
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Get the hostname for domain-specific cookie settings
  const hostname = request.headers.get('host') || '';
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Improved cookie options for better persistence
  const cookieOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  };

  // Create a Supabase client using the request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false // This should only be true on the client
      },
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name);
          return cookie?.value;
        },
        set(name, value, options) {
          // Set the cookie in the response with consistent options
          const cookieSettings = {
            name,
            value,
            ...cookieOptions,
            ...options,
            path: '/', // Always use root path
          };
          
          // Set in response
          response.cookies.set(cookieSettings);
          
          // For debugging
          console.log(`[Middleware] Set cookie: ${name}`);
        },
        remove(name, options) {
          // Ensure we're removing the cookie with the exact same path it was set with
          response.cookies.set({
            name,
            value: '',
            maxAge: 0,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
          });
          
          console.log(`[Middleware] Removed cookie: ${name}`);
        },
      },
    }
  )

  // Actually refresh the session
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Middleware] Error refreshing session:', error.message);
    } else if (session) {
      console.log('[Middleware] Session refreshed successfully for user:', session.user.email);
      
      // Refresh the access token if needed
      // This helps ensure the session stays valid longer
      if (session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const hoursBefore = 1; // Refresh 1 hour before expiration
        const refreshTime = new Date(expiresAt.getTime() - (hoursBefore * 60 * 60 * 1000));
        
        if (now >= refreshTime) {
          console.log('[Middleware] Access token needs refreshing');
          await supabase.auth.refreshSession();
        }
      }
    } else {
      console.log('[Middleware] No active session found');
    }
  } catch (e) {
    console.error('[Middleware] Unexpected error in session refresh:', e);
  }

  return response
} 
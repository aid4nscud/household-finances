import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Session } from '@supabase/supabase-js'

// This middleware refreshes the user's session and checks if they're logged in
export async function middleware(request: NextRequest) {
  // Start with logging the request
  console.log(`[Middleware] Request to: ${request.nextUrl.pathname}`)
  
  try {
    // Create a response object that we'll use to handle the response
    let response = NextResponse.next()
    
    // Create a Supabase client specifically for the middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            try {
              // Get all cookies from the request
              const allCookies = request.cookies.getAll();
              
              // Check for problematic auth cookies and exclude them if they seem malformed
              return allCookies.filter(cookie => {
                // If this is an auth cookie, validate it
                if (['sb-access-token', 'sb-refresh-token', 'supabase-auth-token'].includes(cookie.name)) {
                  try {
                    // For JWT tokens, they should start with ey
                    if (cookie.name.startsWith('sb-') && !cookie.value.startsWith('ey')) {
                      console.log(`[Middleware] Filtering out malformed cookie: ${cookie.name}`);
                      return false;
                    }
                    
                    // For JSON objects, try parsing them
                    if (cookie.name === 'supabase-auth-token') {
                      JSON.parse(cookie.value);
                    }
                    
                    return true;
                  } catch (error) {
                    console.error(`[Middleware] Invalid cookie format for ${cookie.name}, removing it`);
                    return false;
                  }
                }
                return true;
              });
            } catch (error) {
              console.error('[Middleware] Error getting cookies:', error);
              return [];
            }
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                // Ensure cookie values are properly stringified if they're objects
                const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
                request.cookies.set(name, cookieValue);
              });
              
              // Create a new response with the updated cookies
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              
              cookiesToSet.forEach(({ name, value, options }) => {
                // Ensure cookie values are properly stringified if they're objects
                const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
                response.cookies.set(name, cookieValue, options);
              });
            } catch (error) {
              console.error('[Middleware] Error setting cookies:', error);
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
            }
          },
        },
      }
    );
    
    // Safely attempt to get the session
    let session: Session | null = null;
    try {
      // Refresh session if expired - required for auth persistence
      const { data } = await supabase.auth.getSession();
      session = data.session;
    } catch (error) {
      console.error('[Middleware] Error refreshing session:', error);
      
      // Clear all authentication cookies to allow a clean sign-in
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      response.cookies.delete('supabase-auth-token');
    }
    
    // URL information for routing decisions
    const url = request.nextUrl.clone();
    const { pathname } = url;
    
    // Check if the request is for a protected route
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/settings');
    
    // Check if the request is for an auth route
    const isAuthRoute = pathname.startsWith('/sign-in') || 
                      pathname.startsWith('/sign-up');
    
    // Auth callback route should be allowed regardless of auth status
    const isAuthCallback = pathname.startsWith('/auth/callback');
    
    if (isAuthCallback) {
      return response;
    }
    
    // Debug page should always be accessible
    if (pathname.startsWith('/auth-debug')) {
      return response;
    }
    
    // If the route is protected and the user is not logged in, redirect to sign-in
    if (isProtectedRoute && !session) {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
    
    // If the user is logged in and trying to access an auth route, redirect to dashboard
    if (isAuthRoute && session) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // For home page, redirect based on auth status
    if (pathname === '/' && session) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Add a specific redirect for the history page
    if (pathname === '/dashboard/history') {
      url.pathname = '/dashboard/create';
      return NextResponse.redirect(url);
    }
    
    return response;
  } catch (error) {
    console.error('[Middleware] Unhandled error in middleware:', error);
    
    // Create a clean response that clears problematic cookies
    const response = NextResponse.next();
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('supabase-auth-token');
    
    return response;
  }
}

// Match all routes that need session handling or auth protection
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*', 
    '/settings/:path*',
    
    // Auth routes that redirect to dashboard if already authenticated
    '/sign-in',
    '/sign-up',
    
    // Home page for redirection
    '/',
    
    // Auth callback route
    '/auth/callback',
    
    // Debug page
    '/auth-debug',
  ],
} 
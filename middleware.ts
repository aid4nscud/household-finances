import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Session } from '@supabase/supabase-js'
import { SITE_URL } from './lib/constants'

// This middleware refreshes the user's session and checks if they're logged in
export async function middleware(request: NextRequest) {
  // Start with logging the request
  console.log(`[Middleware] Request to: ${request.nextUrl.pathname}`)
  
  try {
    // Create a response object to modify later if needed
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    
    // Create a Supabase client for handling auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set(name, value)
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set(name, value, options)
          },
          remove(name, options) {
            request.cookies.delete(name)
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.delete(name)
          },
        },
      }
    )
    
    // Check the auth state
    const { data: { session } } = await supabase.auth.getSession()
    
    // Handle path redirects based on auth state
    const url = request.nextUrl.clone()
    const { pathname } = url
    
    // Check if the request is for a protected route
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/settings');
    
    // Check if the request is for an auth route
    const isAuthRoute = pathname.startsWith('/sign-in') || 
                      pathname.startsWith('/sign-up');
    
    // Auth callback route should be allowed regardless of auth status
    const isAuthCallback = pathname.startsWith('/auth/callback');
    
    if (isAuthCallback) {
      console.log('[Middleware] Allowing auth callback request:', pathname);
      // Important: For auth callback, we must return the original response
      // without any modifications to ensure cookies are properly set
      return response;
    }
    
    // Debug page should always be accessible
    if (pathname.startsWith('/auth-debug')) {
      return response;
    }
    
    // If the route is protected and the user is not logged in, redirect to sign-in
    if (isProtectedRoute && !session) {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }
    
    // If the user is logged in and trying to access an auth route, redirect to dashboard
    if (isAuthRoute && session) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // For home page, redirect based on auth status
    if (pathname === '/') {
      console.log('[Middleware] Handling root path redirect');
      
      url.pathname = session ? '/dashboard' : '/sign-in'
      return NextResponse.redirect(url)
    }
    
    // Special redirect for history page
    if (pathname === '/dashboard/history') {
      url.pathname = '/dashboard/create'
      return NextResponse.redirect(url)
    }
    
    return response;
  } catch (error) {
    console.error('[Middleware] Unhandled error in middleware:', error);
    
    // Create a clean response that clears problematic cookies
    const response = NextResponse.next();
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('sb-auth-token');
    
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
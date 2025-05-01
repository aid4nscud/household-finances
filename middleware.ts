import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Session } from '@supabase/supabase-js'
import { SITE_URL } from './lib/constants'

// This middleware refreshes the user's session and checks if they're logged in
export async function middleware(request: NextRequest) {
  // Start with logging the request
  console.log(`[Middleware] Request to: ${request.nextUrl.pathname}`)
  
  // Check for PKCE-related cookies early
  const cookieHeader = request.headers.get('cookie')
  const hasPKCECookies = cookieHeader?.includes('code-verifier') || cookieHeader?.includes('sb-')
  if (hasPKCECookies) {
    console.log('[Middleware] PKCE cookies detected, preserving for auth flow')
  }
  
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
            const cookie = request.cookies.get(name)
            console.log(`[Middleware] Getting cookie: ${name}, exists: ${!!cookie}`)
            return cookie?.value
          },
          set(name, value, options) {
            console.log(`[Middleware] Setting cookie: ${name}`)
            request.cookies.set(name, value)
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            // Ensure cookies have path='/' and appropriate security settings
            response.cookies.set(name, value, {
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            })
          },
          remove(name, options) {
            console.log(`[Middleware] Removing cookie: ${name}`)
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
      
      // Special handling for auth callback to preserve PKCE cookies
      if (cookieHeader) {
        console.log('[Middleware] Preserving cookies for auth callback');
        // We make sure to preserve cookies in the response to maintain PKCE state
        response.headers.set('cookie', cookieHeader);
      }
      
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
    
    // IMPORTANT: Always preserve cookies in the response to maintain auth state
    if (cookieHeader) {
      console.log('[Middleware] Preserving cookies between requests');
      response.headers.set('cookie', cookieHeader);
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
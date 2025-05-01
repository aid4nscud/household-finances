import { updateSession } from './utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// This middleware refreshes the user's session and checks if they're logged in
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // For auth callback routes, prioritize passing cookies properly
  if (pathname.startsWith('/auth/callback')) {
    console.log('[Middleware] Auth callback detected, preserving cookies');
    const cookieHeader = request.headers.get('cookie');
    
    if (cookieHeader) {
      // Log PKCE-related cookies for debugging
      const cookies = cookieHeader.split(';').map(c => c.trim().split('=')[0]);
      const pkce = cookies.filter(c => 
        c.includes('code-verifier') || 
        c.startsWith('sb-')
      );
      
      if (pkce.length > 0) {
        console.log('[Middleware] PKCE cookies present:', pkce);
      } else {
        console.log('[Middleware] Warning: No PKCE cookies found in auth callback');
      }
    }
    
    // Let the callback route handle everything
    return NextResponse.next();
  }
  
  // Handle root path specially with fast redirect
  if (pathname === '/') {
    try {
      // Fast check for auth cookie before full verification
      const hasAuthCookie = request.cookies.has('sb-access-token') || 
                           request.cookies.has('sb-refresh-token');
      
      if (!hasAuthCookie) {
        // No auth cookies found, redirect to sign-in
        console.log('[Middleware] No auth cookies found, redirecting to sign-in');
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      
      // Verify the session with Supabase
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name) {
              return request.cookies.get(name)?.value
            },
          }
        }
      )
      
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        // User is logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        // Auth cookies exist but they're invalid
        console.log('[Middleware] Invalid auth cookies, redirecting to sign-in');
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    } catch (error) {
      console.error('[Middleware] Error in root redirect:', error)
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
  
  // For all other routes, use the regular auth session handling
  return await updateSession(request)
}

// Match all routes that need session handling or auth protection
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
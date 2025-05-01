import { updateSession } from './utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// This middleware refreshes the user's session and checks if they're logged in
export async function middleware(request: NextRequest) {
  // Handle root path specially to make sure it always works
  const { pathname } = request.nextUrl
  
  if (pathname === '/') {
    try {
      // Create supabase client to check auth status
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
      
      // Check if user is logged in
      const { data } = await supabase.auth.getUser()
      
      // Redirect based on auth status
      if (data.user) {
        // User is logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        // User is not logged in, redirect to sign-in
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    } catch (error) {
      console.error('Error in root redirect middleware:', error)
      // If anything fails, redirect to sign-in as a fallback
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
  
  // For all other routes, update the auth session
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
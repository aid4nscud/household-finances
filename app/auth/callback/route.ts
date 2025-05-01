import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle error from Supabase auth redirect
  if (error) {
    console.error(`[Auth Callback] Error in redirect from Supabase: ${error}`)
    console.error(`[Auth Callback] Error description: ${errorDescription}`)
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    )
  }

  // Check if code exists
  if (!code) {
    console.error(`[Auth Callback] No code parameter found in callback URL`)
    return NextResponse.redirect(new URL('/sign-in?error=No+authentication+code+provided', requestUrl.origin))
  }

  try {
    // Create a Supabase client for the route handler
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      throw error
    }
    
    // Redirect to dashboard on successful authentication
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  } catch (error) {
    // Log detailed error for debugging
    console.error('[Auth Callback] Error exchanging code for session:', error)
    
    // Redirect to sign-in with error message
    const errorMessage = error instanceof Error ? 
      error.message : 
      'Authentication failed'
    
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    )
  }
} 
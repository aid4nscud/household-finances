import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This route handles the callback from Supabase Auth
// after a user signs in with a magic link
export async function GET(request: NextRequest) {
  console.log('[Auth Callback] Auth callback triggered');

  // Detect the URL parameters from the callback
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('[Auth Callback] Code present:', !!code);
  console.log('[Auth Callback] Error present:', !!errorDescription);

  if (errorDescription) {
    console.error('[Auth Callback] Error from auth provider:', errorDescription);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(errorDescription)}`, request.url)
    )
  }

  if (!code) {
    console.error('[Auth Callback] No code provided in callback');
    return NextResponse.redirect(
      new URL('/sign-in?error=Missing+authorization+code', request.url)
    )
  }

  try {
    // Create a server-side Supabase client
    const supabase = createClient()
    
    // Exchange the code for a session
    console.log('[Auth Callback] Exchanging code for session...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth Callback] Error exchanging code:', error.message);
      console.error('[Auth Callback] Error details:', error);
      
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }
    
    // Log success
    console.log('[Auth Callback] Successfully exchanged code for session');
    console.log('[Auth Callback] User email:', data.user?.email);
    console.log('[Auth Callback] Session expires at:', data.session?.expires_at);
    
    // Important: Get all cookies from Supabase's response to ensure they're properly set
    const requestHeaders = new Headers(request.headers)
    const responseCookies = requestHeaders.getSetCookie();
    
    console.log('[Auth Callback] Cookies to set:', responseCookies.length);
    
    // Create a response that redirects to the dashboard
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // Copy all cookies from Supabase response to our response
    if (responseCookies.length > 0) {
      console.log('[Auth Callback] Adding cookies to response');
      responseCookies.forEach(cookie => {
        console.log('[Auth Callback] Setting cookie:', cookie.split(';')[0]); // Log just the cookie name part
        response.headers.append('Set-Cookie', cookie)
      })
    } else {
      console.warn('[Auth Callback] No cookies received from Supabase');
    }

    return response
  } catch (error: any) {
    console.error('[Auth Callback] Unexpected error:', error);
    console.error('[Auth Callback] Error message:', error.message);
    console.error('[Auth Callback] Stack trace:', error.stack);
    
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent('An unexpected error occurred')}`, request.url)
    )
  }
} 
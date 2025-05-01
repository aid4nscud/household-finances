import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This route handles the callback from Supabase Auth
// after a user signs in with a magic link
export async function GET(request: NextRequest) {
  console.log('[Auth Callback] Auth callback triggered');
  console.log('[Auth Callback] Full request URL:', request.url);

  // Detect the URL parameters from the callback
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('[Auth Callback] Code present:', !!code);
  console.log('[Auth Callback] Error present:', !!errorDescription);

  // Debug cookies
  console.log('[Auth Callback] Request cookies:');
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      console.log('  - ' + cookie.split('=')[0]);
    });
    
    // Check specifically for code verifier
    const hasCodeVerifier = cookies.some(cookie => 
      cookie.startsWith('supabase-auth-token-code-verifier=') || 
      cookie.startsWith('sb-') || 
      cookie.includes('code-verifier')
    );
    console.log('[Auth Callback] Has code verifier cookie:', hasCodeVerifier);
  } else {
    console.log('[Auth Callback] No cookies in request');
  }

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
    console.log('[Auth Callback] Code value (first 10 chars):', code.substring(0, 10) + '...');
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth Callback] Error exchanging code:', error.message);
      console.error('[Auth Callback] Error details:', error);
      
      // Check for specific PKCE error
      if (error.message.includes('code verifier')) {
        console.error('[Auth Callback] This appears to be a PKCE code verifier issue');
        console.error('[Auth Callback] Make sure the code verifier cookie is being correctly set and passed');
      }
      
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }
    
    // Log success
    console.log('[Auth Callback] Successfully exchanged code for session');
    console.log('[Auth Callback] User email:', data.user?.email);
    console.log('[Auth Callback] Session expires at:', data.session?.expires_at);
    
    // Create a response that redirects to the dashboard
    const response = NextResponse.redirect(new URL('/', request.url))
    
    // Get all cookies from Supabase's response to ensure they're properly set
    try {
      const requestHeaders = new Headers(request.headers)
      
      // Try to use getSetCookie method which might not be available in all environments
      if (typeof requestHeaders.getSetCookie === 'function') {
        const responseCookies = requestHeaders.getSetCookie();
        console.log('[Auth Callback] Cookies to set:', responseCookies.length);
        
        // Copy all cookies from Supabase response to our response
        if (responseCookies.length > 0) {
          console.log('[Auth Callback] Adding cookies to response');
          responseCookies.forEach(cookie => {
            console.log('[Auth Callback] Setting cookie:', cookie.split(';')[0]); // Log just the cookie name part
            response.headers.append('Set-Cookie', cookie)
          })
        } else {
          console.warn('[Auth Callback] No cookies received from Supabase via getSetCookie method');
        }
      } else {
        // Fallback for environments where getSetCookie is not available
        console.log('[Auth Callback] getSetCookie method not available, relying on server-side cookie handling');
        
        // The server-side Supabase client should have already set the cookies
        // in the cookies store, which should be automatically included in the response
        console.log('[Auth Callback] Using server-side cookie store instead');
      }
    } catch (cookieError) {
      console.error('[Auth Callback] Error handling cookies:', cookieError);
      // Continue with the response even if cookie handling fails
      // The cookies might still be set by the Supabase client
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
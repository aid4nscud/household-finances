import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This route handles the callback from Supabase Auth
// after a user signs in with a magic link
export async function GET(request: NextRequest) {
  console.log('[Auth Callback] Auth callback triggered');
  
  // Get the full URL for debugging
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log('[Auth Callback] Code present:', !!code);
  console.log('[Auth Callback] Error present:', !!errorDescription);

  // Handle error from auth provider
  if (errorDescription) {
    console.error('[Auth Callback] Error from auth provider:', errorDescription);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(errorDescription)}`, requestUrl.origin)
    )
  }

  // Handle missing code
  if (!code) {
    console.error('[Auth Callback] No code provided in callback');
    return NextResponse.redirect(
      new URL('/sign-in?error=Missing+authorization+code', requestUrl.origin)
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
      
      // Check for PKCE errors and provide more helpful error messages
      if (error.message.includes('code verifier')) {
        console.error('[Auth Callback] PKCE code verifier issue detected');
        
        // Specific error for PKCE issues
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent('Authentication error: Code verifier missing. This might be due to cookies being blocked or not persisted properly.')}`, requestUrl.origin)
        )
      }
      
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }
    
    // Log successful authentication
    console.log('[Auth Callback] Successfully exchanged code for session');
    console.log('[Auth Callback] User email:', data.user?.email);
    
    // Create a response that redirects to the dashboard or home page
    // Use origin to ensure we're using the correct base URL
    const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    
    return response
  } catch (error: any) {
    console.error('[Auth Callback] Unexpected error:', error.message);
    
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent('An unexpected error occurred during authentication')}`, requestUrl.origin)
    )
  }
} 
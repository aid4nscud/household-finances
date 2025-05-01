import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This route handles the callback from Supabase Auth
// after a user signs in with a magic link
export async function GET(request: NextRequest) {
  // Add a unique ID to this request for tracking in logs
  const requestId = Math.random().toString(36).substring(2, 10)
  console.log(`[Auth Callback ${requestId}] Auth callback triggered at ${new Date().toISOString()}`);
  
  // Get the full URL for debugging
  const requestUrl = new URL(request.url)
  console.log(`[Auth Callback ${requestId}] Full URL: ${request.url}`);
  
  const code = requestUrl.searchParams.get('code')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  console.log(`[Auth Callback ${requestId}] Code present: ${!!code}`);
  
  // Log all cookies for debugging
  const cookieHeader = request.headers.get('cookie')
  console.log(`[Auth Callback ${requestId}] Cookie header exists: ${!!cookieHeader}`)
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim().split('=')[0])
    console.log(`[Auth Callback ${requestId}] Cookies in request:`, cookies)
    
    // Check for PKCE-related cookies specifically
    const hasPKCECookie = cookies.some(c => 
      c.includes('code-verifier') || 
      c.startsWith('sb-') || 
      c.includes('supabase'))
    console.log(`[Auth Callback ${requestId}] Has PKCE cookies: ${hasPKCECookie}`)
  } else {
    console.log(`[Auth Callback ${requestId}] WARNING: No cookies found in request!`)
  }

  // Handle error from auth provider
  if (errorDescription) {
    console.error(`[Auth Callback ${requestId}] Error from auth provider:`, errorDescription);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(errorDescription)}`, requestUrl.origin)
    )
  }

  // Handle missing code
  if (!code) {
    console.error(`[Auth Callback ${requestId}] No code provided in callback`);
    return NextResponse.redirect(
      new URL('/sign-in?error=Missing+authorization+code', requestUrl.origin)
    )
  }

  try {
    // Create a server-side Supabase client
    const supabase = createClient()
    
    // Exchange the code for a session
    console.log(`[Auth Callback ${requestId}] Exchanging code for session...`);
    console.log(`[Auth Callback ${requestId}] Code value (first 10 chars): ${code.substring(0, 10)}...`);
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error(`[Auth Callback ${requestId}] Error exchanging code:`, error.message);
      console.error(`[Auth Callback ${requestId}] Error details:`, JSON.stringify(error));
      
      // Check for PKCE errors and provide more helpful error messages
      if (error.message.includes('code verifier')) {
        console.error(`[Auth Callback ${requestId}] PKCE code verifier issue detected`);
        
        // Create a more informative error message
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent('Authentication error: Code verifier missing. This might be due to cookies being blocked or not persisted properly.')}`, requestUrl.origin)
        )
      }
      
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }
    
    // Log successful authentication
    console.log(`[Auth Callback ${requestId}] Successfully exchanged code for session`);
    console.log(`[Auth Callback ${requestId}] User email: ${data.user?.email}`);
    
    // Create a response that redirects to the dashboard
    const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    
    // Preserve cookies by copying them from the request
    if (cookieHeader) {
      console.log(`[Auth Callback ${requestId}] Preserving cookies in response`);
      response.headers.set('cookie', cookieHeader)
      
      // Log response headers for debugging
      const responseHeadersLog = Array.from(response.headers.entries()).map(([key, value]) => 
        `${key}: ${key === 'set-cookie' ? '(cookie data hidden)' : value}`
      )
      console.log(`[Auth Callback ${requestId}] Response headers:`, responseHeadersLog)
    }
    
    console.log(`[Auth Callback ${requestId}] Completed successfully, redirecting to dashboard`);
    return response
  } catch (error: any) {
    console.error(`[Auth Callback ${requestId}] Unexpected error:`, error.message);
    console.error(`[Auth Callback ${requestId}] Stack trace:`, error.stack);
    
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent('An unexpected error occurred during authentication')}`, requestUrl.origin)
    )
  }
} 
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
        
        // Create a more informative error message with instructions to use localStorage
        return NextResponse.redirect(
          new URL(`/sign-in?error=${encodeURIComponent('Authentication error: Session storage issue. We have updated our session handling - please try again.')}`, requestUrl.origin)
        )
      }
      
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }
    
    // Log successful authentication
    console.log(`[Auth Callback ${requestId}] Successfully exchanged code for session`);
    console.log(`[Auth Callback ${requestId}] User email: ${data.user?.email}`);
    
    // Create HTML page that will handle both cookies and localStorage
    const htmlWithJavaScript = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Successful</title>
        <style>
          body { font-family: system-ui, sans-serif; background-color: #f4f4f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .container { background-color: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 24rem; text-align: center; }
          h1 { color: #18181b; font-size: 1.5rem; margin-bottom: 1rem; }
          p { color: #52525b; margin-bottom: 1.5rem; }
          .spinner { border: 3px solid #e4e4e7; border-radius: 50%; border-top: 3px solid #3b82f6; width: 1.5rem; height: 1.5rem; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>Authentication Successful</h1>
          <p>Redirecting you to dashboard...</p>
        </div>
        <script>
          // Store session in localStorage
          try {
            // Get URL hash fragment for any parameters
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
              localStorage.setItem('supabase.auth.token', hash.substring(1));
            }
            
            // Redirect to dashboard after ensuring localStorage is updated
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          } catch (e) {
            console.error('Error storing session:', e);
            window.location.href = '/dashboard';
          }
        </script>
      </body>
    </html>
    `;
    
    // Return HTML response instead of redirect to handle both cookies and localStorage
    return new NextResponse(htmlWithJavaScript, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error: any) {
    console.error(`[Auth Callback ${requestId}] Unexpected error:`, error.message);
    console.error(`[Auth Callback ${requestId}] Stack trace:`, error.stack);
    
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent('An unexpected error occurred during authentication')}`, requestUrl.origin)
    )
  }
} 
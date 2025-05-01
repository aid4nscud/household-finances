import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // For debugging, log PKCE cookies
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const hasPKCECookie = cookieHeader.includes('code-verifier') || 
                         cookieHeader.includes('sb-');
    
    // Only log in non-production environments
    if (process.env.NODE_ENV !== 'production' && hasPKCECookie) {
      const cookies = cookieHeader.split(';')
        .map(c => c.trim().split('=')[0])
        .filter(c => c.includes('code-verifier') || c.startsWith('sb-'));
      
      console.log('[Middleware Helper] PKCE cookies present:', cookies);
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name)
          // Log PKCE cookies for debugging in non-production
          if (process.env.NODE_ENV !== 'production' && 
             (name.includes('code-verifier') || name.startsWith('sb-'))) {
            console.log(`[Middleware Helper] Getting cookie: ${name}, exists: ${!!cookie}`);
          }
          return cookie?.value
        },
        set(name, value, options) {
          // Log PKCE cookies for debugging in non-production
          if (process.env.NODE_ENV !== 'production' && 
             (name.includes('code-verifier') || name.startsWith('sb-'))) {
            console.log(`[Middleware Helper] Setting cookie: ${name}`);
          }
          
          // This is a safe way to set request cookies by getting all current cookies
          // and then setting the cookie values including the new one
          const requestHeaders = new Headers(request.headers)
          if (request.cookies.get(name)?.value !== value) {
            requestHeaders.set('cookie', 
              request.cookies.getAll()
                .map(cookie => `${cookie.name}=${cookie.value}`)
                .join('; ') + `; ${name}=${value}`
            )
          }
          
          // Set cookie in the response
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          
          // We can use the response.cookies.set directly
          response.cookies.set({
            name,
            value,
            ...options,
            path: options?.path ?? '/',
            // Make sure SameSite is appropriate
            sameSite: options?.sameSite ?? 'lax',
            // Make sure secure is set for production
            secure: process.env.NODE_ENV === 'production'
          })
        },
        remove(name, options) {
          // Log PKCE cookies for debugging in non-production
          if (process.env.NODE_ENV !== 'production' && 
             (name.includes('code-verifier') || name.startsWith('sb-'))) {
            console.log(`[Middleware Helper] Removing cookie: ${name}`);
          }
          
          // Only modify response cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          // For removal, we set an expired cookie
          response.cookies.set({
            name,
            value: '',
            maxAge: 0,
            path: options?.path ?? '/',
          })
        },
      },
    }
  )

  // Refresh the session - this will set/refresh cookies if a session exists
  await supabase.auth.getUser()

  return response
} 
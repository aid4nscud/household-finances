import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
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
          })
        },
        remove(name, options) {
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

  // Refresh the session
  await supabase.auth.getUser()

  return response
} 
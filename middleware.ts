import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

// This middleware refreshes the user's session and checks if they're logged in
export async function middleware(request: NextRequest) {
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
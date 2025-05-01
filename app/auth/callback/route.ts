import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This route handles the callback from Supabase Auth
// after a user signs in with a magic link
export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // Create a Supabase client for the route handler
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the dashboard page after successful authentication
  // or to the sign-in page if authentication failed
  return NextResponse.redirect(new URL('/dashboard', req.url));
} 
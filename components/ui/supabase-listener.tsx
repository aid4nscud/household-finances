'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SupabaseListener({
  serverAccessToken,
}: {
  serverAccessToken?: string
}) {
  const router = useRouter()
  const supabase = createClient()
  
  // Function to check session and refresh if needed
  const checkAndRefreshSession = useCallback(async () => {
    try {
      // Get current client-side session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[SupabaseListener] Client session check:', !!session);
      
      if (!session && serverAccessToken) {
        console.log('[SupabaseListener] Missing client session with server token, forcing refresh');
        router.refresh();
        return;
      }
      
      // Even if we have a session, check if it's valid by making a test query
      if (session) {
        try {
          // Simple RLS-protected query to confirm session validity
          const { error: testError } = await supabase
            .from('income_statements')
            .select('id')
            .limit(1);
            
          if (testError && testError.code === 'PGRST301') {
            // Auth error indicates invalid session
            console.log('[SupabaseListener] Session check failed, invalid auth:', testError.message);
            router.refresh();
          } else {
            console.log('[SupabaseListener] Session validated successfully');
          }
        } catch (err) {
          console.error('[SupabaseListener] Error during session test:', err);
        }
      }
    } catch (err) {
      console.error('[SupabaseListener] Session check error:', err);
    }
  }, [router, serverAccessToken, supabase]);

  useEffect(() => {
    // Log the server token availability
    console.log('[SupabaseListener] Server access token exists:', !!serverAccessToken);
    
    // Run the session check immediately
    checkAndRefreshSession();
    
    // Schedule periodic checks (every 60 seconds)
    const intervalId = setInterval(checkAndRefreshSession, 60000);
    
    // Set up a listener to sync route changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[SupabaseListener] Auth state change event:', event);
      
      if (session?.access_token !== serverAccessToken) {
        // Server and client are out of sync, refresh the page
        console.log('[SupabaseListener] Token mismatch, refreshing page');
        router.refresh();
      }
      
      // Additional handling for specific auth events
      if (event === 'SIGNED_OUT') {
        console.log('[SupabaseListener] User signed out, redirecting to sign-in');
        router.push('/sign-in');
      } else if (event === 'SIGNED_IN') {
        console.log('[SupabaseListener] User signed in, refreshing');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    }
  }, [serverAccessToken, router, supabase, checkAndRefreshSession]);

  return null
} 
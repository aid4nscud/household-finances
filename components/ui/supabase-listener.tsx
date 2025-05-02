'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SupabaseListener({
  serverAccessToken,
}: {
  serverAccessToken?: string
}) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Log the server token availability
    console.log('[SupabaseListener] Server access token exists:', !!serverAccessToken);
    
    // Check the current session on mount to ensure client is in sync
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[SupabaseListener] Current client session exists:', !!session);
      
      // If client has no session but server claims there should be one, refresh
      if (!session && serverAccessToken) {
        console.log('[SupabaseListener] Client session missing but server has token, refreshing');
        router.refresh();
      }
    };
    
    checkSession();
    
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
    });

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, router, supabase])

  return null
} 
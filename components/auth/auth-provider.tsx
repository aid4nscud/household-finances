'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient, User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type SupabaseContext = {
  supabase: SupabaseClient
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshSession: () => Promise<Session | null>
  signOut: () => Promise<void>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function useAuth() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({
  children,
  initialSession = null,
}: {
  children: React.ReactNode
  initialSession?: Session | null
}) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [isLoading, setIsLoading] = useState(!initialSession)
  const [authStatus, setAuthStatus] = useState<'authenticated' | 'unauthenticated'>(
    initialSession?.user ? 'authenticated' : 'unauthenticated'
  )

  // Track current session for getSession calls
  const [currentSession, setCurrentSession] = useState<Session | null>(initialSession);

  // Log initial auth state
  useEffect(() => {
    console.log('[AuthProvider] Initial auth state:', { 
     user: user?.email, 
      isAuthenticated: !!user,
      initialSession: !!initialSession
    });
  }, []);

  // Function to refresh the session - can be called from components
  const refreshSession = async () => {
    console.log('AuthProvider: Refreshing session...');
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('AuthProvider: Session refresh error:', error);
        throw error;
      }
      
      if (data.session) {
        console.log('AuthProvider: Session refreshed successfully, setting state...');
        // Update the auth state
        setUser(data.session.user);
        setCurrentSession(data.session);
        setAuthStatus('authenticated');
        return data.session; // Return the session object
      } else {
        console.log('AuthProvider: No session after refresh, signing out...');
        setUser(null);
        setCurrentSession(null);
        setAuthStatus('unauthenticated');
        return null;
      }
    } catch (err) {
      console.error('AuthProvider: Error refreshing session:', err);
      setUser(null);
      setCurrentSession(null);
      setAuthStatus('unauthenticated');
      return null;
    }
  };

  // Simplified function to sign out the user per Supabase recommendations
  const signOut = async () => {
    console.log('AuthProvider: Starting sign out process...');
    
    try {
      // First, call the API to sign out server-side
      console.log('AuthProvider: Making server-side sign-out call');
      
      // Use the fetch API to call the server action
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });
      
      // Log the response for debugging
      console.log('AuthProvider: Server sign-out response status:', response.status);
      
      // Now sign out via Supabase Auth API client-side
      console.log('AuthProvider: Calling client-side signOut');
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/devices
      });
      
      if (error) {
        console.error('AuthProvider: Client-side sign out error:', error);
      } else {
        console.log('AuthProvider: Client-side sign out successful');
      }
      
      // Clear browser storage
      if (typeof window !== 'undefined') {
        // Clear any items that might contain auth data
        const authItemKeys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-'))) {
            authItemKeys.push(key);
          }
        }
        
        // Remove them
        authItemKeys.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        console.log('AuthProvider: Cleared local storage items');
      }
      
      // Update local state
      setUser(null);
      setCurrentSession(null);
      setAuthStatus('unauthenticated');
      
      console.log('AuthProvider: Local state updated, redirecting to sign-in page');
      
      // Force navigation to sign-in page
      window.location.href = '/sign-in';
    } catch (err) {
      console.error('AuthProvider: Error during sign out:', err);
      
      // Even if there's an error, update local state and redirect
      setUser(null);
      setCurrentSession(null); 
      setAuthStatus('unauthenticated');
      
      // Force navigation to sign-in page
      window.location.href = '/sign-in';
    }
  };

  useEffect(() => {
    // Get the initial session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthProvider] Error getting session:', error.message);
          setUser(null);
          setCurrentSession(null);
          setAuthStatus('unauthenticated');
        } else if (data.session) {
          console.log('[AuthProvider] Session found for user:', data.session.user.email);
          setUser(data.session.user);
          setCurrentSession(data.session);
          setAuthStatus('authenticated');
        } else {
          console.log('[AuthProvider] No session found');
          setUser(null);
          setCurrentSession(null);
          setAuthStatus('unauthenticated');
        }
      } catch (err) {
        console.error('[AuthProvider] Unexpected error checking session:', err);
        setUser(null);
        setCurrentSession(null);
        setAuthStatus('unauthenticated');
      } finally{
        setIsLoading(false);
      }
    };
    
    // Check session on mount
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthProvider] Auth state changed:', event);
      
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        console.log('[AuthProvider] User authenticated:', session.user.email);
        setUser(session.user);
        setCurrentSession(session);
        setAuthStatus('authenticated');
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthProvider] SIGNED_OUT event received');
        setUser(null);
        setCurrentSession(null);
        setAuthStatus('unauthenticated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    router
  ]);

  const value = {
    supabase,
    user,
    session: currentSession,
    isLoading,
    isAuthenticated: authStatus === 'authenticated',
    refreshSession,
    signOut
  };

  return (
    <Context.Provider
      value={value}
    >
      {children}
    </Context.Provider>
  )
} 
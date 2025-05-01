'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient, User, Session } from '@supabase/supabase-js'

type SupabaseContext = {
  supabase: SupabaseClient
  user: User | null
  session: Session | null
  isLoading: boolean
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
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [supabase] = useState(() => createClient())
  const [session, setSession] = useState<Session | null>(initialSession)
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [isLoading, setIsLoading] = useState(!initialSession)

  // Log initial auth state
  useEffect(() => {
    console.log('[AuthProvider] Initialized with session:', !!initialSession);
    console.log('[AuthProvider] Initial user:', initialSession?.user?.email || 'none');
  }, [initialSession]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('[AuthProvider] Auth state change event:', event);
        console.log('[AuthProvider] New session exists:', !!newSession);
        
        if (newSession?.user) {
          console.log('[AuthProvider] Setting authenticated user:', newSession.user.email);
          setSession(newSession)
          setUser(newSession.user)
        } else {
          console.log('[AuthProvider] Clearing user and session');
          setSession(null)
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )

    // Check session immediately on mount to handle any auth state changes that occurred
    // before the component was mounted (e.g., during page refresh)
    const checkSession = async () => {
      try {
        console.log('[AuthProvider] Checking current session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthProvider] Error getting session:', error.message);
          return;
        }
        
        if (data.session) {
          console.log('[AuthProvider] Retrieved session for user:', data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
        } else {
          console.log('[AuthProvider] No active session found');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('[AuthProvider] Unexpected error checking session:', err);
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log('[AuthProvider] Unsubscribing from auth state changes');
      subscription.unsubscribe()
    }
  }, [supabase.auth]);

  return (
    <Context.Provider
      value={{
        supabase,
        session,
        user,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  )
} 
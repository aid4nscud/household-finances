'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Session } from '@supabase/supabase-js'

type AuthState = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

type AuthContextType = AuthState & {
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  })
  
  // Initialize Supabase client on the client side only
  const [supabase] = useState(() => createClient())
  
  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === 'undefined') return
    
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
        })
      } catch (error) {
        console.error('Error getting session:', error)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }
    
    // Get initial session
    getSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          isLoading: false,
        })
      }
    )
    
    // Cleanup on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  return (
    <AuthContext.Provider value={{ ...authState, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
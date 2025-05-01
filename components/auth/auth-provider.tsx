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

  useEffect(() => {
    // Only set up the listener if there's a user or we're still loading
    if (user || isLoading) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          if (newSession?.user) {
            setSession(newSession)
            setUser(newSession.user)
          } else {
            setSession(null)
            setUser(null)
          }
          setIsLoading(false)
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [supabase.auth, user, isLoading])

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

export function useAuth() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
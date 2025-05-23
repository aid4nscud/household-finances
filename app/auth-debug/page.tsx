'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import type { AuthError } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export default function AuthDebugPage() {
  const { session, user, isLoading } = useAuth()
  const [error, setError] = useState<AuthError | Error | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [cookies, setCookies] = useState<{name: string, value: string}[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClient()
  
  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`])
  }

  // Parse and display cookies
  const inspectCookies = () => {
    const cookieList: {name: string, value: string}[] = []
    const allCookies = document.cookie.split('; ')
    
    allCookies.forEach(cookie => {
      const [name, value] = cookie.split('=')
      cookieList.push({ name, value: name.startsWith('sb-') ? `${value.substring(0, 15)}...` : value })
    })
    
    setCookies(cookieList)
    addLog(`Found ${cookieList.length} cookies, ${cookieList.filter(c => c.name.startsWith('sb-')).length} Supabase-related`)
  }

  // Test the authentication state
  useEffect(() => {
    setIsMounted(true)
    
    if (isLoading) {
      addLog('Loading authentication state...')
    } else if (session) {
      addLog(`Session retrieved: Active, expires at ${new Date(session.expires_at! * 1000).toLocaleString()}`)
      addLog(`User retrieved: Logged in as ${user?.email}`)
    } else {
      addLog('No active session')
      addLog('Not logged in')
    }

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth state changed: ${event}`)
      // Refresh cookies when auth state changes
      inspectCookies()
    })

    // Initial cookie inspection
    inspectCookies()

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [isLoading, session, user])

  // If not mounted yet, return a simple loading state that matches server-side render
  if (!isMounted) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
      </div>
    )
  }

  // Force re-check of session
  const recheckSession = async () => {
    try {
      addLog('Manually checking session...')
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        addLog(`Session check error: ${error.message}`)
        setError(error)
      } else if (data.session) {
        addLog(`Session check successful! User: ${data.session.user.email}`)
      } else {
        addLog('Session check: No active session found')
      }
    } catch (err) {
      const error = err as Error
      addLog(`Error checking session: ${error.message}`)
      setError(error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <div className="bg-gray-100 rounded p-4">
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {user ? 'Yes' : 'No'}</p>
          <p>Session active: {session ? 'Yes' : 'No'}</p>
          <div className="mt-4 space-x-2">
            <Button onClick={recheckSession}>Re-check Session</Button>
            <Button onClick={inspectCookies} variant="outline">Refresh Cookies</Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <div className="bg-red-100 text-red-800 rounded p-4">
            <p>Message: {error.message}</p>
            <p>Name: {error.name}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cookies</h2>
        <div className="bg-gray-100 rounded p-4 max-h-60 overflow-y-auto">
          {cookies.map((cookie, i) => (
            <div key={i} className="py-1 border-b border-gray-200 last:border-0">
              <span className="font-mono text-sm">{cookie.name}</span>: {cookie.value}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <div className="bg-gray-100 rounded p-4 max-h-80 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="py-1 border-b border-gray-200 last:border-0">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
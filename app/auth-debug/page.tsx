'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import type { AuthError } from '@supabase/supabase-js'

export default function AuthDebugPage() {
  const { supabase, session, user, isLoading } = useAuth()
  const [error, setError] = useState<AuthError | Error | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  
  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`])
  }

  // Test the authentication state
  useEffect(() => {
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
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [isLoading, session, supabase.auth, user])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <div className="bg-gray-100 rounded p-4">
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {user ? 'Yes' : 'No'}</p>
          <p>Session active: {session ? 'Yes' : 'No'}</p>
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

      {user && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <div className="bg-gray-100 rounded p-4">
            <pre className="whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      )}

      {session && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Session Information</h2>
          <div className="bg-gray-100 rounded p-4">
            <p>Expires at: {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}</p>
            <p>Access token: {session.access_token ? `${session.access_token.substring(0, 20)}...` : 'None'}</p>
            <p>Refresh token: {session.refresh_token ? `${session.refresh_token.substring(0, 10)}...` : 'None'}</p>
          </div>
        </div>
      )}

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
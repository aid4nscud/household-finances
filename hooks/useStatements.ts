'use client'

import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { useToast } from '@/components/ui/use-toast'

// Create a singleton Supabase client instance
const supabase = createClient()

// Function to get an authenticated session with error handling
async function getAuthenticatedSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) return { session: null, error }
    return { session: data.session, error: null }
  } catch (error) {
    console.error('Error getting session:', error)
    return { 
      session: null, 
      error: new Error(error instanceof Error ? error.message : 'Unknown authentication error') 
    }
  }
}

export function useStatements() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { session } = useAuth()

  // Create a new income statement
  const createStatement = async (statementData: any) => {
    try {
      // Check if we have a valid session
      if (!session) {
        // Try to refresh the session
        const { data: { session: newSession } } = await supabase.auth.getSession()
        if (!newSession) {
          throw new Error('No valid session')
        }
      }

      // Get the current session to get user_id
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession?.user) {
        throw new Error('No authenticated user found')
      }

      // Structure the data correctly for the database schema
      const dbRecord = {
        user_id: currentSession.user.id,
        statement_data: statementData
      }

      const { data, error } = await supabase
        .from('income_statements')
        .insert([dbRecord])
        .select()
        .single()
      
      if (error) throw error
      
      toast({
        title: 'Success',
        description: 'Statement created successfully',
      })
      
      return data
    } catch (error) {
      console.error('Error creating statement:', error)
        toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create statement',
        variant: 'destructive',
        })
      throw error
    }
  }

  // Update an existing income statement
  const updateStatement = async (id: string, statementData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check authentication before proceeding
      const { session, error: authError } = await getAuthenticatedSession()
      
      if (authError) {
        console.error('Authentication error details:', authError)
        
        // Redirect to sign-in if authentication fails
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
          duration: 5000,
        })
        
        throw new Error('Authentication error: ' + authError.message)
      }
      
      if (!session || !session.user) {
        console.error('No valid session found')
        throw new Error('You must be logged in to update a statement.')
      }
      
      const userId = session.user.id
      console.log('Updating statement for user ID:', userId)
      
      // Update the data
      const { data, error } = await supabase
        .from('income_statements')
        .update({
          statement_data: statementData,
          updated_at: new Date().toISOString() // Explicitly update the timestamp
        })
        .eq('id', id)
        .eq('user_id', userId) // Ensure user owns this statement
        .select('id')
        .single()
      
      if (error) {
        console.error('Supabase error details:', error)
        throw new Error(`Database error: ${error.message || 'Unknown database error. Please try again later.'}`)
      }
      
      if (!data || !data.id) {
        console.error('No data returned from update')
        throw new Error('Failed to update statement: No ID returned from database')
      }
      
      toast({
        title: "Success!",
        description: "Your income statement has been updated successfully.",
        variant: "default",
        duration: 5000,
      })
      
      return data.id
    } catch (err) {
      console.error('Statement update error:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unknown error occurred while updating your statement'
      setError(new Error(errorMessage))
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Get the most recent income statement
  const getLatestStatement = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check authentication before proceeding
      const { session, error: authError } = await getAuthenticatedSession()
      
      if (authError) {
        console.error('Authentication error details in getLatestStatement:', authError)
        
        // Silent error for retrieving statements - component will handle redirect
        console.log('Auth error when retrieving statement, component will handle redirect')
        return null
      }
      
      if (!session || !session.user) {
        console.error('No valid session found in getLatestStatement')
        return null
      }
      
      const userId = session.user.id
      console.log('Getting latest statement for user ID:', userId)
      
      // Get the most recent statement
      const { data, error } = await supabase
        .from('income_statements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) {
        // If no statement found, this is not an error for our purposes
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Supabase error details:', error)
        throw new Error(`Database error: ${error.message || 'Unknown database error. Please try again later.'}`)
      }
      
      return data
    } catch (err) {
      console.error('Statement retrieval error:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unknown error occurred while retrieving your statement'
      setError(new Error(errorMessage))
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Delete an income statement
  const deleteStatement = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/statements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete statement')
      }

      toast({
        title: "Success!",
        description: "Statement deleted successfully.",
        variant: "default",
        duration: 3000,
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(new Error(errorMessage))
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createStatement,
    updateStatement,
    getLatestStatement,
    deleteStatement
  }
} 
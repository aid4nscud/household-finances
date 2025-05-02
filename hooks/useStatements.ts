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
  const { refreshSession } = useAuth()

  // Create a new income statement
  const createStatement = async (statementData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check authentication before proceeding
      const { session, error: authError } = await getAuthenticatedSession()
      
      if (authError) {
        console.error('Authentication error details:', authError)
        
        // Try to refresh the session using auth context
        try {
          console.log('Attempting to refresh session via AuthProvider...')
          const refreshedSession = await refreshSession()
          
          if (refreshedSession) {
            console.log('Successfully refreshed session via AuthProvider')
            // Continue with the refreshed session
            const userId = refreshedSession.user.id
            
            // Insert the data
            const { data: insertData, error: insertError } = await supabase
              .from('income_statements')
              .insert({
                user_id: userId,
                statement_data: statementData
              })
              .select('id')
              .single()
            
            if (insertError) {
              throw new Error(`Database error: ${insertError.message}`)
            }
            
            if (!insertData || !insertData.id) {
              throw new Error('Failed to create statement: No ID returned from database')
            }
            
            toast({
              title: "Success!",
              description: "Your income statement has been created successfully.",
              variant: "default",
              duration: 5000,
            })
            
            setIsLoading(false)
            return insertData.id
          }
        } catch (refreshErr) {
          console.error('AuthProvider refresh attempt failed:', refreshErr)
        }
        
        // If we reach here, the refresh failed
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
          duration: 5000,
        })
        
        // Navigate to sign-in
        setTimeout(() => {
          router.push('/sign-in')
        }, 1000)
        
        throw new Error('Authentication error: ' + authError.message)
      }
      
      if (!session || !session.user) {
        console.error('No valid session found')
        throw new Error('You must be logged in to create a statement.')
      }
      
      const userId = session.user.id
      console.log('Creating statement for user ID:', userId)
      
      // Insert the data
      const { data, error } = await supabase
        .from('income_statements')
        .insert({
          user_id: userId,
          statement_data: statementData
        })
        .select('id')
        .single()
      
      if (error) {
        console.error('Database error while creating statement:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      
      if (!data || !data.id) {
        throw new Error('Failed to create statement: No ID returned from database')
      }
      
      toast({
        title: "Success!",
        description: "Your income statement has been created successfully.",
        variant: "default",
        duration: 5000,
      })
      
      setIsLoading(false)
      return data.id
    } catch (err) {
      console.error('Error in createStatement:', err)
      setIsLoading(false)
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unknown error occurred while creating your statement'
      setError(new Error(errorMessage))
      
      if (!errorMessage.includes('Authentication error')) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        })
      }
      
      return null
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
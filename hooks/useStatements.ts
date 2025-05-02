'use client'

import { useState } from 'react'
import { useToast } from './use-toast'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function useStatements() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  // Helper function to get authenticated session with retry
  const getAuthenticatedSession = async () => {
    // First attempt
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (!authError && authData.session && authData.session.user) {
      return { session: authData.session, error: null }
    }
    
    console.log('Initial session check failed, attempting to refresh...', authError || 'No session found')
    
    // Try to refresh the session
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
    
    if (!refreshError && refreshData.session && refreshData.session.user) {
      console.log('Session successfully refreshed')
      return { session: refreshData.session, error: null }
    }
    
    console.error('Session refresh failed:', refreshError || 'No session after refresh')
    
    // Final error - no valid session
    return { 
      session: null, 
      error: authError || refreshError || new Error('No valid authentication session found') 
    }
  }

  // Create a new income statement
  const createStatement = async (statementData: any) => {
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
        
        // Let the component handle the redirect to avoid navigation during rendering
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
        console.error('Supabase error details:', error)
        throw new Error(`Database error: ${error.message || 'Unknown database error. Please try again later.'}`)
      }
      
      if (!data || !data.id) {
        console.error('No data returned from insertion')
        throw new Error('Failed to create statement: No ID returned from database')
      }
      
      toast({
        title: "Success!",
        description: "Your income statement has been created successfully.",
        variant: "default",
        duration: 5000,
      })
      
      return data.id
    } catch (err) {
      console.error('Statement creation error:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unknown error occurred while creating your statement'
      setError(errorMessage)
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      })
      
      return null
    } finally {
      setIsLoading(false)
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
      setError(errorMessage)
      
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
      setError(errorMessage)
      
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
      setError(errorMessage)
      
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
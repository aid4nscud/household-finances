'use client'

import { useState } from 'react'
import { useToast } from './use-toast'
import { createClient } from '@/utils/supabase/client'

export function useStatements() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  // Create a new income statement
  const createStatement = async (statementData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check authentication before proceeding
      const { data: authData, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        console.error('Auth error details:', authError)
        throw new Error('Authentication error: ' + authError.message)
      }
      
      if (!authData.session || !authData.session.user) {
        console.error('No valid session found', authData)
        throw new Error('You must be logged in to create a statement.')
      }
      
      const userId = authData.session.user.id
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
      const { data: authData, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        console.error('Auth error details:', authError)
        throw new Error('Authentication error: ' + authError.message)
      }
      
      if (!authData.session || !authData.session.user) {
        console.error('No valid session found', authData)
        throw new Error('You must be logged in to update a statement.')
      }
      
      const userId = authData.session.user.id
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
      const { data: authData, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authData.user) {
        throw new Error('You must be logged in to retrieve a statement.')
      }
      
      // Get the most recent statement
      const { data, error } = await supabase
        .from('income_statements')
        .select('*')
        .eq('user_id', authData.user.id)
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
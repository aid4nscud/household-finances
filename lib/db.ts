import { createClient } from '@/utils/supabase/server'
import { createServiceClient } from '@/lib/supabase'
import { cache } from 'react'

/**
 * Get a user's income statements with optional pagination
 * Cached for improved performance
 */
export const getIncomeStatements = cache(async (userId: string, page = 1, limit = 10) => {
  const supabase = createClient()
  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error, count } = await supabase
    .from('income_statements')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching income statements:', error)
    throw new Error(`Failed to fetch income statements: ${error.message}`)
  }

  return { data, count }
})

/**
 * Get a single income statement by ID
 * Cached for improved performance
 */
export const getIncomeStatementById = cache(async (id: string, userId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('income_statements')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching income statement:', error)
    throw new Error(`Failed to fetch income statement: ${error.message}`)
  }

  return data
})

/**
 * Delete an income statement by ID
 */
export async function deleteIncomeStatement(id: string, userId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('income_statements')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting income statement:', error)
    throw new Error(`Failed to delete income statement: ${error.message}`)
  }

  return true
}

/**
 * Admin function to get all income statements
 * Only available to service role
 */
export async function adminGetAllStatements() {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('income_statements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error in admin fetch of statements:', error)
    throw new Error(`Admin fetch failed: ${error.message}`)
  }

  return data
} 
import { createClient } from '@/utils/supabase/server'

/**
 * Get the current user's session
 */
export async function getSession() {
  const supabase = createClient()
  return await supabase.auth.getSession()
}

/**
 * Get the current user using the more secure getUser method
 * This authenticates the request with the Supabase server
 * rather than just reading from cookies
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting authenticated user:', error.message)
    return null
  }
  
  return data.user
} 
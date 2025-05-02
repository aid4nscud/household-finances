import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  // Check if user is already authenticated
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  
  if (data.user) {
    // User is authenticated, redirect to dashboard
    redirect('/dashboard')
  } else {
    // User is not authenticated, redirect to sign-in
    redirect('/sign-in')
  }
} 
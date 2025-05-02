'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SITE_URL } from '@/lib/constants'

export async function signIn(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return redirect('/sign-in?error=' + encodeURIComponent(error.message))
  }
  
  return redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    return redirect('/sign-up?error=' + encodeURIComponent(error.message))
  }
  
  return redirect('/sign-in?message=Check your email to confirm your sign up')
}

export async function signOut() {
  const supabase = createClient()
  
  // Make sure to clear cookies server-side
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Server action sign-out error:', error);
  }
  
  // Redirect to home page even if there's an error
  return redirect('/')
} 
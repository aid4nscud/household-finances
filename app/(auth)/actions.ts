'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PRODUCTION_REDIRECT_URL, LOCAL_REDIRECT_URL } from '@/lib/constants'
import { headers } from 'next/headers'

// Determine the appropriate redirect URL based on the request
function getRedirectUrl() {
  const headersList = headers()
  const host = headersList.get('host') || ''
  
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  return isLocalhost ? LOCAL_REDIRECT_URL : PRODUCTION_REDIRECT_URL
}

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
  const redirectUrl = getRedirectUrl()
  
  console.log(`[Server] Using redirect URL for signup: ${redirectUrl}`)
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })
  
  if (error) {
    return redirect('/sign-up?error=' + encodeURIComponent(error.message))
  }
  
  return redirect('/sign-in?message=Check your email to confirm your sign up')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/')
} 
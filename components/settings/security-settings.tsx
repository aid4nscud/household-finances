'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface SecuritySettingsProps {
  user: User
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isLoadingReset, setIsLoadingReset] = useState(false)
  const [isLoadingSignOut, setIsLoadingSignOut] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSendPasswordReset = async () => {
    try {
      setIsLoadingReset(true)
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email as string, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send password reset email',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingReset(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoadingSignOut(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.'
      })
      
      router.push('/sign-in')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign out',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingSignOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-gray-500 mb-4">
          You can reset your password by sending a password reset link to your email.
        </p>
        <Button 
          variant="outline" 
          onClick={handleSendPasswordReset} 
          disabled={isLoadingReset}
        >
          {isLoadingReset ? 'Sending...' : 'Send Password Reset Email'}
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Sign Out</h3>
        <p className="text-sm text-gray-500 mb-4">
          Sign out from your account.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleSignOut} 
          disabled={isLoadingSignOut}
        >
          {isLoadingSignOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  )
} 
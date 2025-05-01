'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface ProfileSettingsProps {
  user: User
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || '')
  const { toast } = useToast()

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName }
      })
      
      if (error) throw error
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user?.email || ''}
          disabled
          readOnly
        />
        <p className="text-sm text-gray-500">
          Your email address is used for sign-in and notifications.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button 
        onClick={handleUpdateProfile} 
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update Profile'}
      </Button>
    </div>
  )
} 
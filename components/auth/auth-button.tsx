'use client'

import { useAuth } from '@/components/auth/auth-provider'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/(auth)/actions'
import { LogOut, LogIn } from 'lucide-react'

export function AuthButton() {
  const { user, isLoading } = useAuth()
  
  return (
    <>
      {isLoading ? (
        <Button variant="ghost" size="sm" disabled>
          Loading...
        </Button>
      ) : user ? (
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </form>
      ) : (
        <Button asChild variant="default" size="sm" className="gap-2">
          <Link href="/sign-in">
            <LogIn className="h-4 w-4" />
            <span>Sign in</span>
          </Link>
        </Button>
      )}
    </>
  )
} 
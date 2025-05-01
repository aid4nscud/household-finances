'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export function Header() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      })
      
      router.push('/sign-in')
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not sign out",
        variant: "destructive"
      })
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                Financial Dashboard
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900">
                Dashboard
              </Link>
              <Link href="/dashboard/history" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                History
              </Link>
              <Link href="/settings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button 
              onClick={handleSignOut}
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 
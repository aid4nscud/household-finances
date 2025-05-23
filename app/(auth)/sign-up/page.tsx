import { AuthForm } from '@/components/auth/auth-form'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface SignUpPageProps {
  searchParams: { error?: string }
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  // Check if user is already authenticated
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // If authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }
  
  const errorMessage = searchParams.error
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              <span className="text-[#00C805]">Val</span>You
            </span>
          </div>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800/30">
            <p className="text-sm text-red-600 dark:text-red-400">{decodeURIComponent(errorMessage)}</p>
          </div>
        )}
        
        <div className="p-6">
          <div className="text-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Get started</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create an account to manage your finances
            </p>
          </div>
          
          <AuthForm mode="signUp" />
          
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center">
                <div className="w-1 h-1 bg-[#00C805] rounded-full mr-2"></div>
                <span>Track household expenses</span>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-[#00C805] rounded-full mr-2"></div>
                <span>Get personalized insights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 
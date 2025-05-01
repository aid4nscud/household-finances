import { AuthForm } from '@/components/auth/auth-form'
import Link from 'next/link'

interface SignInPageProps {
  searchParams: { error?: string }
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const errorMessage = searchParams.error
  
  return (
    <>
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">ValYou</h1>
        </Link>
      </div>
      
      <div className="backdrop-blur-sm bg-white/30 border border-gray-100/50 shadow-lg rounded-2xl overflow-hidden w-full max-w-md mx-auto">
        {errorMessage && (
          <div className="bg-red-50/80 border-l-4 border-red-400 p-4 backdrop-blur-sm">
            <p className="text-sm text-red-700">{decodeURIComponent(errorMessage)}</p>
          </div>
        )}
        
        <div className="p-6 pt-5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          </div>
          
          <AuthForm mode="signIn" />
        </div>
      </div>
    </>
  )
} 
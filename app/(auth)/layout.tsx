import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { createClient } from '@/utils/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
      {/* Simple green accent at top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-[#00C805]"></div>
      
      {/* Main content */}
      <div className="w-full max-w-md mx-auto px-4">
        <AuthProvider initialSession={session}>
          {children}
        </AuthProvider>
      </div>
      <Toaster />
    </div>
  )
} 
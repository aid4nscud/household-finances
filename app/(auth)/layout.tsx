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
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients and patterns */}
      <div className="fixed inset-0 bg-gray-50 -z-10"></div>
      <div className="fixed inset-0 bg-grid-pattern opacity-20 -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 to-primary/10 -z-10"></div>
      <div className="fixed top-0 inset-x-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] -z-10"></div>
      
      {/* Main content */}
      <div className="z-10 px-4 py-8 w-full max-w-sm md:max-w-md">
        <AuthProvider initialSession={session}>
          {children}
        </AuthProvider>
      </div>
      <Toaster />
    </div>
  )
} 
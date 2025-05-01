import MainNav from '@/components/core/main-nav'
import { createClient } from '@/utils/supabase/server'
import SupabaseListener from '@/components/ui/supabase-listener'
import { Toaster } from '@/components/ui/toaster'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="relative flex min-h-screen flex-col">
      <SupabaseListener serverAccessToken={session?.access_token} />
      <MainNav session={session} />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t">
        <div className="container max-w-screen-2xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ValYou. All rights reserved.
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
} 
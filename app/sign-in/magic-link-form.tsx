import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createClient } from '@/utils/supabase/client'
import { SITE_URL } from '@/lib/constants'

// Schema for form validation
const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export function MagicLinkForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log('[MagicLinkForm] Initiating sign in with magic link')
      
      // Clear any existing auth cookies before starting a new auth flow
      const cookiesToClear = [
        'sb-access-token',
        'sb-refresh-token',
        'sb-auth-token',
        'supabase-auth-token',
        'supabase-auth-token-code-verifier',
      ];
      
      // Clear Supabase cookies to avoid conflicts
      cookiesToClear.forEach(cookie => {
        // Standard cookie clear for development
        document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        
        // Try with domain specification for production environments
        const domain = window.location.hostname;
        document.cookie = `${cookie}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        
        // For production domains, also try with leading dot for subdomains
        if (domain !== 'localhost') {
          const rootDomain = domain.split('.').slice(-2).join('.');
          document.cookie = `${cookie}=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      });
      
      // Find and clear any other auth-related cookies
      document.cookie.split('; ').forEach(cookie => {
        const [name] = cookie.split('=');
        if (name.includes('-auth-token') || name.startsWith('sb-') || name.includes('clerk')) {
          // Clear for all domains and paths
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          
          const domain = window.location.hostname;
          document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          
          // For production domains
          if (domain !== 'localhost') {
            const rootDomain = domain.split('.').slice(-2).join('.');
            document.cookie = `${name}=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          }
        }
      });
      
      // Set up PKCE auth
      const redirectTo = `${SITE_URL}/auth/callback`;
      console.log('[MagicLinkForm] Redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      })
      
      if (error) {
        console.error('[MagicLinkForm] Auth error:', error.message);
        throw error
      }

      console.log('[MagicLinkForm] Magic link sent successfully');
      setSuccess(true)
    } catch (error: any) {
      console.error('[MagicLinkForm] Error:', error);
      setError(error?.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email to receive a magic link
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
          <p>Magic link sent! Check your email for the login link.</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hello@example.com"
                      {...field}
                      type="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
} 
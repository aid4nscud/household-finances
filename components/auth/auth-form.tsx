'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { signInWithEmail, signUp } from '@/app/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { LOCAL_REDIRECT_URL, PRODUCTION_REDIRECT_URL } from '@/lib/constants'

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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Mail, Loader2 } from 'lucide-react'

// Form schema for input validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

interface AuthFormProps {
  mode?: 'signIn' | 'signUp'
}

export function AuthForm({ mode = 'signIn' }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState(LOCAL_REDIRECT_URL)
  const router = useRouter()
  const { toast } = useToast()

  // Move redirect URL logic into useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1'
      setRedirectUrl(isLocalhost ? LOCAL_REDIRECT_URL : PRODUCTION_REDIRECT_URL)
    }
  }, []) // Empty dependency array means this only runs once on mount

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      setEmail(values.email)

      const formData = new FormData()
      formData.append('email', values.email)

      const result = mode === 'signIn' 
        ? await signInWithEmail(formData)
        : await signUp(formData)

      if (result.error) {
        setErrorMessage(result.error)
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
        return
      }

      setIsCodeSent(true)
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the login link',
      })
    } catch (error: any) {
      setErrorMessage(error.message)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4 text-sm bg-red-50 dark:bg-red-900/20 border-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {!isCodeSent ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 text-sm">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="name@example.com" 
                        type="email" 
                        autoComplete="email"
                        disabled={isLoading}
                        className="h-10 pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#00C805] hover:bg-[#00C805]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send magic link</span>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-5">
          <div className="bg-[#00C805]/5 border border-[#00C805]/20 rounded p-4 text-center">
            <p className="text-sm mb-1">
              Check your email for the login link
            </p>
            <p className="text-xs text-gray-500 break-all">
              {email}
            </p>
          </div>
          
          <Button
            variant="outline"
            className="w-full border-gray-200 dark:border-gray-700"
            onClick={() => setIsCodeSent(false)}
          >
            Use a different email
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-[#00C805]"
          onClick={() => router.push(mode === 'signIn' ? '/sign-up' : '/sign-in')}
        >
          {mode === 'signIn' ? 'Create an account' : 'Sign in instead'}
        </Button>
      </div>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { isRateLimited } from '@/utils/rate-limit'
import { REDIRECT_URL } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// Form schema for input validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

// Component types
interface AuthFormProps {
  mode?: 'signIn' | 'signUp'
}

export function AuthForm({ mode = 'signIn' }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

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
      setEmail(values.email)
      
      // Apply rate limiting based on email
      if (isRateLimited(values.email)) {
        throw new Error('Too many requests. Please try again later.')
      }
      
      // Handle passwordless authentication with magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: REDIRECT_URL,
          shouldCreateUser: mode === 'signUp', // Only create a new user in signUp mode
        },
      });

      if (error) {
        throw error;
      }

      setIsCodeSent(true)
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the login link',
      })
    } catch (error) {
      console.error('[AuthForm] Authentication error:', error)
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send magic link',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-sm border-0 bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
        </CardTitle>
        {!isCodeSent && (
          <CardDescription className="text-center">
            {mode === 'signIn' ? 'Sign in' : 'Create an account'} with your email
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {!isCodeSent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        type="email" 
                        autoComplete="email"
                        disabled={isLoading}
                        className="h-11 px-4"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-11 font-medium shadow-sm transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send magic link'}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-5 py-3">
            <div className="bg-primary/10 rounded-lg py-4 px-3">
              <p className="text-sm text-primary/80">
                Check your email <span className="font-medium">({email})</span> for the login link
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => setIsCodeSent(false)}
            >
              Use a different email
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-0 pb-6">
        <p className="text-sm text-muted-foreground">
          {mode === 'signIn' ? "Don't have an account? " : "Already have an account? "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-medium text-primary" 
            onClick={() => router.push(mode === 'signIn' ? '/sign-up' : '/sign-in')}
          >
            {mode === 'signIn' ? 'Sign up' : 'Sign in'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
} 
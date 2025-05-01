"use client"

import Link from "next/link"
import { Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MainNav({ session }: { session: Session | null }) {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  async function handleSignOut() {
    try {
      console.log('[MainNav] Starting sign out process');
      
      // Clear all possible auth cookies, including both Supabase and Clerk
      const cookiesToClear = [
        // Supabase cookies
        'sb-access-token',
        'sb-refresh-token', 
        'sb-auth-token',
        'supabase-auth-token',
        'supabase-auth-token-code-verifier',
        // Clerk cookies
        '__clerk_db_jwt',
        '__clerk_db_jwt_YqB7Y3Gz',
        '__client_uat',
        '__client_uat_YqB7Y3Gz'
      ];
      
      // Add project-specific Supabase cookies
      if (typeof window !== 'undefined') {
        // Find and clear any Supabase project-specific cookies
        document.cookie.split('; ').forEach(cookie => {
          const [name] = cookie.split('=');
          if (name.includes('-auth-token') || name.startsWith('sb-')) {
            cookiesToClear.push(name);
          }
        });
      }
      
      // Clear all cookies with various path and domain combinations
      cookiesToClear.forEach(cookieName => {
        // Standard cookie clear
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        // Without security attributes
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure=false; samesite=lax`;
        // Try with an empty path
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        
        // Try with domain specification for production environments
        const domain = window.location.hostname;
        document.cookie = `${cookieName}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        
        // For production domains, also try with leading dot for subdomains
        if (domain !== 'localhost') {
          const rootDomain = domain.split('.').slice(-2).join('.');
          document.cookie = `${cookieName}=; path=/; domain=.${rootDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      });
      
      // Then sign out via Supabase Auth API
      console.log('[MainNav] Calling Supabase signOut API');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[MainNav] Sign out API error:", error);
        throw error;
      }
      
      console.log('[MainNav] Sign out successful, redirecting to sign-in page');
      
      // Force a full page reload to ensure complete state reset
      window.location.href = '/sign-in';
    } catch (e) {
      console.error("[MainNav] Sign out error:", e);
      
      // Even if there's an error, try to redirect to sign-in
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 500);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="mr-4 flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="px-7">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault()
                        document.querySelector('body')?.click()
                      }
                    }}
                  >
                    <span className="font-bold">ValYou</span>
                  </Link>
                </div>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                  <div className="flex flex-col space-y-3">
                    {session ? (
                      <>
                        <Link
                          href="/dashboard"
                          className={cn(
                            "text-foreground/70 transition-colors hover:text-foreground",
                            pathname === "/dashboard" && "font-medium text-foreground"
                          )}
                        >
                          Dashboard
                        </Link>
                        <Button 
                          variant="outline" 
                          className="mt-4 justify-start" 
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/sign-in">
                          <Button variant="outline" className="w-full justify-start">Sign In</Button>
                        </Link>
                        <Link href="/sign-up">
                          <Button className="w-full justify-start">Sign Up</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/" className="hidden items-center space-x-2 md:flex">
                <span className="font-bold">ValYou</span>
              </Link>
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  {session && (
                    <>
                      <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathname === "/dashboard" && "font-medium text-primary"
                            )}
                          >
                            Dashboard
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            <div className="flex items-center gap-4">
              {!session ? (
                <div className="hidden md:flex gap-2">
                  <Link href="/sign-in" className={cn(pathname === "/sign-in" && "hidden")}>
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/sign-up" className={cn(pathname === "/sign-up" && "hidden")}>
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={user?.user_metadata?.avatar_url || ""} 
                          alt={user?.email || "user"} 
                        />
                        <AvatarFallback>
                          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.user_metadata?.full_name || user?.email || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 
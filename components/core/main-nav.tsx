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
import { useAuth } from '@/components/auth/auth-provider'

export default function MainNav({ session }: { session: Session | null }) {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()
  const { signOut } = useAuth()

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  async function handleSignOut() {
    console.log('[MainNav] Signing out...');
    try {
      await signOut();
    } catch (e) {
      console.error("[MainNav] Sign out error:", e);
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
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-primary/20 transition-all duration-200 overflow-hidden group"
                    >
                      <Avatar className="h-9 w-9 group-hover:scale-105 transition-transform duration-200">
                        <AvatarImage 
                          src={user?.user_metadata?.avatar_url || ""} 
                          alt={user?.email || "user"} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground font-medium">
                          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 p-3" 
                    align="end" 
                    forceMount
                    sideOffset={8}
                  >
                    <div className="flex items-center gap-3 pb-2">
                      <Avatar className="h-11 w-11 border-2 border-primary/20">
                        <AvatarImage 
                          src={user?.user_metadata?.avatar_url || ""} 
                          alt={user?.email || "user"} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground font-medium text-lg">
                          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold leading-none">
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1.5 max-w-[160px] truncate">
                          {user?.email}
                        </p>
                        <div className="mt-2 flex gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            Member
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <div className="space-y-1 py-1">
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-primary/5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                          </svg>
                          Dashboard
                        </DropdownMenuItem>
                      </Link>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="cursor-pointer flex items-center gap-2 py-2 px-3 rounded-md transition-colors hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
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
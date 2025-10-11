"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "@/components/search/global-search"
import { useAuth } from "@/components/auth/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 group-hover:scale-105 transition-transform">
                <Image src="/logo.png" alt="Jos North Culture & Tourism CDS" fill className="object-contain" priority />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Culture & Tourism</h1>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`relative text-base font-medium transition-colors pb-1 ${
                  isActive("/")
                    ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                href="/sites"
                className={`relative text-base font-medium transition-colors pb-1 ${
                  isActive("/sites")
                    ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cultural Sites
              </Link>
              <Link
                href="/events"
                className={`relative text-base font-medium transition-colors pb-1 ${
                  isActive("/events")
                    ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Peace Events
              </Link>
              <Link
                href="/stories"
                className={`relative text-base font-medium transition-colors pb-1 ${
                  isActive("/stories")
                    ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                CDS Stories
              </Link>
              <Link
                href="/community"
                className={`relative text-base font-medium transition-colors pb-1 ${
                  isActive("/community")
                    ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Community
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3">
                {loading ? (
                  <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-teal-600 text-white font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites">My Favorites</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/auth/signup">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 p-0 hover:bg-gray-100 rounded-lg"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12M6 12h12"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-up bg-white">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className={`text-base font-medium transition-colors px-2 py-2 rounded-lg ${
                    isActive("/") ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/sites"
                  className={`text-base font-medium transition-colors px-2 py-2 rounded-lg ${
                    isActive("/sites") ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cultural Sites
                </Link>
                <Link
                  href="/events"
                  className={`text-base font-medium transition-colors px-2 py-2 rounded-lg ${
                    isActive("/events") ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Peace Events
                </Link>
                <Link
                  href="/stories"
                  className={`text-base font-medium transition-colors px-2 py-2 rounded-lg ${
                    isActive("/stories") ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  CDS Stories
                </Link>
                <Link
                  href="/community"
                  className={`text-base font-medium transition-colors px-2 py-2 rounded-lg ${
                    isActive("/community") ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </Link>
                <div className="pt-4 border-t border-gray-200">
                  {loading ? (
                    <div className="w-full h-10 animate-pulse bg-gray-200 rounded-lg" />
                  ) : user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 px-2">Signed in as {user.email}</div>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full text-gray-700 hover:bg-gray-50" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

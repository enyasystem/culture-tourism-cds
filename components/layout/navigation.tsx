"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X, MapPin, Calendar, BookOpen } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Culture & Tourism" fill className="object-contain" priority />
            </div>
            <span className="font-semibold text-gray-900 text-lg">Culture & Tourism</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Explore
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isExploreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isExploreOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <Link
                      href="/sites"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <MapPin className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">Cultural Sites</div>
                        <div className="text-sm text-gray-600">
                          Explore Jos's rich cultural heritage and historical landmarks
                        </div>
                      </div>
                    </Link>
                    <Link
                      href="/events"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <Calendar className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">Cultural Events</div>
                        <div className="text-sm text-gray-600">Join exciting cultural events and CDS activities</div>
                      </div>
                    </Link>
                    <Link
                      href="/stories"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <BookOpen className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">CDS Stories</div>
                        <div className="text-sm text-gray-600">Read inspiring stories from corps members</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/community" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Community
            </Link>

            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>

            <Link href="/auth/signup">
              <Button className="bg-[#1A7B7B] hover:bg-[#0F766E] text-white px-5 py-2 h-9 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md">
                Get started
              </Button>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link
                href="/sites"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cultural Sites
              </Link>
              <Link
                href="/events"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cultural Events
              </Link>
              <Link
                href="/stories"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CDS Stories
              </Link>
              <Link
                href="/community"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-3 border-t border-gray-100 mt-2">
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

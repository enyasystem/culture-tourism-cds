"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X, MapPin, Calendar, BookOpen, Users } from "lucide-react"

export function Navigation() {
  console.log("NAVIGATION COMPONENT RENDERED");

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isExploreOpen, setIsExploreOpen] = useState(false)
  const pathname = usePathname()
  const exploreRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    if (!isExploreOpen) return
    function handleClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setIsExploreOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsExploreOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [isExploreOpen])

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-gray-200 rounded-[35px] shadow-sm w-full max-w-3xl">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <meta name="google-site-verification" content="N-c6GKMxJNUO8ClrwFBMb5p1dutz7mRTcpVVGp6_b2s" />
          {/* left: logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Culture & Tourism" fill className="object-contain" priority />
            </div>
            <span className="font-semibold text-black tracking-wide text-lg">Culture & Tourism</span>
          </Link>

          {/* center: links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative" ref={exploreRef}>
              <button
                className="flex items-center gap-2 text-sm font-medium text-black hover:text-[#1A7B7B] transition-colors cursor-pointer focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isExploreOpen}
                onClick={() => setIsExploreOpen((v) => !v)}
              >
                Explore
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExploreOpen ? "rotate-180" : ""}`} />
              </button>
              {isExploreOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  tabIndex={-1}
                >
                  <div className="p-2">
                    <Link
                      href="/sites"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <MapPin className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-black mb-1">Cultural Sites</div>
                        <div className="text-sm text-gray-600">Explore Jos's rich cultural heritage and historical landmarks</div>
                      </div>
                    </Link>
                    <Link
                      href="/events"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <Calendar className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-black mb-1">Cultural Events</div>
                        <div className="text-sm text-gray-600">Join exciting cultural events and CDS activities</div>
                      </div>
                    </Link>
                    <Link
                      href="/tribes"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <Users className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-black mb-1">Tribes of Plateau</div>
                        <div className="text-sm text-gray-600">Discover the diverse tribes and ethnic groups</div>
                      </div>
                    </Link>
                    <Link
                      href="/community"
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                        <BookOpen className="w-5 h-5 text-[#1A7B7B]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-black mb-1">Community</div>
                        <div className="text-sm text-gray-600">Read inspiring stories from corps members</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/stories" className="text-sm font-medium text-black hover:text-[#1A7B7B] transition-colors cursor-pointer">
              CDS Stories
            </Link>

            <Link href="/about" className="text-sm font-medium text-black hover:text-[#1A7B7B] transition-colors cursor-pointer">
              About
            </Link>
          </div>

          {/* right: CTA and mobile menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Link href="/contact">
                <button className="relative inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#1A7B7B] text-white font-semibold hover:bg-[#156666] transition-all duration-200 cursor-pointer">
                  Get In Touch
                </button>
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-black hover:text-[#1A7B7B] transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-3 bg-white/5 rounded-lg p-3">
              <Link href="/sites" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-black py-2 hover:text-[#1A7B7B] cursor-pointer">
                Cultural Sites
              </Link>
              <Link href="/events" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-black py-2 hover:text-[#1A7B7B] cursor-pointer">
                Cultural Events
              </Link>
              <Link href="/stories" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-black py-2 hover:text-[#1A7B7B] cursor-pointer">
                CDS Stories
              </Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-black py-2 hover:text-[#1A7B7B] cursor-pointer">
                About
              </Link>
              <div className="pt-3 border-t border-gray-200 mt-2">
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start bg-[#1A7B7B] text-white font-semibold hover:bg-[#156666] cursor-pointer">
                    Get In Touch
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

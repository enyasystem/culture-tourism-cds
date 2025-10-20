"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] ==================== PROTECTED ROUTE CHECK ====================")

      const adminSession = localStorage.getItem("admin_session")
      const adminUsername = localStorage.getItem("admin_username")
      const loginTime = localStorage.getItem("admin_login_time")

      console.log("[v0] Admin session:", adminSession)
      console.log("[v0] Admin username:", adminUsername)
      console.log("[v0] Login time:", loginTime)

      // If we don't have a client-side marker in localStorage, try to
      // recover by checking the Supabase client session (cookies) before
      // immediately redirecting. This avoids a race where the server-side
      // cookies are present but localStorage hasn't been synced yet.
      if (!adminSession || adminSession !== "true" || !adminUsername) {
        console.log("[v0] \u2717 No valid admin session found locally, attempting Supabase client check")

        try {
          const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
          const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          if (SUPABASE_URL && SUPABASE_ANON_KEY) {
            const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
            const { data } = await supabase.auth.getUser()
            const user = (data as any)?.user
            if (user) {
              console.log("[v0] \u2713 Supabase client reports authenticated user:", user?.email || user?.id)
              try {
                // Sync a minimal client-side marker so other admin-only
                // components won't redirect while we allow access.
                localStorage.setItem("admin_session", "true")
                localStorage.setItem("admin_username", user.email || "admin")
                localStorage.setItem("admin_login_time", new Date().toISOString())
              } catch (e) {
                // ignore storage errors
              }
              setIsAuthorized(true)
              setIsLoading(false)
              return
            }
          }
        } catch (e) {
          console.error("[v0] Supabase client check failed:", e)
        }

        // If we're on the login page, allow it to render so users can sign in.
        if (pathname && pathname.startsWith("/admin/login")) {
          setIsLoading(false)
          return
        }

        // Not on login page: navigate to login and clear loading so the
        // UI doesn't remain stuck in the verifying state.
        setIsLoading(false)
        router.push("/admin/login")
        return
      }

      // Optional: Check if session is expired (24 hours)
      if (loginTime) {
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)

        console.log("[v0] Hours since login:", hoursSinceLogin)

        if (hoursSinceLogin > 24) {
          console.log("[v0] ✗ Session expired (>24 hours), redirecting to login")
          // Session expired
          localStorage.removeItem("admin_session")
          localStorage.removeItem("admin_username")
          localStorage.removeItem("admin_login_time")
          router.push("/admin/login")
          return
        }
      }

      console.log("[v0] ✓ Admin session valid, granting access")
      setIsAuthorized(true)
      setIsLoading(false)
      console.log("[v0] ================================================================")
    }

    checkAuth()
  }, [router, requireAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-[#1A7B7B]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

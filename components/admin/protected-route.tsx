"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] ==================== PROTECTED ROUTE CHECK ====================")

      const adminSession = localStorage.getItem("admin_session")
      const adminUsername = localStorage.getItem("admin_username")
      const loginTime = localStorage.getItem("admin_login_time")

      console.log("[v0] Admin session:", adminSession)
      console.log("[v0] Admin username:", adminUsername)
      console.log("[v0] Login time:", loginTime)

      if (!adminSession || adminSession !== "true" || !adminUsername) {
        console.log("[v0] ✗ No valid admin session found, redirecting to login")
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

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, User, ArrowLeft } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const u = username.trim()
    const p = password.trim()

    // If Supabase env is configured, attempt real auth using Supabase
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        const { data, error } = await supabase.auth.signInWithPassword({ email: u, password: p })
        if (error) {
          setError(error.message || "Sign in failed")
          setIsLoading(false)
          return
        }

        // Sync session to server so middleware can read HTTP-only cookies
        try {
          const sessionResp = await supabase.auth.getSession()
          const session = (sessionResp && (sessionResp as any).data?.session) || (data as any)?.session || null

          await fetch("/api/auth", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ event: "SIGNED_IN", session }),
          })
        } catch (e) {
          // ignore cookie sync errors - try to continue
        }

        // mark client-side session and redirect to admin dashboard
        try {
          localStorage.setItem("admin_session", "true")
          localStorage.setItem("admin_username", u)
          localStorage.setItem("admin_login_time", new Date().toISOString())
        } catch (err) {
          // ignore storage errors
        }

        router.push("/admin")
        router.refresh()
        return
      } catch (err: any) {
        setError(err?.message || "Sign in failed")
        setIsLoading(false)
        return
      }
    }

    // Fallback demo auth (localStorage) when Supabase is not configured
    if (u === "admin@example.com" && p === "password") {
      try {
        localStorage.setItem("admin_session", "true")
        localStorage.setItem("admin_username", u)
        localStorage.setItem("admin_login_time", new Date().toISOString())
      } catch (err) {
        // ignore storage errors
      }
      router.push("/admin")
      return
    }

    setError("Invalid username or password")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1A7B7B]/5 via-background to-[#0F766E]/5">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#1A7B7B]/10">
              <Shield className="w-8 h-8 text-[#1A7B7B]" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10 h-11" required />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In to Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1A7B7B]">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
 
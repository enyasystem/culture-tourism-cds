"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Mountain, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // After sign-in, fetch the authenticated user and their profile role.
      const { data: userData, error: getUserError } = await supabase.auth.getUser()
      if (!getUserError && userData?.user?.id) {
        const userId = userData.user.id
        try {
          const { data: profile, error: profileErr } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("user_id", userId)
            .single()

          if (!profileErr && profile?.role === "admin") {
            router.push("/admin")
            router.refresh()
            return
          }
        } catch {
          // ignore and fall back to home
        }
      }

      // default redirect
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F7F7] via-white to-[#F0F9F9] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1A7B7B]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/logo.png" alt="Culture & Tourism CDS" fill className="object-cover" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Mountain className="w-4 h-4 text-[#1A7B7B]" />
            Culture & Tourism CDS Platform
          </p>
        </div>

        <Card className="shadow-xl border-0 animate-slide-up">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-[#1A7B7B] focus:ring-[#1A7B7B]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-[#1A7B7B] focus:ring-[#1A7B7B]"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#1A7B7B] hover:bg-[#0F766E] text-white font-medium transition-all duration-300 hover:shadow-lg group"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#1A7B7B] hover:text-[#0F766E] font-semibold hover:underline transition-colors"
              >
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#1A7B7B] transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

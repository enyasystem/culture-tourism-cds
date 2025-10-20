import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - Jos Culture Platform",
  description: "Sign in to the admin area",
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally omits the admin chrome (AdminSidebar, AdminLayout)
  // so pages under /admin/login render a clean, unauthenticated UI.
  return <div className="min-h-screen flex items-center justify-center bg-muted">{children}</div>
}

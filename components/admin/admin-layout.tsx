"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const pathname = usePathname()

  // Hide the admin sidebar on the login page to avoid showing admin UI
  // while an anonymous or signing-in user is on the login route.
  const showSidebar = !(pathname && pathname.startsWith("/admin/login"))

  return (
    <div className="min-h-screen bg-background flex">
      {showSidebar && <AdminSidebar currentPath={currentPath} />}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

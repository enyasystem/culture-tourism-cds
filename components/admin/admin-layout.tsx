"use client"

import type React from "react"
import { useState } from "react"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Hide the admin sidebar on the login page to avoid showing admin UI
  // while an anonymous or signing-in user is on the login route.
  const showSidebar = !(pathname && pathname.startsWith("/admin/login"))

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Top bar for small screens */}
      {showSidebar && (
        <header className="w-full md:hidden flex items-center justify-between px-3 py-2 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <button
              aria-label="Open menu"
              className="p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-sm font-semibold text-foreground">Admin</div>
              <div className="text-xs text-muted-foreground">Jos Culture</div>
            </div>
          </div>
        </header>
      )}

      <div className="flex">
        {showSidebar && <AdminSidebar currentPath={currentPath} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

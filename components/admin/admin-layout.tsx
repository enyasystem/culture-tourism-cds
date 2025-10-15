"use client"

import type React from "react"

import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar currentPath={currentPath} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

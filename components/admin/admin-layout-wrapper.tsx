"use client"

import React from "react"
import { AdminLayout as UIAdminLayout } from "@/components/admin/admin-layout"
import { ProtectedRoute } from "@/components/admin/protected-route"

export default function AdminLayoutWrapper({ children, currentPath }: { children: React.ReactNode; currentPath?: string }) {
  return (
    <ProtectedRoute>
      <UIAdminLayout currentPath={currentPath}>{children}</UIAdminLayout>
    </ProtectedRoute>
  )
}

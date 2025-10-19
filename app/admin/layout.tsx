import type React from "react"
import type { Metadata } from "next"
import AdminLayoutWrapper from "@/components/admin/admin-layout-wrapper"

export const metadata: Metadata = {
  title: "Admin Dashboard - Jos Culture & Tourism",
  description: "Administrative panel for managing the Jos Culture & Tourism CDS Platform",
}

// Server component layout: it exports `metadata` and renders a client-side
// wrapper which contains authentication guards and client-only UI.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper currentPath="/admin">{children}</AdminLayoutWrapper>
}

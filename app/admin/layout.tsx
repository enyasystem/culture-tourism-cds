import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Jos Culture & Tourism",
  description: "Administrative panel for managing the Jos Culture & Tourism CDS Platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

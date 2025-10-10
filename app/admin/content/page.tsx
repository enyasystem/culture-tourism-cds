"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { ContentManagement } from "@/components/admin/content-management"

export default function ContentPage() {
  return (
    <AdminLayout currentPath="/admin/content">
      <div className="p-8">
        <ContentManagement />
      </div>
    </AdminLayout>
  )
}

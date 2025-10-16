"use client"

import React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import PageEditor from "../../../../../components/admin/page-editor"

export default function NewPage() {
  return (
    <AdminLayout currentPath="/admin/content">
      <div className="p-6">
        <PageEditor />
      </div>
    </AdminLayout>
  )
}

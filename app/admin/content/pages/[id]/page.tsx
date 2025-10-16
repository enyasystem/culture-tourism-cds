"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import PageEditor from "../../../../../components/admin/page-editor"

export default function EditPage({ params }: { params: { id?: string } }) {
  const id = params?.id

  return (
    <AdminLayout currentPath="/admin/content">
      <div className="p-6">
        <PageEditor id={id} />
      </div>
    </AdminLayout>
  )
}

"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import PageEditor from "../../../../../components/admin/page-editor"

export default function EditPage({ params }: { params: { id?: string } }) {
  const id = params?.id

  return (
    <div className="p-6">
      <PageEditor id={id} />
    </div>
  )
}

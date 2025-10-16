"use client"

import React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import StoryEditor from "@/components/admin/story-editor"

export default function EditStory({ params }: { params: { id?: string } }) {
  const id = params?.id
  return (
    <AdminLayout currentPath="/admin/stories">
      <div className="p-6">
        <StoryEditor id={id} />
      </div>
    </AdminLayout>
  )
}

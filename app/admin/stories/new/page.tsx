"use client"

import React from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import StoryEditor from "@/components/admin/story-editor"

export default function NewStory() {
  return (
    <AdminLayout currentPath="/admin/stories">
      <div className="p-6">
        <StoryEditor />
      </div>
    </AdminLayout>
  )
}

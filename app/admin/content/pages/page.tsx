"use client"

import React, { useEffect, useState } from "react"
import PagesList from "@/components/admin/pages-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPages() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link href="/admin/content/pages/new">
          <Button>Create page</Button>
        </Link>
      </div>

      <PagesList key={refreshKey} onChange={() => setRefreshKey((k) => k + 1)} />
    </div>
  )
}

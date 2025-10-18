"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { storyDbSelect } from "@/lib/schemas/stories"

export default function StoriesList({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchList() {
    setLoading(true)
    try {
      const resp = await fetch(`/api/admin/stories`)
      const json = await resp.json()
      setItems(json.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this story?")) return

    // optimistic remove
    const prev = items
    setItems((s) => s.filter((it) => it.id !== id))
    onChange?.()

    try {
      const resp = await fetch(`/api/admin/stories/${id}`, { method: "DELETE" })
      if (!resp.ok) {
        const txt = await resp.text()
        // restore
        setItems(prev)
        onChange?.()
        alert("Delete failed: " + txt)
      }
    } catch (e) {
      setItems(prev)
      onChange?.()
      alert(String(e))
    }
  }

  return (
    <div>
      {loading && <div>Loading…</div>}
      {!loading && (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="p-4 border rounded-md bg-card flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.summary}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/stories/${it.id}`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(it.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

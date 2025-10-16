"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { storyCreateSchema } from "@/lib/schemas/stories"

export default function StoryEditor({ id }: { id?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<any>({ title: "", slug: "", summary: "", body: "", published: false, cover_image: "" })

  function isUuid(val?: string) {
    if (!val) return false
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
  }

  useEffect(() => {
    // If id is not provided, this is 'create' flow.
    if (!id) return

    // Defensive: if id exists but is not a UUID (for example the literal
    // 'page' segment), redirect to the new editor to avoid calling per-id
    // endpoints with invalid IDs.
    if (!isUuid(id)) {
      console.warn('story-editor: received non-uuid id, redirecting to new editor', id)
      router.replace('/admin/stories/new')
      return
    }

    ;(async () => {
      try {
        const resp = await fetch(`/api/admin/stories/${id}`, { credentials: 'same-origin' })
        if (!resp.ok) {
          const txt = await resp.text()
          console.error('Failed to load story:', resp.status, txt)
          alert(`Failed to load story (status ${resp.status}):\n${txt}`)
          return
        }
        const json = await resp.json()
        if (json.data) setForm(json.data)
      } catch (e) {
        console.error(e)
        alert('Error loading story: ' + String(e))
      }
    })()
  }, [id])

  function updateField<K extends string>(key: K, value: any) {
    setForm((f: any) => ({ ...f, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      storyCreateSchema.parse({ title: form.title, slug: form.slug, summary: form.summary, body: form.body, published: !!form.published, cover_image: form.cover_image })
      if (id) {
        const resp = await fetch(`/api/admin/stories/${id}`, {
          method: "PATCH",
          credentials: 'same-origin',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!resp.ok) {
          const txt = await resp.text()
          console.error('PATCH error', resp.status, txt)
          alert(`PATCH failed (status ${resp.status}):\n${txt}`)
          throw new Error(txt)
        }
      } else {
        const resp = await fetch(`/api/admin/stories`, {
          method: "POST",
          credentials: 'same-origin',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!resp.ok) {
          const txt = await resp.text()
          console.error('POST error', resp.status, txt)
          alert(`POST failed (status ${resp.status}):\n${txt}`)
          throw new Error(txt)
        }
      }
      router.push("/admin/stories")
    } catch (e: any) {
      alert(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl">
      <div className="grid gap-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium">Title</span>
          <Input value={form.title} onChange={(e) => updateField('title', (e.target as HTMLInputElement).value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Slug (url)</span>
          <Input value={form.slug} onChange={(e) => updateField('slug', (e.target as HTMLInputElement).value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Summary</span>
          <Input value={form.summary} onChange={(e) => updateField('summary', (e.target as HTMLInputElement).value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium">Body (markdown)</span>
          <textarea className="w-full rounded-md border px-3 py-2" value={form.body} onChange={(e) => updateField('body', (e.target as HTMLTextAreaElement).value)} />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.published} onChange={(e) => updateField('published', (e.target as HTMLInputElement).checked)} />
          <span>Published</span>
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>
    </form>
  )
}

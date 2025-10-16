"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { pageCreateSchema } from "@/lib/schemas/pages"

export default function PageEditor({ id }: { id?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<any>({ title: "", slug: "", summary: "", body: "", published: false, cover_image: "" })

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const resp = await fetch(`/api/admin/pages/${id}`)
        const json = await resp.json()
        if (json.data) setForm(json.data)
      } catch (e) {
        console.error(e)
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
      // Basic client-side validation
      pageCreateSchema.parse({ title: form.title, slug: form.slug, summary: form.summary, body: form.body, published: !!form.published, cover_image: form.cover_image })

      if (id) {
        const resp = await fetch(`/api/admin/pages/${id}`, { method: "PATCH", body: JSON.stringify(form), headers: { "Content-Type": "application/json" } })
        if (!resp.ok) throw new Error(await resp.text())
      } else {
        const resp = await fetch(`/api/admin/pages`, { method: "POST", body: JSON.stringify(form), headers: { "Content-Type": "application/json" } })
        if (!resp.ok) throw new Error(await resp.text())
      }

      router.push("/admin/content/pages")
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

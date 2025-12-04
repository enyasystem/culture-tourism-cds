"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

export default function StoryForm({ onCreated, onCancel }: { onCreated?: () => void; onCancel?: () => void }) {
  const [newStory, setNewStory] = useState({ title: "", content: "" })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null)
  const [serverDiagnostics, setServerDiagnostics] = useState<string | null>(null)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    // build preview URLs when files change
    const urls: string[] = []
    selectedFiles.forEach((f) => {
      try {
        const u = URL.createObjectURL(f)
        urls.push(u)
      } catch (e) {
        console.debug("preview create failed", e)
      }
    })
    // revoke old previews
    setPreviews((prev) => {
      prev.forEach((p) => { try { URL.revokeObjectURL(p) } catch {} })
      return urls
    })
    // cleanup on unmount
    return () => {
      urls.forEach((u) => { try { URL.revokeObjectURL(u) } catch {} })
    }
  }, [selectedFiles])

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    setSelectedFiles(arr)
    // reset previous upload state
    setUploadedUrls([])
    setSelectedCoverIndex(null)
    setProgressMap({})
    setUploadErrorMessage(null)
  }

  const uploadAllFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return []
    const urls: string[] = []
    try {
      setIsUploading(true)
      for (const f of selectedFiles) {
        const filename = `${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.\\-]/g, "_")}`
        setProgressMap((p) => ({ ...p, [filename]: 5 }))
        const resp = await fetch(`/api/admin/uploads`, {
          method: "POST",
          headers: {
            "Content-Type": f.type || "application/octet-stream",
            "x-filename": filename,
          },
          body: f,
        })
        if (!resp.ok) {
          const text = await resp.text()
          setUploadErrorMessage(text || `Status ${resp.status}`)
          setServerDiagnostics(text || null)
          throw new Error(text || `Status ${resp.status}`)
        }
        const json = await resp.json()
        const publicUrl = json.publicUrl
        urls.push(publicUrl)
        setProgressMap((p) => ({ ...p, [filename]: 100 }))
      }
      setUploadedUrls(urls)
      if (selectedCoverIndex === null && urls.length > 0) setSelectedCoverIndex(0)
      return urls
    } finally {
      setIsUploading(false)
      setTimeout(() => setProgressMap({}), 800)
    }
  }

  const handleCreate = async () => {
    if (!newStory.title.trim()) {
      toast({ title: "Error", description: "Title is required", variant: "error" })
      return
    }

    try {
      setIsSubmitting(true)
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 200)

      // upload files if any and not already uploaded
      if (selectedFiles.length > 0 && uploadedUrls.length === 0) {
        await uploadAllFiles()
      }

      const payload: any = {
        title: newStory.title,
        slug: slugify(newStory.title || "untitled"),
        body: newStory.content || undefined,
        published: false,
      }

      if (uploadedUrls.length > 0) {
        payload.images = uploadedUrls
        const coverIdx = selectedCoverIndex !== null ? selectedCoverIndex : 0
        if (uploadedUrls[coverIdx]) payload.cover_image = uploadedUrls[coverIdx]
      }

      const resp = await fetch(`/api/admin/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (resp.status === 201) {
        toast({ title: "Created", description: "Story created successfully", variant: "success" })
        setNewStory({ title: "", content: "" })
        setSelectedFiles([])
        setUploadedUrls([])
        setSelectedCoverIndex(null)
        setPreviews([])
        onCreated?.()
        onCancel?.()
      } else {
        let json: any = null
        try {
          json = await resp.json()
        } catch (e) {
          const txt = await resp.text()
          console.error('Create story failed (non-json)', { status: resp.status, text: txt })
          const friendly = txt || `Status ${resp.status}`
          setUploadErrorMessage(friendly)
          setServerDiagnostics(null)
          toast({ title: 'Failed', description: friendly, variant: 'error' })
          return
        }

        let shortMsg = 'An error occurred while creating the story.'
        if (json?.error) {
          if (typeof json.error === 'string') shortMsg = json.error
          else if (json.error?.message) shortMsg = json.error.message
          else shortMsg = String(json.error)
        }

        const diag = json?.diagnostics ? JSON.stringify(json.diagnostics, null, 2) : null
        setUploadErrorMessage(shortMsg)
        setServerDiagnostics(diag)
        toast({ title: 'Failed', description: shortMsg, variant: 'error' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: String(err), variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Add New Story</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="story-title">Title *</Label>
          <Input
            id="story-title"
            value={newStory.title}
            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
            placeholder="Story title"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="story-content">Content</Label>
          <Textarea
            id="story-content"
            value={newStory.content}
            onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
            placeholder="Story content..."
            rows={5}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="story-files">Upload Images (optional)</Label>
          <input
            id="story-files"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFilesChange(e.target.files)}
            disabled={isSubmitting || isUploading}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {previews.map((p, idx) => (
                <div key={p} className="relative">
                  <img src={p} alt={`preview-${idx}`} className="h-20 w-full object-cover rounded-md" />
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <label className="text-xs">
                      <input
                        type="radio"
                        name="cover"
                        checked={selectedCoverIndex === idx || (uploadedUrls.length === 0 && idx === 0 && selectedCoverIndex === null)}
                        onChange={() => {
                          // track the selected index; when uploads complete we'll use the uploadedUrls[index]
                          setSelectedCoverIndex(idx)
                        }}
                      />
                      <span className="ml-1">Cover</span>
                    </label>
                    {Object.keys(progressMap).length > 0 ? (
                      <div className="text-xs text-muted-foreground">{Object.values(progressMap)[idx] ?? ""}%</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Uploading images...</p>
            </div>
          )}

          {uploadErrorMessage && (
            <div className="mt-3">
              <p className="text-sm text-red-600">Upload error: {uploadErrorMessage}</p>
              {serverDiagnostics && (
                <pre className="text-xs text-muted-foreground mt-2 max-h-40 overflow-auto whitespace-pre-wrap">
                  {serverDiagnostics}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting || !newStory.title.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Story"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

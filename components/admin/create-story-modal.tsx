"use client"

import React, { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"

export default function CreateStoryModal({ onCreated }: { onCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newStory, setNewStory] = useState({ title: "", content: "", excerpt: "", category: "experience" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null)
  const [serverDiagnostics, setServerDiagnostics] = useState<string | null>(null)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()
  const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "stories"

  const handleCreate = async () => {
    try {
      // Build payload matching the server-side schema (storyCreateSchema)
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 200)

      let coverImageUrl: string | undefined = undefined

      if (selectedFile) {
        // reset previous upload errors
        setUploadErrorMessage(null)
          try {
            setIsUploading(true)
            setUploadProgress(5)
            // Upload file to server endpoint which uses the service role key
            const filename = `${selectedFile.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`
            const uploadResp = await fetch(`/api/admin/uploads`, {
              method: "POST",
              headers: {
                "Content-Type": selectedFile.type || "application/octet-stream",
                "x-filename": filename,
              },
              body: selectedFile,
            })

            if (!uploadResp.ok) {
              const text = await uploadResp.text()
              console.error('Image upload failed', { status: uploadResp.status, text })
              setUploadErrorMessage(text || `Status ${uploadResp.status}`)
              setServerDiagnostics(text)
              toast({ title: 'Upload failed', description: text || `Status ${uploadResp.status}`, variant: 'error' })
              throw new Error(text || `Status ${uploadResp.status}`)
            }

            const json = await uploadResp.json()
            coverImageUrl = json.publicUrl
            setUploadProgress(100)
            // success indicator
            const okMsg = json.message || 'Upload complete'
            setUploadSuccessMessage(okMsg)
            setServerDiagnostics(null)
            setUploadErrorMessage(null)
            toast({ title: 'Upload complete', description: okMsg, variant: 'success' })
          } catch (uploadErr) {
            console.error("Upload error (caught)", uploadErr)
            throw uploadErr
          } finally {
            setIsUploading(false)
            setTimeout(() => setUploadProgress(null), 800)
          }
      }

      const payload = {
        title: newStory.title,
        slug: slugify(newStory.title || "untitled"),
        summary: newStory.excerpt || undefined,
        // author_name removed; server will resolve author from session (author_id)
        body: newStory.content || undefined,
        published: false,
        cover_image: coverImageUrl,
      }

      const resp = await fetch(`/api/admin/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (resp.status === 201) {
        toast({ title: "Created", description: "Story created", variant: "success" })
        setIsOpen(false)
        setNewStory({ title: "", content: "", excerpt: "", category: "experience" })
        setSelectedFile(null)
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        onCreated?.()
      } else {
        // Try to parse a JSON error structure from the server. We intentionally do NOT request
        // verbose diagnostics from the server to avoid exposing internal blobs to the browser.
        let json: any = null
        try {
          json = await resp.json()
        } catch (e) {
          // Fall back to text if JSON parsing fails
          const txt = await resp.text()
          console.error('Create story failed (non-json)', { status: resp.status, text: txt })
          const friendly = txt || `Status ${resp.status}`
          setUploadErrorMessage(friendly)
          setServerDiagnostics(null)
          toast({ title: 'Failed', description: friendly, variant: 'error' })
          return
        }

        // Prefer a short, user-friendly message. The server will return a concise `error` string
        // in most cases. Only store diagnostics if the server included a small diagnostics object.
        let shortMsg = 'An error occurred while creating the story.'
        if (json?.error) {
          if (typeof json.error === 'string') shortMsg = json.error
          else if (json.error?.message) shortMsg = json.error.message
          else shortMsg = String(json.error)
        }
        console.error('Create story failed', { status: resp.status, body: json })

        // If server included diagnostics (should be rare unless server-side debug was requested),
        // truncate to avoid leaking large blobs to the UI.
        const diag = json?.diagnostics ? JSON.stringify(json.diagnostics, null, 2) : null
        const truncate = (s: string | null, n = 600) => {
          if (!s) return null
          return s.length > n ? `${s.slice(0, n)}... [truncated]` : s
        }

        setUploadErrorMessage(shortMsg)
        setServerDiagnostics(truncate(diag, 800))
        toast({ title: 'Failed', description: shortMsg, variant: 'error' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: String(err), variant: "error" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          Add Story
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Story...</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Input value={newStory.excerpt} onChange={(e) => setNewStory({ ...newStory, excerpt: e.target.value })} />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea value={newStory.content} onChange={(e) => setNewStory({ ...newStory, content: e.target.value })} />
          </div>
          <div>
            <Label>Cover image (optional)</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files ? e.target.files[0] : null
                setSelectedFile(f)
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl)
                  setPreviewUrl(null)
                }
                if (f) {
                  try {
                    const url = URL.createObjectURL(f)
                    setPreviewUrl(url)
                  } catch (err) {
                    console.debug("Failed to create preview URL", err)
                  }
                }
              }}
            />

            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl} alt="preview" className="h-40 w-auto object-cover rounded-md" />
              </div>
            )}

            {isUploading && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Uploading image...</p>
                {uploadProgress !== null ? (
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, uploadProgress))}%` }}
                    />
                  </div>
                ) : null}
              </div>
            )}
            {uploadErrorMessage && (
              <div className="mt-2">
                <p className="text-sm text-red-600">Upload error: {uploadErrorMessage}</p>
                {serverDiagnostics && (
                  <pre className="text-xs text-muted-foreground mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{serverDiagnostics}</pre>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

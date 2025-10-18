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
  const [newStory, setNewStory] = useState({ title: "", content: "", author_name: "", excerpt: "", category: "experience" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null)
  const [serverDiagnostics, setServerDiagnostics] = useState<string | null>(null)
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
              toast({ title: 'Upload failed', description: text || `Status ${uploadResp.status}`, variant: 'error' })
              throw new Error(text || `Status ${uploadResp.status}`)
            }

            const json = await uploadResp.json()
            coverImageUrl = json.publicUrl
            setUploadProgress(100)
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
        body: newStory.content || undefined,
        published: false,
        cover_image: coverImageUrl,
      }

      const resp = await fetch(`/api/admin/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-debug": "1" },
        body: JSON.stringify(payload),
      })
      if (resp.status === 201) {
        toast({ title: "Created", description: "Story created", variant: "success" })
        setIsOpen(false)
        setNewStory({ title: "", content: "", author_name: "", excerpt: "", category: "experience" })
        setSelectedFile(null)
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        onCreated?.()
      } else {
        const text = await resp.text()
        // Surface RLS / server-side errors visibly in the modal upload area so admin users
        // can see that the failure was due to DB row-level security rather than the image upload.
        if (text && text.toLowerCase().includes("row-level security")) {
          const friendly =
            "Insert rejected by database row-level security. Ensure the server is using the Supabase service role key (SUPABASE_SERVICE_ROLE_KEY) or adjust RLS policies."
          console.error('Create story failed (RLS)', { status: resp.status, text })
          setUploadErrorMessage(friendly)
          setServerDiagnostics(text)
          toast({ title: "Failed", description: friendly, variant: "error" })
        } else {
          console.error('Create story failed', { status: resp.status, text })
          setUploadErrorMessage(text || `Status ${resp.status}`)
          setServerDiagnostics(text)
          toast({ title: "Failed", description: text, variant: "error" })
        }
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
          <DialogTitle>Add New Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} />
          </div>
          <div>
            <Label>Author Name</Label>
            <Input value={newStory.author_name} onChange={(e) => setNewStory({ ...newStory, author_name: e.target.value })} />
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

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
        try {
          setIsUploading(true)
          // create a unique path for the file
          const filename = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`
          const path = `stories/${filename}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, selectedFile, { cacheControl: "3600", upsert: false })

          if (uploadError) throw uploadError

          // get public URL
          const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path)
          // @ts-ignore publicData typing may vary depending on supabase client version
          coverImageUrl = publicData?.publicUrl || publicData?.public_url || undefined
        } finally {
          setIsUploading(false)
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (resp.status === 201) {
        toast({ title: "Created", description: "Story created", variant: "success" })
        setIsOpen(false)
        setNewStory({ title: "", content: "", author_name: "", excerpt: "", category: "experience" })
        setSelectedFile(null)
        onCreated?.()
      } else {
        const text = await resp.text()
        toast({ title: "Failed", description: text, variant: "error" })
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
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            />
            {isUploading && <p className="text-sm text-muted-foreground">Uploading image...</p>}
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

"use client"

import React, { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"

export default function CreateStoryModal({ onCreated }: { onCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newStory, setNewStory] = useState({ title: "", content: "", author_name: "", excerpt: "", category: "experience" })
  const { toast } = useToast()

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

      const payload = {
        title: newStory.title,
        slug: slugify(newStory.title || "untitled"),
        summary: newStory.excerpt || undefined,
        body: newStory.content || undefined,
        published: false,
        cover_image: undefined,
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

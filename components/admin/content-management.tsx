"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Camera, Clock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import Link from "next/link"
import CreateStoryModal from '@/components/admin/create-story-modal'

interface Story {
  id: string
  title: string
  content: string
  excerpt: string | null
  // author_id removed
  category: string
  status: string
  is_featured: boolean
  views_count: number
  image_url?: string | null
  cover_image?: string | null
  summary?: string | null
  tags: string[] | null
  state: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export function ContentManagement() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/admin/stories')
      if (!res.ok) {
        console.error('Failed to fetch /api/admin/stories', await res.text())
        setLoading(false)
        return
      }
      const json = await res.json()
      const rows = json?.data || []
      setStories(rows)

      // author_id/profile resolution removed; UI will not attempt to resolve authors
    } catch (e) {
      console.error('fetchStories error', e)
    } finally {
      setLoading(false)
    }
  }

  const filteredStories = stories.filter((story) => {
    const resolvedAuthor = ''.toString()
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resolvedAuthor.includes(searchTerm.toLowerCase()) ||
      story.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = selectedTab === "all" || story.status === selectedTab

    return matchesSearch && matchesTab
  })

  const stats = {
    total: stories.length,
    published: stories.filter((s) => s.status === "published").length,
    pending: stories.filter((s) => s.status === "pending").length,
    draft: stories.filter((s) => s.status === "draft").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "pending":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      })
      if (res.ok) {
        setStories((s) => s.map((st) => (st.id === id ? { ...st, status: "published" } : st)))
        toast({ title: "Approved", description: "Story published", variant: "success" })
      } else {
        console.error("Failed to approve story", await res.text())
        toast({ title: "Failed", description: "Could not publish story", variant: "error" })
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: String(err), variant: "error" })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })
      if (res.ok) {
        setStories((s) => s.map((st) => (st.id === id ? { ...st, status: "rejected" } : st)))
        toast({ title: "Rejected", description: "Story rejected", variant: "success" })
      } else {
        console.error("Failed to reject story", await res.text())
        toast({ title: "Failed", description: "Could not reject story", variant: "error" })
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: String(err), variant: "error" })
    }
  }

  const handleDelete = async (story: Story) => {
    const ok = window.confirm("Delete this story? This action cannot be undone.")
    if (!ok) return
    // optimistic UI: remove immediately, restore on error
    const prev = stories
    setStories((s) => s.filter((x) => x.id !== story.id))
    setDeletingId(story.id)
    toast({ title: "Deleting", description: "Deleting story...", variant: "info" })

    try {
      const resp = await fetch(`/api/admin/stories/${story.id}`, { method: "DELETE", credentials: "same-origin" })

      if (resp.status === 204) {
        toast({ title: "Deleted", description: "Story deleted successfully", variant: "success" })
        return
      }

      let bodyText = await resp.text()
      try {
        const parsed = JSON.parse(bodyText)
        bodyText = JSON.stringify(parsed, null, 2)
      } catch {}
      console.error(`Failed to delete story (status ${resp.status}):`, bodyText)
      // restore
      setStories(prev)
      toast({ title: "Failed to delete", description: `Status ${resp.status}: ${bodyText}`, variant: "error" })
    } catch (e: any) {
      console.error(e)
      setStories(prev)
      toast({ title: "Error", description: String(e), variant: "error" })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">CDS Stories Management</h3>
          <p className="text-sm text-muted-foreground">Manage stories submitted by corps members</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {stats.pending} Pending
          </Badge>
          <CreateStoryModal onCreated={() => fetchStories()} />
        </div>
      </div>

      {/* Stats (compact) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-3">
            <div className="text-xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Stories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xl font-bold text-primary">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xl font-bold text-accent">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-xl font-bold text-muted-foreground">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search stories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Stories ({stats.total})</TabsTrigger>
              <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({stats.draft})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story</TableHead>
                {/* <TableHead>Author</TableHead> */}
                {/* <TableHead>Category</TableHead> */}
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {(story.cover_image || story.image_url) ? (
                          <img src={story.cover_image || story.image_url || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="max-w-[300px]">
                        <div className="font-medium text-foreground">{story.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{(() => {
                          const txt = (story.excerpt as any) ?? (story.summary as any) ?? (story.content as any) ?? ""
                          return txt ? String(txt).substring(0, 100) + (String(txt).length > 100 ? "..." : "") : null
                        })()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Unknown</div>
                        <div className="text-xs text-muted-foreground">&nbsp;</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{story.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{story.views_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(story.status)}>{story.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(story.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedStory(story)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/stories/${story.id}`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(story)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deletingId === story.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                        {story.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(story.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(story.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Story Details Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Story Details</DialogTitle>
          </DialogHeader>
          {selectedStory && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStory.title}</h3>
                    <p className="text-muted-foreground">by Unknown</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedStory.category}</Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{formatDate(selectedStory.created_at)}</span>
                      {selectedStory.location && (
                        <>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{selectedStory.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant={getStatusColor(selectedStory.status)}>{selectedStory.status}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{selectedStory.views_count}</div>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{selectedStory.is_featured ? "Yes" : "No"}</div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{selectedStory.tags?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">Tags</p>
                </div>
              </div>

              {selectedStory.tags && selectedStory.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-3">Story Content</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground leading-relaxed">{selectedStory.content}</p>
                </div>
              </div>

              {selectedStory.status === "pending" && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => selectedStory && handleReject(selectedStory.id)}>Reject</Button>
                  <Button onClick={() => selectedStory && handleApprove(selectedStory.id)}>Approve</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

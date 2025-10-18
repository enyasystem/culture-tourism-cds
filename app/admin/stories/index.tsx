"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, MoreHorizontal, Plus, Eye, Edit, Trash2, Camera, Clock, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import Link from "next/link"
import CreateStoryModal from '@/components/admin/create-story-modal'
import { useRouter } from "next/navigation"

interface Story {
  id: string
  title: string
  content: string
  excerpt: string | null
  summary?: string | null
  // author_id removed
  category: string
  status: string
  is_featured: boolean
  views_count: number
  image_url?: string | null
  cover_image?: string | null
  tags: string[] | null
  state: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  // author/profile resolution removed
  const [serviceRoleExists, setServiceRoleExists] = useState<boolean | null>(null)

  useEffect(() => {
    fetchStories()
    // check server-side service role presence
    ;(async () => {
      try {
        const res = await fetch('/api/admin/service-role-exists')
        if (res.ok) {
          const json = await res.json()
          setServiceRoleExists(Boolean(json.exists))
        } else {
          setServiceRoleExists(false)
        }
      } catch (e) {
        console.error('Failed to check service role key', e)
        setServiceRoleExists(false)
      }
    })()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/admin/stories')
      if (!res.ok) {
        const t = await res.text()
        console.error('Failed to fetch /api/admin/stories', res.status, t)
        setLoading(false)
        return
      }
      const json = await res.json()
      const rows = json?.data || []
      setStories(rows)

      // author/profile resolution removed
      setLoading(false)
    } catch (e) {
      console.error('fetchStories error', e)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        {serviceRoleExists === false && (
          <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
            <strong>Server configuration missing:</strong> SUPABASE_SERVICE_ROLE_KEY is not configured on the server. Admin actions like creating stories with images require the Supabase service role key to bypass database row-level security. Set the env var on your server and restart the app.
          </div>
        )}
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Stories</h1>
            <p className="text-muted-foreground">Manage corps member stories and experiences...</p>
          </div>
          <CreateStoryModal onCreated={() => fetchStories()} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Stories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{stats.published}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-accent">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-muted-foreground">{stats.draft}</div>
              <p className="text-sm text-muted-foreground">Draft</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Stories Table */}
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
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
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
                            <img
                              src={story.cover_image || story.image_url || "/placeholder.svg"}
                              alt={story.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="max-w-[300px]">
                          <div className="font-medium text-foreground">{story.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {(() => {
                              const txt = (story.excerpt as any) ?? (story.summary as any) ?? (story.content as any) ?? ""
                              return txt ? String(txt).substring(0, 100) + (String(txt).length > 100 ? "..." : "") : null
                            })()}
                          </div>
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
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={async () => {
                              const ok = window.confirm("Delete this story? This action cannot be undone.")
                              if (!ok) return
                              // optimistic remove
                              const prev = stories
                              setStories((s) => s.filter((x) => x.id !== story.id))
                              setDeletingId(story.id)
                              toast({ title: "Deleting", description: "Deleting story...", variant: "info" })

                              try {
                                const resp = await fetch(`/api/admin/stories/${story.id}`, {
                                  method: "DELETE",
                                  credentials: 'same-origin',
                                })

                                if (resp.status === 204) {
                                  toast({ title: "Deleted", description: "Story deleted successfully", variant: "success" })
                                  return
                                }

                                // not 204, try to surface server message
                                let bodyText = await resp.text()
                                try {
                                  const parsed = JSON.parse(bodyText)
                                  console.debug('DELETE response JSON:', parsed)
                                  bodyText = JSON.stringify(parsed, null, 2)
                                } catch {
                                  // keep raw text
                                }
                                console.error(`Failed to delete story (status ${resp.status}):`, bodyText)
                                setStories(prev)
                                toast({ title: "Failed to delete", description: `Status ${resp.status}: ${bodyText}`, variant: "error" })
                              } catch (e: any) {
                                console.error(e)
                                setStories(prev)
                                toast({ title: "Error", description: String(e), variant: "error" })
                              } finally {
                                setDeletingId(null)
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deletingId === story.id ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
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
                    <Button variant="outline">Reject</Button>
                    <Button>Approve</Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

"use client"
import { StatsCard } from "@/components/admin/stats-card"
import { ContentManagement } from "@/components/admin/content-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Camera, TrendingUp, Eye, Heart, MessageCircle, BarChart3, Plus, ArrowRight, Clock, Zap } from "lucide-react"
import StoryForm from '@/components/admin/story-form'
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

// Sidebar data will be fetched dynamically and stored in component state

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, sites: 0, events: 0, stories: 0 })
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [topContent, setTopContent] = useState<any[]>([])
  const [showStoryForm, setShowStoryForm] = useState(false)

  useEffect(() => {
    const fetchCounts = async () => {
      setLoadingCounts(true)
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        // user_profiles
        const u = await supabase.from("user_profiles").select("id", { count: "exact", head: true })
        // cultural_sites
        const s = await supabase.from("cultural_sites").select("id", { count: "exact", head: true })
        // events
        const e = await supabase.from("events").select("id", { count: "exact", head: true })
        // stories
        const st = await supabase.from("stories").select("id", { count: "exact", head: true })

        setCounts({
          users: (u.count as number) || 0,
          sites: (s.count as number) || 0,
          events: (e.count as number) || 0,
          stories: (st.count as number) || 0,
        })
      } catch (err) {
        console.error("Failed to fetch admin counts:", err)
      } finally {
        setLoadingCounts(false)
      }
    }

    const fetchSidebar = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        // Recent stories (latest 4)
        const { data: storiesData } = await supabase
          .from("stories")
          .select("id,title,author_id,created_at,views_count")
          .order("created_at", { ascending: false })
          .limit(4)

        // Recent events (latest 4)
        const { data: eventsData } = await supabase
          .from("events")
          .select("id,title,created_by,created_at")
          .order("created_at", { ascending: false })
          .limit(4)

        // Top content by views across stories and sites (simple approach: top 3 stories + top 3 sites sorted client-side)
        const { data: topStories } = await supabase
          .from("stories")
          .select("id,title,views_count,created_at")
          .order("views_count", { ascending: false })
          .limit(3)

        const { data: topSites } = await supabase
          .from("cultural_sites")
          .select("id,name AS title,views_count,created_at")
          .order("views_count", { ascending: false })
          .limit(3)

        // Map recent activity items
        const recent: Array<any> = []
        if (storiesData) {
          storiesData.forEach((s: any) =>
            recent.push({
              id: s.id,
              type: "story_posted",
              message: `New story: ${s.title}`,
              user: s.author_id || "Unknown",
              timestamp: new Date(s.created_at).toLocaleString(),
            }),
          )
        }
        if (eventsData) {
          eventsData.forEach((ev: any) =>
            recent.push({
              id: ev.id,
              type: "event_created",
              message: `Event: ${ev.title}`,
              user: ev.created_by || "Admin",
              timestamp: new Date(ev.created_at).toLocaleString(),
            }),
          )
        }

        // sort recent by created_at descending (they already were fetched descending but merged list needs sorting)
        recent.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

        // Map topContent (merge topStories and topSites into one list sorted by views)
        const top: Array<any> = []
        if (topStories) topStories.forEach((t: any) => top.push({ id: t.id, title: t.title, views: t.views_count ?? 0, type: "story" }))
        if (topSites) topSites.forEach((t: any) => top.push({ id: t.id, title: t.title, views: t.views_count ?? 0, type: "site" }))
        top.sort((a, b) => (b.views || 0) - (a.views || 0))

        // update local state
        setRecentActivity(recent.slice(0, 6))
        setTopContent(top.slice(0, 3))
      } catch (err) {
        console.error("Failed to fetch sidebar data:", err)
      }
    }

    // Run both in parallel
    fetchCounts()
    fetchSidebar()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-lg">Welcome back. Here's what's happening on your platform today.</p>
          </div>
          <Button onClick={() => setShowStoryForm(!showStoryForm)} className="gap-2">
            {showStoryForm ? "Cancel" : "Add Story"}
          </Button>
        </div>

        {/* Story Form */}
        {showStoryForm && (
          <div className="mb-8">
            <StoryForm 
              onCreated={() => {
                setShowStoryForm(false)
                // refresh counts if needed
              }}
              onCancel={() => setShowStoryForm(false)}
            />
          </div>
        )}

        {/* Key Metrics Grid - Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Sites Card */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Cultural Sites</p>
                  <p className="text-3xl font-bold text-foreground">{loadingCounts ? "..." : counts.sites}</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">Total locations</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 hover:border-l-purple-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Active Events</p>
                  <p className="text-3xl font-bold text-foreground">{loadingCounts ? "..." : counts.events}</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">Upcoming & ongoing</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stories Card */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 hover:border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Stories Shared</p>
                  <p className="text-3xl font-bold text-foreground">{loadingCounts ? "..." : counts.stories}</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">Corps member content</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 hover:border-l-orange-600">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-foreground">{loadingCounts ? "..." : counts.users}</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">Total members</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/admin/content">
                  <Button variant="outline" className="w-full h-auto py-4 px-4 flex-col gap-3 hover:bg-primary/5 hover:border-primary transition-all">
                    <Camera className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Manage Stories</div>
                      <div className="text-xs text-muted-foreground">Edit & moderate content</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/sites">
                  <Button variant="outline" className="w-full h-auto py-4 px-4 flex-col gap-3 hover:bg-primary/5 hover:border-primary transition-all">
                    <MapPin className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Cultural Sites</div>
                      <div className="text-xs text-muted-foreground">Manage locations</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/events">
                  <Button variant="outline" className="w-full h-auto py-4 px-4 flex-col gap-3 hover:bg-primary/5 hover:border-primary transition-all">
                    <Calendar className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Create Event</div>
                      <div className="text-xs text-muted-foreground">Schedule new activities</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full h-auto py-4 px-4 flex-col gap-3 hover:bg-primary/5 hover:border-primary transition-all">
                    <BarChart3 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Platform Settings</div>
                      <div className="text-xs text-muted-foreground">Configure platform</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                At a Glance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Content Health</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Good</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User Activity</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-between text-primary hover:text-primary mt-4">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Section */}
        <div className="mb-10">
          <ContentManagement />
        </div>
      </div>
    </div>
  )
}

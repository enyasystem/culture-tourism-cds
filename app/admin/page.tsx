"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { StatsCard } from "@/components/admin/stats-card"
import { ContentManagement } from "@/components/admin/content-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Camera, TrendingUp, Eye, Heart, MessageCircle, BarChart3, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

// Sidebar data will be fetched dynamically and stored in component state

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, sites: 0, events: 0, stories: 0 })
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [topContent, setTopContent] = useState<any[]>([])

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
          .select("id,title,author_name,created_at,views_count")
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
              user: s.author_name || "Unknown",
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
    <AdminLayout currentPath="/admin">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Jos Culture & Tourism Platform Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              Platform Growing
            </Badge>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* <StatsCard
            title="Total Corps Members"
            value={loadingCounts ? "..." : String(counts.users)}
            change=""
            changeType="positive"
            icon={Users}
          /> */}
          <StatsCard
            title="Cultural Sites"
            value={loadingCounts ? "..." : String(counts.sites)}
            change=""
            changeType="positive"
            icon={MapPin}
          />
          <StatsCard
            title="Active Events"
            value={loadingCounts ? "..." : String(counts.events)}
            change=""
            changeType="neutral"
            icon={Calendar}
          />
          <StatsCard
            title="Stories Shared"
            value={loadingCounts ? "..." : String(counts.stories)}
            change=""
            changeType="neutral"
            icon={Camera}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Content Management */}
          <div className="lg:col-span-2">
            <ContentManagement />
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContent.map((content) => (
                  <div key={content.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground line-clamp-1">{content.title}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {content.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{content.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{content.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{content.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <MapPin className="w-6 h-6" />
                <span>Add Cultural Site</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Calendar className="w-6 h-6" />
                <span>Create Event</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Users className="w-6 h-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <BarChart3 className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

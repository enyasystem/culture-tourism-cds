"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { StatsCard } from "@/components/admin/stats-card"
import { ContentManagement } from "@/components/admin/content-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Camera, TrendingUp, Eye, Heart, MessageCircle, BarChart3, Plus } from "lucide-react"

const recentActivity = [
  {
    id: 1,
    type: "user_joined",
    message: "New corps member joined the platform",
    user: "Kemi Adebayo",
    timestamp: "5 minutes ago",
  },
  {
    id: 2,
    type: "story_posted",
    message: "New story posted about Jos Wildlife Park",
  user: "Ibrahim Musa",
    timestamp: "12 minutes ago",
  },
  {
    id: 3,
    type: "event_created",
    message: "Cultural festival event created",
    user: "Admin User",
    timestamp: "1 hour ago",
  },
  {
    id: 4,
    type: "site_visited",
    message: "High traffic on Shere Hills page",
    user: "System",
    timestamp: "2 hours ago",
  },
]

const topContent = [
  {
    id: 1,
    title: "Jos Wildlife Park Experience",
    type: "story",
    views: 1240,
    likes: 89,
    comments: 23,
  },
  {
    id: 2,
    title: "Cultural Festival 2025",
    type: "event",
    views: 2100,
    likes: 156,
    comments: 45,
  },
  {
    id: 3,
    title: "Shere Hills Hiking Guide",
    type: "site",
    views: 1850,
    likes: 134,
    comments: 31,
  },
]

export default function AdminDashboard() {
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
          <StatsCard
            title="Total Corps Members"
            value="245"
            change="+12 this week"
            changeType="positive"
            icon={Users}
          />
          <StatsCard title="Cultural Sites" value="52" change="+3 this month" changeType="positive" icon={MapPin} />
          <StatsCard title="Active Events" value="12" change="6 upcoming" changeType="neutral" icon={Calendar} />
          <StatsCard title="Stories Shared" value="189" change="+8 pending review" changeType="neutral" icon={Camera} />
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

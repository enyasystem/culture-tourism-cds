"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Eye, Heart, Camera, Download } from "lucide-react"

const monthlyData = [
  { month: "Jan", users: 45, stories: 12, events: 3, sites: 2 },
  { month: "Feb", users: 78, stories: 23, events: 5, sites: 3 },
  { month: "Mar", users: 120, stories: 34, events: 8, sites: 4 },
  { month: "Apr", users: 156, stories: 45, events: 12, sites: 6 },
  { month: "May", users: 189, stories: 67, events: 15, sites: 8 },
  { month: "Jun", users: 234, stories: 89, events: 18, sites: 12 },
]

const engagementData = [
  { date: "Jan 15", views: 1200, likes: 89, comments: 23 },
  { date: "Jan 16", views: 1450, likes: 102, comments: 31 },
  { date: "Jan 17", views: 1680, likes: 134, comments: 28 },
  { date: "Jan 18", views: 1890, likes: 156, comments: 45 },
  { date: "Jan 19", views: 2100, likes: 178, comments: 52 },
  { date: "Jan 20", views: 2340, likes: 201, comments: 67 },
]

const categoryData = [
  { name: "Culture", value: 35, color: "#8b5cf6" },
  { name: "Adventure", value: 28, color: "#06b6d4" },
  { name: "Experience", value: 22, color: "#10b981" },
  { name: "Leisure", value: 15, color: "#f59e0b" },
]

const topContent = [
  {
    title: "Jos Wildlife Park Experience",
    type: "Story",
    views: 2340,
    engagement: 89,
    author: "Adaora Okafor",
  },
  {
    title: "Cultural Festival 2025",
    type: "Event",
    views: 2100,
    engagement: 156,
    author: "Admin",
  },
  {
    title: "Shere Hills Hiking Guide",
    type: "Site",
    views: 1850,
    engagement: 134,
    author: "David Okonkwo",
  },
  {
    title: "Traditional Music Workshop",
    type: "Event",
    views: 1680,
    engagement: 102,
    author: "Cultural Heritage Foundation",
  },
  {
    title: "Jos Main Market Discovery",
    type: "Story",
    views: 1450,
    engagement: 78,
    author: "Ibrahim Musa",
  },
]

export default function AnalyticsPage() {
  return (
    <AdminLayout currentPath="/admin/analytics">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Platform insights and performance metrics</p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">245</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <span className="text-accent">+12%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">12.4K</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <span className="text-accent">+18%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl font-bold text-foreground">8.6%</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingDown className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">-2%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Content</p>
                  <p className="text-2xl font-bold text-foreground">189</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <span className="text-accent">+8</span>
                    <span className="text-muted-foreground">this week</span>
                  </div>
                </div>
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8b5cf6" name="Users" />
                  <Bar dataKey="stories" fill="#06b6d4" name="Stories" />
                  <Bar dataKey="events" fill="#10b981" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="likes" stroke="#06b6d4" strokeWidth={2} name="Likes" />
                  <Line type="monotone" dataKey="comments" stroke="#10b981" strokeWidth={2} name="Comments" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Content Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-sm font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{content.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">by {content.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <span>{content.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-muted-foreground" />
                          <span>{content.engagement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="geography">Geography</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">User Growth</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>New Users (This Month)</span>
                        <span className="font-medium">56</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Returning Users</span>
                        <span className="font-medium">189</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">User Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily Active Users</span>
                        <span className="font-medium">78</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Weekly Active Users</span>
                        <span className="font-medium">156</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">189</div>
                    <p className="text-sm text-muted-foreground">Total Stories</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">52</div>
                    <p className="text-sm text-muted-foreground">Cultural Sites</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">18</div>
                    <p className="text-sm text-muted-foreground">Active Events</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Engagement Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Likes per Story</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Comments per Story</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Share Rate</span>
                        <span className="font-medium">12%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Content Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Most Viewed Category</span>
                        <span className="font-medium">Culture</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Best Performing Day</span>
                        <span className="font-medium">Saturday</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Peak Activity Time</span>
                        <span className="font-medium">2-4 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="geography" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-4">User Distribution by LGA</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Jos North</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-24 h-2" />
                        <span className="text-sm font-medium">110</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Jos South</span>
                      <div className="flex items-center gap-2">
                        <Progress value={35} className="w-24 h-2" />
                        <span className="text-sm font-medium">86</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Jos East</span>
                      <div className="flex items-center gap-2">
                        <Progress value={20} className="w-24 h-2" />
                        <span className="text-sm font-medium">49</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

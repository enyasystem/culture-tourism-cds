"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Eye, Clock, AlertCircle } from "lucide-react"

const pendingContent = [
  {
    id: 1,
    type: "story",
    title: "Amazing Day at Jos Wildlife Park",
    author: "Adaora Okafor",
    authorId: "PL/23B/1234",
    avatar: "/placeholder.svg?key=avatar1",
    submittedAt: "2025-01-16T10:30:00Z",
    status: "pending",
    content: "Had the most incredible experience at the wildlife park today...",
    images: 3,
  },
  {
    id: 2,
    type: "site",
    title: "New Cultural Center in Jos East",
    author: "Ibrahim Musa",
    authorId: "PL/23B/5678",
    avatar: "/placeholder.svg?key=avatar2",
    submittedAt: "2025-01-15T14:20:00Z",
    status: "pending",
    content: "Discovered this amazing new cultural center that showcases...",
    images: 5,
  },
  {
    id: 3,
    type: "event",
    title: "Traditional Music Workshop",
    author: "Fatima Abdullahi",
    authorId: "PL/23B/9012",
    avatar: "/placeholder.svg?key=avatar3",
    submittedAt: "2025-01-15T09:15:00Z",
    status: "pending",
    content: "Organizing a traditional music workshop for corps members...",
    images: 2,
  },
]

const recentActions = [
  {
    id: 1,
    action: "approved",
    content: "Jos Main Market Cultural Tour",
    author: "Chioma Eze",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    action: "rejected",
    content: "Inappropriate content submission",
    author: "Anonymous User",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    action: "approved",
    content: "Shere Hills Photography Event",
    author: "David Okonkwo",
    timestamp: "6 hours ago",
  },
]

export function ContentManagement() {
  const [selectedTab, setSelectedTab] = useState("pending")

  const handleApprove = (id: number) => {
    console.log("Approving content:", id)
    // TODO: Implement approval logic
  }

  const handleReject = (id: number) => {
    console.log("Rejecting content:", id)
    // TODO: Implement rejection logic
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Content Management</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {pendingContent.length} Pending
          </Badge>
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            Review Required
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingContent.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingContent.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.author} />
                      <AvatarFallback>
                        {item.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.authorId}
                        </Badge>
                        <span>•</span>
                        <span>{formatTimeAgo(item.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {item.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{item.content}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {item.images > 0 && `${item.images} images attached`}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReject(item.id)}>
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(item.id)}>
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentActions.map((action) => (
            <Card key={action.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        action.action === "approved" ? "bg-accent" : "bg-destructive"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {action.action === "approved" ? "Approved" : "Rejected"}: {action.content}
                      </p>
                      <p className="text-sm text-muted-foreground">by {action.author}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{action.timestamp}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

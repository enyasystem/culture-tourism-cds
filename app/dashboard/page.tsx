import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's contributions
  const { data: userSites } = await supabase.from("cultural_sites").select("*").eq("created_by", user.id)

  const { data: userEvents } = await supabase.from("events").select("*").eq("created_by", user.id)

  const { data: userStories } = await supabase.from("stories").select("*").eq("author_id", user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome back, {profile?.full_name || user.email}!</h1>
          <p className="text-gray-600">Manage your contributions to the Culture & Tourism CDS platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cultural Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userSites?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Events Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userEvents?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stories Shared</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{userStories?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-green-600">Active</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/sites/new">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">Add Cultural Site</Button>
              </Link>
              <Link href="/events/new">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">Create Cultural Event</Button>
              </Link>
              <Link href="/stories/new">
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">Share Your Story</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStories?.slice(0, 3).map((story) => (
                  <div key={story.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{story.title}</p>
                      <p className="text-xs text-gray-500">{new Date(story.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {(!userStories || userStories.length === 0) && (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

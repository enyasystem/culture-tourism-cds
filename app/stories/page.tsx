import { createClient } from "@/lib/supabase/server"
import { storyDbSelect } from "@/lib/schemas/stories"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { StoriesClient } from "@/components/stories/stories-client"

// Server component: fetch initial published stories and pass to the client
export default async function StoriesPage() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("stories")
      .select(storyDbSelect)
      .eq("published", true)
      .order("created_at", { ascending: false })

    const safe = Array.isArray(data)
      ? data.map((row: any) => ({
          id: row.id != null ? String(row.id) : "",
          title: row.title || "",
          content: row.summary || row.excerpt || row.body || "",
          images: Array.isArray(row.images)
            ? row.images
            : row.images
            ? [row.images]
            : row.cover_image
            ? [row.cover_image]
            : [],
          date: row.created_at || row.published_at || null,
          tags: Array.isArray(row.tags) ? row.tags : row.tags ? [row.tags] : [],
        }))
      : []

    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <StoriesClient initialStories={safe} />
        <Footer />
      </main>
    )
  } catch (err) {
    console.error('[stories page] server fetch failed', err)
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-[300px] flex items-center justify-center">Failed to load stories.</div>
        <Footer />
      </main>
    )
  }
}

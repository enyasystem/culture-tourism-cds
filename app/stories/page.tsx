import { createClient } from "@/lib/supabase/server"
import { storyDbSelect } from "@/lib/schemas/stories"
import { resolveImageUrl } from "@/lib/image-utils"
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
      ? data.map((row: any) => {
          const id = row.id != null ? String(row.id) : ""
          const title = row.title || ""
          const content = row.summary || row.excerpt || row.body || ""

          // Normalize images array (accept arrays, JSON strings, single string)
          let images: any[] = []
          if (Array.isArray(row?.images)) images = row.images
          else if (typeof row?.images === "string") {
            try {
              const parsed = JSON.parse(row.images)
              images = Array.isArray(parsed) ? parsed : [row.images]
            } catch {
              images = [row.images]
            }
          } else if (row?.cover_image) images = [row.cover_image]

          // Resolve storage paths to public URLs when appropriate
          images = (images || []).map((p) => resolveImageUrl(typeof p === "string" ? p : String(p))).filter(Boolean as any)
          const cover_image = resolveImageUrl(row?.cover_image)

          const date = row.created_at || row.published_at || null
          const tags = Array.isArray(row.tags) ? row.tags : row.tags ? [row.tags] : []

          return { id, title, content, cover_image, images, date, tags }
        })
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

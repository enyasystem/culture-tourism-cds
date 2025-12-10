import { createClient } from "@/lib/supabase/server"
import { storyDbSelect } from "@/lib/schemas/stories"
import { resolveImageUrl } from "@/lib/image-utils"
import { type NextRequest, NextResponse } from "next/server"

// Public GET-only handler for stories (minimal & robust)
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const url = new URL(request.url)
  const category = url.searchParams.get("category")
  const state = url.searchParams.get("state")
  const featured = url.searchParams.get("featured")
  const search = url.searchParams.get("search")

  try {
    // Adaptive select: split the configured select into columns we can
    // iteratively trim if Postgres complains a column is missing.
    let selectCols = storyDbSelect.split(",").map((s) => s.trim()).filter(Boolean)

    // Ensure minimal required columns exist
    if (!selectCols.includes("id") || !selectCols.includes("title")) {
      console.debug("[api/stories] required columns missing from select", selectCols)
      return NextResponse.json([], { status: 200 })
    }

    let lastError: any = null
    let rows: any[] = []

    for (let attempt = 0; attempt < 8; attempt++) {
      const cols = selectCols.join(",")
      let query: any = supabase.from("stories").select(cols).order("created_at", { ascending: false })

      // apply filters only if those columns are present
      query = query.eq("published", true)
      if (category && selectCols.includes("category")) query = query.eq("category", category)
      if (state && selectCols.includes("state")) query = query.eq("state", state)
      if (featured === "true" && selectCols.includes("is_featured")) query = query.eq("is_featured", true)

      if (search) {
        const q = `%${search}%`
        const searchCols = ["title", "summary", "excerpt", "body"].filter((c) => selectCols.includes(c))
        if (searchCols.length > 0) {
          query = query.or(searchCols.map((c) => `${c}.ilike.${q}`).join(","))
        }
      }

      const { data, error } = await query
      if (!error) {
        rows = data || []
        lastError = null
        break
      }

      lastError = error
      console.debug("[api/stories] query error", error)

      // If Postgres reports a missing column (42703), remove it and retry
      if (error?.code === "42703" && typeof error.message === "string") {
        const m = error.message.match(/column\s+(?:[\w.]+\.)?"?([a-z0-9_]+)"?\s+does not exist/i)
        const missing = m ? m[1] : null
        if (missing && selectCols.includes(missing)) {
          selectCols = selectCols.filter((c) => c !== missing)
          continue
        }
      }

      // otherwise stop retrying
      break
    }

    if (lastError) {
      console.debug("[api/stories] final query error, returning fallback sample data", lastError)

      // Temporary fallback for local dev when Supabase is unreachable.
      // Returns a few sample stories using images from the `public/` folder so thumbnails render.
      const fallback = [
        {
          id: "fallback-1",
          title: "A Day at Jos Wildlife Park",
          summary: "We spent the day exploring the trails at Jos Wildlife Park...",
          cover_image: "/visit-wildlife-renamed/jos-wildlife-20251204-090248-2-1.jpg",
          images: [
            "/visit-wildlife-renamed/jos-wildlife-20251204-090248-2-1.jpg",
            "/visit-wildlife-renamed/jos-wildlife-20251204-090248-3-1.jpg",
          ],
          published: true,
        },
        {
          id: "fallback-2",
          title: "My First Visit to Jos Museum",
          summary: "Walking through the halls of Jos Museum was like taking a journey through time...",
          cover_image: "/national-museum-jos-cultural-artifacts.jpg",
          images: ["/national-museum-jos-cultural-artifacts.jpg"],
          published: true,
        },
        {
          id: "fallback-3",
          title: "The Legend of Shere Hills",
          summary: "Local elders speak of Shere Hills with reverence...",
          cover_image: "/shere-hills-jos-plateau-landscape.jpg",
          images: ["/shere-hills-jos-plateau-landscape.jpg"],
          published: true,
        },
      ]

      return NextResponse.json(fallback, { status: 200 })
    }

    const normalized = (rows || []).map((row: any) => {
      const id = row?.id != null ? String(row.id) : undefined

      // Normalize images: accept arrays, single strings, or JSON-stringified arrays
      let images: any = []
      if (Array.isArray(row?.images)) {
        images = row.images
      } else if (typeof row?.images === 'string') {
        try {
          const parsed = JSON.parse(row.images)
          images = Array.isArray(parsed) ? parsed : [row.images]
        } catch (e) {
          images = [row.images]
        }
      } else if (row?.cover_image) {
        images = [row.cover_image]
      }

      // Convert storage paths to public URLs when applicable
      images = (images || []).map((p: any) => resolveImageUrl(typeof p === 'string' ? p : String(p)) ).filter(Boolean)

      // normalize cover_image similarly
      const cover = resolveImageUrl(row?.cover_image)

      const tags = Array.isArray(row?.tags) ? row.tags : row?.tags ? [row.tags] : []
      const content = (row?.summary as string) || (row?.excerpt as string) || (row?.body as string) || ''

      return { ...(row || {}), id, images, cover_image: cover, tags, content }
    })

    return NextResponse.json(normalized)
  } catch (err) {
    console.error("[api/stories] unexpected error", err)
    return NextResponse.json([], { status: 200 })
  }
}

import { createClient } from "@/lib/supabase/server"
import { storyDbSelect } from "@/lib/schemas/stories"
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
      console.debug("[api/stories] final query error, returning empty array", lastError)
      return NextResponse.json([], { status: 200 })
    }

    const normalized = (rows || []).map((row: any) => {
      const id = row?.id != null ? String(row.id) : undefined
      const images = Array.isArray(row?.images)
        ? row.images
        : row?.images
        ? [row.images]
        : row?.cover_image
        ? [row.cover_image]
        : []

      const tags = Array.isArray(row?.tags) ? row.tags : row?.tags ? [row.tags] : []
      const content = (row?.summary as string) || (row?.excerpt as string) || (row?.body as string) || ''

      return { ...(row || {}), id, images, tags, content }
    })

    return NextResponse.json(normalized)
  } catch (err) {
    console.error("[api/stories] unexpected error", err)
    return NextResponse.json([], { status: 200 })
  }
}

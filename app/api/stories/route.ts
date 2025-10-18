import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category")
  const state = searchParams.get("state")
  const featured = searchParams.get("featured")
  const search = searchParams.get("search")

  try {
    // Build base query (we'll try with the status filter first, but if the
    // `status` column doesn't exist in the DB we'll retry without it so the
    // site can still render rows).
    const buildQuery = (includeStatus = true) => {
      let q: any = supabase.from("stories").select("*").order("created_at", { ascending: false })
      if (includeStatus) q = q.or('status.eq.published,published.eq.true')
      else q = q.eq('published', true)
      if (category) q = q.eq("category", category)
      if (state) q = q.eq("state", state)
      if (featured === "true") q = q.eq("is_featured", true)
      if (search) q = q.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      return q
    }

    // First attempt: query with status filter
    let { data, error } = await buildQuery(true)

    // If Postgres reports a missing column (42703 / "does not exist"), retry
    // without the status filter to remain resilient to schema differences.
    if (error) {
      const msg = String(error.message || '')
      const isMissingColumn = /does not exist/i.test(msg) || (error.code === '42703')
      if (isMissingColumn) {
        console.debug('[api/stories] detected missing column while filtering by status, retrying without status filter')
        const retry = await buildQuery(false)
        const { data: retryData, error: retryErr } = await retry
        if (retryErr) {
          return NextResponse.json({ error: retryErr.message || String(retryErr) }, { status: 500 })
        }

        // Normalize rows: ensure images and tags are always arrays
        const normalized = (retryData || []).map((row: any) => ({
          ...row,
          images: Array.isArray(row?.images)
            ? row.images
            : row?.images
            ? [row.images]
            : row?.cover_image
            ? [row.cover_image]
            : row?.image_url
            ? [row.image_url]
            : [],
          tags: Array.isArray(row?.tags) ? row.tags : row?.tags ? [row.tags] : [],
        }))

        return NextResponse.json(normalized)
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Normalize rows: ensure images and tags are always arrays
    const normalized = (data || []).map((row: any) => ({
      ...row,
      images: Array.isArray(row?.images)
        ? row.images
        : row?.images
        ? [row.images]
        : row?.cover_image
        ? [row.cover_image]
        : row?.image_url
        ? [row.image_url]
        : [],
      tags: Array.isArray(row?.tags) ? row.tags : row?.tags ? [row.tags] : [],
    }))

    return NextResponse.json(normalized)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {

    const body = await request.json()
    // We no longer attach author_id on public story creation; server-side
    // operations that need to record authors should do so explicitly via
    // admin endpoints with the service role key.
    const { data, error } = await supabase
      .from("stories")
      .insert({
        ...body,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

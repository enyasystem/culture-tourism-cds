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
    let query = supabase.from("stories").select("*").eq("status", "published").order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }
    if (state) {
      query = query.eq("state", state)
    }
    if (featured === "true") {
      query = query.eq("is_featured", true)
    }
    if (search) {
      // author_name removed; search title and content only
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
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

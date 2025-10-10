import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const eventType = searchParams.get("event_type")
  const state = searchParams.get("state")
  const featured = searchParams.get("featured")
  const upcoming = searchParams.get("upcoming")
  const search = searchParams.get("search")

  try {
    let query = supabase.from("events").select("*").eq("status", "active").order("start_date", { ascending: true })

    if (eventType) {
      query = query.eq("event_type", eventType)
    }
    if (state) {
      query = query.eq("state", state)
    }
    if (featured === "true") {
      query = query.eq("is_featured", true)
    }
    if (upcoming === "true") {
      query = query.gte("start_date", new Date().toISOString())
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`)
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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { data, error } = await supabase
      .from("events")
      .insert({
        ...body,
        created_by: user.id,
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

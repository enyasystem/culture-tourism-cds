import { NextResponse } from "next/server"
import { pageCreateSchema, pageDbSelect } from "@/lib/schemas/pages"

// GET list, POST create
export async function GET(req: Request) {
  // List pages (public can see published only) – admin UI will call this via
  // server-side with service role when needed. For now return all published pages.
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL! + "/rest/v1/pages")
    url.searchParams.set("select", pageDbSelect)
    // Allow optional pagination
    const page = url.searchParams.get("page") || "1"

    const resp = await fetch(url.toString(), {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
        Accept: "application/json",
      },
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text }, { status: resp.status })
    }

    const data = await resp.json()
    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // Create a new page (admin only). Validate input with Zod.
  try {
    const body = await req.json()
    const parsed = pageCreateSchema.parse(body)

    // Use service role key server-side to insert
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/pages`
    const resp = await fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: svcKey || "",
        Authorization: `Bearer ${svcKey || ""}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(parsed),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text }, { status: resp.status })
    }

    const created = await resp.json()
    return NextResponse.json({ data: created[0] }, { status: 201 })
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ error: e.errors }, { status: 400 })
    }
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

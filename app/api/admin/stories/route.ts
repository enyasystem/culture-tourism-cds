import { NextResponse } from "next/server"
import { storyCreateSchema, storyDbSelect } from "@/lib/schemas/stories"

// GET list, POST create
export async function GET(req: Request) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL! + "/rest/v1/stories")
    url.searchParams.set("select", storyDbSelect)
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
  try {
    const body = await req.json()
    console.debug('[api/admin/stories] POST body:', body)
    const parsed = storyCreateSchema.parse(body)
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`
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
      console.debug('[api/admin/stories] supabase response error:', resp.status, text)
      try {
        const parsedErr = JSON.parse(text)
        return NextResponse.json({ error: parsedErr }, { status: resp.status })
      } catch {
        return NextResponse.json({ error: text }, { status: resp.status })
      }
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

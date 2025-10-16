import { NextResponse } from "next/server"
import { storyUpdateSchema, storyDbSelect } from "@/lib/schemas/stories"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories?id=eq.${id}&select=${storyDbSelect}`
    const resp = await fetch(url, {
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
    const item = Array.isArray(data) && data.length ? data[0] : null
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ data: item })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const body = await req.json()
    const parsed = storyUpdateSchema.parse(body)
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories?id=eq.${id}`
    const resp = await fetch(url, {
      method: "PATCH",
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
    const updated = await resp.json()
    return NextResponse.json({ data: updated[0] })
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ error: e.errors }, { status: 400 })
    }
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories?id=eq.${id}`
    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        apikey: svcKey || "",
        Authorization: `Bearer ${svcKey || ""}`,
        Prefer: "return=representation",
      },
    })
    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text }, { status: resp.status })
    }
    return NextResponse.json({}, { status: 204 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

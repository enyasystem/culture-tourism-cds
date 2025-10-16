import { NextResponse } from "next/server"
import { storyUpdateSchema, storyDbSelect } from "@/lib/schemas/stories"

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const paramsObj = new URLSearchParams()
  paramsObj.set('id', `eq.${id}`)
    paramsObj.set('select', storyDbSelect)
    const url = `${base}/rest/v1/stories?${paramsObj.toString()}`
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
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }
  try {
    const body = await req.json()
    console.debug('[api/admin/stories/[id]) PATCH body:', { id, body })
    const parsed = storyUpdateSchema.parse(body)
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const paramsObj = new URLSearchParams()
  paramsObj.set('id', `eq.${id}`)
    const url = `${base}/rest/v1/stories?${paramsObj.toString()}`
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
      console.debug('[api/admin/stories/[id]) supabase PATCH error:', resp.status, text)
      return NextResponse.json({ error: text }, { status: resp.status })
    }
    const updated = await resp.json()
    console.debug('[api/admin/stories/[id]) PATCH success:', { id, updated })
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
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }
  try {
    console.debug('[api/admin/stories/[id]) DELETE request for id:', id)
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const paramsObj = new URLSearchParams()
  paramsObj.set('id', `eq.${id}`)
    const url = `${base}/rest/v1/stories?${paramsObj.toString()}`
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
      console.debug('[api/admin/stories/[id]) supabase DELETE error:', resp.status, text)
      return NextResponse.json({ error: text }, { status: resp.status })
    }
    console.debug('[api/admin/stories/[id]) DELETE success for id:', id)
    return NextResponse.json({}, { status: 204 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

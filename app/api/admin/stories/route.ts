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
    // Enumerate incoming headers (mask sensitive ones) for debugging
    let incomingDebug = false
    try {
      const headersObj: Record<string, string> = {}
      for (const [k, v] of Array.from(req.headers.entries())) {
        if (/authorization|apikey|cookie|set-cookie/i.test(k)) {
          headersObj[k] = v ? `${v.slice(0, 4)}...${v.slice(-4)}` : ''
        } else {
          headersObj[k] = v || ''
        }
      }
      incomingDebug = req.headers.get('x-admin-debug') === '1'
      console.debug('[api/admin/stories] incoming headers (masked):', headersObj)
    } catch (hErr) {
      console.debug('[api/admin/stories] failed to enumerate incoming headers', hErr)
    }
    console.debug('[api/admin/stories] POST body:', body)
    // Ensure admin-created stories are published by default.
    const parsedInput = storyCreateSchema.parse(body)
    const parsed = { ...parsedInput, published: true }
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    // Debug: log whether service role key is available (mask the value)
    try {
      if (svcKey) {
        console.debug('[api/admin/stories] SUPABASE_SERVICE_ROLE_KEY present (masked):', `${svcKey.slice(0, 4)}...${svcKey.slice(-4)}`)
      } else {
        console.debug('[api/admin/stories] SUPABASE_SERVICE_ROLE_KEY missing or empty')
      }
    } catch (e) {
      console.debug('[api/admin/stories] error checking SUPABASE_SERVICE_ROLE_KEY presence', e)
    }
    if (!svcKey) {
      console.error('[api/admin/stories] Missing SUPABASE_SERVICE_ROLE_KEY in server environment')
      return NextResponse.json({ error: 'Missing server configuration: SUPABASE_SERVICE_ROLE_KEY. Set this env var on the server (do NOT expose it to the browser).' }, { status: 500 })
    }
    const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`
    // Log payload and masked key without exposing secret
    try {
      console.debug('[api/admin/stories] creating story; payload:', parsed)
      console.debug('[api/admin/stories] masked service key present:', !!svcKey, svcKey ? `${svcKey.slice(0,4)}...${svcKey.slice(-4)}` : 'MISSING')
    } catch (e) {
      console.debug('[api/admin/stories] error while preparing debug logs', e)
    }

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
      // Expanded server-side diagnostics for Supabase failure
      let diagnostics: any = null
      try {
        const ct = resp.headers.get('content-type') || 'unknown'
        const respHeaders: Record<string, string> = {}
        for (const [k, v] of Array.from(resp.headers.entries())) {
          respHeaders[k] = v || ''
        }
        diagnostics = { status: resp.status, contentType: ct, headers: respHeaders, body: text }
        console.debug('[api/admin/stories] supabase response error', diagnostics)
      } catch (elog) {
        console.debug('[api/admin/stories] error while logging supabase response diagnostics', elog)
      }

      // Translate common PostgREST / Supabase errors into clearer messages for the admin UI
      if (text && text.toLowerCase().includes('violates row-level security')) {
        console.debug('[api/admin/stories] detected RLS violation from Supabase (raw body logged above)')
        const payload: any = { error: 'Insert rejected by database row-level security. Ensure the server is using the Supabase service role key or adjust RLS policies.' }
        if (incomingDebug) return NextResponse.json({ ...payload, diagnostics }, { status: resp.status })
        return NextResponse.json(payload, { status: resp.status })
      }

      try {
        const parsedErr = JSON.parse(text)
        if (incomingDebug) return NextResponse.json({ error: parsedErr, diagnostics }, { status: resp.status })
        return NextResponse.json({ error: parsedErr }, { status: resp.status })
      } catch {
        if (incomingDebug) return NextResponse.json({ error: text, diagnostics }, { status: resp.status })
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

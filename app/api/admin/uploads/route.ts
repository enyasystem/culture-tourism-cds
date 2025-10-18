import { NextResponse } from "next/server"

export const runtime = 'node'

export async function POST(req: Request) {
  try {
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'stories'

    if (!svcKey) {
      console.error('[api/admin/uploads] Missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json({ error: 'Server not configured for uploads' }, { status: 500 })
    }

    // Expect filename and content-type headers from the client
    const filenameHeader = req.headers.get('x-filename') || `upload-${Date.now()}`
    const contentType = req.headers.get('content-type') || 'application/octet-stream'

    // sanitize filename
    const safeName = filenameHeader.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const path = `stories/${Date.now()}-${safeName}`

    // Read raw body
    const arrayBuffer = await req.arrayBuffer()
    const body = Buffer.from(arrayBuffer)

    const url = `${base}/storage/v1/object/${BUCKET}/${encodeURIComponent(path)}`

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        apikey: svcKey,
        Authorization: `Bearer ${svcKey}`,
        'Content-Type': contentType,
      },
      body,
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.error('[api/admin/uploads] Supabase storage upload failed', resp.status, text)
      return NextResponse.json({ error: 'Upload failed', diagnostics: { status: resp.status, body: text } }, { status: resp.status })
    }

    // public URL for object
    const publicUrl = `${base}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`

    return NextResponse.json({ publicUrl })
  } catch (e: any) {
    console.error('[api/admin/uploads] error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

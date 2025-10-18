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

    // Optional server-side file size limit (bytes); default 5 MB
    const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES) || 5 * 1024 * 1024
    if (body.length > MAX_BYTES) {
      const msg = `File too large. Maximum allowed size is ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`
      console.debug('[api/admin/uploads] file too large', { size: body.length, max: MAX_BYTES })
      return NextResponse.json({ error: 'File too large', code: 'FILE_TOO_LARGE', message: msg }, { status: 413 })
    }

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

      // Try to parse JSON error from Supabase storage
      let parsed: any = null
      try {
        parsed = JSON.parse(text)
      } catch (e) {
        parsed = null
      }

      // Map common Supabase storage errors to friendly structured codes
      if (parsed && parsed.error && parsed.statusCode) {
        const statusCode = String(parsed.statusCode)
        if (statusCode === '415' || parsed.error === 'invalid_mime_type') {
          return NextResponse.json({ error: 'Invalid file type', code: 'INVALID_MIME', message: String(parsed.message || 'Invalid mime type'), diagnostics: parsed }, { status: 415 })
        }
      }

      // Fallback: return raw diagnostics
      return NextResponse.json({ error: 'Upload failed', code: 'UPLOAD_FAILED', message: String(text || 'Unknown'), diagnostics: { status: resp.status, body: text } }, { status: resp.status })
    }

    // public URL for object
    const publicUrl = `${base}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`

    return NextResponse.json({ success: true, publicUrl, message: 'Upload complete' })
  } catch (e: any) {
    console.error('[api/admin/uploads] error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

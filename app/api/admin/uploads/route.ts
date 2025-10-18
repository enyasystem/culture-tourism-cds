import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const incomingDebug = req.headers.get('x-admin-debug') === '1'
    const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'stories'

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

    // Use admin client (service role) for storage upload
    const serverSupabase = await createAdminClient()

    // Upload using SDK's storage API (admin client uses service role key)
    const { error: uploadError } = await serverSupabase.storage.from(BUCKET).upload(path, body, {
      contentType,
      upsert: false,
    })

    if (uploadError) {
      console.error('[api/admin/uploads] Supabase storage upload failed', uploadError)
      const short = { error: 'Upload failed', code: 'UPLOAD_FAILED', message: String(uploadError.message || uploadError) }
      if (incomingDebug) return NextResponse.json({ ...short, diagnostics: { uploadError } }, { status: 500 })
      return NextResponse.json(short, { status: 500 })
    }

    // public URL for object
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const publicUrl = `${base}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path)}`

    return NextResponse.json({ success: true, publicUrl, message: 'Upload complete' })
  } catch (e: any) {
    console.error('[api/admin/uploads] error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

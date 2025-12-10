import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { uploadBufferToVercel } from '@/lib/storage/vercel'

export const runtime = 'nodejs'

// Handle CORS preflight from browsers (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-filename, x-admin-debug',
    },
  })
}

export async function POST(req: Request) {
  try {
    console.debug('[api/admin/uploads] incoming request method: POST')
  } catch {}
  try {
    const incomingDebug = req.headers.get('x-admin-debug') === '1'
    if (incomingDebug) {
      try {
        const masked = process.env.SUPABASE_SERVICE_ROLE_KEY ? `${String(process.env.SUPABASE_SERVICE_ROLE_KEY).slice(0,4)}...${String(process.env.SUPABASE_SERVICE_ROLE_KEY).slice(-4)}` : 'MISSING'
        console.debug('[api/admin/uploads] x-admin-debug=1 enabled; SUPABASE_SERVICE_ROLE_KEY (masked):', masked)
        console.debug('[api/admin/uploads] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      } catch (dE) {
        console.debug('[api/admin/uploads] debug log failed', dE)
      }
    }
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

    // If a Vercel blob write token is configured, prefer uploading to Vercel Blob storage.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const vercelUrl = await uploadBufferToVercel(body, path, contentType)
        return NextResponse.json({ success: true, publicUrl: vercelUrl, message: 'Upload complete (vercel blob)' })
      } catch (err: any) {
        console.error('[api/admin/uploads] Vercel blob upload failed', err)
        if (incomingDebug) {
          const diagnostics = { message: String(err?.message || err), stack: err?.stack }
          return NextResponse.json({ success: false, backend: 'vercel', diagnostics }, { status: 500 })
        }
        // fall through to supabase path as a fallback
      }
    }

    // Use admin client (service role) for storage upload (fallback)
    let serverSupabase: any = null
    try {
      serverSupabase = await createAdminClient()
    } catch (svcErr) {
      console.error('[api/admin/uploads] failed to create admin client', svcErr)
      if (incomingDebug) return NextResponse.json({ error: 'Failed to create admin client', diagnostics: String(svcErr?.message || svcErr) }, { status: 500 })
      return NextResponse.json({ error: 'Failed to create admin client' }, { status: 500 })
    }

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

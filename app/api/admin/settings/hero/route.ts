import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient, createClient as createServerSupabase, createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Use the same server client pattern as other public GET handlers
    // (like /api/stories). This uses the anon key and respects request
    // cookies while avoiding service-role usage for public reads.
    const supabase = await createClient()

    // Don't use .single() to avoid PostgREST errors when no rows exist;
    // select and pick the first result if present.
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'hero_images').limit(1)

    if (error) {
      console.error('[api/admin/settings/hero] read error', error)
      // Return an empty hero array (frontend treats empty as absence)
      return NextResponse.json({ hero: [] })
    }

    // data is likely an array of rows; pick first and normalize
    const row = Array.isArray(data) ? data[0] : data

    // Normalize the returned value shape (string, json, array, object)
    let value: any = []
    try {
      if (!row) {
        value = []
      } else if (typeof row.value === 'string') {
        try {
          value = JSON.parse(row.value)
        } catch {
          value = row.value
        }
      } else if (typeof row.value !== 'undefined') {
        value = row.value
      } else {
        value = row
      }
    } catch (err) {
      console.warn('[api/admin/settings/hero] normalization failed', err, { raw: row })
      value = []
    }

    console.debug('[api/admin/settings/hero] GET returning value', { raw: row, value })
    return NextResponse.json({ hero: value })
  } catch (e: any) {
    console.error('[api/admin/settings/hero] unexpected error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { hero } = body || {}

    if (!Array.isArray(hero)) {
      return NextResponse.json({ error: 'Invalid payload: hero must be an array' }, { status: 400 })
    }

    // Ensure admin privileges: verify session user exists
    const supabase = await createServerSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = (userData as any)?.user
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await createAdminClient()
    const upsert = await admin
      .from('site_settings')
      .upsert({ key: 'hero_images', value: hero }, { onConflict: 'key' })
      .select()

    // supabase returns { data, error }
    const upsertError = (upsert as any)?.error
    const upsertData = (upsert as any)?.data
    if (upsertError) {
      console.error('[api/admin/settings/hero] upsert error', upsertError)
      const message = upsertError?.message || String(upsertError)
      return NextResponse.json({ error: message }, { status: 500 })
    }
    // debug log what was written by upsert
    console.debug('[api/admin/settings/hero] upsert wrote', upsertData)

    try {
      // Revalidate the homepage so any cached server content is refreshed
      revalidatePath('/')
    } catch (revalErr) {
      // non-fatal: log and continue
      console.warn('[api/admin/settings/hero] revalidatePath failed', revalErr)
    }

    return NextResponse.json({ success: true, data: upsertData })
  } catch (e: any) {
    console.error('[api/admin/settings/hero] unexpected error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

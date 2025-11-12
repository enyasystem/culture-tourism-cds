import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, createClient as createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) return NextResponse.json({ ok: false, error: "missing userId" }, { status: 400 })

    let supabase: any = null
    let data: any = null
    let error: any = null

    // Try admin/service-role client first. If it's not configured (common in
    // local dev), fall back to the server-side client which uses the request
    // cookies and the anon key. The server client will work when the session
    // cookie is present and RLS permits access to user_profiles for the user.
    try {
      supabase = await createAdminClient()
      const resp = await supabase.from("user_profiles").select("role").eq("user_id", userId).limit(1)
      data = resp.data
      error = resp.error
    } catch (adminErr) {
  console.debug('[api/user-role] createAdminClient failed, falling back to server client', String(adminErr))
      try {
        const serverClient = await createServerClient()
        const resp = await serverClient.from("user_profiles").select("role").eq("user_id", userId).limit(1)
        data = resp.data
        error = resp.error
      } catch (serverErr) {
        console.error('[api/user-role] server-client lookup error', serverErr)
  return NextResponse.json({ ok: false, error: String(serverErr) }, { status: 500 })
      }
    }

    if (error) {
      console.debug('[api/user-role] lookup error', error)
      return NextResponse.json({ ok: false, error: error.message ?? String(error) }, { status: 500 })
    }

    const profile = Array.isArray(data) && data.length ? data[0] : null
    return NextResponse.json({ ok: true, role: profile?.role ?? null })
  } catch (err) {
    console.error('[api/user-role] unexpected error', err)
    return NextResponse.json({ ok: false, error: (err as Error).message ?? String(err) }, { status: 500 })
  }
}

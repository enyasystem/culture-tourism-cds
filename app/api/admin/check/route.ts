import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Create a server Supabase client which will read cookies from the
    // incoming request and allow us to determine the authenticated user.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // noop for this endpoint
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false })
    }

    // Use the service role key to read the user_profiles table via REST
    // to avoid RLS/policy blocking the client-side query.
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${user.id}&select=role`
    const resp = await fetch(restUrl, {
      headers: {
        apikey: svcKey || "",
        Authorization: `Bearer ${svcKey || ""}`,
        Accept: "application/json",
      },
    })

    if (!resp.ok) {
      const txt = await resp.text()
      console.debug('[api/admin/check] service-role fetch failed', resp.status, txt)
      return NextResponse.json({ isAdmin: false })
    }

    const svcData = await resp.json()
    const profile = Array.isArray(svcData) && svcData.length ? svcData[0] : null

    return NextResponse.json({ isAdmin: !!profile && profile.role === "admin" })
  } catch (e) {
    console.error('[api/admin/check] error', e)
    return NextResponse.json({ isAdmin: false })
  }
}

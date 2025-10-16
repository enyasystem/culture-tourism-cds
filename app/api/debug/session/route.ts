import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // no-op for debug
          },
        },
      },
    )

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()

    console.debug('[api/debug/session] getUser ->', !!user, user?.id, user?.email, 'error:', userErr)

    let profile = null
    let profileErr = null
    if (user) {
      const { data, error } = await supabase.from('user_profiles').select('role,user_id').eq('user_id', user.id).single()
      profile = data
      profileErr = error
      console.debug('[api/debug/session] user_profiles ->', profile, 'error:', profileErr)

      // Also fetch via the REST API with the service role key to compare results
      try {
        const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_profiles?user_id=eq.${user.id}`
        const resp = await fetch(url, {
          headers: {
            apikey: svcKey || '',
            Authorization: `Bearer ${svcKey || ''}`,
            Accept: 'application/json',
          },
        })
        const svcData = await resp.json()
        console.debug('[api/debug/session] service-role user_profiles ->', svcData)
        return NextResponse.json({ ok: true, user, userErr, profile, profileErr, serviceRoleQuery: svcData })
      } catch (e) {
        console.debug('[api/debug/session] service-role query error', e)
        return NextResponse.json({ ok: true, user, userErr, profile, profileErr, serviceRoleQueryError: String(e) })
      }
    }

    return NextResponse.json({ ok: true, user, userErr, profile, profileErr })
  } catch (err) {
    console.debug('[api/debug/session] error', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

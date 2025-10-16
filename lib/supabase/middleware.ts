import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Debug: log incoming request and cookies
  try {
    const cookieNames = request.cookies.getAll().map((c) => c.name)
    console.debug('[supabase-middleware] incoming:', request.nextUrl.pathname, 'cookies:', cookieNames.length, cookieNames)
  } catch (e) {
    console.debug('[supabase-middleware] incoming: could not read cookies', e)
  }
  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Debug: log whether getUser returned a user
  if (user) {
    console.debug('[supabase-middleware] supabase.auth.getUser -> user id:', user.id, 'email:', user.email)
  } else {
    console.debug('[supabase-middleware] supabase.auth.getUser -> no user')
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
      console.debug('[supabase-middleware] admin route requested:', request.nextUrl.pathname)
    if (!user) {
      console.debug('[supabase-middleware] redirecting to /auth/login because no authenticated user')
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    // Query user_profiles using the service role key via the REST API to avoid
    // RLS/policy recursion issues (the policy previously selected from the same
    // table which caused infinite recursion). This is safe server-side.
    let profile = null
    try {
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
        const text = await resp.text()
        console.debug('[supabase-middleware] service role user_profiles fetch failed', resp.status, text)
        const url = request.nextUrl.clone()
        url.pathname = "/unauthorized"
        return NextResponse.redirect(url)
      }

      const svcData = await resp.json()
      // svcData is an array; pick first
      profile = Array.isArray(svcData) && svcData.length ? svcData[0] : null
      console.debug('[supabase-middleware] service-role user_profiles ->', profile)
    } catch (e) {
      console.debug('[supabase-middleware] service-role user_profiles fetch error', e)
      const url = request.nextUrl.clone()
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }

    if (!profile || profile.role !== "admin") {
      console.debug('[supabase-middleware] user is not admin (via service-role check), redirecting to /unauthorized')
      const url = request.nextUrl.clone()
      url.pathname = "/unauthorized"
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}

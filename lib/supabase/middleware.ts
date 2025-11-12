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

    // To avoid relying on environment variables inside the middleware runtime
    // (which may not expose private envs in some runtimes), call the internal
    // server endpoint `/api/user-role` which performs the service-role lookup
    // server-side. This keeps secrets server-only and prevents 401s like
    // "No API key found in request" that occur when the middleware cannot read
    // the service key.
    try {
      const url = new URL('/api/user-role', request.url)
      const resp = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!resp.ok) {
        const text = await resp.text()
        console.debug('[supabase-middleware] service role user_profiles fetch failed', resp.status, text)
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/unauthorized'
        return NextResponse.redirect(redirectUrl)
      }

      const json = await resp.json()
      const role = json?.role ?? null
      console.debug('[supabase-middleware] service-role user_profiles ->', role)

      if (!role || role !== 'admin') {
        console.debug('[supabase-middleware] user is not admin (via service-role check), redirecting to /unauthorized')
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/unauthorized'
        return NextResponse.redirect(redirectUrl)
      }
    } catch (e) {
      console.debug('[supabase-middleware] service-role user_profiles fetch error', String(e))
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/unauthorized'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}

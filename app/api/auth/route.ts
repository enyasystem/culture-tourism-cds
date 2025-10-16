import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, session } = body ?? {}

    console.debug('[api/auth] received POST event=', event, 'hasSession=', !!session)

    // Prepare a response we can attach cookies to
    const response = NextResponse.json({ ok: true })

    // Create a server Supabase client that will apply cookies to our response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // attach cookies to the response so subsequent middleware/requests can read them
              response.cookies.set(name, value, options as any)
            })
          },
        },
      },
    )

    // If there's a session supplied from the client, set it on the server client
    // This will cause the client to produce the correct auth cookies via setAll
    if (session) {
      // supabase.auth.setSession will persist cookies using the cookies.setAll above
      // If the method is not available for some reason, this will throw and we'll return ok=false
      // Most @supabase/ssr versions provide setSession on the auth client.
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await supabase.auth.setSession(session)
        console.debug('[api/auth] setSession -> success')
      } catch (e) {
        console.debug('[api/auth] setSession -> error', e)
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
      }
    } else {
      // When there's no session, clear server-side session cookies by calling signOut
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await supabase.auth.signOut()
        console.debug('[api/auth] signOut -> success')
      } catch (e) {
        console.debug('[api/auth] signOut -> error', e)
        // ignore
      }
    }

    return response
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message ?? String(err) }, { status: 500 })
  }
}

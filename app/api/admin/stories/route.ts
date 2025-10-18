import { NextResponse } from "next/server"
import { storyCreateSchema, storyDbSelect } from "@/lib/schemas/stories"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

// GET list, POST create
export async function GET(req: Request) {
  try {
    const restBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`
    const url = new URL(restBase)
    url.searchParams.set("select", storyDbSelect)

    // Prefer using the service role key for admin server-side reads so RLS
    // doesn't hide non-published rows. Fall back to the anon key if the
    // service role key is not configured.
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    const useKey = svcKey || anonKey

    const headers: Record<string, string> = {
      apikey: useKey,
      Authorization: `Bearer ${useKey}`,
      Accept: "application/json",
    }

    // Attempt the request and, if Postgres complains about missing columns
    // (42703 / "does not exist"), iteratively remove those columns from the
    // select and retry until success or no columns remain.
    let currentCols = storyDbSelect.split(',').map((s) => s.trim()).filter(Boolean)
    let attempt = 0
    const maxAttempts = Math.max(1, currentCols.length)
    while (attempt < maxAttempts) {
      const attemptSelect = currentCols.join(',')
      const attemptUrl = new URL(restBase)
      attemptUrl.searchParams.set('select', attemptSelect)
      const respAttempt = await fetch(attemptUrl.toString(), { headers })
      if (respAttempt.ok) {
        const data = await respAttempt.json()
        return NextResponse.json({ data })
      }

      const text = await respAttempt.text()
      let parsedErr: any = null
      try {
        parsedErr = JSON.parse(text)
      } catch {
        parsedErr = null
      }

      const errMessage = (parsedErr && parsedErr.message) ? parsedErr.message : String(text || '')

      // If PostgREST reports a missing column (Postgres 42703 / "does not exist")
      // try to extract the column name and remove it for the next attempt.
      const isUndefinedColumn = (parsedErr && parsedErr.code === '42703') || /does not exist/i.test(errMessage)
      if (isUndefinedColumn) {
        const colMatch = errMessage.match(/column\s+(?:\S+\.)?(?:"?)([a-zA-Z0-9_]+)(?:"?)\s+does not exist/i)
        const missingCol = colMatch ? colMatch[1] : null
        if (missingCol && currentCols.includes(missingCol)) {
          console.debug(`[api/admin/stories] detected missing column '${missingCol}', removing from select and retrying`)
          currentCols = currentCols.filter((c) => c !== missingCol)
          attempt += 1
          continue
        }
      }

      // Schema cache error (PostgREST PGRST204) — give a helpful error.
      const isSchemaCacheError = parsedErr && parsedErr.code === 'PGRST204'
      if (isSchemaCacheError) {
        console.debug('[api/admin/stories] detected PostgREST schema-cache error (PGRST204) on GET')
        return NextResponse.json({ error: "Database schema cache error: a required column was not found. Ensure your migrations are applied and restart PostgREST/Supabase." }, { status: respAttempt.status })
      }

      // If we didn't handle the error above, return the parsed error or raw text.
      return NextResponse.json({ error: parsedErr ? parsedErr : text }, { status: respAttempt.status })
    }

    // If we exhausted attempts (all columns removed) return an informative error.
    return NextResponse.json({ error: 'No selectable columns remain after removing missing columns. Reconcile your DB schema with server code.' }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Enumerate incoming headers (mask sensitive ones) for debugging
    let incomingDebug = false
    try {
      const headersObj: Record<string, string> = {}
      for (const [k, v] of Array.from(req.headers.entries())) {
        if (/authorization|apikey|cookie|set-cookie/i.test(k)) {
          headersObj[k] = v ? `${v.slice(0, 4)}...${v.slice(-4)}` : ''
        } else {
          headersObj[k] = v || ''
        }
      }
      incomingDebug = req.headers.get('x-admin-debug') === '1'
      console.debug('[api/admin/stories] incoming headers (masked):', headersObj)
    } catch (hErr) {
      console.debug('[api/admin/stories] failed to enumerate incoming headers', hErr)
    }
    console.debug('[api/admin/stories] POST body:', body)
    // Ensure admin-created stories are published by default.
    const parsedInput = storyCreateSchema.parse(body)
    const parsed: any = { ...parsedInput, published: true }

    // If there is an authenticated server session, attach the author's id and name
    try {
      const serverSupabase = await createServerSupabase()
      const { data: userData } = await serverSupabase.auth.getUser()
      const user = (userData as any)?.user
      if (user) {
        // Do not attach author_id here. The stories table no longer requires
        // author_id to be set by this endpoint. If you need to record the
        // creating user, use a dedicated non-Public column or a different
        // admin process that updates an explicit relationship.
      }
    } catch (sessErr) {
      // If we can't read session, continue without author metadata
      console.debug('[api/admin/stories] could not resolve server session for author info', sessErr)
    }
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    // Debug: log whether service role key is available (mask the value)
    try {
      if (svcKey) {
        console.debug('[api/admin/stories] SUPABASE_SERVICE_ROLE_KEY present (masked):', `${svcKey.slice(0, 4)}...${svcKey.slice(-4)}`)
      } else {
        console.debug('[api/admin/stories] SUPABASE_SERVICE_ROLE_KEY missing or empty')
      }
    } catch (e) {
      console.debug('[api/admin/stories] error checking SUPABASE_SERVICE_ROLE_KEY presence', e)
    }
    if (!svcKey) {
      console.error('[api/admin/stories] Missing SUPABASE_SERVICE_ROLE_KEY in server environment')
      return NextResponse.json({ error: 'Missing server configuration: SUPABASE_SERVICE_ROLE_KEY. Set this env var on the server (do NOT expose it to the browser).' }, { status: 500 })
    }
    const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`
    // Log payload and masked key without exposing secret
    try {
      console.debug('[api/admin/stories] creating story; payload:', parsed)
      console.debug('[api/admin/stories] masked service key present:', !!svcKey, svcKey ? `${svcKey.slice(0,4)}...${svcKey.slice(-4)}` : 'MISSING')
    } catch (e) {
      console.debug('[api/admin/stories] error while preparing debug logs', e)
    }

    const resp = await fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: svcKey || "",
        Authorization: `Bearer ${svcKey || ""}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(parsed),
    })
    if (!resp.ok) {
      const text = await resp.text()

      // Attempt to parse structured error from PostgREST/Supabase
      let parsedErr: any = null
      try {
        parsedErr = JSON.parse(text)
      } catch {
        parsedErr = null
      }

      // Special-case: PostgREST schema cache error (PGRST204) where a column cannot be found
      // Return a concise, actionable message rather than the full diagnostics blob.
      const isSchemaCacheError = parsedErr && parsedErr.code === 'PGRST204'
      if (isSchemaCacheError) {
        console.debug('[api/admin/stories] detected PostgREST schema-cache error (PGRST204)')
        const short = {
          error: "Database schema cache error: a required column (e.g. 'author_id') was not found. Ensure your migrations are up-to-date and restart the Supabase/PostgREST service.",
        }
        // Only return full diagnostics if explicitly requested via x-admin-debug
        if (incomingDebug) {
          const safeDiag = { status: resp.status, message: parsedErr.message || 'PGRST204', code: parsedErr.code }
          return NextResponse.json({ ...short, diagnostics: safeDiag }, { status: resp.status })
        }
        return NextResponse.json(short, { status: resp.status })
      }

      // Build a minimal sanitized diagnostics object only when incomingDebug is enabled.
      const buildSanitizedDiagnostics = () => {
        const ct = resp.headers.get('content-type') || 'unknown'
        const respHeaders: Record<string, string> = {}
        for (const [k, v] of Array.from(resp.headers.entries())) {
          // Mask sensitive headers and cookies
          if (/authorization|apikey|cookie|set-cookie/i.test(k)) {
            respHeaders[k] = v ? `${String(v).slice(0, 4)}...${String(v).slice(-4)}` : ''
          } else {
            const val = v || ''
            // Shorten very long values for readability
            respHeaders[k] = val.length > 200 ? `${val.slice(0, 80)}...[truncated]...${val.slice(-20)}` : val
          }
        }
        return { status: resp.status, contentType: ct, headers: respHeaders, body: parsedErr ? parsedErr : text }
      }

      // If this is an RLS violation mention, provide a clearer message.
      const textLower = String(text).toLowerCase()
      if (textLower.includes('violates row-level security')) {
        console.debug('[api/admin/stories] detected RLS violation from Supabase')
        const payload: any = { error: 'Insert rejected by database row-level security. Ensure the server is using the Supabase service role key or adjust RLS policies.' }
        if (incomingDebug) return NextResponse.json({ ...payload, diagnostics: buildSanitizedDiagnostics() }, { status: resp.status })
        return NextResponse.json(payload, { status: resp.status })
      }

      // Default: return a short, non-sensitive error to the client.
      if (parsedErr && parsedErr.message) {
        if (incomingDebug) return NextResponse.json({ error: parsedErr.message, diagnostics: buildSanitizedDiagnostics() }, { status: resp.status })
        return NextResponse.json({ error: parsedErr.message }, { status: resp.status })
      }

      if (incomingDebug) return NextResponse.json({ error: text }, { status: resp.status })
      return NextResponse.json({ error: 'An unexpected database error occurred. Enable x-admin-debug=1 for more details (server-only).' }, { status: resp.status })
    }
    const created = await resp.json()
    return NextResponse.json({ data: created[0] }, { status: 201 })
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ error: e.errors }, { status: 400 })
    }
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
    )
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Create a server-side Supabase client authenticated with the Service Role key.
 * Use this only for trusted server admin operations (uploads, admin inserts).
 * WARNING: Do NOT expose this client or the service role key to the browser.
 */
export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !svcKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin client')
  }

  // createServerClient requires cookie handlers for server clients. For the
  // admin/service-role client we don't have request cookies, so provide
  // lightweight no-op implementations that satisfy the API contract.
  // getAll must return an array of cookie objects; setAll should accept
  // an array and persist them (no-op here).
  return createServerClient(supabaseUrl, svcKey, {
    cookies: {
      async getAll() {
        return []
      },
      async setAll(_cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        // no-op: admin client doesn't persist cookies
      },
    },
  })
}

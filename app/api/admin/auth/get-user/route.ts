import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    // Resolve current user from the request session (server-side)
    const supabase = await createServerSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = (userData as any)?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ email: user.email })
  } catch (e: any) {
    console.error('[api/admin/auth/get-user] unexpected error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

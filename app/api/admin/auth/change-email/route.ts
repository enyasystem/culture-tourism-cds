import { NextResponse } from 'next/server'
import { createAdminClient, createClient as createServerSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { newEmail } = body || {}

    if (!newEmail || typeof newEmail !== 'string' || !newEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 })
    }

    // Resolve current user from the request session (server-side)
    const supabase = await createServerSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = (userData as any)?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if new email is the same as current email
    if (newEmail.toLowerCase() === user.email?.toLowerCase()) {
      return NextResponse.json({ error: 'New email must be different from current email' }, { status: 400 })
    }

    // Use the admin client (service role) to update the user's email
    const admin = await createAdminClient()
    // @ts-ignore - supabase-js admin API exists on auth.admin when using service role
    const res = await (admin.auth as any).admin.updateUserById(user.id, { email: newEmail })

    if (res?.error) {
      console.error('[api/admin/auth/change-email] update error', res.error)
      // Check if it's a duplicate email error
      if (res.error?.message?.toLowerCase().includes('duplicate') || res.error?.message?.toLowerCase().includes('already')) {
        return NextResponse.json({ error: 'Email address is already in use' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to update email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('[api/admin/auth/change-email] unexpected error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createAdminClient, createClient as createServerSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { newPassword, currentPassword } = body || {}

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
    }

    // Resolve current user from the request session (server-side)
    const supabase = await createServerSupabase()
    const { data: userData } = await supabase.auth.getUser()
    const user = (userData as any)?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify current password by attempting to sign in with the user's email
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
      console.error('[api/admin/auth/change-password] missing supabase env keys')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    try {
      const tokenResp = await fetch(`${supabaseUrl.replace(/\/?$/, '')}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey,
        },
        body: JSON.stringify({ email: user.email, password: currentPassword }),
      })

      const tokenJson = await tokenResp.json()
      if (!tokenResp.ok || !tokenJson?.access_token) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
    } catch (err) {
      console.error('[api/admin/auth/change-password] verify error', err)
      return NextResponse.json({ error: 'Failed to verify current password' }, { status: 500 })
    }

    // Use the admin client (service role) to update the user's password
    const admin = await createAdminClient()
    // @ts-ignore - supabase-js admin API exists on auth.admin when using service role
    const res = await (admin.auth as any).admin.updateUserById(user.id, { password: newPassword })

    if (res?.error) {
      console.error('[api/admin/auth/change-password] update error', res.error)
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('[api/admin/auth/change-password] unexpected error', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

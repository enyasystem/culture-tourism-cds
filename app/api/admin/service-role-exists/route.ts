import { NextResponse } from "next/server"

export async function GET() {
  try {
    const exists = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    return NextResponse.json({ exists })
  } catch (e) {
    return NextResponse.json({ exists: false }, { status: 500 })
  }
}

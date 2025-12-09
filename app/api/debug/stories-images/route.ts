import { createClient } from '@/lib/supabase/server'
import { storyDbSelect } from '@/lib/schemas/stories'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('stories').select(storyDbSelect).order('created_at', { ascending: false }).limit(20)

    if (error) {
      console.error('[debug/stories-images] supabase error', error)
      return NextResponse.json({ ok: false, error }, { status: 500 })
    }

    const rows = Array.isArray(data) ? data : []

    const normalized = rows.map((row: any) => {
      const images = Array.isArray(row?.images)
        ? row.images
        : row?.images
        ? [row.images]
        : row?.cover_image
        ? [row.cover_image]
        : []

      return { id: row.id, title: row.title, cover_image: row.cover_image, images, raw_images: row.images }
    })

    return NextResponse.json({ ok: true, rows: normalized })
  } catch (err) {
    console.error('[debug/stories-images] unexpected', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

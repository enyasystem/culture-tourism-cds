"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { StoryCard } from "@/components/stories/story-card"

interface Story {
  id: string
  title: string
  content: string
  images?: string[]
  cover_image?: string | null
  image_url?: string | null
  excerpt?: string | null
}

export function StoriesGrid({ visible }: { visible?: boolean }) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchStories = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/stories')
        if (!res.ok) {
          const txt = await res.text().catch(() => '')
          throw new Error(txt || `Failed to fetch admin stories: ${res.status}`)
        }
        const raw = await res.json()
        const data = Array.isArray(raw?.data) ? raw.data : []
        if (!mounted) return
        setStories(
          data.map((row: any) => ({
            id: row.id,
            title: row.title,
            content: row.summary || row.excerpt || row.body || row.content || '',
            images: Array.isArray(row.images) ? row.images : row.images ? [row.images] : row.cover_image ? [row.cover_image] : row.image_url ? [row.image_url] : [],
            excerpt: row.summary || row.excerpt || null,
          }))
        )
      } catch (err: any) {
        console.error('Failed to fetch admin stories', err)
        setError(String(err?.message || err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchStories()
    return () => {
      mounted = false
    }
  }, [])

  if (loading && stories.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-600">Failed to load stories: {error}</div>
  }

  if (stories.length === 0) {
    return <div className="text-sm text-muted-foreground">No stories available.</div>
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {stories.slice(0, 4).map((s) => (
        <div key={s.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
          <div className="relative h-48 overflow-hidden">
            <img
              src={(s.images && s.images.length > 0 ? s.images[0] : '/placeholder.svg')}
              alt={s.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col flex-1 p-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{s.excerpt || s.content}</p>
            </div>
            <div className="mt-4">
              <Link href={`/stories/${s.id}`}>
                <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-colors duration-300 hover:scale-105">
                  Read Story
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

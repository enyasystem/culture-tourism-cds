import { createClient } from '@/lib/supabase/server'
import { storyDbSelect } from '@/lib/schemas/stories'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'

export default async function StoryDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('stories')
      .select(storyDbSelect)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.debug('[stories/[id]] story not found', id, error)
      return notFound()
    }

    const story: any = data

    const images: string[] = Array.isArray(story.images)
      ? story.images
      : story.images
      ? [story.images]
      : story.cover_image
      ? [story.cover_image]
      : []

    const content = story.summary || story.excerpt || story.body || ''

    return (
      <main className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <article className="prose lg:prose-xl">
            <h1 className="text-4xl font-bold">{story.title}</h1>
            <div className="text-sm text-muted-foreground">
              {story.created_at ? new Date(story.created_at).toLocaleString() : ''}
            </div>

            {images.length > 0 && (
              <div className="mt-6 mb-6">
                <img src={images[0]} alt={story.title} className="w-full h-72 object-cover rounded-lg" />
              </div>
            )}

            <div className="mt-6">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </article>
        </div>

        <Footer />
      </main>
    )
  } catch (err) {
    console.error('[stories/[id]] unexpected error', err)
    return notFound()
  }
}

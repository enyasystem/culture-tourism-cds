import { createClient } from '@/lib/supabase/server'
import { storyDbSelect } from '@/lib/schemas/stories'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import StoryReaderGallery from '@/components/stories/story-reader-gallery'

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

        <div className="max-w-3xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <article>
            <div className="mb-6">
              <Link href="/stories" className="text-sm text-muted-foreground hover:underline">
                ← Back to stories
              </Link>
            </div>

            <header className="mb-6">
              <h1 className="text-4xl font-extrabold leading-tight">{story.title}</h1>
              <div className="mt-2 text-sm text-muted-foreground">
                {story.created_at ? new Date(story.created_at).toLocaleString() : ''}
              </div>
            </header>

            {images.length > 0 && (
              <div className="mb-6">
                <StoryReaderGallery images={images} alt={story.title} />
              </div>
            )}

            {story.summary && <p className="text-lg text-slate-700 mb-6">{story.summary}</p>}

            <div className="prose lg:prose-xl max-w-none">
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

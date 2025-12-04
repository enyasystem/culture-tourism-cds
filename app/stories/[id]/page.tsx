import { createClient } from '@/lib/supabase/server'
import { storyDbSelect } from '@/lib/schemas/stories'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import StoryReaderGallery from '@/components/stories/story-reader-gallery'
import StoryShareButton from '@/components/stories/story-share-button'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params
  const supabase = await createClient()

  try {
    const { data } = await supabase
      .from('stories')
      .select('title,summary,cover_image,slug')
      .eq('id', id)
      .single()

    if (!data) return {}

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const storyUrl = `${baseUrl}/stories/${id}`
    const imageUrl = data.cover_image ? `${baseUrl}${data.cover_image}` : `${baseUrl}/og-image.jpg`

    return {
      title: data.title,
      description: data.summary || 'Read this story on Culture & Tourism',
      openGraph: {
        title: data.title,
        description: data.summary || 'Read this story on Culture & Tourism',
        url: storyUrl,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: data.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title,
        description: data.summary || 'Read this story',
        images: [imageUrl],
      },
    }
  } catch (err) {
    return {}
  }
}

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
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {story.created_at ? new Date(story.created_at).toLocaleString() : ''}
                </div>
                <StoryShareButton title={story.title} url={`/stories/${id}`} />
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

"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { StoryCard } from "@/components/stories/story-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav"
import { NoStoriesFound } from "@/components/ui/empty-states"
import { StoryCardSkeleton } from "@/components/ui/loading-states"
import { Search, Plus, TrendingUp, Clock, Sparkles, Heart, Eye } from "lucide-react"

// stories fetched from the database (published only)
// kept the previous static dataset in repository history for reference
interface Story {
  id: string
  title: string
  content: string
  images?: string[]
  location?: string
  date?: string
  likes?: number
  comments?: number
  tags?: string[]
  isLiked?: boolean
}

const initialStories: Story[] = []

const sortOptions = [
  { value: "recent", label: "Most Recent", icon: Clock },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
]

const allTags = [
  "wildlife",
  "nature",
  "culture",
  "museum",
  "hiking",
  "adventure",
  "CDS",
  "community",
  "market",
  "traditional",
]

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [filteredStories, setFilteredStories] = useState<Story[]>(initialStories)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const storiesRef = useRef<HTMLDivElement>(null)
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isStoriesVisible, setIsStoriesVisible] = useState(false)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true)
        }
      })
    }, observerOptions)

    const storiesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsStoriesVisible(true)
        }
      })
    }, observerOptions)

    if (heroRef.current) heroObserver.observe(heroRef.current)
    if (storiesRef.current) storiesObserver.observe(storiesRef.current)

    return () => {
      heroObserver.disconnect()
      storiesObserver.disconnect()
    }
  }, [])

  // Fetch published stories from the API on mount
  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    let pollTimer: number | null = null

    const fetchStories = async (opts?: { signal?: AbortSignal }) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/stories', { signal: opts?.signal })
        if (!res.ok) {
          const txt = await res.text().catch(() => '')
          throw new Error(txt || `Failed to fetch stories: ${res.status}`)
        }
        const raw = await res.json()
        // Accept two shapes: either the public API returns an array, or
        // some endpoints return { data: [] } (admin-style). Normalize to an array.
        let data: Story[] = []
        if (Array.isArray(raw)) {
          data = raw
        } else if (raw && Array.isArray((raw as any).data)) {
          data = (raw as any).data
        } else {
          console.debug('[stories page] unexpected /api/stories response shape', raw)
          data = []
        }
        if (!mounted) return
        setStories(data)
        // only replace filteredStories when there is no active search/tag
        setFilteredStories((prev) => (!searchQuery && !selectedTag ? data : prev))
        console.debug('[stories page] fetched stories count:', data?.length, data?.[0])
      } catch (err: any) {
        if (err?.name === 'AbortError') return
        console.error('Failed to load stories', err)
        setError(String(err?.message || err))
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    // initial load
    fetchStories({ signal: controller.signal })

    // refetch on window focus so admin changes become visible quickly
    const onFocus = () => {
      // create a fresh controller for this one-off fetch
      const c = new AbortController()
      fetchStories({ signal: c.signal }).catch(() => {})
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus()
    }

    window.addEventListener('focus', onFocus)
    window.addEventListener('visibilitychange', onVisibility)

    // poll periodically (20s) for updates
    pollTimer = window.setInterval(() => {
      const c = new AbortController()
      fetchStories({ signal: c.signal }).catch(() => {})
    }, 20_000)

    return () => {
      mounted = false
      controller.abort()
      if (pollTimer) window.clearInterval(pollTimer)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // Keep filteredStories in sync with the main stories list when
  // there is no active search query or tag filter. This ensures the
  // Featured hero (derived from `stories`) and the All Stories list
  // (derived from `filteredStories`) remain consistent.
  useEffect(() => {
    if (!searchQuery && !selectedTag) {
      setFilteredStories(stories)
    }
  }, [stories, searchQuery, selectedTag])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)

    setTimeout(() => {
      let filtered = stories

      if (query) {
        const q = query.toLowerCase()
        filtered = filtered.filter((story: Story) => {
          const title = story.title?.toLowerCase() || ''
          const content = story.content?.toLowerCase() || ''
          const hasTag = (story.tags || []).some((tag: string) => tag.toLowerCase().includes(q))
          const loc = story.location?.toLowerCase() || ''
          return title.includes(q) || content.includes(q) || hasTag || loc.includes(q)
        })
      }

      if (selectedTag) {
        filtered = filtered.filter((story: Story) => (story.tags || []).includes(selectedTag))
      }

      setFilteredStories(filtered)
      setIsLoading(false)
    }, 300)
  }

  const handleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null)
      setFilteredStories(stories)
    } else {
      setSelectedTag(tag)
      const filtered = stories.filter((story: Story) => (story.tags || []).includes(tag))
      setFilteredStories(filtered)
    }
  }

  const handleSort = (option: string) => {
    setSortBy(option)
    const sorted = [...filteredStories].sort((a: Story, b: Story) => {
      if (option === "popular") {
        return (b.likes || 0) - (a.likes || 0)
      }
      return (new Date(b.date || 0).getTime() || 0) - (new Date(a.date || 0).getTime() || 0)
    })
    setFilteredStories(sorted)
  }

  const totalLikes = stories.reduce((sum: number, story: Story) => sum + (story.likes || 0), 0)
  const totalComments = stories.reduce((sum: number, story: Story) => sum + (story.comments || 0), 0)
  const featuredStory = stories[0]

  // If observer hasn't fired yet, but we already have stories, reveal the
  // grid so users don't see an empty area. This keeps the animation when
  // scrolling but avoids the content staying hidden after load.
  const showStories = isStoriesVisible || filteredStories.length > 0
  // Show a full-page loading state (same as admin) while the initial
  // stories request is in-flight and no stories have been loaded yet.
  if (isLoading && stories.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading stories...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div
        ref={heroRef}
        className="relative pt-20 pb-16 bg-gradient-to-br from-[#1A7B7B] via-[#0F766E] to-[#1A7B7B] overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Corps Stories
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
              Share Your Cultural Journey
            </h1>
            <p className="text-xl text-white/90 text-pretty max-w-3xl mx-auto mb-8">
              Discover authentic experiences from corps members exploring Jos's rich cultural heritage
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stories.length}</div>
                <div className="text-sm text-white/80">Stories</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalLikes}</div>
                <div className="text-sm text-white/80">Likes</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalComments}</div>
                <div className="text-sm text-white/80">Comments</div>
              </div>
            </div>

            <Button size="lg" className="bg-white text-[#1A7B7B] hover:bg-white/90 gap-2">
              <Plus className="w-5 h-5" />
              Share Your Story
            </Button>
          </div>

          {/* Featured Story Preview */}
          {featuredStory && (
            <div
              className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
                isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                        <img
                          src={(featuredStory.images && featuredStory.images.length > 0 ? featuredStory.images[0] : "/placeholder.svg")}
                          alt={featuredStory.title || 'Featured story'}
                          className="w-full h-full object-cover"
                        />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#1A7B7B] text-white">Featured Story...</Badge>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-foreground mb-3">{featuredStory.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{featuredStory.content}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span>{featuredStory.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{featuredStory.comments} comments</span>
                      </div>
                    </div>
                    <Button className="w-fit bg-[#1A7B7B] hover:bg-[#0F766E]">Read Full Story</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav className="mb-8" />

          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search stories, experiences, locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-14 text-base border-2 focus:border-[#1A7B7B]"
                />
              </div>
              <div className="flex gap-3">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleSort(option.value)}
                    className={`gap-2 ${sortBy === option.value ? "bg-[#1A7B7B] hover:bg-[#0F766E]" : ""}`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center">Filter by tag:</span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedTag === tag ? "bg-[#1A7B7B] hover:bg-[#0F766E] text-white" : "hover:border-[#1A7B7B]"
                  }`}
                  onClick={() => handleTagFilter(tag)}
                >
                  #{tag}
                </Badge>
              ))}
              {selectedTag && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTag(null)
                      setFilteredStories(stories)
                    }}
                    className="h-6 text-xs"
                  >
                    Clear filter
                  </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedTag ? `Stories tagged with #${selectedTag}` : "All Stories..."}
            </h2>
            <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
              {isLoading
                ? "Loading..."
                : `${filteredStories.length} ${filteredStories.length === 1 ? "story" : "stories"}`}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <StoryCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-900">
                  Failed to load stories: {error}
                </div>
              )}
              {!error && stories.length === 0 && (
                <div className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
                  No published stories were found. If you expect stories to appear, check that the story rows have status="published" and that `cover_image`/`image_url` fields are populated. Visit the <a href="/admin/stories" className="underline">admin stories</a> page to review.
                </div>
              )}
              <div
                ref={storiesRef}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 transition-all duration-1000 ${
                  showStories ? "opacity-100" : "opacity-0"
                }`}
              >
                {filteredStories.map((story, index) => (
                  <div
                    key={story.id}
                    className="transition-all duration-700"
                    style={{
                      transitionDelay: showStories ? `${index * 100}ms` : "0ms",
                      opacity: showStories ? 1 : 0,
                      transform: showStories ? "translateY(0)" : "translateY(30px)",
                    }}
                  >
                    <StoryCard story={story} />
                  </div>
                ))}
              </div>

              {filteredStories.length === 0 && <NoStoriesFound />}
            </>
          )}

          {filteredStories.length > 0 && !isLoading && (
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#1A7B7B] text-[#1A7B7B] hover:bg-[#1A7B7B] hover:text-white transition-all bg-transparent"
              >
                Load More Stories
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

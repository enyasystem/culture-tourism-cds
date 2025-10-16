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

const corpsStories = [
  {
    id: 1,
    title: "My First Visit to Jos Wildlife Park",
    content:
      "What an incredible experience! The wildlife park exceeded all my expectations. The rock formations are absolutely stunning, and seeing the animals in their natural habitat was breathtaking. As a corps member from Lagos, I never imagined Jos had such natural beauty. The park rangers were so knowledgeable and shared fascinating stories about the local ecosystem. I spent the entire afternoon there and could have stayed longer. This is definitely a must-visit for any corps member serving in Plateau State!",
    images: [
      "/jos-wildlife-park-plateau-state.jpg",
      "/placeholder.svg?key=wildlife2",
      "/placeholder.svg?key=wildlife3",
    ],
    author: {
      name: "Adaora Okafor",
      avatar: "/placeholder.svg?key=avatar1",
    },
    location: "Jos Wildlife Park",
    date: "2025-01-15",
    likes: 42,
    comments: 8,
    tags: ["wildlife", "nature", "firstvisit", "amazing"],
    isLiked: true,
  },
  {
    id: 2,
    title: "Cultural Night at the National Museum",
    content:
      "Last night's cultural event at the National Museum was absolutely magical! The traditional dancers were incredible, and learning about the history of the Middle Belt region was so enlightening. The museum staff did an amazing job organizing everything. I met so many interesting people and learned about traditions I never knew existed. The artifacts collection is impressive, and the storytelling session about Jos's history gave me chills. Proud to be serving in such a culturally rich state!",
    images: ["/national-museum-jos-cultural-artifacts.jpg", "/placeholder.svg?key=cultural2"],
    author: {
      name: "Ibrahim Musa",
      avatar: "/placeholder.svg?key=avatar2",
    },
    location: "National Museum Jos",
    date: "2025-01-12",
    likes: 38,
    comments: 12,
    tags: ["culture", "museum", "traditional", "history"],
    isLiked: false,
  },
  {
    id: 3,
    title: "Sunrise Hike at Shere Hills",
    content:
      "Woke up at 5 AM for this hike and it was SO worth it! The sunrise view from Shere Hills is something every corps member needs to experience. The climb was challenging but manageable, and the panoramic view of Jos from the top is breathtaking. I went with a group of fellow corps members and we had such a great time. The fresh air, the exercise, and the stunning scenery made for a perfect weekend adventure. Already planning my next visit!",
    images: [
      "/shere-hills-jos-plateau-landscape.jpg",
      "/placeholder.svg?key=sunrise2",
      "/placeholder.svg?key=sunrise3",
      "/placeholder.svg?key=sunrise4",
    ],
    author: {
      name: "Fatima Abdullahi",
      avatar: "/placeholder.svg?key=avatar3",
    },
    location: "Shere Hills",
    date: "2025-01-10",
    likes: 56,
    comments: 15,
    tags: ["hiking", "sunrise", "adventure", "weekend"],
    isLiked: true,
  },
  {
    id: 4,
    title: "Jos Main Market Cultural Experience",
    content:
      "Spent my Saturday morning exploring Jos Main Market and what a cultural immersion it was! The variety of local crafts, traditional fabrics, and handmade items is incredible. I bought some beautiful pottery and traditional jewelry. The vendors were so friendly and patient, teaching me about the significance of different items. The food section was amazing too - tried some local delicacies I'd never heard of before. This market is a treasure trove of Plateau State culture!",
    images: ["/placeholder.svg?key=market1", "/placeholder.svg?key=market2"],
    author: {
      name: "Chioma Eze",
      avatar: "/placeholder.svg?key=avatar4",
    },
    location: "Jos Main Market",
    date: "2025-01-08",
    likes: 29,
    comments: 6,
    tags: ["market", "crafts", "culture", "shopping"],
    isLiked: false,
  },
  {
    id: 5,
    title: "Community Service at Local School",
    content:
      "Today our CDS group organized a cultural education program at a local primary school. We taught the children about different Nigerian cultures and they shared stories about Jos traditions. It was so heartwarming to see their enthusiasm and curiosity. We also helped paint some classrooms and donated books. The teachers were so grateful, and the children's smiles made everything worthwhile. This is why I love the NYSC program - the opportunity to give back to communities while learning so much ourselves.",
    images: ["/placeholder.svg?key=school1"],
    author: {
      name: "David Okonkwo",
      avatar: "/placeholder.svg?key=avatar5",
    },
    location: "Government Primary School, Jos",
    date: "2025-01-05",
    likes: 67,
    comments: 18,
    tags: ["CDS", "community", "education", "service"],
    isLiked: true,
  },
]

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
  const [filteredStories, setFilteredStories] = useState(corpsStories)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)

    setTimeout(() => {
      let filtered = corpsStories

      if (query) {
        filtered = filtered.filter(
          (story) =>
            story.title.toLowerCase().includes(query.toLowerCase()) ||
            story.content.toLowerCase().includes(query.toLowerCase()) ||
            story.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
            story.location.toLowerCase().includes(query.toLowerCase()),
        )
      }

      if (selectedTag) {
        filtered = filtered.filter((story) => story.tags.includes(selectedTag))
      }

      setFilteredStories(filtered)
      setIsLoading(false)
    }, 300)
  }

  const handleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null)
      setFilteredStories(corpsStories)
    } else {
      setSelectedTag(tag)
      const filtered = corpsStories.filter((story) => story.tags.includes(tag))
      setFilteredStories(filtered)
    }
  }

  const handleSort = (option: string) => {
    setSortBy(option)
    const sorted = [...filteredStories].sort((a, b) => {
      if (option === "popular") {
        return b.likes - a.likes
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    setFilteredStories(sorted)
  }

  const totalLikes = corpsStories.reduce((sum, story) => sum + story.likes, 0)
  const totalComments = corpsStories.reduce((sum, story) => sum + story.comments, 0)
  const featuredStory = corpsStories[0]

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
                <div className="text-3xl font-bold text-white">{corpsStories.length}</div>
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
                      src={featuredStory.images[0] || "/placeholder.svg"}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#1A7B7B] text-white">Featured Story</Badge>
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
                    setFilteredStories(corpsStories)
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
              {selectedTag ? `Stories tagged with #${selectedTag}` : "All Stories"}
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
              <div
                ref={storiesRef}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 transition-all duration-1000 ${
                  isStoriesVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                {filteredStories.map((story, index) => (
                  <div
                    key={story.id}
                    className="transition-all duration-700"
                    style={{
                      transitionDelay: isStoriesVisible ? `${index * 100}ms` : "0ms",
                      opacity: isStoriesVisible ? 1 : 0,
                      transform: isStoriesVisible ? "translateY(0)" : "translateY(30px)",
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

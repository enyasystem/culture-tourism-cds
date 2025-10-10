"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { StoryCard } from "@/components/stories/story-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav"
import { NoStoriesFound } from "@/components/ui/empty-states"
import { StoryCardSkeleton } from "@/components/ui/loading-states"
import { Search, Plus, TrendingUp, Clock } from "lucide-react"

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
      corpsId: "PL/23B/1234",
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
      corpsId: "PL/23B/5678",
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
      corpsId: "PL/23B/9012",
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
      corpsId: "PL/23B/3456",
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
      corpsId: "PL/23B/7890",
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

export default function StoriesPage() {
  const [filteredStories, setFilteredStories] = useState(corpsStories)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)

    setTimeout(() => {
      if (!query) {
        setFilteredStories(corpsStories)
        setIsLoading(false)
        return
      }

      const filtered = corpsStories.filter(
        (story) =>
          story.title.toLowerCase().includes(query.toLowerCase()) ||
          story.content.toLowerCase().includes(query.toLowerCase()) ||
          story.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          story.location.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredStories(filtered)
      setIsLoading(false)
    }, 300)
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

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav className="mb-6" />

          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Corps Stories
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Cultural Experiences & Stories
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Read and share authentic experiences from corps members exploring Jos's cultural heritage. Upload your own
              stories, photos, and adventures.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search stories, experiences, locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Share Your Story</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort(option.value)}
                    className="gap-2"
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${filteredStories.length} stories`}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-8 mb-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <StoryCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-8 mb-12">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>

              {filteredStories.length === 0 && <NoStoriesFound />}
            </>
          )}

          {filteredStories.length > 0 && !isLoading && (
            <div className="text-center">
              <Button variant="outline" size="lg">
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

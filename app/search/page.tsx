"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { SiteCard } from "@/components/sites/site-card"
import { EventCard } from "@/components/events/event-card"
import { StoryCard } from "@/components/stories/story-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calendar, Camera, Users, Filter, SortAsc } from "lucide-react"

// Mock data - in a real app, this would come from an API
const searchData = {
  sites: [
    {
      id: 1,
      name: "Jos Wildlife Park",
      description: "Home to diverse wildlife species and natural rock formations unique to Plateau State.",
      image: "/jos-wildlife-park-plateau-state.jpg",
      category: "Nature",
      rating: 4.8,
      duration: "2-3 hours",
      location: "Jos South",
      distance: "5.2 km away",
      highlights: ["Wildlife", "Rock Formations", "Nature Trails", "Photography"],
    },
    {
      id: 2,
      name: "Shere Hills",
      description: "Breathtaking hills offering panoramic views of Jos and surrounding landscapes.",
      image: "/shere-hills-jos-plateau-landscape.jpg",
      category: "Landscape",
      rating: 4.9,
      duration: "3-4 hours",
      location: "Jos East",
      distance: "12.8 km away",
      highlights: ["Hiking", "Scenic Views", "Photography", "Adventure"],
    },
  ],
  events: [
    {
      id: 1,
      title: "Jos Cultural Festival 2025",
      description:
        "Annual celebration of Jos cultural heritage featuring traditional dances, music, arts, and local cuisine.",
      image: "/placeholder.svg?key=cultural-festival",
      date: "2025-03-15",
      time: "10:00 AM - 6:00 PM",
      location: "Jos Main Bowl",
      category: "Festival",
      attendees: 245,
      maxAttendees: 500,
      organizer: "Jos Cultural Committee",
    },
  ],
  stories: [
    {
      id: 1,
      title: "My First Visit to Jos Wildlife Park",
      content: "What an incredible experience! The wildlife park exceeded all my expectations...",
      images: ["/jos-wildlife-park-plateau-state.jpg"],
      author: {
        name: "Adaora Okafor",
        avatar: "/placeholder.svg?key=avatar1",
      },
      location: "Jos Wildlife Park",
      date: "2025-01-15",
      likes: 42,
      comments: 8,
      tags: ["wildlife", "nature", "firstvisit", "amazing"],
    },
  ],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [results, setResults] = useState(searchData)

  useEffect(() => {
    // Simulate search API call
    if (query) {
      // In a real app, you would make an API call here
      console.log("Searching for:", query)
    }
  }, [query])

  const totalResults = results.sites.length + results.events.length + results.stories.length

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search sites, events, stories, people..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <SortAsc className="w-4 h-4" />
                  <span>Sort</span>
                </Button>
              </div>
            </div>

            {query && (
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Search results for "{query}"</h1>
                  <p className="text-muted-foreground">Found {totalResults} results</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-border rounded px-2 py-1 bg-background"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {query ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="all" className="gap-2">
                  <Search className="w-4 h-4" />
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="sites" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Sites ({results.sites.length})
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Events ({results.events.length})
                </TabsTrigger>
                <TabsTrigger value="stories" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Stories ({results.stories.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-12">
                {results.sites.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">Cultural Sites</h2>
                      <Badge variant="secondary">{results.sites.length}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.sites.map((site) => (
                        <SiteCard key={site.id} site={site} />
                      ))}
                    </div>
                  </div>
                )}

                {results.events.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <h2 className="text-xl font-semibold text-foreground">Events</h2>
                      <Badge variant="secondary">{results.events.length}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.events.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                )}

                {results.stories.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Camera className="w-5 h-5 text-accent" />
                      <h2 className="text-xl font-semibold text-foreground">Stories</h2>
                      <Badge variant="secondary">{results.stories.length}</Badge>
                    </div>
                    <div className="max-w-4xl space-y-6">
                      {results.stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sites">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.sites.map((site) => (
                    <SiteCard key={site.id} site={site} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stories">
                <div className="max-w-4xl space-y-6">
                  {results.stories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Search Suggestions */
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Discover Jos Culture</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Search for cultural sites, events, stories, and connect with fellow corps members exploring Plateau
                State.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <MapPin className="w-6 h-6" />
                  <span>Cultural Sites</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Calendar className="w-6 h-6" />
                  <span>Events</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Camera className="w-6 h-6" />
                  <span>Stories</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Users className="w-6 h-6" />
                  <span>Community</span>
                </Button>
              </div>
            </div>
          )}

          {/* No Results */}
          {query && totalResults === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try different keywords or check your spelling. You can also browse our categories below.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">wildlife park</Badge>
                <Badge variant="outline">cultural festival</Badge>
                <Badge variant="outline">shere hills</Badge>
                <Badge variant="outline">museum</Badge>
                <Badge variant="outline">traditional crafts</Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

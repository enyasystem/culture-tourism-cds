"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Camera, Users, Clock, Star, X } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: number
  type: "site" | "event" | "story" | "user"
  title: string
  description: string
  image?: string
  url: string
  metadata?: {
    location?: string
    date?: string
    rating?: number
    author?: string
  }
}

const mockSearchResults: SearchResult[] = [
  {
    id: 1,
    type: "site",
    title: "Jos Wildlife Park",
    description: "Home to diverse wildlife species and natural rock formations unique to Plateau State.",
    image: "/jos-wildlife-park-plateau-state.jpg",
    url: "/sites/jos-wildlife-park",
    metadata: {
      location: "Jos South",
      rating: 4.8,
    },
  },
  {
    id: 2,
    type: "event",
    title: "Jos Cultural Festival 2025",
    description:
      "Annual celebration of Jos cultural heritage featuring traditional dances, music, arts, and local cuisine.",
    image: "/placeholder.svg?key=cultural-festival",
    url: "/events/jos-cultural-festival-2025",
    metadata: {
      date: "2025-03-15",
      location: "Jos Main Bowl",
    },
  },
  {
    id: 3,
    type: "story",
    title: "My First Visit to Jos Wildlife Park",
    description: "What an incredible experience! The wildlife park exceeded all my expectations...",
    url: "/stories/first-visit-wildlife-park",
    metadata: {
      author: "Adaora Okafor",
      date: "2025-01-15",
    },
  },
  {
    id: 4,
    type: "site",
    title: "Shere Hills",
    description: "Breathtaking hills offering panoramic views of Jos and surrounding landscapes.",
    image: "/shere-hills-jos-plateau-landscape.jpg",
    url: "/sites/shere-hills",
    metadata: {
      location: "Jos East",
      rating: 4.9,
    },
  },
]

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")

  const searchTypes = [
    { value: "all", label: "All", icon: Search },
    { value: "site", label: "Sites", icon: MapPin },
    { value: "event", label: "Events", icon: Calendar },
    { value: "story", label: "Stories", icon: Camera },
    { value: "user", label: "People", icon: Users },
  ]

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const filtered = mockSearchResults.filter((result) => {
          const matchesQuery =
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
          const matchesType = selectedType === "all" || result.type === selectedType
          return matchesQuery && matchesType
        })
        setResults(filtered)
        setIsLoading(false)
      }, 300)
    } else {
      setResults([])
    }
  }, [query, selectedType])

  const getResultIcon = (type: string) => {
    switch (type) {
      case "site":
        return MapPin
      case "event":
        return Calendar
      case "story":
        return Camera
      case "user":
        return Users
      default:
        return Search
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto p-4">
        <Card className="shadow-2xl border-2">
          <CardContent className="p-0">
            {/* Search Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search sites, events, stories, people..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                    autoFocus
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Type Filters */}
              <div className="flex flex-wrap gap-2">
                {searchTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.value}
                      variant={selectedType === type.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.value)}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="p-6 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              )}

              {!isLoading && query.length > 2 && results.length === 0 && (
                <div className="p-6 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-foreground font-medium">No results found</p>
                  <p className="text-muted-foreground text-sm">Try different keywords or check your spelling</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((result) => {
                    const Icon = getResultIcon(result.type)
                    return (
                      <Link key={result.id} href={result.url} onClick={onClose}>
                        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          {result.image ? (
                            <img
                              src={result.image || "/placeholder.svg"}
                              alt={result.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground line-clamp-1">{result.title}</h3>
                              <Badge variant="outline" className="text-xs capitalize">
                                {result.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{result.description}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {result.metadata?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{result.metadata.location}</span>
                                </div>
                              )}
                              {result.metadata?.date && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(result.metadata.date)}</span>
                                </div>
                              )}
                              {result.metadata?.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-secondary fill-current" />
                                  <span>{result.metadata.rating}</span>
                                </div>
                              )}
                              {result.metadata?.author && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{result.metadata.author}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {query.length <= 2 && (
                <div className="p-6 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-foreground font-medium">Start typing to search</p>
                  <p className="text-muted-foreground text-sm">Search for cultural sites, events, stories, and more</p>
                </div>
              )}
            </div>

            {/* Search Footer */}
            {results.length > 0 && (
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Found {results.length} results</span>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">↑↓</kbd>
                    <span>Navigate</span>
                    <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Enter</kbd>
                    <span>Select</span>
                    <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

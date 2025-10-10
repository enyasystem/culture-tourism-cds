"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { SiteCard } from "@/components/sites/site-card"
import { SiteFilters } from "@/components/sites/site-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav"
import { NoSitesFound } from "@/components/ui/empty-states"
import { SiteCardSkeleton } from "@/components/ui/loading-states"
import { MapPin, Grid, List, Map } from "lucide-react"

const culturalSites = [
  {
    id: 1,
    name: "Jos Wildlife Park",
    description:
      "Home to diverse wildlife species and natural rock formations unique to Plateau State. Experience the beauty of nature and wildlife conservation.",
    image: "/jos-wildlife-park-plateau-state.jpg",
    category: "Nature",
    rating: 4.8,
    duration: "2-3 hours",
    location: "Jos South",
    distance: "5.2 km away",
    highlights: ["Wildlife", "Rock Formations", "Nature Trails", "Photography"],
    isLiked: false,
  },
  {
    id: 2,
    name: "National Museum Jos",
    description:
      "Explore the rich cultural heritage and archaeological artifacts of the Middle Belt region. A treasure trove of Nigerian history and culture.",
    image: "/national-museum-jos-cultural-artifacts.jpg",
    category: "Museum",
    rating: 4.6,
    duration: "1-2 hours",
    location: "Jos North",
    distance: "2.1 km away",
    highlights: ["Artifacts", "History", "Culture", "Education"],
    isLiked: true,
  },
  {
    id: 3,
    name: "Shere Hills",
    description:
      "Breathtaking hills offering panoramic views of Jos and surrounding landscapes. Perfect for hiking and scenic photography.",
    image: "/shere-hills-jos-plateau-landscape.jpg",
    category: "Landscape",
    rating: 4.9,
    duration: "3-4 hours",
    location: "Jos East",
    distance: "12.8 km away",
    highlights: ["Hiking", "Scenic Views", "Photography", "Adventure"],
    isLiked: false,
  },
  {
    id: 4,
    name: "Jos Main Market",
    description: "Experience the vibrant local culture and traditional crafts at one of Nigeria's most famous markets.",
    image: "/placeholder.svg?key=market",
    category: "Cultural Center",
    rating: 4.3,
    duration: "1-2 hours",
    location: "Jos North",
    distance: "1.5 km away",
    highlights: ["Local Crafts", "Traditional Items", "Culture", "Shopping"],
    isLiked: false,
  },
  {
    id: 5,
    name: "Plateau State Museum",
    description:
      "Discover the archaeological wonders and cultural artifacts that tell the story of Plateau State's rich heritage.",
    image: "/placeholder.svg?key=plateau-museum",
    category: "Museum",
    rating: 4.4,
    duration: "1-2 hours",
    location: "Jos North",
    distance: "3.2 km away",
    highlights: ["Archaeology", "Cultural Heritage", "Education", "History"],
    isLiked: false,
  },
  {
    id: 6,
    name: "Assop Falls",
    description: "A spectacular waterfall surrounded by lush vegetation, perfect for picnics and nature photography.",
    image: "/placeholder.svg?key=assop-falls",
    category: "Nature",
    rating: 4.7,
    duration: "2-3 hours",
    location: "Barkin Ladi",
    distance: "25.4 km away",
    highlights: ["Waterfall", "Picnic Spot", "Nature", "Photography"],
    isLiked: true,
  },
]

export default function SitesPage() {
  const [filteredSites, setFilteredSites] = useState(culturalSites)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = (filters: any) => {
    setIsLoading(true)

    setTimeout(() => {
      let filtered = culturalSites

      if (filters.search) {
        filtered = filtered.filter(
          (site) =>
            site.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            site.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            site.highlights.some((h) => h.toLowerCase().includes(filters.search.toLowerCase())),
        )
      }

      if (filters.category && filters.category !== "All Sites") {
        filtered = filtered.filter((site) => site.category === filters.category)
      }

      if (filters.duration) {
        filtered = filtered.filter((site) => {
          const siteDuration = site.duration
          switch (filters.duration) {
            case "Under 1 hour":
              return siteDuration.includes("30 min") || siteDuration.includes("45 min")
            case "1-2 hours":
              return siteDuration.includes("1-2")
            case "2-3 hours":
              return siteDuration.includes("2-3")
            case "3+ hours":
              return siteDuration.includes("3-4") || siteDuration.includes("4+")
            default:
              return true
          }
        })
      }

      if (filters.minRating > 0) {
        filtered = filtered.filter((site) => site.rating >= filters.minRating)
      }

      setFilteredSites(filtered)
      setIsLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav className="mb-6" />

          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Cultural Heritage
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Discover Jos Cultural Sites
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Explore the rich cultural heritage, natural wonders, and historical landmarks that make Jos a unique
              destination for cultural tourism.
            </p>
          </div>

          <div className="mb-8">
            <SiteFilters onFilterChange={handleFilterChange} />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {isLoading ? "Loading..." : `${filteredSites.length} Cultural Sites`}
              </h2>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Jos, Plateau State</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Map className="w-4 h-4 mr-2" />
                <span>Map View</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div
              className={`grid gap-8 mb-12 ${
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
              }`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SiteCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div
                className={`grid gap-8 mb-12 ${
                  viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
                }`}
              >
                {filteredSites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>

              {filteredSites.length === 0 && <NoSitesFound />}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

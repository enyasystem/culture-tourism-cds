"use client"

import React from "react"
import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav"
import { NoEventsFound } from "@/components/ui/empty-states"
import { EventCardSkeleton } from "@/components/ui/loading-states"
import { Calendar, Search, Filter, Plus } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Jos Cultural Festival 2025",
    description:
      "Annual celebration of Jos cultural heritage featuring traditional dances, music, arts, and local cuisine. Join corps members and locals in this vibrant celebration.",
    image: "/placeholder.svg?key=cultural-festival",
    date: "2025-03-15",
    time: "10:00 AM - 6:00 PM",
    location: "Jos Main Bowl",
    category: "Festival",
    attendees: 245,
    maxAttendees: 500,
    isBookmarked: true,
    organizer: "Jos Cultural Committee",
  },
  {
    id: 2,
    title: "Traditional Craft Workshop",
    description:
      "Learn traditional pottery and weaving techniques from local artisans. Perfect opportunity for corps members to engage with local culture.",
    image: "/placeholder.svg?key=craft-workshop",
    date: "2025-02-20",
    time: "2:00 PM - 5:00 PM",
    location: "Jos Arts & Crafts Center",
    category: "Workshop",
    attendees: 32,
    maxAttendees: 50,
    isBookmarked: false,
    organizer: "Jos Artisans Guild",
  },
  {
    id: 3,
    title: "Plateau State Museum Night",
    description:
      "Special evening tour of the museum with cultural performances and storytelling sessions about Jos history and heritage.",
    image: "/placeholder.svg?key=museum-night",
    date: "2025-02-28",
    time: "7:00 PM - 10:00 PM",
    location: "Plateau State Museum",
    category: "Cultural",
    attendees: 78,
    maxAttendees: 100,
    isBookmarked: false,
    organizer: "Museum Cultural Team",
  },
  {
    id: 4,
    title: "CDS Community Service Day",
    description:
      "Join fellow corps members in community development activities including cultural site maintenance and local community support.",
    image: "/placeholder.svg?key=community-service",
    date: "2025-03-05",
    time: "8:00 AM - 4:00 PM",
    location: "Various Locations",
    category: "CDS Activity",
    attendees: 156,
    maxAttendees: 300,
    isBookmarked: true,
    organizer: "NYSC Jos",
  },
  {
    id: 5,
    title: "Jos Food & Culture Fair",
    description:
      "Taste authentic Plateau State cuisine and learn about food traditions. Cultural cooking demonstrations and local food vendors.",
    image: "/placeholder.svg?key=food-fair",
    date: "2025-03-22",
    time: "11:00 AM - 8:00 PM",
    location: "Jos Recreation Center",
    category: "Food & Culture",
    attendees: 189,
    maxAttendees: 300,
    isBookmarked: false,
    organizer: "Jos Food Association",
  },
  {
    id: 6,
    title: "Shere Hills Hiking & Photography",
    description:
      "Guided hiking tour of Shere Hills with photography workshop. Capture the beauty of Jos landscapes and learn photography techniques.",
    image: "/placeholder.svg?key=hiking-photo",
    date: "2025-02-25",
    time: "6:00 AM - 2:00 PM",
    location: "Shere Hills",
    category: "Adventure",
    attendees: 45,
    maxAttendees: 60,
    isBookmarked: false,
    organizer: "Jos Adventure Club",
  },
]

const categories = ["All Events", "Festival", "Workshop", "Cultural", "CDS Activity", "Food & Culture", "Adventure"]

export default function EventsPage() {
  const [filteredEvents, setFilteredEvents] = useState(upcomingEvents)
  const [selectedCategory, setSelectedCategory] = useState("All Events")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = () => {
    setIsLoading(true)

    setTimeout(() => {
      let filtered = upcomingEvents

      if (searchQuery) {
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      if (selectedCategory !== "All Events") {
        filtered = filtered.filter((event) => event.category === selectedCategory)
      }

      setFilteredEvents(filtered)
      setIsLoading(false)
    }, 500)
  }

  const { useEffect } = React
  useEffect(() => {
    handleFilterChange()
  }, [searchQuery, selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav className="mb-6" />

          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Cultural Events
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Jos Cultural Events & Festivals
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Join upcoming cultural events, festivals, and CDS activities. Connect with fellow corps members and
              immerse yourself in Jos's vibrant cultural scene.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events, festivals, workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              {isLoading ? "Loading..." : `${filteredEvents.length} Upcoming Events`}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                <span>More Filters</span>
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Calendar View</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {filteredEvents.length === 0 && <NoEventsFound />}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

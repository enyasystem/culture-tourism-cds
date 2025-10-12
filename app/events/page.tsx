"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Filter, Plus, TrendingUp, Users, MapPin, Sparkles } from "lucide-react"

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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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

  useEffect(() => {
    handleFilterChange()
  }, [searchQuery, selectedCategory])

  const totalAttendees = upcomingEvents.reduce((sum, event) => sum + event.attendees, 0)
  const featuredEvent = upcomingEvents[0]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-24 pb-16 bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A7B7B] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-12 transition-all duration-1000 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Cultural Events & Festivals
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
              Discover Jos Cultural Events
            </h1>
            <p className="text-xl text-white/90 text-pretty max-w-3xl mx-auto">
              Join exciting cultural events, festivals, and CDS activities across Jos, Plateau State
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 ease-out delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{upcomingEvents.length}</div>
                  <div className="text-white/80 text-sm">Upcoming Events</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{totalAttendees}+</div>
                  <div className="text-white/80 text-sm">Total Attendees</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{categories.length - 1}</div>
                  <div className="text-white/80 text-sm">Event Categories</div>
                </div>
              </div>
            </div>
          </div>

          {featuredEvent && (
            <div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-1000 ease-out delay-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Featured Event</span>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-3 bg-white/20 text-white border-white/30">{featuredEvent.category}</Badge>
                  <h3 className="text-3xl font-bold text-white mb-3">{featuredEvent.title}</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">{featuredEvent.description}</p>
                  <div className="flex flex-wrap gap-4 mb-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{featuredEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{featuredEvent.attendees} attending</span>
                    </div>
                  </div>
                  <Button size="lg" className="bg-white text-[#1A7B7B] hover:bg-white/90">
                    Register Now
                  </Button>
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden">
                  <img
                    src={featuredEvent.image || "/placeholder.svg"}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search events, festivals, workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl border-2 focus:border-[#1A7B7B]"
                />
              </div>
              <Button size="lg" className="gap-2 bg-[#1A7B7B] hover:bg-[#0F766E] h-14 px-8">
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#1A7B7B] hover:bg-[#0F766E] text-white shadow-lg scale-105"
                      : "hover:border-[#1A7B7B] hover:text-[#1A7B7B]"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {isLoading ? "Loading..." : `${filteredEvents.length} Upcoming Events`}
            </h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl bg-transparent">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 rounded-xl bg-transparent">
                <Calendar className="w-4 h-4" />
                <span>Calendar View</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-2xl h-96" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(50px)",
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All Events")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

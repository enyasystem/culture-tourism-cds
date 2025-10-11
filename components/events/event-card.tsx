"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Bookmark, Share2 } from "lucide-react"
import { useState } from "react"

interface EventCardProps {
  event: {
    id: number
    title: string
    description: string
    image: string
    date: string
    time: string
    location: string
    category: string
    attendees: number
    maxAttendees?: number
    isBookmarked?: boolean
    organizer: string
  }
}

export function EventCard({ event }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(event.isBookmarked || false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    }
  }

  const dateInfo = formatDate(event.date)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden p-0">
      <div className="relative overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary">{event.category}</Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "text-primary fill-current" : "text-muted-foreground"}`} />
          </button>
          <button className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors">
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[60px]">
            <div className="text-xs font-medium">{dateInfo.month}</div>
            <div className="text-xl font-bold">{dateInfo.day}</div>
            <div className="text-xs">{dateInfo.weekday}</div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2">{event.title}</h3>
        </div>

        <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.attendees} attending
              {event.maxAttendees && ` • ${event.maxAttendees - event.attendees} spots left`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Organized by <span className="font-medium text-foreground">{event.organizer}</span>
          </div>
          <Button size="sm" className="group">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Join Event</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

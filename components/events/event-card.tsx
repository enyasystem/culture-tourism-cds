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
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden p-0 rounded-2xl border-2 hover:border-[#1A7B7B]/20">
      <div className="relative overflow-hidden h-56">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4">
          <Badge className="bg-[#1A7B7B] text-white border-0 shadow-lg">{event.category}</Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${isBookmarked ? "text-[#1A7B7B] fill-current" : "text-muted-foreground"}`}
            />
          </button>
          <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg">
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-white rounded-xl p-3 text-center min-w-[70px] shadow-xl">
            <div className="text-xs font-semibold text-[#1A7B7B] uppercase">{dateInfo.month}</div>
            <div className="text-2xl font-bold text-foreground">{dateInfo.day}</div>
            <div className="text-xs text-muted-foreground uppercase">{dateInfo.weekday}</div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground line-clamp-2 mb-3 group-hover:text-[#1A7B7B] transition-colors">
          {event.title}
        </h3>

        <p className="text-muted-foreground mb-5 text-sm leading-relaxed line-clamp-2">{event.description}</p>

        <div className="space-y-3 mb-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A7B7B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-[#1A7B7B]" />
            </div>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A7B7B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#1A7B7B]" />
            </div>
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A7B7B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-[#1A7B7B]" />
            </div>
            <span>
              {event.attendees} attending
              {event.maxAttendees && ` • ${event.maxAttendees - event.attendees} spots left`}
            </span>
          </div>
        </div>

        <div className="pt-5 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              by <span className="font-semibold text-foreground">{event.organizer}</span>
            </div>
            <Button size="sm" className="bg-[#1A7B7B] hover:bg-[#0F766E] gap-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>Join Event</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

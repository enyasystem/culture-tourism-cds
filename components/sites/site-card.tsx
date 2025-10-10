"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Navigation, Camera, Heart } from "lucide-react"
import { useState } from "react"

interface SiteCardProps {
  site: {
    id: number
    name: string
    description: string
    image: string
    category: string
    rating: number
    duration: string
    location: string
    distance: string
    highlights: string[]
    isLiked?: boolean
  }
}

export function SiteCard({ site }: SiteCardProps) {
  const [isLiked, setIsLiked] = useState(site.isLiked || false)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={site.image || "/placeholder.svg"}
          alt={site.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary">{site.category}</Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-secondary fill-current" />
            <span className="text-xs font-medium">{site.rating}</span>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "text-red-500 fill-current" : "text-muted-foreground"}`} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <MapPin className="w-4 h-4" />
            <span className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">{site.distance}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{site.name}</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{site.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {site.highlights.slice(0, 3).map((highlight, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {highlight}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{site.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{site.location}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 group">
            <Navigation className="w-4 h-4 mr-2" />
            <span>Get Directions</span>
          </Button>
          <Button variant="outline" size="icon">
            <Camera className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

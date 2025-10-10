"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

interface StoryCardProps {
  story: {
    id: number
    title: string
    content: string
    images: string[]
    author: {
      name: string
      avatar: string
      corpsId: string
    }
    location: string
    date: string
    likes: number
    comments: number
    tags: string[]
    isLiked?: boolean
  }
}

export function StoryCard({ story }: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(story.isLiked || false)
  const [likesCount, setLikesCount] = useState(story.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Author Header */}
      <CardContent className="p-4 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={story.author.avatar || "/placeholder.svg"} alt={story.author.name} />
            <AvatarFallback>
              {story.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{story.author.name}</h4>
              <Badge variant="outline" className="text-xs">
                {story.author.corpsId}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{story.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(story.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Story Content */}
      <CardContent className="p-4 pt-0">
        <h3 className="text-lg font-semibold text-foreground mb-2">{story.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">{story.content}</p>

        {/* Images */}
        {story.images.length > 0 && (
          <div className="mb-4">
            {story.images.length === 1 ? (
              <img
                src={story.images[0] || "/placeholder.svg"}
                alt="Story image"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {story.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Story image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {index === 3 && story.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold">+{story.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "text-red-500 fill-current" : ""}`} />
              <span>{likesCount}</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{story.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
          <Button variant="ghost" size="sm">
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, MapPin, Calendar, Bookmark } from "lucide-react"
import { useState } from "react"

interface StoryCardProps {
  story: {
    id: string
    title: string
    content: string
    images?: string[]
    author?: {
      name?: string
      avatar?: string
      corpsId?: string
    }
    location?: string
    date?: string
    likes?: number
    comments?: number
    tags?: string[]
    isLiked?: boolean
  }
}

export function StoryCard({ story }: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(story.isLiked || false)
  const [likesCount, setLikesCount] = useState<number>(story.likes || 0)
  const [isBookmarked, setIsBookmarked] = useState(false)

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

  // normalize optional arrays to avoid TS 'possibly undefined' checks in JSX
  const images = story.images ?? []
  const tags = story.tags ?? []

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-[#1A7B7B]/20 h-full flex flex-col">
      <CardContent className="p-6 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 ring-2 ring-[#1A7B7B]/20">
            <AvatarImage src={story.author?.avatar || "/placeholder.svg"} alt={story.author?.name || 'User'} />
            <AvatarFallback className="bg-[#1A7B7B] text-white">
              {(story.author?.name || 'U')
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">{story.author?.name || 'Unknown'}</h4>
              <Badge variant="outline" className="text-xs border-[#1A7B7B]/30 text-[#1A7B7B]">
                {story.author?.corpsId || ''}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{story.location || ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(story.date || '')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? "fill-[#1A7B7B] text-[#1A7B7B]" : "text-muted-foreground"}`}
            />
          </button>
        </div>
      </CardContent>

      <CardContent className="p-6 pt-0 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-[#1A7B7B] transition-colors">
          {story.title}
        </h3>
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">{story.content}</p>

        {images.length > 0 && (
          <div className="mb-4">
            {images.length === 1 ? (
              <div className="relative overflow-hidden rounded-xl group/image">
                <img
                  src={images[0] || "/placeholder.svg"}
                  alt="Story image"
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover/image:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg group/image">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Story image ${index + 1}`}
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover/image:scale-110"
                    />
                    {index === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-xl">+{images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs hover:bg-[#1A7B7B] hover:text-white hover:border-[#1A7B7B] transition-all cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t-2 border-border">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#1A7B7B] transition-all group/like"
            >
              <Heart
                className={`w-5 h-5 transition-all ${isLiked ? "text-red-500 fill-current scale-110" : "group-hover/like:scale-110"}`}
              />
              <span>{likesCount}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#1A7B7B] transition-all group/comment">
              <MessageCircle className="w-5 h-5 group-hover/comment:scale-110 transition-transform" />
              <span>{story.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#1A7B7B] transition-all group/share">
              <Share2 className="w-5 h-5 group-hover/share:scale-110 transition-transform" />
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold text-[#1A7B7B] hover:bg-[#1A7B7B] hover:text-white transition-all"
          >
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

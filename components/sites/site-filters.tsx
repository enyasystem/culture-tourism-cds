"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Clock, Star, X } from "lucide-react"

interface SiteFiltersProps {
  onFilterChange: (filters: any) => void
}

const categories = [
  "All Sites",
  "Nature",
  "Museum",
  "Landscape",
  "Historical",
  "Religious",
  "Cultural Center",
  "Recreation",
]

const durations = ["Under 1 hour", "1-2 hours", "2-3 hours", "3+ hours"]

export function SiteFilters({ onFilterChange }: SiteFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Sites")
  const [selectedDuration, setSelectedDuration] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = () => {
    onFilterChange({
      search: searchQuery,
      category: selectedCategory,
      duration: selectedDuration,
      minRating,
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Sites")
    setSelectedDuration("")
    setMinRating(0)
    onFilterChange({
      search: "",
      category: "All Sites",
      duration: "",
      minRating: 0,
    })
  }

  const { useEffect } = React
  useEffect(() => {
    handleFilterChange()
  }, [searchQuery, selectedCategory, selectedDuration, minRating])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search cultural sites, landmarks, museums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-4">
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>

        {(selectedCategory !== "All Sites" || selectedDuration || minRating > 0) && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "All Sites" || selectedDuration || minRating > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "All Sites" && (
            <Badge variant="secondary" className="gap-1">
              <span>{selectedCategory}</span>
              <button onClick={() => setSelectedCategory("All Sites")}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedDuration && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              <span>{selectedDuration}</span>
              <button onClick={() => setSelectedDuration("")}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3" />
              <span>{minRating}+ rating</span>
              <button onClick={() => setMinRating(0)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Detailed Filters */}
      {showFilters && (
        <Card className="animate-fade-in-up">
          <CardContent className="p-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Category</h3>
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

            {/* Duration */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Duration</h3>
              <div className="flex flex-wrap gap-2">
                {durations.map((duration) => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDuration(selectedDuration === duration ? "" : duration)}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    {duration}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Minimum Rating</h3>
              <div className="flex gap-2">
                {[3, 4, 4.5].map((rating) => (
                  <Button
                    key={rating}
                    variant={minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

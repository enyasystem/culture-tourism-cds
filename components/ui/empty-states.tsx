"use client"

import type React from "react"
import { Calendar, Camera, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {icon && <div className="mb-6 text-6xl opacity-50">{icon}</div>}
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">{description}</p>
        {action &&
          (action.href ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          ))}
      </CardContent>
    </Card>
  )
}

export function NoSitesFound() {
  return (
    <EmptyState
      icon="🏛️"
      title="No Cultural Sites Found"
      description="We couldn't find any cultural sites matching your criteria. Try adjusting your filters or search terms."
      action={{
        label: "Clear Filters",
        onClick: () => window.dispatchEvent(new Event('cts:clear-filters')),
      }}
    />
  )
}

export function NoEventsFound() {
  return (
    <div className="text-center py-16">
      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search terms or category filters to find more events.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => window.dispatchEvent(new Event('cts:clear-filters'))}>Clear Filters</Button>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>
    </div>
  )
}

export function NoStoriesFound() {
  return (
    <div className="text-center py-16">
      <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">No stories found</h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search terms or be the first to share a story about this topic.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => window.dispatchEvent(new Event('cts:clear-filters'))}>Clear Search</Button>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Share Your Story
        </Button>
      </div>
    </div>
  )
}

export function SearchNoResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description={`We couldn't find anything matching "${query}". Try different keywords or browse our categories.`}
      action={{
        label: "Browse All Sites",
        href: "/sites",
      }}
    />
  )
}

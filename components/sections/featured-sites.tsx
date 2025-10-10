"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useApi } from "@/hooks/use-api"

type CulturalSite = {
  id: string
  name: string
  description: string
  location: string
  state: string
  category: string
  image_url?: string
  is_featured: boolean
  created_at: string
}

export function FeaturedSites() {
  const { data: sites, loading, error } = useApi<CulturalSite[]>("/api/cultural-sites?featured=true")

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Featured Destinations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Must-Visit Cultural Sites in Jos
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded mb-4" />
                  <div className="h-10 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Error loading featured sites: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Featured Destinations
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Must-Visit Cultural Sites in Jos
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Discover the most popular cultural landmarks and natural wonders that make Jos a unique destination for
            corps members and tourists alike.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sites?.map((site) => (
            <Card
              key={site.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    site.image_url ||
                    `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(site.name + " cultural site")}`
                  }
                  alt={site.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{site.category}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{site.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{site.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{site.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{site.state}</span>
                  </div>
                </div>

                <Link href={`/sites/${site.id}`}>
                  <Button variant="outline" className="w-full group bg-transparent">
                    <span>Explore Site</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/sites">
            <Button size="lg" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              <span>View All Cultural Sites</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

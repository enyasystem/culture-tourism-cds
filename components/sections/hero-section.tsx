"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Camera, Users, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
      <div className="absolute inset-0 bg-[url('/abstract-cultural-pattern-jos-plateau.jpg')] opacity-5 bg-cover bg-center" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Discover Jos Culture & Tourism</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              <span className="text-foreground">Explore the</span> <span className="text-primary">Cultural Heart</span>{" "}
              <span className="text-foreground">of</span> <span className="text-secondary">Plateau State</span>
            </h1>

            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl">
              Join corps members in discovering Jos's rich cultural heritage, vibrant festivals, and breathtaking
              landmarks. Share your experiences and connect with fellow explorers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth">
                <Button size="lg" className="group">
                  <span>Start Exploring</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/sites">
                <Button variant="outline" size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>View Cultural Sites</span>
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground">Cultural Sites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">200+</div>
                <div className="text-muted-foreground">Corps Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">15+</div>
                <div className="text-muted-foreground">Annual Events</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Cultural Sites</h3>
              <p className="text-sm text-muted-foreground">
                Discover Jos Rock formations, museums, and historical landmarks
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mt-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Cultural Events</h3>
              <p className="text-sm text-muted-foreground">Join festivals, traditional dances, and CDS activities</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Share Stories</h3>
              <p className="text-sm text-muted-foreground">Upload photos and experiences from your cultural visits</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mt-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with fellow corps members and cultural enthusiasts
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

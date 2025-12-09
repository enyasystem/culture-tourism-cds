"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 120)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <section className="relative py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Badge className="mb-4 bg-[#1A7B7B] text-white">About Us</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About Culture & Tourism CDS</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">We empower NYSC corps members to document and promote Jos's cultural heritage through community-driven tourism initiatives, storytelling, and events.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-700 mb-4">To preserve, celebrate, and share Plateau State's cultural heritage while creating sustainable tourism opportunities that benefit local communities and corps members.</p>
                <h3 className="text-2xl font-semibold mb-4">What We Do</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Document cultural sites and oral histories</li>
                  <li>Organize community events and tours</li>
                  <li>Train corps members in responsible tourism</li>
                  <li>Share stories that inspire visitors and locals</li>
                </ul>
              </div>

              <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img src="/visit-wildlife-renamed/jos-wildlife-20251204-090246-3.jpg" alt="National Museum" className="w-full h-64 object-cover" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">100+</div>
                    <div className="text-sm text-gray-600">Active Corps Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">100+</div>
                    <div className="text-sm text-gray-600">Documented Sites</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">200+</div>
                    <div className="text-sm text-gray-600">Stories Shared</div>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

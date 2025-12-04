"use client"

import { useRef, useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"

export default function TribesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const contentRef = useRef<HTMLElement>(null)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === contentRef.current) setContentVisible(true)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    if (contentRef.current) observer.observe(contentRef.current)

    return () => observer.disconnect()
  }, [])

  const tribesData = [
    {
      id: 1,
      name: "Berom",
      location: "Jos and surrounding areas",
      population: "~400,000",
      description: "The Berom people are the primary inhabitants of the Jos Plateau. They are predominantly agriculturalists, cultivating crops like beans, maize, and potatoes. The Berom have a rich cultural heritage with traditional governance systems led by paramount chiefs.",
      traditions: ["Farming", "Traditional governance", "Craft making"],
      image: "/tribes/berom.jpg",
    },
    {
      id: 2,
      name: "Anaguta",
      location: "Jos Plateau region",
      population: "~50,000",
      description: "Indigenous to the Jos Plateau, the Anaguta people have maintained their distinct cultural identity for centuries. They are known for their agricultural practices, traditional rituals, and strong community bonds.",
      traditions: ["Agriculture", "Traditional rituals", "Stone carving"],
      image: "/tribes/anaguta.jpg",
    },
    {
      id: 3,
      name: "Afizere",
      location: "Riyom Local Government Area",
      population: "~20,000",
      description: "The Afizere maintain unique cultural practices distinct from neighboring groups. They are known for their skilled craftsmanship, traditional arts, and vibrant cultural festivals.",
      traditions: ["Craftsmanship", "Traditional arts", "Pottery"],
      image: "/tribes/afizere.jpg",
    },
    {
      id: 4,
      name: "Irigwe",
      location: "Southern Plateau State",
      population: "~100,000",
      description: "Living in the southern part of Plateau State, the Irigwe people have vibrant cultural traditions and strong communal practices. They are farmers and herders with a rich oral history.",
      traditions: ["Farming", "Herding", "Traditional dances"],
      image: "/tribes/irigwe.jpg",
    },
    {
      id: 5,
      name: "Jarawa",
      location: "Plateau State",
      population: "~30,000",
      description: "The Jarawa community is known for their unique language, traditional crafts, and strong cultural identity. They maintain distinct traditions and have contributed significantly to the cultural diversity of Plateau State.",
      traditions: ["Language preservation", "Craft making", "Traditional weaving"],
      image: "/tribes/jarawa.jpg",
    },
    {
      id: 6,
      name: "Tarok",
      location: "Langtang region",
      population: "~80,000",
      description: "Found in the Langtang region, the Tarok people have distinctive cultural practices and agricultural traditions. They are known for their hospitality and strong family structures.",
      traditions: ["Agriculture", "Traditional music", "Community ceremonies"],
      image: "/tribes/tarok.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] pt-24 overflow-hidden bg-gradient-to-b from-[#1A7B7B]/10 to-white">
        <div
          className="absolute inset-0 z-0 will-change-transform opacity-30"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src="/abstract-cultural-pattern-jos-plateau.jpg"
            alt="Plateau Background"
            className="w-full h-[120vh] object-cover"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className={`max-w-3xl transition-all duration-1200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Tribes of Plateau State
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed max-w-2xl">
              Discover the rich cultural diversity and heritage of the various ethnic groups that call Plateau State home.
            </p>
          </div>
        </div>
      </section>

      {/* Tribes Grid Section */}
      <section
        ref={contentRef}
        className={`py-20 bg-white transition-all duration-1200 ease-out ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tribesData.map((tribe, index) => (
                <div
                  key={tribe.id}
                  className={`group transition-all duration-800 ease-out ${
                    contentVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-90"
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1A7B7B] to-[#0F766E]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#1A7B7B]">
                        Tribe
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tribe.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{tribe.location}</p>

                      <p className="text-gray-700 mb-6 flex-1">{tribe.description}</p>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Estimated Population</p>
                          <p className="text-lg font-bold text-[#1A7B7B]">{tribe.population}</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Cultural Traditions</p>
                          <div className="flex flex-wrap gap-2">
                            {tribe.traditions.map((tradition, i) => (
                              <span key={i} className="bg-[#1A7B7B]/10 text-[#1A7B7B] px-3 py-1 rounded-full text-xs font-medium">
                                {tradition}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Preservation Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Preserving Cultural Heritage</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                The diverse tribes of Plateau State represent a rich tapestry of Nigerian culture. Each group maintains unique languages, traditions, and practices that have been passed down through generations.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Through tourism, education, and cultural documentation, we work to ensure that these invaluable traditions are preserved and celebrated for future generations. Visiting Plateau State offers a unique opportunity to experience this cultural diversity firsthand.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

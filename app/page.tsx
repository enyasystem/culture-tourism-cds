"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/layout/navigation"
import { UserOnboarding } from "@/components/onboarding/user-onboarding"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding(false)
  }

  const handleOnboardingClose = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setShowOnboarding(false)
  }

  const featuredDestinations = [
    {
      id: 1,
      name: "National Museum Jos",
      location: "Museum Street, Jos",
      image: "/national-museum-jos-cultural-artifacts.jpg",
      description: "Explore Nigeria's rich archaeological heritage",
    },
    {
      id: 2,
      name: "Shere Hills",
      location: "Shere Village, Jos",
      image: "/shere-hills-jos-plateau-landscape.jpg",
      description: "Breathtaking rock formations and views",
    },
    {
      id: 3,
      name: "Jos Wildlife Park",
      location: "Jos South, Plateau",
      image: "/jos-wildlife-park-plateau-state.jpg",
      description: "Home to diverse wildlife species",
    },
  ]

  const slides = [
    {
      mainImage: "/shere-hills-jos-plateau-landscape.jpg",
      destinations: featuredDestinations,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <UserOnboarding isOpen={showOnboarding} onClose={handleOnboardingClose} onComplete={handleOnboardingComplete} />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/abstract-cultural-pattern-jos-plateau.jpg"
            alt="Jos Plateau Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A7B7B]/90 via-[#1A7B7B]/70 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Side - Text Content */}
            <div className="text-white space-y-6 lg:space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight uppercase">
                EXPLORE YOUR
                <br />
                DREAM PLACE
                <br />
                WITH US
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-xl italic">
                Make the experience of traveling to your dream tourist destination come true with us. We will provide
                the best experience of your life.
              </p>
            </div>

            {/* Right Side - Search and Featured Cards */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Explore Here..."
                  className="w-full px-6 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 placeholder:text-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-[#1A7B7B] shadow-xl"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Main Featured Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={slides[currentSlide].mainImage || "/placeholder.svg"}
                  alt="Featured Destination"
                  className="w-full h-[300px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Navigation Arrows */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Three Destination Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {slides[currentSlide].destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">{destination.name}</h3>
                        <p className="text-sm text-gray-600">{destination.location}</p>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Link href={`/sites/${destination.id}`}>
                          <button className="flex items-center gap-2 bg-[#1A7B7B] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#156666] transition-colors">
                            Read More
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 pt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index ? "bg-white w-8" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Culture & Tourism CDS Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About Culture & Tourism CDS</h2>
              <div className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Empowering NYSC corps members to promote cultural heritage and sustainable tourism in Jos, Plateau State
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#1A7B7B]/10 to-[#0F766E]/5 p-8 rounded-3xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Culture & Tourism CDS group is dedicated to preserving and promoting the rich cultural heritage
                    of Jos and Plateau State. We work to develop sustainable tourism initiatives that benefit local
                    communities while providing corps members with meaningful service opportunities.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1A7B7B]/10 to-[#0F766E]/5 p-8 rounded-3xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#1A7B7B] text-xl">✓</span>
                      <span>Document and preserve cultural sites and heritage locations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#1A7B7B] text-xl">✓</span>
                      <span>Organize cultural events and tourism awareness programs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#1A7B7B] text-xl">✓</span>
                      <span>Connect corps members with local communities and tourism initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#1A7B7B] text-xl">✓</span>
                      <span>Share experiences and promote Jos as a cultural tourism destination</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/national-museum-jos-cultural-artifacts.jpg"
                    alt="Culture & Tourism CDS"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#1A7B7B] text-white p-8 rounded-2xl shadow-xl max-w-xs">
                  <p className="text-4xl font-bold mb-2">500+</p>
                  <p className="text-lg">Active Corps Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started with Culture & Tourism CDS in four simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#1A7B7B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
                  <p className="text-gray-600">Create your account and join the Culture & Tourism CDS community</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#1A7B7B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Explore Sites</h3>
                  <p className="text-gray-600">Discover cultural sites, museums, and heritage locations across Jos</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#1A7B7B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Attend Events</h3>
                  <p className="text-gray-600">Participate in cultural events, workshops, and CDS activities</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#1A7B7B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Share Stories</h3>
                  <p className="text-gray-600">Document your experiences and inspire other corps members</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link href="/auth/signup">
                <button className="bg-[#1A7B7B] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#156666] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Get Started Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Explore by Category</h2>
              <div className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover Jos's cultural treasures organized by your interests
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Museums & Heritage */}
              <Link href="/sites?category=museums" className="h-full">
                <div className="group bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Museums & Heritage</h3>
                  <p className="text-white/90 mb-4 flex-1">Explore archaeological sites and cultural museums</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Discover More</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Natural Attractions */}
              <Link href="/sites?category=nature" className="h-full">
                <div className="group bg-gradient-to-br from-[#0F766E] to-[#0D5F5F] rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Natural Attractions</h3>
                  <p className="text-white/90 mb-4 flex-1">Experience breathtaking landscapes and wildlife</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Discover More</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Festivals & Events */}
              <Link href="/events" className="h-full">
                <div className="group bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Festivals & Events</h3>
                  <p className="text-white/90 mb-4 flex-1">Join cultural celebrations and CDS activities</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Discover More</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Historical Sites */}
              <Link href="/sites?category=historical" className="h-full">
                <div className="group bg-gradient-to-br from-[#0F766E] to-[#0D5F5F] rounded-3xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Historical Sites</h3>
                  <p className="text-white/90 mb-4 flex-1">Discover Jos's rich historical landmarks</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Discover More</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Featured Upcoming Events</h2>
              <div className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join us for exciting cultural events and CDS activities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Event 1 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/national-museum-jos-cultural-artifacts.jpg"
                    alt="Cultural Heritage Workshop"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#1A7B7B] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Feb 15
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Heritage Workshop</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Learn about Jos's archaeological treasures and preservation techniques
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>50 spots</span>
                    </div>
                  </div>
                  <Link href="/events/1">
                    <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-colors">
                      Register Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* Event 2 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/shere-hills-jos-plateau-landscape.jpg"
                    alt="Shere Hills Hiking Tour"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#1A7B7B] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Feb 20
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Shere Hills Hiking Tour</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Experience breathtaking views and rock formations with fellow corps members
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>7:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>30 spots</span>
                    </div>
                  </div>
                  <Link href="/events/2">
                    <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-colors">
                      Register Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* Event 3 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/jos-wildlife-park-plateau-state.jpg"
                    alt="Wildlife Conservation Talk"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#1A7B7B] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Feb 25
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Wildlife Conservation Talk</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Learn about wildlife preservation and sustainable tourism practices
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>2:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>40 spots</span>
                    </div>
                  </div>
                  <Link href="/events/3">
                    <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-colors">
                      Register Now
                    </button>
                  </Link>
                </div>
              </div>

              {/* Event 4 */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/abstract-cultural-pattern-jos-plateau.jpg"
                    alt="Peace Building Forum"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#1A7B7B] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Mar 1
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Peace Building Forum</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Engage in discussions on promoting peace and cultural understanding
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>11:00 AM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>60 spots</span>
                    </div>
                  </div>
                  <Link href="/events/4">
                    <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-colors">
                      Register Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* View All Events Button */}
            <div className="text-center mt-12">
              <Link href="/events">
                <button className="bg-white border-2 border-[#1A7B7B] text-[#1A7B7B] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#1A7B7B] hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                  View All Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card to-muted/30 border-t py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-lg">P</span>
                </div>
                <div>
                  <span className="font-bold text-xl">Peace & Tourism</span>
                  <p className="text-xs text-muted-foreground">CDS Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Empowering Peace and Tourism CDS members to explore Jos's cultural heritage, promote peaceful
                coexistence, and develop sustainable tourism initiatives in Plateau State.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-foreground">Explore</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="/sites" className="hover:text-primary transition-colors font-medium">
                    Cultural Sites
                  </a>
                </li>
                <li>
                  <a href="/events" className="hover:text-primary transition-colors font-medium">
                    Peace Events
                  </a>
                </li>
                <li>
                  <a href="/stories" className="hover:text-primary transition-colors font-medium">
                    CDS Stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-foreground">Community</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors font-medium">
                    Peace & Tourism CDS
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors font-medium">
                    Local Communities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors font-medium">
                    Tourism Board
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-foreground">Contact</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>peacetourism@josculture.ng</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+234 xxx xxx xxxx</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Jos, Plateau State</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>
              &copy; 2025 Peace & Tourism CDS Platform. Developed by{" "}
              <span className="text-primary font-semibold">Enya Elvis (3367)</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

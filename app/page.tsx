"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { StoryCard } from "@/components/stories/story-card"
import { StoriesGrid } from "@/components/stories/stories-grid"
import { UserOnboarding } from "@/components/onboarding/user-onboarding"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const aboutRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const tribesRef = useRef<HTMLElement>(null)
  const categoriesRef = useRef<HTMLElement>(null)
  const eventsRef = useRef<HTMLElement>(null)

  const [aboutVisible, setAboutVisible] = useState(false)
  const [howItWorksVisible, setHowItWorksVisible] = useState(false)
  const [tribesVisible, setTribesVisible] = useState(false)
  const [categoriesVisible, setCategoriesVisible] = useState(false)
  const [eventsVisible, setEventsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

    setTimeout(() => setIsVisible(true), 100)

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === aboutRef.current) setAboutVisible(true)
          if (entry.target === howItWorksRef.current) setHowItWorksVisible(true)
          if (entry.target === tribesRef.current) setTribesVisible(true)
          if (entry.target === categoriesRef.current) setCategoriesVisible(true)
          if (entry.target === eventsRef.current) setEventsVisible(true)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (aboutRef.current) observer.observe(aboutRef.current)
    if (howItWorksRef.current) observer.observe(howItWorksRef.current)
    if (tribesRef.current) observer.observe(tribesRef.current)
    if (categoriesRef.current) observer.observe(categoriesRef.current)
    if (eventsRef.current) observer.observe(eventsRef.current)

    return () => observer.disconnect()
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

  const [slides, setSlides] = useState([
    {
      mainImage: "/shere-hills-jos-plateau-landscape.jpg",
      destinations: featuredDestinations,
    },
    {
      mainImage: "/national-museum-jos-cultural-artifacts.jpg",
      destinations: featuredDestinations,
    },
    {
      mainImage: "/jos-wildlife-park-plateau-state.jpg",
      destinations: featuredDestinations,
    },
  ])

  // Load admin-configured hero images if available
  // debug: show where hero came from
  const [heroSource, setHeroSource] = useState<'default' | 'admin' | 'none'>('default')

  const loadHero = async () => {
    try {
      const resp = await fetch('/api/admin/settings/hero')
      if (!resp.ok) return
      const json = await resp.json()
      console.debug('[page] /api/admin/settings/hero response', json)
      if (Array.isArray(json?.hero)) {
        const mapped = json.hero
          .map((h: any) => {
            if (!h) return null
            // Accept multiple shapes: string (URL), object with `url`, `publicUrl`, `public_url`, `src`, `image`, `path` etc.
            const url =
              typeof h === 'string'
                ? h
                : h.url ?? h.publicUrl ?? h.public_url ?? h.publicURL ?? h.src ?? h.image ?? h.path ?? null
            if (!url) return null
            return { mainImage: url, destinations: featuredDestinations }
          })
          .filter(Boolean)
        console.debug('[page] mapped hero slides', mapped)
        setSlides(mapped)
        // treat any returned array (including empty) as authoritative admin config
        setHeroSource('admin')
      }
    } catch (e) {
      console.error('failed to load hero settings', e)
    }
  }

  useEffect(() => {
    loadHero()

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'site-hero-updated') {
        loadHero()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const hasSlides = slides && slides.length > 0
  const activeSlide = hasSlides ? slides[currentSlide % slides.length] : null

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      <UserOnboarding isOpen={showOnboarding} onClose={handleOnboardingClose} onComplete={handleOnboardingComplete} />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-16 overflow-hidden">
        <div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src="/abstract-cultural-pattern-jos-plateau.jpg"
            alt="Jos Plateau Background"
            className="w-full h-[120vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A7B7B]/90 via-[#1A7B7B]/70 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Debug badge: shows whether admin hero is active
          <div className="absolute right-6 top-6 bg-white/80 text-sm text-gray-800 px-3 py-1 rounded-full shadow-md">
            {heroSource === 'admin' ? 'Hero: Admin' : heroSource === 'default' ? 'Hero: Default' : 'Hero: None'}
          </div> */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Side - Text Content */}
            <div
              className={`text-white space-y-6 lg:space-y-8 transition-all duration-1200 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
              }`}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight uppercase">
                <span
                  className="inline-block transition-all duration-700 delay-100"
                  style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
                >
                  DISCOVER JOS
                </span>
                <br />
                <span
                  className="inline-block transition-all duration-700 delay-200"
                  style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
                >
                  CULTURAL
                </span>
                <br />
                <span
                  className="inline-block transition-all duration-700 delay-300"
                  style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
                >
                  HERITAGE
                </span>
              </h1>
              <p
                className={`text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-xl italic transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Join Culture & Tourism CDS in exploring Jos's rich cultural heritage, promoting peace through tourism,
                and documenting the treasures of Plateau State for future generations.
              </p>
            </div>

            {/* Right Side - Search and Featured Cards */}
            <div
              className={`space-y-6 transition-all duration-1200 delay-400 ease-out ${
                isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-20 scale-95"
              }`}
            >
              {/* Search Bar */}
              <div
                className={`relative transition-all duration-800 delay-600 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <input
                  type="text"
                  placeholder="Explore Here..."
                  className="w-full px-6 py-4 rounded-[35px] bg-white/95 backdrop-blur-sm text-gray-800 placeholder:text-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-[#1A7B7B] shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
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

              {/* Main Featured Image (or placeholder when no admin slides) */}
              {hasSlides ? (
                <>
                  <div
                    className={`relative rounded-3xl overflow-hidden shadow-2xl group transition-all duration-800 delay-700 ${
                      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                  >
                    <img
                      src={activeSlide?.mainImage || "/placeholder.svg"}
                      alt="Featured Destination"
                      className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:-translate-x-1"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:translate-x-1"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Three Destination Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeSlide?.destinations.map((destination, index) => (
                      <div
                        key={destination.id}
                        className={`group perspective-1000 transition-all duration-800 ${
                          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                        }`}
                        style={{ transitionDelay: `${900 + index * 150}ms` }}
                      >
                        <div className="relative w-full h-full preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                          {/* Front Face */}
                          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col">
                            <div className="aspect-[4/3] relative overflow-hidden">
                              <img
                                src={destination.image || "/placeholder.svg"}
                                alt={destination.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-base">{destination.name}</h3>
                                <p className="text-sm text-gray-600">{destination.location}</p>
                              </div>
                              <div className="flex justify-end mt-3">
                                <button className="flex items-center gap-2 bg-[#1A7B7B] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#156666] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                  Read More
                                  <svg
                                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Back Face */}
                          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-3xl overflow-hidden shadow-xl flex flex-col p-6 text-white">
                            <h3 className="font-bold text-lg mb-3">{destination.name}</h3>
                            <p className="text-sm text-white/90 mb-4 flex-1">{destination.description}</p>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>4.8 Rating</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>Open Daily</span>
                              </div>
                            </div>
                            <Link href={`/sites/${destination.id}`} className="w-full">
                              <button className="w-full bg-white text-[#1A7B7B] py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                Explore Now
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Carousel Indicators */}
                  <div
                    className={`flex justify-center gap-2 pt-4 transition-all duration-800 delay-1200 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 rounded-full transition-all duration-500 hover:scale-110 ${
                          currentSlide === index ? "bg-white w-8" : "bg-white/50 w-3 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* About Culture & Tourism CDS Section */}
      <section
        ref={aboutRef}
        className={`py-20 bg-white transition-all duration-1200 ease-out ${
          aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About Culture & Tourism CDS</h2>
              <div
                className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6 transition-all duration-700 delay-200"
                style={{ width: aboutVisible ? "96px" : "0px" }}
              ></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Empowering NYSC corps members to promote cultural heritage and sustainable tourism in Jos, Plateau State
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div
                className={`space-y-6 transition-all duration-1000 delay-300 ease-out ${
                  aboutVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
                }`}
              >
                <div className="bg-gradient-to-br from-[#1A7B7B]/10 to-[#0F766E]/5 p-8 rounded-3xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Culture & Tourism CDS group is dedicated to preserving and promoting the rich cultural heritage
                    of Jos and Plateau State. We work to develop sustainable tourism initiatives that benefit local
                    communities while providing corps members with meaningful service opportunities.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1A7B7B]/10 to-[#0F766E]/5 p-8 rounded-3xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h3>
                  <ul className="space-y-3 text-gray-700">
                    {[
                      "Document and preserve cultural sites and heritage locations",
                      "Organize cultural events and tourism awareness programs",
                      "Connect corps members with local communities and tourism initiatives",
                      "Share experiences and promote Jos as a cultural tourism destination",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-3 transition-all duration-500 ${
                          aboutVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        }`}
                        style={{ transitionDelay: `${500 + index * 100}ms` }}
                      >
                        <span className="text-[#1A7B7B] text-xl">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`relative transition-all duration-1000 delay-500 ease-out ${
                  aboutVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-20 scale-95"
                }`}
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src="/visit-wildlife-renamed/jos-wildlife-20251204-090246-3.jpg"
                    alt="Culture & Tourism CDS"
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div
                  className={`absolute -bottom-6 -left-6 bg-[#1A7B7B] text-white p-8 rounded-2xl shadow-xl max-w-xs transition-all duration-700 delay-700 hover:scale-105 ${
                    aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                >
                  <p className="text-4xl font-bold mb-2">100+</p>
                  <p className="text-lg">Active Corps Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
 {/* Featured CDS Stories (replaces Featured Upcoming Events) */}
      <section
        ref={eventsRef}
        className={`py-20 bg-gradient-to-b from-gray-50 to-white transition-all duration-1200 ease-out ${
          eventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                eventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Corps Stories</h2>
              <div
                className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6 transition-all duration-700 delay-200"
                style={{ width: eventsVisible ? "96px" : "0px" }}
              ></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Recent stories shared by corps members</p>
            </div>

            {/* Stories grid will be populated via client fetch of admin stories */}
            <StoriesGrid visible={eventsVisible} />

            {/* View All Stories Button */}
            <div
              className={`text-center mt-12 transition-all duration-800 delay-600 ${
                eventsVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10"
              }`}
            >
              <Link href="/stories">
                <button className="bg-white border-2 border-[#1A7B7B] text-[#1A7B7B] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#1A7B7B] hover:text-white transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-2 duration-300">
                  View All Stories
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>        

      {/* Tribes of Plateau Section */}
      <section
        ref={tribesRef}
        className={`py-20 bg-white transition-all duration-1200 ease-out ${
          tribesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                tribesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Tribes of Plateau State</h2>
              <div
                className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6 transition-all duration-700 delay-200"
                style={{ width: tribesVisible ? "96px" : "0px" }}
              ></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the rich diversity of ethnic groups and their unique cultural heritage
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Berom",
                  description: "The Berom people are primarily found in Jos and the surrounding areas. Known for their agricultural practices and traditional governance systems.",
                  color: "from-[#1A7B7B] to-[#0F766E]",
                },
                {
                  name: "Anaguta",
                  description: "Indigenous to the Jos Plateau, the Anaguta have a rich cultural heritage centered around farming and traditional rituals.",
                  color: "from-[#0F766E] to-[#0D5F5F]",
                },
                {
                  name: "Afizere",
                  description: "The Afizere people maintain distinct cultural practices and are known for their craftsmanship and traditional arts.",
                  color: "from-[#1A7B7B] to-[#156666]",
                },
                {
                  name: "Irigwe",
                  description: "Living in the southern part of Plateau State, the Irigwe people have vibrant cultural traditions and communal practices.",
                  color: "from-[#0D5F5F] to-[#0A4C4C]",
                },
                {
                  name: "Jarawa",
                  description: "The Jarawa community is known for their unique language, traditional crafts, and strong cultural identity.",
                  color: "from-[#156666] to-[#1A7B7B]",
                },
                {
                  name: "Tarok",
                  description: "Found in the Langtang region, the Tarok people have distinctive cultural practices and agricultural traditions.",
                  color: "from-[#0A4C4C] to-[#0F766E]",
                },
              ].map((tribe, index) => (
                <div
                  key={index}
                  className={`group transition-all duration-800 ease-out ${
                    tribesVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-90"
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div className="relative h-[320px] preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                    {/* Front Face */}
                    <div className={`absolute inset-0 backface-hidden bg-gradient-to-br ${tribe.color} rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl`}>
                      <div>
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{tribe.name}</h3>
                        <p className="text-white/90 mb-4">{tribe.description}</p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <button className="text-white font-semibold w-full bg-white/10 py-2 rounded-full hover:bg-white/20 transition-all duration-300">Discover More</button>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-between border-2 border-[#1A7B7B]">
                      <div>
                        <h3 className="text-2xl font-bold text-[#1A7B7B] mb-4">{tribe.name}</h3>
                        <p className="text-gray-700 mb-4">{tribe.description}</p>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">Learn about traditions, festivals and crafts.</div>
                        </div>
                      </div>
                      <Link href="/tribes" className="w-full">
                        <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-all duration-300 hover:scale-105">
                          Explore Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`text-center mt-16 transition-all duration-800 delay-900 ${
                tribesVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10"
              }`}
            >
              <Link href="/tribes">
                <button className="bg-[#1A7B7B] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#156666] transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105">
                  Explore All Tribes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

   
     

       {/* Explore by Category Section */}
      <section
        ref={categoriesRef}
        className={`py-20 bg-white transition-all duration-1200 ease-out ${
          categoriesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${
                categoriesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Explore by Category</h2>
              <div
                className="w-24 h-1 bg-[#1A7B7B] mx-auto mb-6 transition-all duration-700 delay-200"
                style={{ width: categoriesVisible ? "96px" : "0px" }}
              ></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover Jos's cultural treasures organized by your interests
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Museums & Heritage */}
              <div
                className={`group perspective-1000 transition-all duration-800 ${
                  categoriesVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20"
                }`}
                style={{ transitionDelay: categoriesVisible ? "200ms" : "0ms" }}
              >
                <div className="relative h-[320px] preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
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
                      <p className="text-white/90 mb-4">Explore archaeological sites and cultural museums</p>
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                      <span>Discover More</span>
                      <svg
                        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-between border-2 border-[#1A7B7B]">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A7B7B] mb-4">Museums & Heritage</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#1A7B7B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">12 Heritage Sites</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#1A7B7B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">National Museum Jos</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#1A7B7B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Archaeological Sites</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/sites?category=museums" className="w-full">
                      <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-all duration-300 hover:scale-105">
                        Explore Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Natural Attractions */}
              <div
                className={`group perspective-1000 transition-all duration-800 ${
                  categoriesVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20"
                }`}
                style={{ transitionDelay: categoriesVisible ? "300ms" : "0ms" }}
              >
                <div className="relative h-[320px] preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#0F766E] to-[#0D5F5F] rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
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
                      <p className="text-white/90 mb-4">Experience breathtaking landscapes and wildlife</p>
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                      <span>Discover More</span>
                      <svg
                        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-between border-2 border-[#0F766E]">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0F766E] mb-4">Natural Attractions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#0F766E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">8 Natural Sites</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#0F766E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Shere Hills</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#0F766E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Wildlife Park</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/sites?category=nature" className="w-full">
                      <button className="w-full bg-[#0F766E] text-white py-3 rounded-full font-semibold hover:bg-[#0D5F5F] transition-all duration-300 hover:scale-105">
                        Explore Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Festivals & Events */}
              <div
                className={`group perspective-1000 transition-all duration-800 ${
                  categoriesVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20"
                }`}
                style={{ transitionDelay: categoriesVisible ? "400ms" : "0ms" }}
              >
                <div className="relative h-[320px] preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1A7B7B] to-[#0F766E] rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
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
                      <p className="text-white/90 mb-4">Join cultural celebrations and CDS activities</p>
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                      <span>Discover More</span>
                      <svg
                        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-between border-2 border-[#1A7B7B]">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A7B7B] mb-4">Festivals & Events</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#1A7B7B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">15+ Annual Events</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#1A7B7B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Cultural Festivals</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#1A7B7B] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">CDS Activities</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/events" className="w-full">
                      <button className="w-full bg-[#1A7B7B] text-white py-3 rounded-full font-semibold hover:bg-[#156666] transition-all duration-300 hover:scale-105">
                        View Events
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Historical Sites */}
              <div
                className={`group perspective-1000 transition-all duration-800 ${
                  categoriesVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20"
                }`}
                style={{ transitionDelay: categoriesVisible ? "500ms" : "0ms" }}
              >
                <div className="relative h-[320px] preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#0F766E] to-[#0D5F5F] rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
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
                      <p className="text-white/90 mb-4">Discover Jos's rich historical landmarks</p>
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                      <span>Discover More</span>
                      <svg
                        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-between border-2 border-[#0F766E]">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0F766E] mb-4">Historical Sites</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#0F766E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">10 Historical Sites</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#0F766E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Colonial Buildings</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#0F766E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Ancient Landmarks</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/sites?category=historical" className="w-full">
                      <button className="w-full bg-[#0F766E] text-white py-3 rounded-full font-semibold hover:bg-[#0D5F5F] transition-all duration-300 hover:scale-105">
                        Explore Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

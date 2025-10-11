import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1A7B7B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 bg-white rounded-lg p-1">
                <Image src="/logo.png" alt="Jos North Culture & Tourism CDS" fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Culture & Tourism</h3>
                <p className="text-sm text-white/80">CDS Platform</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              Connecting corps members with the rich cultural heritage and natural beauty of Jos, Plateau State.
              Discover, explore, and share your cultural journey.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0F766E] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0F766E] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0F766E] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/sites" className="hover:text-white transition-colors">
                  Cultural Sites
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Festivals
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Corps Stories
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@josculture.ng</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+234 (0) 73 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jos, Plateau State</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">© 2025 Culture & Tourism CDS Platform. All rights reserved.</p>
          <a
            href="https://github.com/enyasystem"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors group"
          >
            <span>Designed & Developed by Enya Elvis (PL/24C/3367)</span>
            <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  )
}

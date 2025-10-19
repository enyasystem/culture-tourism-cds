import Link from 'next/link'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <div className="max-w-3xl">
          <div className="mx-auto w-64 h-64">
            {/* Simple on-brand illustration: compass + broken path */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="200" height="200" rx="24" fill="#E6FFFA" />
              <g transform="translate(40,40)">
                <circle cx="60" cy="60" r="38" fill="#0F766E" opacity="0.08" />
                <path d="M58 28 L72 40 L48 52 L34 40 Z" fill="#0F766E" />
                <path d="M10 110 C30 80, 90 80, 110 110" stroke="#1A7B7B" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" fill="none" />
                <circle cx="8" cy="112" r="4" fill="#1A7B7B" />
                <circle cx="112" cy="112" r="4" fill="#1A7B7B" />
              </g>
            </svg>
          </div>

          <h1 className="mt-8 text-3xl sm:text-4xl font-bold text-foreground">Page not found</h1>
          <p className="mt-4 text-muted-foreground">We couldn't find the page you're looking for. It may have moved or no longer exists.</p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1A7B7B] text-white font-semibold hover:bg-[#156666] transition">
              Home
            </Link>
            <Link href="/stories" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#1A7B7B] text-[#1A7B7B] hover:bg-[#1A7B7B] hover:text-white transition">
              Browse Stories
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">If you followed a broken link, please let us know — or try searching from the navigation.</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}

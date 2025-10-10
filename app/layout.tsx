import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Culture & Tourism CDS | Jos, Plateau State",
  description:
    "Empowering NYSC corps members to explore, document, and promote Jos's rich cultural heritage and sustainable tourism in Plateau State",
  generator: "v0.app",
  keywords: ["Culture", "Tourism", "CDS", "Jos", "Plateau State", "NYSC", "Cultural Heritage", "Nigeria"],
  authors: [{ name: "Enya Elvis", url: "https://github.com/enyasystem" }],
  openGraph: {
    title: "Culture & Tourism CDS | Jos, Plateau State",
    description:
      "Empowering NYSC corps members to explore, document, and promote Jos's rich cultural heritage and sustainable tourism",
    url: "https://josculture.ng",
    siteName: "Culture & Tourism CDS Platform",
    images: [
      {
        url: "/logo-social.jpg",
        width: 1200,
        height: 630,
        alt: "Culture & Tourism CDS Platform",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culture & Tourism CDS | Jos, Plateau State",
    description: "Empowering NYSC corps members to explore Jos's rich cultural heritage",
    images: ["/logo-social.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.jpg",
    apple: "/apple-touch-icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}

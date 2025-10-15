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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://culture-tourism-cds.vercel.app"),
  openGraph: {
    title: "Culture & Tourism CDS | Jos, Plateau State",
    description:
      "Empowering NYSC corps members to explore, document, and promote Jos's rich cultural heritage and sustainable tourism",
    url: "/",
    siteName: "Jos North Culture & Tourism CDS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jos North Culture & Tourism CDS Platform",
        type: "image/png",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culture & Tourism CDS | Jos, Plateau State",
    description: "Empowering NYSC corps members to explore Jos's rich cultural heritage",
    images: ["/og-image.png"],
    creator: "@enyasystem",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest",
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

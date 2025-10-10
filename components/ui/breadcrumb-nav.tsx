"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

interface BreadcrumbNavProps {
  items?: { label: string; href?: string }[]
  className?: string
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbItems.length <= 1) return null

  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href || "/"}>{item.label}</Link>
                </BreadcrumbLink>
              )}
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

function generateBreadcrumbsFromPath(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: { label: string; href?: string }[] = [{ label: "Home", href: "/" }]

  let currentPath = ""
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = formatSegmentLabel(segment)

    if (index === segments.length - 1) {
      // Last segment - no href (current page)
      breadcrumbs.push({ label })
    } else {
      breadcrumbs.push({ label, href: currentPath })
    }
  })

  return breadcrumbs
}

function formatSegmentLabel(segment: string): string {
  // Convert URL segments to readable labels
  const labelMap: Record<string, string> = {
    sites: "Cultural Sites",
    events: "Events",
    stories: "Stories",
    community: "Community",
    admin: "Admin",
    auth: "Authentication",
    search: "Search Results",
  }

  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
}

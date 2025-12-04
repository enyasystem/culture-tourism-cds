"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  Camera,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

// menuItems is rendered dynamically; badges may be updated at runtime
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", badge: null },
  // Removed Corps Members link per privacy request
  { icon: MapPin, label: "Cultural Sites", href: "/admin/sites", badge: null },
  { icon: Calendar, label: "Events", href: "/admin/events", badge: null },
  // { icon: Camera, label: "Stories", href: "/admin/stories", badge: null },
  { icon: Camera, label: "Stories", href: "/admin/content", badge: null },
  // { icon: BarChart3, label: "Analytics...", href: "/admin/analytics", badge: null },
  { icon: Settings, label: "Settings", href: "/admin/settings", badge: null },
]

interface AdminSidebarProps {
  currentPath?: string
  mobileOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ currentPath = "/admin", mobileOpen, onClose }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const [counts, setCounts] = useState<{ events: number; stories: number }>({ events: 0, stories: 0 })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
        const { count: eventsCount } = await supabase.from("events").select("id", { head: true, count: "exact" })
        const { count: storiesCount } = await supabase.from("stories").select("id", { head: true, count: "exact" })
        setCounts({ events: (eventsCount as number) || 0, stories: (storiesCount as number) || 0 })
      } catch (err) {
        console.error("Failed to fetch sidebar counts:", err)
      }
    }

    fetchCounts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    localStorage.removeItem("admin_username")
    localStorage.removeItem("admin_login_time")
    router.push("/admin/login")
  }

  const SidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-card to-background/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-sm font-bold text-foreground">Admin Panel</h2>
              </div>
              <p className="text-xs text-muted-foreground">Jos Culture Platform</p>
            </div>
          )}
          {/* collapse toggle - hide on small screens to avoid duplicate mobile controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto hidden md:inline-flex hover:bg-primary/10"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          {/* mobile close */}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-2 md:hidden hover:bg-primary/10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} onClick={() => onClose?.()}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 transition-all ${
                      isActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "text-foreground hover:bg-primary/10"
                    } ${isCollapsed ? "px-2" : "px-3"}`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant={isActive ? "secondary" : "outline"}
                            className={`text-xs ${isActive ? "bg-white/20 text-white" : ""}`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 bg-gradient-to-t from-background/80 to-transparent">
        <Button
          variant="outline"
          className={`w-full justify-start gap-3 text-primary hover:bg-primary/10 font-medium mb-2 ${isCollapsed ? "px-2" : "px-3"}`}
          onClick={() => window.open('/', '_blank')}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Visit Site</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium ${isCollapsed ? "px-2" : "px-3"}`}
          onClick={() => {
            handleLogout()
            onClose?.()
          }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop / large screens */}
      <aside className={`hidden md:flex bg-card border-r border-border/50 transition-all duration-300 flex-col ${isCollapsed ? "w-16" : "w-64"}`}>
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-card w-64 h-full border-r border-border shadow-xl">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

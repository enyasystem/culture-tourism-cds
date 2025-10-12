"use client"

import { useState } from "react"
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
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", badge: null },
  { icon: Users, label: "Corps Members", href: "/admin/users", badge: "245" },
  { icon: MapPin, label: "Cultural Sites", href: "/admin/sites", badge: null },
  { icon: Calendar, label: "Events", href: "/admin/events", badge: "12" },
  { icon: Camera, label: "Stories", href: "/admin/stories", badge: "8" },
  { icon: FileText, label: "Content", href: "/admin/content", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics", badge: null },
  { icon: Settings, label: "Settings", href: "/admin/settings", badge: null },
]

interface AdminSidebarProps {
  currentPath?: string
}

export function AdminSidebar({ currentPath = "/admin" }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    localStorage.removeItem("admin_username")
    localStorage.removeItem("admin_login_time")
    router.push("/admin/login")
  }

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">Jos Culture Platform</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = currentPath === item.href
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${isCollapsed ? "px-2" : "px-3"}`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
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
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${isCollapsed ? "px-2" : "px-3"}`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}

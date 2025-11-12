"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Trophy,
  LogOut,
  Code2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  MessageSquare,
  Play,
} from "lucide-react"
import { Button } from "./ui/button"
import { Tooltip } from "./ui/tooltip"
import { cn } from "../lib/utils"
import { useAuth } from "../contexts/AuthContext"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/interviewee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Available Tests",
    href: "/interviewee/tests",
    icon: Play,
  },
  {
    title: "My Results",
    href: "/interviewee/results",
    icon: Trophy,
  },
  {
    title: "Practice Arena",
    href: "/interviewee/practice",
    icon: BookOpen,
  },
  {
    title: "Scheduled Interviews",
    href: "/interviewee/interviews",
    icon: Clock,
  },
  {
    title: "Messages",
    href: "/interviewee/messages",
    icon: MessageSquare,
  },
]

export default function IntervieweeSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('interviewee-sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })
  const location = useLocation()
  const { logout } = useAuth()

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    localStorage.setItem('interviewee-sidebar-collapsed', JSON.stringify(newCollapsed))
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-sidebar-primary" />
            <div>
              <span className="font-bold text-sidebar-foreground">SmartHire</span>
              <p className="text-xs text-sidebar-foreground/70">Candidate Portal</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleCollapse}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Tooltip key={item.href} content={item.title} show={collapsed}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center space-x-0"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
                {collapsed && isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-sidebar-accent-foreground rounded-r-full"></div>
                )}
              </Link>
            </Tooltip>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Tooltip content="Logout" show={collapsed}>
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}


//       const currentPath = window.location.pathname
//       if (currentPath !== "/interviewee/dashboard") {
//         fetchNotifications()
//         fetchUnreadCount()
//       }
//     }, 10000)

//     return () => clearInterval(interval)
//   }, [user])

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         markAsRead,
//         markAllAsRead,
//         clearAllNotifications,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   )
// }
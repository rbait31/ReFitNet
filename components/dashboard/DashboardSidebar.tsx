"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  MessageSquare,
  Star,
  History,
  Settings,
  Globe,
} from "lucide-react"
import { SignOutButton } from "@/components/SignOutButton"

interface DashboardSidebarProps {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

const menuItems = [
  {
    href: "/dashboard",
    label: "Результаты",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/public",
    label: "Публичные результаты",
    icon: Globe,
  },
  {
    href: "/dashboard/favorites",
    label: "Избранное",
    icon: Star,
  },
  {
    href: "/dashboard/history",
    label: "История",
    icon: History,
  },
  {
    href: "/dashboard/settings",
    label: "Настройки",
    icon: Settings,
  },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 border-r border-blue-200 flex flex-col">
      {/* Профиль пользователя */}
      <div className="p-6 border-b border-blue-200">
        <div className="flex flex-col items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
              style={{ 
                width: '64px', 
                height: '64px',
                minWidth: '64px',
                minHeight: '64px'
              }}
              referrerPolicy="no-referrer"
              onLoad={() => {
                console.log('User image loaded successfully:', user.image)
              }}
              onError={(e) => {
                console.error('Failed to load user image:', user.image)
                // Если изображение не загрузилось, показываем placeholder
                const placeholder = document.createElement('div')
                placeholder.className = 'w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl font-semibold border-2 border-white shadow-md'
                placeholder.textContent = user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
                e.currentTarget.parentElement?.replaceChild(placeholder, e.currentTarget)
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl font-semibold border-2 border-white shadow-md">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="text-center">
            <p className="font-medium text-gray-800">{user.name || "Пользователь"}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Меню навигации */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href === "/dashboard" && pathname === "/dashboard")
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-200 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Выход */}
      <div className="p-4 border-t border-blue-200">
        <SignOutButton />
      </div>
    </aside>
  )
}


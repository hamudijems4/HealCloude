"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, LayoutDashboard, User, Building2, LogOut, Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "MoH Dashboard", roles: ["moh_analyst", "super_admin"] },
  { href: "/patient", icon: User, label: "My Health", roles: ["patient", "clinician", "facility_admin", "super_admin"] },
  { href: "/dashboard/facilities", icon: Building2, label: "Facilities", roles: ["facility_admin", "super_admin"] },
  { href: "/dashboard/map", icon: Map, label: "Disease Map", roles: ["moh_analyst", "super_admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()

  const visibleItems = NAV_ITEMS.filter((item) =>
    !user || item.roles.includes(user.role)
  )

  return (
    <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-base tracking-tight">TenaLink</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-2">
        {user && (
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-gray-300 truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace("_", " ")}</p>
          </div>
        )}
        <button
          onClick={clearAuth}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

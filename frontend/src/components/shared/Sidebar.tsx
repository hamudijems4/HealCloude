"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity, LayoutDashboard, User, Building2,
  LogOut, Map, Bell, Settings, HeartPulse,
  Users, Briefcase, FileText, Plane, Hotel, CreditCard, Crown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/leads", icon: Users, label: "Leads & Clients", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/packages", icon: Briefcase, label: "Packages", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/passports", icon: FileText, label: "Passports", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/visa", icon: FileText, label: "Visa Management", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/jobs", icon: Briefcase, label: "Job Orders", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/umrah", icon: Building2, label: "Umrah Packages", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/flights", icon: Plane, label: "Flights", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/hotels", icon: Hotel, label: "Hotels", roles: ["moh_analyst", "super_admin"] },
  { href: "/dashboard/sales", icon: CreditCard, label: "Sales & Orders", roles: ["moh_analyst", "super_admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, clearAuth } = useAuthStore()
  const visible = NAV.filter((n) => !user || n.roles.includes(user.role))

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-30">
      {/* Logo - Exactly like screenshot */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-100">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-[900] text-ink-primary text-xl tracking-tighter leading-none">TenaLink</p>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mt-1.5 leading-none">Health Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {visible.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200",
                active
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                  : "text-ink-muted hover:text-ink-primary hover:bg-gray-50"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-ink-muted")} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-[24px] p-5 text-white relative overflow-hidden shadow-xl shadow-primary-100">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-base mb-1">Upgrade to Pro</p>
            <p className="text-[11px] text-primary-100 mb-5 leading-relaxed font-medium">Unlock all features and get exclusive benefits.</p>
            <button className="w-full py-2.5 px-4 bg-white text-primary-600 rounded-xl text-xs font-extrabold hover:bg-primary-50 transition-all shadow-sm">
              Upgrade Now
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={clearAuth}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-ink-muted hover:text-danger hover:bg-danger-light transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

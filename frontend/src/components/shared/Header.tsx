"use client"
import { Bell, Search } from "lucide-react"
import { useAuthStore } from "@/store/auth"

export function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
      <div>
        {title && <h1 className="font-bold text-ink-primary text-lg">{title}</h1>}
        {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-56 shadow-card">
          <Search className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          <input
            placeholder="Search patients, regions..."
            className="text-xs bg-transparent focus:outline-none text-ink-secondary placeholder-ink-muted w-full"
          />
        </div>
        <button className="relative p-2 bg-white border border-gray-200 rounded-xl shadow-card hover:shadow-card-hover transition-all">
          <Bell className="w-4 h-4 text-ink-secondary" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-danger rounded-full border-2 border-white" />
        </button>
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-600">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-ink-primary leading-tight">{user.full_name}</p>
              <p className="text-[10px] text-ink-muted capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

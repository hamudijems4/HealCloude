"use client"
import { useMohSummary, useRegionalStats, useDiseaseAlerts } from "@/hooks/useHealth"
import { Activity, AlertTriangle, Building2, Users, Brain, Wifi } from "lucide-react"
import { cn, getRiskBg } from "@/lib/utils"
import { WellnessMap } from "@/components/maps/WellnessMap"
import { NationalTrendChart } from "@/components/charts/NationalTrendChart"

export default function DashboardPage() {
  const { data: summary } = useMohSummary()
  const { data: alerts } = useDiseaseAlerts()
  const { data: regions } = useRegionalStats()

  const stats = [
    {
      label: "Registered Patients",
      value: summary?.total_registered_patients?.toLocaleString() ?? "—",
      icon: Users,
      color: "text-brand-400",
    },
    {
      label: "Facilities Online",
      value: summary ? `${summary.facilities_online} / ${summary.facilities_online + summary.facilities_offline}` : "—",
      icon: Building2,
      color: "text-green-400",
    },
    {
      label: "Active Alerts",
      value: summary?.active_alerts ?? "—",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "Avg Wellness Score",
      value: summary ? `${summary.avg_national_wellness_score}%` : "—",
      icon: Activity,
      color: "text-yellow-400",
    },
    {
      label: "AI Interventions Today",
      value: summary?.ai_interventions_today?.toLocaleString() ?? "—",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      label: "USSD Sessions Today",
      value: summary?.ussd_sessions_today?.toLocaleString() ?? "—",
      icon: Wifi,
      color: "text-teal-400",
    },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">National Health Overview</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Real-time surveillance across all regions · Updated every 30s
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <Icon className={cn("w-5 h-5 mb-3", color)} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card p-4 min-h-[420px]">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Regional Wellness Heatmap</h2>
          <WellnessMap regions={regions ?? []} />
        </div>

        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">
            Active Disease Alerts
            {alerts && alerts.length > 0 && (
              <span className="ml-2 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">
                {alerts.length}
              </span>
            )}
          </h2>
          <div className="space-y-3">
            {alerts?.map((alert, i) => (
              <div key={i} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{alert.disease_name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {alert.region}{alert.zone ? ` · ${alert.zone}` : ""}
                    </p>
                  </div>
                  <span className={cn("risk-badge", getRiskBg(
                    alert.severity === "emergency" ? "critical"
                    : alert.severity === "warning" ? "high" : "medium"
                  ))}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-brand-400 text-xs mt-2 font-medium">{alert.case_count} cases reported</p>
              </div>
            ))}
            {!alerts?.length && (
              <p className="text-gray-500 text-sm text-center py-8">No active alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="glass-card p-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">National Wellness Trend (30 days)</h2>
        <NationalTrendChart />
      </div>

      {/* Regional Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300">Regional Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="text-left px-4 py-3 font-medium">Region</th>
                <th className="text-right px-4 py-3 font-medium">Patients</th>
                <th className="text-right px-4 py-3 font-medium">Facilities</th>
                <th className="text-right px-4 py-3 font-medium">Wellness Score</th>
                <th className="text-right px-4 py-3 font-medium">Alerts</th>
                <th className="px-4 py-3 font-medium">Top Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {regions?.map((r) => (
                <tr key={r.region} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.region}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{r.total_patients.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{r.facility_count}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      "font-semibold",
                      r.avg_wellness_score >= 70 ? "text-green-400" :
                      r.avg_wellness_score >= 50 ? "text-yellow-400" : "text-red-400"
                    )}>
                      {r.avg_wellness_score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.active_alerts > 0 ? (
                      <span className="text-red-400 font-medium">{r.active_alerts}</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.top_conditions.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

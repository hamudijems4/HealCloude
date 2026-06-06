"use client"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import type { RegionalStats } from "@/types"

const COLORS = ["#5c59f0", "#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b"]

interface Props { regions: RegionalStats[] }

export function RegionDonutChart({ regions }: Props) {
  const top5 = [...regions]
    .sort((a, b) => b.total_patients - a.total_patients)
    .slice(0, 5)

  const total = top5.reduce((s, r) => s + r.total_patients, 0)

  return (
    <div>
      <div className="relative h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={top5} dataKey="total_patients" nameKey="region" innerRadius={55} outerRadius={78} paddingAngle={4}>
              {top5.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(v: number) => [v.toLocaleString(), "Patients"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold text-ink-primary">{(total / 1000).toFixed(0)}K</span>
          <span className="text-[10px] text-ink-muted font-semibold uppercase tracking-wide">Patients</span>
        </div>
      </div>
      <div className="space-y-2.5 mt-4">
        {top5.map((r, i) => (
          <div key={r.region} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-xs font-medium text-ink-secondary">{r.region}</span>
            </div>
            <span className="text-xs font-bold text-ink-primary">{r.total_patients.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

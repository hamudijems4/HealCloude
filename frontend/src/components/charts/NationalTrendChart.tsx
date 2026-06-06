"use client"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { subDays, format } from "date-fns"

const data = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "MMM d"),
  wellness: Math.round(58 + Math.random() * 12 - 5 + i * 0.2),
  interventions: Math.round(12000 + Math.random() * 4000),
}))

export function NationalTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="wellnessGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} domain={[50, 80]} />
        <Tooltip
          contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", fontSize: 12 }}
          labelStyle={{ color: "#d1d5db" }}
          itemStyle={{ color: "#14b8a6" }}
        />
        <Area
          type="monotone"
          dataKey="wellness"
          name="Wellness Score"
          stroke="#14b8a6"
          strokeWidth={2}
          fill="url(#wellnessGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

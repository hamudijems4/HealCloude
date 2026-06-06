"use client"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { subDays, format } from "date-fns"

const data = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "MMM d"),
  wellness: Math.round(58 + Math.random() * 10 + i * 0.2),
}))

export function NationalTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="wellnessGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5c59f0" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#5c59f0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#929ab8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={4}
          dy={8}
        />
        <YAxis
          tick={{ fill: "#929ab8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={[50, 80]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: 12,
          }}
          labelStyle={{ color: "#1e2547", fontWeight: 600 }}
          itemStyle={{ color: "#5c59f0" }}
        />
        <Area
          type="monotone"
          dataKey="wellness"
          name="Wellness Score"
          stroke="#5c59f0"
          strokeWidth={2.5}
          fill="url(#wellnessGrad)"
          dot={false}
          activeDot={{ r: 5, fill: "#5c59f0", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

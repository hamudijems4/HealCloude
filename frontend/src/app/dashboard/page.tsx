"use client"
import { useMohSummary, useRegionalStats, useDiseaseAlerts } from "@/hooks/useHealth"
import {

  Users, Building2, AlertTriangle, Activity,
  Brain, Wifi, ArrowUpRight, MoreHorizontal, Bell,
  Calendar, ChevronDown, CreditCard, Briefcase, FileText,
  TrendingUp, Plane, Hotel, MapPin, Clock, CheckCircle2, ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts"

const REVENUE_DATA = [
  { name: "Jan", value: 400 }, { name: "Feb", value: 600 }, { name: "Mar", value: 500 },
  { name: "Apr", value: 800 }, { name: "May", value: 700 }, { name: "Jun", value: 900 },
  { name: "Jul", value: 850 }, { name: "Aug", value: 1100 }, { name: "Sep", value: 1000 },
  { name: "Oct", value: 1300 }, { name: "Nov", value: 1200 }, { name: "Dec", value: 1500 },
]

const CLIENTS_BY_COUNTRY = [
  { name: "Pakistan", value: 45, color: "#5c59f0" },
  { name: "India", value: 20, color: "#8b5cf6" },
  { name: "Bangladesh", value: 15, color: "#10b981" },
  { name: "Nepal", value: 10, color: "#f59e0b" },
  { name: "Others", value: 10, color: "#ef4444" },
]

const VISA_STATUS = [
  { name: "Approved", value: 658, color: "#10b981" },
  { name: "Processing", value: 356, color: "#5c59f0" },
  { name: "Pending", value: 134, color: "#f59e0b" },
  { name: "Rejected", value: 100, color: "#ef4444" },
]

const MINI_CHART_DATA = [
  { v: 40 }, { v: 30 }, { v: 45 }, { v: 35 }, { v: 55 }, { v: 40 }, { v: 60 }
]

function StatCard({ label, value, trend, trendType, icon: Icon, color, chartColor }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={cn("w-12 h-12 rounded-[18px] flex items-center justify-center shadow-sm", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="h-8 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MINI_CHART_DATA}>
              <Line type="monotone" dataKey="v" stroke={chartColor} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.1em]">{label}</p>
        <h3 className="text-3xl font-[900] text-ink-primary mt-1 tracking-tighter">{value}</h3>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={cn(
          "flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-lg",
          trendType === "up" ? "text-success bg-success-light" : "text-danger bg-danger-light"
        )}>
          {trendType === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trend}
        </div>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">vs last month</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: summary } = useMohSummary()

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12">
      {/* Header Section - Matched to Screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-[900] text-ink-primary tracking-tight">Good Morning, Ahmed 👋</h1>
          <p className="text-ink-muted text-sm font-semibold mt-1 opacity-80">Here's what's happening with your health system today.</p>
        </div>
        <button className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-ink-secondary hover:bg-gray-50 transition-all">
          <Calendar className="w-5 h-5 text-primary-500" />
          <span className="font-extrabold">May 24, 2025</span>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          label="Total Patients" value="3,580" trend="+ 12.5%" trendType="up"
          icon={Users} color="bg-info-light text-info" chartColor="#3b82f6"
        />
        <StatCard 
          label="Passports" value="2,945" trend="+ 8.3%" trendType="up"
          icon={FileText} color="bg-success-light text-success" chartColor="#10b981"
        />
        <StatCard 
          label="Visas Processing" value="1,248" trend="+ 5.7%" trendType="up"
          icon={Briefcase} color="bg-purple-light text-purple" chartColor="#8b5cf6"
        />
        <StatCard 
          label="Upcoming Departures" value="18" trend="+ 20.0%" trendType="up"
          icon={TrendingUp} color="bg-warning-light text-warning" chartColor="#f59e0b"
        />
        <StatCard 
          label="Revenue (This Month)" value="$128,430" trend="+ 15.3%" trendType="up"
          icon={CreditCard} color="bg-danger-light text-danger" chartColor="#ef4444"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Overview Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-black text-ink-primary">Revenue Overview</h2>
                <div className="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-black text-ink-muted uppercase tracking-widest">This Year</div>
              </div>
              <div className="flex items-end gap-4">
                <span className="text-4xl font-black text-ink-primary tracking-tighter">$1,482,430</span>
                <div className="flex items-center gap-1 text-success font-black text-base mb-1">
                  <ArrowUpRight className="w-5 h-5" />
                  18.6% <span className="text-ink-muted font-bold ml-1 text-sm">vs last year</span>
                </div>
              </div>
            </div>
            <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
              <MoreHorizontal className="w-6 h-6 text-ink-muted" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5c59f0" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#5c59f0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#929ab8', fontSize: 12, fontWeight: 700 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#929ab8', fontSize: 12, fontWeight: 700 }} tickFormatter={(v) => `$${v}K`} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#5c59f0" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Charts Stack */}
        <div className="flex flex-col gap-8">
          {/* Clients by Country Donut */}
          <div className="bg-white p-8 rounded-[40px] shadow-card border border-gray-50 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-ink-primary">Clients by Country</h2>
              <button className="text-[11px] font-black text-ink-muted bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                All Countries <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="relative h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CLIENTS_BY_COUNTRY} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                    {CLIENTS_BY_COUNTRY.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-ink-primary tracking-tighter">3,580</span>
                <span className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {CLIENTS_BY_COUNTRY.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-ink-muted">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-ink-primary">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visa Status Donut */}
          <div className="bg-white p-8 rounded-[40px] shadow-card border border-gray-50 flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-ink-primary">Visa Status Overview</h2>
              <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <MoreHorizontal className="w-6 h-6 text-ink-muted" />
              </button>
            </div>
            <div className="relative h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={VISA_STATUS} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                    {VISA_STATUS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-ink-primary tracking-tighter">1,248</span>
                <span className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-1">Total Visas</span>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {VISA_STATUS.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-ink-muted">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-ink-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Departures List */}
        <div className="bg-white p-8 rounded-[40px] shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-ink-primary tracking-tight">Upcoming Departures</h2>
            <button className="text-xs font-black text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-tighter">May</span>
                  <span className="text-xl font-black text-ink-primary leading-none">{24 + i}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-ink-primary truncate">Umrah Group - May 2025</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                    <span className="text-xs text-ink-muted font-bold">Saudi Arabia</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-ink-primary">12 Pax</p>
                  <span className="text-[9px] font-black text-success bg-success-light px-2 py-1 rounded-lg uppercase tracking-widest mt-1 inline-block">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities List */}
        <div className="bg-white p-8 rounded-[40px] shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-ink-primary tracking-tight">Recent Activities</h2>
            <button className="text-xs font-black text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-7">
            {[
              { title: "New client registered", time: "10 min ago", icon: Users, color: "text-info bg-info-light" },
              { title: "Visa approved - Ahmed Ali", time: "45 min ago", icon: CheckCircle2, color: "text-success bg-success-light" },
              { title: "New payment received", time: "2 hours ago", icon: CreditCard, color: "text-danger bg-danger-light" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", activity.color)}>
                  <activity.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-ink-primary leading-snug">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="w-3.5 h-3.5 text-ink-muted" />
                    <span className="text-xs text-ink-muted font-bold">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks & Reminders List */}
        <div className="bg-white p-8 rounded-[40px] shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-ink-primary tracking-tight">Tasks & Reminders</h2>
            <button className="text-xs font-black text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-5">
            {[
              { task: "Follow up with visa applications", date: "Today", urgent: true },
              { task: "Update flight schedule for Group B", date: "Tomorrow", urgent: false },
              { task: "Send invoice to client #4582", date: "May 28", urgent: false },
              { task: "Review monthly revenue report", date: "May 30", urgent: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-[24px] hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100">
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                  item.urgent ? "border-danger/30 group-hover:border-danger" : "border-gray-200 group-hover:border-primary-400"
                )}>
                  <div className={cn("w-3 h-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity", item.urgent ? "bg-danger" : "bg-primary-500")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink-secondary truncate group-hover:text-ink-primary transition-colors">{item.task}</p>
                </div>
                <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest", item.urgent ? "text-danger bg-danger-light" : "text-ink-muted bg-gray-50")}>
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

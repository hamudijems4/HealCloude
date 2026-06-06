"use client"
import { useState } from "react"
import { Brain, Calendar, FileText, MessageCircle, Send, Loader2, HeartPulse, Activity, Clock } from "lucide-react"
import { cn, getRiskBadgeClass, getRiskBarColor } from "@/lib/utils"
import type { ChatMessage, WellnessRiskOutput } from "@/types"
import api from "@/lib/api"

const MOCK_RISK: WellnessRiskOutput = {
  patient_id: "demo",
  risk_score: 67.4,
  risk_level: "high",
  risk_factors: ["No visit in 142 days", "2 missed appointments", "Chronic conditions: Hypertension, Diabetes"],
  recommended_actions: ["Schedule follow-up within 7 days", "Send medication reminder", "Nurse triage call"],
  next_followup_date: new Date(Date.now() + 7 * 86400_000).toISOString(),
}

const MOCK_APPOINTMENTS = [
  { id: 1, type: "ANC Follow-up",   facility: "Tikur Anbessa Hospital", date: "2024-07-15", attended: null },
  { id: 2, type: "General Checkup", facility: "Bethzatha Hospital",      date: "2024-06-10", attended: true },
  { id: 3, type: "TB Follow-up",    facility: "St. Paul's Hospital",     date: "2024-05-20", attended: false },
]

const MOCK_VITALS = [
  { label: "Blood Pressure", value: "128/82", unit: "mmHg", status: "warning", icon: Activity },
  { label: "Heart Rate",     value: "74",     unit: "bpm",  status: "good",    icon: HeartPulse },
  { label: "Blood Sugar",    value: "6.1",    unit: "mmol", status: "warning", icon: Activity },
  { label: "BMI",            value: "24.3",   unit: "kg/m²",status: "good",    icon: Activity },
]

export default function PatientPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Selam! I'm TenaBot 👋 I'm here to help you understand your health records and wellness. How can I assist you today?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const risk = MOCK_RISK

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg: ChatMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await api.post("/api/v1/wellness/chat", {
        messages: [...messages, userMsg],
        patient_context: { risk_level: risk.risk_level, conditions: risk.risk_factors },
      })
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }])
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-primary">My Health Portal</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            Welcome back, <span className="font-semibold text-ink-secondary">Abebe Haile</span>
            &nbsp;·&nbsp;Fayda ID: <span className="font-mono text-primary-500 font-semibold">ET8823710293</span>
          </p>
        </div>
      </div>

      {/* Vitals Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_VITALS.map(({ label, value, unit, status }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{label}</p>
              <span className={cn(
                "w-2 h-2 rounded-full",
                status === "good" ? "bg-success" : status === "warning" ? "bg-warning" : "bg-danger"
              )} />
            </div>
            <p className="text-2xl font-extrabold text-ink-primary">{value}</p>
            <p className="text-xs text-ink-muted mt-0.5">{unit}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Wellness Score + Actions */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-sm font-bold text-ink-primary">AI Wellness Score</span>
              </div>
              <span className={getRiskBadgeClass(risk.risk_level)}>{risk.risk_level}</span>
            </div>

            <div className="flex items-end gap-2 mb-3">
              <span className={cn("text-5xl font-extrabold", {
                "text-success-dark": risk.risk_level === "low",
                "text-warning-dark": risk.risk_level === "medium",
                "text-danger":       risk.risk_level === "high" || risk.risk_level === "critical",
              })}>
                {risk.risk_score}
              </span>
              <span className="text-ink-muted text-lg mb-1 font-medium">/100</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5">
              <div
                className={cn("h-2.5 rounded-full transition-all", getRiskBarColor(risk.risk_level))}
                style={{ width: `${risk.risk_score}%` }}
              />
            </div>

            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2.5">Risk Factors</p>
            <div className="space-y-2">
              {risk.risk_factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-ink-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-success-light rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-success-dark" />
              </div>
              <span className="text-sm font-bold text-ink-primary">Next Recommended Visit</span>
            </div>
            <p className="text-lg font-extrabold text-ink-primary mb-4">
              {risk.next_followup_date
                ? new Date(risk.next_followup_date).toLocaleDateString("en-ET", { month: "long", day: "numeric", year: "numeric" })
                : "—"}
            </p>
            <div className="space-y-2">
              {risk.recommended_actions.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-ink-secondary bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-primary-500 font-bold mt-0.5">→</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TenaBot Chat */}
        <div className="lg:col-span-2 card flex flex-col" style={{ height: "540px" }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-primary">TenaBot</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                <p className="text-xs text-success-dark font-semibold">Online · AI Wellness Advisor</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/40">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Brain className="w-3.5 h-3.5 text-primary-500" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-primary-500 text-white rounded-br-sm"
                    : "bg-white text-ink-primary border border-gray-100 rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                  <Brain className="w-3.5 h-3.5 text-primary-500" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about your health, medications, next appointment..."
              className="input flex-1"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-primary px-4 py-2.5 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Appointment History */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-500" />
            <h2 className="font-bold text-ink-primary">Appointment History</h2>
          </div>
          <button className="text-xs font-semibold text-primary-500 hover:text-primary-600">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {MOCK_APPOINTMENTS.map((appt) => (
            <div key={appt.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-primary">{appt.type}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{appt.facility}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-ink-muted font-medium">{appt.date}</p>
                <span className={cn("badge", {
                  "badge-success": appt.attended === true,
                  "badge-danger":  appt.attended === false,
                  "badge-info":    appt.attended === null,
                })}>
                  {appt.attended === null ? "Upcoming" : appt.attended ? "Attended" : "Missed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"
import { useState } from "react"
import { Brain, Calendar, FileText, MessageCircle, Send, Loader2 } from "lucide-react"
import { cn, getRiskBg, getRiskColor } from "@/lib/utils"
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
  { id: 1, type: "ANC Follow-up", facility: "Tikur Anbessa Hospital", date: "2024-07-15", attended: null },
  { id: 2, type: "General Checkup", facility: "Bethzatha Hospital", date: "2024-06-10", attended: true },
  { id: 3, type: "TB Follow-up", facility: "St. Paul's Hospital", date: "2024-05-20", attended: false },
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
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">My Health Portal</h1>
        <p className="text-gray-400 text-sm mt-0.5">Welcome back, Abebe Haile · Fayda ID: ET8823710293</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wellness Score */}
        <div className="lg:col-span-1 space-y-4">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-medium text-gray-300">AI Wellness Score</span>
              </div>
              <span className={cn("risk-badge", getRiskBg(risk.risk_level))}>{risk.risk_level}</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className={cn("text-5xl font-bold", getRiskColor(risk.risk_level))}>
                {risk.risk_score}
              </span>
              <span className="text-gray-500 text-lg mb-1">/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <div
                className={cn("h-2 rounded-full transition-all", {
                  "bg-green-500": risk.risk_level === "low",
                  "bg-yellow-500": risk.risk_level === "medium",
                  "bg-orange-500": risk.risk_level === "high",
                  "bg-red-500": risk.risk_level === "critical",
                })}
                style={{ width: `${risk.risk_score}%` }}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Risk Factors</p>
              {risk.risk_factors.map((f, i) => (
                <p key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-orange-400 mt-0.5">•</span> {f}
                </p>
              ))}
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-gray-300">Next Recommended Visit</span>
            </div>
            <p className="text-lg font-bold">
              {risk.next_followup_date
                ? new Date(risk.next_followup_date).toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" })
                : "—"}
            </p>
            <div className="mt-3 space-y-1">
              {risk.recommended_actions.map((a, i) => (
                <p key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                  <span className="text-brand-400 mt-0.5">→</span> {a}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* TenaBot Chat */}
        <div className="lg:col-span-2 glass-card flex flex-col" style={{ height: "520px" }}>
          <div className="flex items-center gap-2 p-4 border-b border-gray-800">
            <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">TenaBot</p>
              <p className="text-xs text-green-400">Online · AI Wellness Advisor</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-gray-800 text-gray-200 rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-800 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your health, medications, appointments..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-semibold text-gray-300">Appointment History</h2>
        </div>
        <div className="divide-y divide-gray-800/60">
          {MOCK_APPOINTMENTS.map((appt) => (
            <div key={appt.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
              <div>
                <p className="text-sm font-medium">{appt.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">{appt.facility}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-400">{appt.date}</p>
                <span className={cn("risk-badge", {
                  "bg-green-500/10 text-green-400 border-green-500/20": appt.attended === true,
                  "bg-red-500/10 text-red-400 border-red-500/20": appt.attended === false,
                  "bg-blue-500/10 text-blue-400 border-blue-500/20": appt.attended === null,
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

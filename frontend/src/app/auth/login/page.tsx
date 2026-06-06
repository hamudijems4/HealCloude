"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Activity, Eye, EyeOff, Loader2, HeartPulse, Shield, Brain } from "lucide-react"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth"
import type { TokenResponse } from "@/types"

const schema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(6, "Min 6 characters"),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError("")
    try {
      const res = await api.post<TokenResponse>("/api/v1/auth/login", data)
      setAuth(res.data.user, res.data.access_token)
      localStorage.setItem("access_token", res.data.access_token)
      const role = res.data.user.role
      router.push(role === "moh_analyst" || role === "super_admin" ? "/dashboard" : "/patient")
    } catch (e: any) {
      setServerError(e.response?.data?.detail || "Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-500 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-400/30 rounded-full" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-primary-600/40 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/20 rounded-full" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">TenaLink</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Ethiopia's Health<br />Nervous System
          </h2>
          <p className="text-primary-100 text-base leading-relaxed mb-10">
            Connecting fragmented hospital systems, predicting health risks with AI, and giving
            the Ministry of Health real-time national visibility.
          </p>
          <div className="space-y-3">
            {[
              { icon: Shield,    text: "Fayda ID Integration" },
              { icon: Brain,     text: "AI Wellness Predictor" },
              { icon: HeartPulse,text: "HL7 FHIR Interoperability" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-200 text-xs">
          ALX Wellness Hackathon 2024 · Built for Ethiopia
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-ink-primary text-lg">TenaLink</span>
          </div>

          <h1 className="text-2xl font-extrabold text-ink-primary mb-1">Welcome back</h1>
          <p className="text-ink-secondary text-sm mb-8">Sign in with your Fayda ID, email, or phone number</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ink-primary mb-1.5">
                Fayda ID / Email / Phone
              </label>
              <input
                {...register("identifier")}
                placeholder="ET0000000000 or user@email.com"
                className="input"
              />
              {errors.identifier && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.identifier.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-ink-primary">Password</label>
                <a href="#" className="text-xs text-primary-500 font-semibold hover:text-primary-600">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="flex items-center gap-2.5 bg-danger-light border border-danger/20 text-danger-dark text-sm font-medium px-4 py-3 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-xl">
            <p className="text-xs font-bold text-primary-700 mb-2.5 uppercase tracking-wide">Demo Credentials</p>
            <div className="space-y-1.5">
              {[
                { role: "MoH Analyst",  id: "moh@tenalink.et",     pw: "password123" },
                { role: "Patient",      id: "ET8823710293",         pw: "password123" },
                { role: "Clinician",    id: "clinic@tenalink.et",   pw: "password123" },
              ].map(({ role, id, pw }) => (
                <div key={role} className="flex items-center justify-between text-xs">
                  <span className="text-primary-600 font-semibold w-24">{role}</span>
                  <span className="text-ink-secondary font-mono">{id}</span>
                  <span className="text-ink-muted font-mono">{pw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

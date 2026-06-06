import Link from "next/link"
import { Activity, ArrowRight, Shield, Wifi, Brain } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">TenaLink</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link href="/auth/login" className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
          ALX Wellness Hackathon 2024
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight mb-6">
          Ethiopia's Health Data{" "}
          <span className="bg-gradient-to-r from-brand-400 to-teal-300 bg-clip-text text-transparent">
            Nervous System
          </span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed">
          Connecting fragmented hospital systems, predicting health risks with AI, and giving
          the Ministry of Health real-time visibility across every region.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105">
            MoH Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/patient" className="flex items-center gap-2 border border-gray-700 hover:border-brand-600 text-gray-300 px-6 py-3 rounded-xl font-semibold transition-all">
            Patient Portal
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
          {[
            { icon: Shield, label: "Fayda ID Integration" },
            { icon: Brain, label: "AI Wellness Predictor" },
            { icon: Wifi, label: "Offline-First Sync" },
            { icon: Activity, label: "HL7 FHIR Standard" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-400 text-sm px-4 py-2 rounded-full">
              <Icon className="w-3.5 h-3.5 text-brand-400" />
              {label}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

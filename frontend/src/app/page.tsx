import Link from "next/link"
import { Activity, ArrowRight, Shield, Wifi, Brain, HeartPulse, MapPin, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-ink-primary text-base">TenaLink</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-secondary">
          <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
          <a href="#how" className="hover:text-primary-500 transition-colors">How It Works</a>
          <a href="#about" className="hover:text-primary-500 transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-semibold text-ink-secondary hover:text-primary-500 transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link href="/auth/login" className="btn-primary text-sm py-2 px-4 shadow-sm">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-b from-white to-surface animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
          ALX Wellness Hackathon 2024 · Ethiopia
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-ink-primary max-w-3xl leading-tight mb-6">
          Ethiopia's Health{" "}
          <span className="text-primary-500">Nervous System</span>
        </h1>

        <p className="text-ink-secondary text-lg max-w-xl mb-10 leading-relaxed">
          Connecting fragmented hospital systems via HL7 FHIR, predicting health risks
          with AI, and giving the Ministry of Health real-time surveillance across every region.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/dashboard" className="btn-primary px-7 py-3">
            MoH Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/patient" className="btn-secondary px-7 py-3">
            Patient Portal
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
          {[
            { icon: Shield,    label: "Fayda ID Integration" },
            { icon: Brain,     label: "AI Wellness Predictor" },
            { icon: Wifi,      label: "Offline-First Sync" },
            { icon: HeartPulse,label: "HL7 FHIR Standard" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-white border border-gray-200 text-ink-secondary text-sm font-medium px-4 py-2.5 rounded-xl shadow-card">
              <Icon className="w-4 h-4 text-primary-500" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-title text-center mb-3">Platform Features</p>
          <h2 className="text-3xl font-bold text-ink-primary text-center mb-12">
            Built for Ethiopia's Health Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin, color: "bg-danger-light text-danger",
                title: "MoH God-View Dashboard",
                desc: "Real-time heatmap of disease outbreaks and wellness metrics across all regions.",
              },
              {
                icon: Brain, color: "bg-primary-50 text-primary-500",
                title: "AI Wellness Advisor",
                desc: "Proactive risk scoring sends personalized nudges via app or USSD/SMS for rural areas.",
              },
              {
                icon: Users, color: "bg-success-light text-success-dark",
                title: "Fayda ID Integration",
                desc: "Single-source-of-truth identity eliminates duplicate records across all clinics.",
              },
              {
                icon: Wifi, color: "bg-warning-light text-warning-dark",
                title: "Offline-First Sync",
                desc: "Rural clinics store data locally and sync automatically when connectivity returns.",
              },
              {
                icon: HeartPulse, color: "bg-purple-light text-purple-dark",
                title: "FHIR Interoperability",
                desc: "Translates any hospital system — EMR, Excel, or paper — into unified HL7 FHIR.",
              },
              {
                icon: Shield, color: "bg-info-light text-info-dark",
                title: "USSD Fallback",
                desc: "Patients without smartphones access their health records via *123# on any phone.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card-hover p-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink-primary mb-2">{title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-primary-500 py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: "2.8M+",   label: "Registered Patients" },
            { value: "1,291",   label: "Facilities Connected" },
            { value: "11",      label: "Regions Covered" },
            { value: "99.9%",   label: "API Uptime" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold">{value}</p>
              <p className="text-primary-200 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-6 flex items-center justify-between text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary-500 rounded-md flex items-center justify-center">
            <Activity className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-ink-secondary">TenaLink</span>
          <span>· Ethiopia's National Health Platform</span>
        </div>
        <p>© 2024 TenaLink. ALX Wellness Hackathon.</p>
      </footer>
    </div>
  )
}

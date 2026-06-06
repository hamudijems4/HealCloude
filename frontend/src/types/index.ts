export interface User {
  id: string
  fayda_id: string | null
  email: string | null
  phone: string | null
  full_name: string
  role: "patient" | "clinician" | "facility_admin" | "moh_analyst" | "super_admin"
  is_active: boolean
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface WellnessRiskOutput {
  patient_id: string
  risk_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  risk_factors: string[]
  recommended_actions: string[]
  next_followup_date: string | null
}

export interface RegionalStats {
  region: string
  total_patients: number
  active_alerts: number
  avg_wellness_score: number
  top_conditions: string[]
  facility_count: number
  coordinates: [number, number]
}

export interface DiseaseAlert {
  region: string
  zone: string | null
  disease_code: string
  disease_name: string
  case_count: number
  severity: "watch" | "warning" | "emergency"
  reported_at: string
}

export interface NationalSummary {
  total_registered_patients: number
  facilities_online: number
  facilities_offline: number
  active_alerts: number
  avg_national_wellness_score: number
  ai_interventions_today: number
  ussd_sessions_today: number
  last_updated: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

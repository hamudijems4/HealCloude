export type UserRole = 'PATIENT' | 'CLINICIAN' | 'MOH_ANALYST' | 'ADMIN';

export interface Profile {
  id: string;
  fayda_id?: string;
  phone?: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  profile: Profile;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  fayda_id?: string;
  phone?: string;
  role?: UserRole;
}

export interface RiskScoreResponse {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
}

export interface PregnancyMilestone {
  id: string;
  title: string;
  date: string;
  status: 'COMPLETED' | 'UPCOMING' | 'CURRENT';
  description?: string;
  type: 'CHECKUP' | 'SCAN' | 'VACCINE' | 'GENERAL' | 'LAB_RESULT';
}

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  provider: string;
  type: 'LAB_RESULT' | 'ULTRASOUND' | 'DOCTOR_NOTE';
  summary: string;
  status: 'NORMAL' | 'ATTENTION_NEEDED' | 'INFO';
}

export interface EmergencyHospital {
  id: string;
  name: string;
  distance: string;
  specialistAvailable: boolean;
}

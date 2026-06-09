export type Role = 'patient' | 'clinic' | 'ngo' | 'moh' | 'super_admin';

export type Permission =
  // Patient
  | 'view_own_health'
  | 'view_own_appointments'
  | 'view_own_wellness'
  | 'view_ussd'
  | 'manage_ussd'
  // Clinic
  | 'view_all_patients'
  | 'view_all_wellness'
  | 'view_patient_detail'
  | 'view_fhir_records'
  | 'manage_appointments'
  | 'fayda_lookup'
  // NGO
  | 'view_research_maps'
  | 'view_heatmaps'
  | 'view_funding_allocation'
  | 'identify_high_need_areas'
  // MoH
  | 'view_disease_map'
  | 'view_disease_alerts'
  | 'manage_alerts'
  | 'view_epidemiology'
  | 'view_facilities'
  | 'view_reports'
  | 'view_moh_dashboard'
  // Shared
  | 'view_settings'
  | 'use_healthbot'
  | 'manage_users';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  patient: [
    'view_own_health',
    'view_own_appointments',
    'view_own_wellness',
    'view_ussd',
    'manage_ussd',
    'use_healthbot',
    'view_settings',
  ],
  clinic: [
    'view_all_patients',
    'view_all_wellness',
    'view_patient_detail',
    'view_fhir_records',
    'manage_appointments',
    'fayda_lookup',
    'view_disease_map',
    'use_healthbot',
    'view_settings',
  ],
  ngo: [
    'view_research_maps',
    'view_heatmaps',
    'view_funding_allocation',
    'identify_high_need_areas',
    'view_facilities',
    'view_reports',
    'view_settings',
  ],
  moh: [
    'view_disease_map',
    'view_disease_alerts',
    'manage_alerts',
    'view_epidemiology',
    'view_facilities',
    'view_reports',
    'view_moh_dashboard',
    'view_settings',
  ],
  super_admin: [
    'view_own_health',
    'view_own_appointments',
    'view_own_wellness',
    'view_ussd',
    'manage_ussd',
    'view_all_patients',
    'view_patient_detail',
    'view_fhir_records',
    'manage_appointments',
    'fayda_lookup',
    'view_research_maps',
    'view_heatmaps',
    'view_funding_allocation',
    'identify_high_need_areas',
    'view_disease_map',
    'view_disease_alerts',
    'manage_alerts',
    'view_epidemiology',
    'view_facilities',
    'view_reports',
    'view_moh_dashboard',
    'use_healthbot',
    'view_settings',
    'manage_users',
  ],
};

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const ROLE_HOME: Record<Role, string> = {
  patient: '/dashboard/my-health',
  clinic:  '/dashboard/patients',
  ngo:     '/dashboard/research',
  moh:     '/dashboard/surveillance',
  super_admin: '/dashboard/surveillance',
};

export const ROLE_META: Record<Role, { label: string; color: string; icon: string; searchPlaceholder?: string }> = {
  patient:     { label: 'Patient Portal',  color: '#059669', icon: '👤', searchPlaceholder: 'Search health records...' },
  clinic:      { label: 'Clinic Network',  color: '#0891b2', icon: '🏥', searchPlaceholder: 'Search by Fayda ID...' },
  ngo:         { label: 'NGO Research',    color: '#d97706', icon: '🌍', searchPlaceholder: 'Search regions, facilities...' },
  moh:         { label: 'MoH Command',     color: '#2563eb', icon: '🏛️', searchPlaceholder: 'Search regions, alerts...' },
  super_admin: { label: 'Super Admin',     color: '#dc2626', icon: '⚙️', searchPlaceholder: 'Search anything...' },
};

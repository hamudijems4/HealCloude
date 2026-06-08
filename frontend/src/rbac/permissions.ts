export type Role =
  | 'patient'
  | 'clinician'
  | 'facility_admin'
  | 'moh_analyst'
  | 'ngo_analyst'
  | 'super_admin';

export type Permission =
  // Personal (patient-only)
  | 'view_own_health'
  | 'view_own_appointments'
  | 'view_own_wellness'
  // Clinical
  | 'view_all_patients'
  | 'view_patient_detail'
  | 'view_fhir_records'
  | 'manage_appointments'
  | 'view_all_wellness'
  // Surveillance (MoH / NGO)
  | 'view_disease_map'
  | 'view_disease_alerts'
  | 'manage_alerts'
  // Infrastructure
  | 'view_facilities'
  | 'view_ussd'
  | 'manage_ussd'
  // Analytics
  | 'view_reports'
  | 'view_moh_dashboard'
  // AI
  | 'use_healthbot'
  // Platform
  | 'view_settings'
  | 'manage_users';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  patient: [
    'view_own_health',
    'view_own_appointments',
    'view_own_wellness',
    'use_healthbot',
    'view_settings',
  ],

  clinician: [
    'view_all_patients',
    'view_patient_detail',
    'view_fhir_records',
    'manage_appointments',
    'view_all_wellness',
    'view_facilities',
    'use_healthbot',
    'view_settings',
  ],

  facility_admin: [
    'view_all_patients',
    'view_patient_detail',
    'view_fhir_records',
    'manage_appointments',
    'view_all_wellness',
    'view_facilities',
    'view_ussd',
    'manage_ussd',
    'view_reports',
    'view_settings',
  ],

  moh_analyst: [
    'view_all_patients',
    'view_patient_detail',
    'view_fhir_records',
    'manage_appointments',
    'view_all_wellness',
    'view_disease_map',
    'view_disease_alerts',
    'manage_alerts',
    'view_facilities',
    'view_ussd',
    'view_reports',
    'view_moh_dashboard',
    'view_settings',
  ],

  ngo_analyst: [
    'view_disease_map',
    'view_disease_alerts',
    'view_facilities',
    'view_reports',
    'view_settings',
  ],

  super_admin: [
    'view_own_health',
    'view_own_appointments',
    'view_own_wellness',
    'view_all_patients',
    'view_patient_detail',
    'view_fhir_records',
    'manage_appointments',
    'view_all_wellness',
    'view_disease_map',
    'view_disease_alerts',
    'manage_alerts',
    'view_facilities',
    'view_ussd',
    'manage_ussd',
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

/** The home route each role lands on after login */
export const ROLE_HOME: Record<Role, string> = {
  patient:        '/dashboard/my-health',
  clinician:      '/dashboard/my-patients',
  facility_admin: '/dashboard/patients',
  moh_analyst:    '/dashboard',
  ngo_analyst:    '/dashboard/ngo',
  super_admin:    '/dashboard',
};

/** Display config per role */
export const ROLE_META: Record<Role, { label: string; color: string; badge: string; searchPlaceholder: string }> = {
  patient:        { label: 'Patient Portal',          color: '#059669', badge: 'bg-green',  searchPlaceholder: 'Search your records…'              },
  clinician:      { label: 'Clinician View',           color: '#0891b2', badge: 'bg-cyan',   searchPlaceholder: 'Search patients by name or ID…'    },
  facility_admin: { label: 'Facility Admin',           color: '#7c3aed', badge: 'bg-purple', searchPlaceholder: 'Search patients, facilities…'      },
  moh_analyst:    { label: 'MoH National Dashboard',  color: '#2563eb', badge: 'bg-blue',   searchPlaceholder: 'Search patients, facilities, alerts…'},
  ngo_analyst:    { label: 'NGO Research View',        color: '#d97706', badge: 'bg-amber',  searchPlaceholder: 'Search regions, diseases…'         },
  super_admin:    { label: 'Super Admin',              color: '#dc2626', badge: 'bg-red',    searchPlaceholder: 'Search anything…'                  },
};

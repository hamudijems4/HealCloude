/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../rbac/usePermissions';
import { RoleGuard } from '../rbac/RoleGuard';

const PageLoader = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f0f6ff' }}>
    <div style={{ width:40, height:40, border:'3px solid #dbeafe', borderTopColor:'#2563eb', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const w = (C: React.ComponentType) => (
  <Suspense fallback={<PageLoader/>}><C/></Suspense>
);

/** Redirects logged-out users to /login */
const AuthGuard = () => {
  const { user, loading } = useAuthStore();
  if (loading) return <PageLoader/>;
  return user ? <Outlet/> : <Navigate to="/login" replace/>;
};

/** After login, redirect / to the role's home route */
const RoleHomeRedirect = () => {
  const { homeRoute } = usePermissions();
  return <Navigate to={homeRoute} replace/>;
};

// ── Lazy imports ──
const Landing           = lazy(() => import('../features/landing/Landing').then(m => ({ default: m.Landing })));
const Login             = lazy(() => import('../features/auth/Login').then(m => ({ default: m.Login })));
const DashboardLayout   = lazy(() => import('../features/dashboard/layouts/DashboardLayout').then(m => ({ default: m.DashboardLayout })));

// Role home dashboards
const MoHDashboard      = lazy(() => import('../features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const PatientHome       = lazy(() => import('../features/dashboard/homes/PatientHome').then(m => ({ default: m.PatientHome })));
const ClinicianHome     = lazy(() => import('../features/dashboard/homes/ClinicianHome').then(m => ({ default: m.ClinicianHome })));
const NGOHome           = lazy(() => import('../features/dashboard/homes/NGOHome').then(m => ({ default: m.NGOHome })));

// Shared pages
const PatientsPage      = lazy(() => import('../features/patients/PatientsPage').then(m => ({ default: m.PatientsPage })));
const PatientDetail     = lazy(() => import('../features/patients/PatientDetail').then(m => ({ default: m.PatientDetail })));
const AppointmentsPage  = lazy(() => import('../features/appointments/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const WellnessPage      = lazy(() => import('../features/wellness/WellnessPage').then(m => ({ default: m.WellnessPage })));
const HealthBotPage     = lazy(() => import('../features/healthbot/HealthBotPage').then(m => ({ default: m.HealthBotPage })));
const DiseaseMapPage    = lazy(() => import('../features/disease-map/DiseaseMapPage').then(m => ({ default: m.DiseaseMapPage })));
const AlertsPage        = lazy(() => import('../features/alerts/AlertsPage').then(m => ({ default: m.AlertsPage })));
const FacilitiesPage    = lazy(() => import('../features/facilities/FacilitiesPage').then(m => ({ default: m.FacilitiesPage })));
const FHIRPage          = lazy(() => import('../features/fhir/FHIRPage').then(m => ({ default: m.FHIRPage })));
const USSDPage          = lazy(() => import('../features/ussd/USSDPage').then(m => ({ default: m.USSDPage })));
const ReportsPage       = lazy(() => import('../features/reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage      = lazy(() => import('../features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

export const router = createBrowserRouter([
  { path: '/',      element: w(Landing) },
  { path: '/login', element: w(Login)   },
  {
    element: <AuthGuard/>,
    children: [{
      path: '/dashboard',
      element: w(DashboardLayout),
      children: [
        // Root /dashboard → redirect to role's home
        { path: '', element: <RoleHomeRedirect/> },

        // ── MoH / super_admin home ──
        {
          path: 'home',
          element: <RoleGuard require="view_moh_dashboard">{w(MoHDashboard)}</RoleGuard>,
        },

        // ── NGO home ──
        {
          path: 'ngo',
          element: <RoleGuard require="view_disease_map">{w(NGOHome)}</RoleGuard>,
        },

        // ── Patient personal portal ──
        {
          path: 'my-health',
          element: <RoleGuard require="view_own_health">{w(PatientHome)}</RoleGuard>,
        },
        {
          path: 'my-appointments',
          element: <RoleGuard require="view_own_appointments">{w(AppointmentsPage)}</RoleGuard>,
        },
        {
          path: 'my-wellness',
          element: <RoleGuard require="view_own_wellness">{w(WellnessPage)}</RoleGuard>,
        },

        // ── Clinician home ──
        {
          path: 'my-patients',
          element: <RoleGuard require="view_all_patients">{w(ClinicianHome)}</RoleGuard>,
        },

        // ── Clinical (clinician / facility_admin / moh) ──
        {
          path: 'patients',
          element: <RoleGuard require="view_all_patients">{w(PatientsPage)}</RoleGuard>,
        },
        {
          path: 'patients/:id',
          element: <RoleGuard require="view_patient_detail">{w(PatientDetail)}</RoleGuard>,
        },
        {
          path: 'appointments',
          element: <RoleGuard require="manage_appointments">{w(AppointmentsPage)}</RoleGuard>,
        },
        {
          path: 'wellness',
          element: <RoleGuard require="view_all_wellness">{w(WellnessPage)}</RoleGuard>,
        },
        {
          path: 'healthbot',
          element: <RoleGuard require="use_healthbot">{w(HealthBotPage)}</RoleGuard>,
        },
        {
          path: 'fhir',
          element: <RoleGuard require="view_fhir_records">{w(FHIRPage)}</RoleGuard>,
        },

        // ── Surveillance (moh / ngo) ──
        {
          path: 'disease-map',
          element: <RoleGuard require="view_disease_map">{w(DiseaseMapPage)}</RoleGuard>,
        },
        {
          path: 'alerts',
          element: <RoleGuard require="view_disease_alerts">{w(AlertsPage)}</RoleGuard>,
        },

        // ── Infrastructure ──
        {
          path: 'facilities',
          element: <RoleGuard require="view_facilities">{w(FacilitiesPage)}</RoleGuard>,
        },
        {
          path: 'ussd',
          element: <RoleGuard require="view_ussd">{w(USSDPage)}</RoleGuard>,
        },

        // ── Analytics ──
        {
          path: 'reports',
          element: <RoleGuard require="view_reports">{w(ReportsPage)}</RoleGuard>,
        },

        // ── Universal ──
        {
          path: 'settings',
          element: <RoleGuard require="view_settings">{w(SettingsPage)}</RoleGuard>,
        },
      ],
    }],
  },
]);

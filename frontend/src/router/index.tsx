/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../rbac/usePermissions';
import { DashboardLayout } from '../features/dashboard/layouts/DashboardLayout';

const PageLoader = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f0f6ff' }}>
    <div style={{ width:40, height:40, border:'3px solid #dbeafe', borderTopColor:'#2563eb', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const w = (C: React.ComponentType) => (
  <Suspense fallback={<PageLoader/>}><C/></Suspense>
);

const AuthGuard = () => {
  const { user, loading } = useAuthStore();
  if (loading) return <PageLoader/>;
  return user ? <Outlet/> : <Navigate to="/login" replace/>;
};

const RoleHomeRedirect = () => {
  const { homeRoute } = usePermissions();
  const { profile, loading } = useAuthStore();
  if (loading || !profile) return <PageLoader/>;
  return <Navigate to={homeRoute} replace/>;
};

// ── Lazy imports ──
const Landing          = lazy(() => import('../features/landing/Landing').then(m => ({ default: m.Landing })));
const Login            = lazy(() => import('../features/auth/Login').then(m => ({ default: m.Login })));
const PatientHome      = lazy(() => import('../features/dashboard/homes/PatientHome').then(m => ({ default: m.PatientHome })));
const PatientsPage     = lazy(() => import('../features/patients/PatientsPage').then(m => ({ default: m.PatientsPage })));
const PatientDetail    = lazy(() => import('../features/patients/PatientDetail').then(m => ({ default: m.PatientDetail })));
const AppointmentsPage = lazy(() => import('../features/appointments/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const WellnessPage     = lazy(() => import('../features/wellness/WellnessPage').then(m => ({ default: m.WellnessPage })));
const HealthBotPage    = lazy(() => import('../features/healthbot/HealthBotPage').then(m => ({ default: m.HealthBotPage })));
const AlertsPage       = lazy(() => import('../features/alerts/AlertsPage').then(m => ({ default: m.AlertsPage })));
const FacilitiesPage   = lazy(() => import('../features/facilities/FacilitiesPage').then(m => ({ default: m.FacilitiesPage })));
const FHIRPage         = lazy(() => import('../features/fhir/FHIRPage').then(m => ({ default: m.FHIRPage })));
const USSDPage         = lazy(() => import('../features/ussd/USSDPage').then(m => ({ default: m.USSDPage })));
const ReportsPage      = lazy(() => import('../features/reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage     = lazy(() => import('../features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AdminPage        = lazy(() => import('../features/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const DiseaseMapPage   = lazy(() => import('../features/disease-map/DiseaseMapPage').then(m => ({ default: m.DiseaseMapPage })));
const PopulationPage   = lazy(() => import('../features/population/PopulationPage').then(m => ({ default: m.PopulationPage })));
const MaternalPage     = lazy(() => import('../features/maternal/MaternalPage').then(m => ({ default: m.MaternalPage })));
const USSDAnalyticsPage = lazy(() => import('../features/ussd-analytics/USSDAnalyticsPage').then(m => ({ default: m.USSDAnalyticsPage })));

export const router = createBrowserRouter([
  { path: '/',      element: w(Landing) },
  { path: '/login', element: w(Login)   },
  {
    element: <AuthGuard/>,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout/>,
        children: [
          { path: '',                element: <RoleHomeRedirect/> },
          // Patient
          { path: 'my-health',       element: w(PatientHome) },
          { path: 'my-appointments', element: w(AppointmentsPage) },
          { path: 'my-wellness',     element: w(WellnessPage) },
          { path: 'ussd',            element: w(USSDPage) },
          { path: 'healthbot',       element: w(HealthBotPage) },
          // Clinic
          { path: 'patients',        element: w(PatientsPage) },
          { path: 'patients/:id',    element: w(PatientDetail) },
          { path: 'fayda',           element: w(PatientsPage) },
          { path: 'appointments',    element: w(AppointmentsPage) },
          { path: 'fhir',            element: w(FHIRPage) },
          // NGO
          { path: 'research',        element: w(DiseaseMapPage) },
          { path: 'heatmaps',        element: w(ReportsPage) },
          { path: 'high-need',       element: w(ReportsPage) },
          { path: 'funding',         element: w(ReportsPage) },
          { path: 'facilities',      element: w(FacilitiesPage) },
          { path: 'population',      element: w(PopulationPage) },
          { path: 'maternal',        element: w(MaternalPage) },
          // MoH
          { path: 'surveillance',    element: w(DiseaseMapPage) },
          { path: 'alerts',          element: w(AlertsPage) },
          { path: 'epidemiology',    element: w(ReportsPage) },
          { path: 'reports',         element: w(ReportsPage) },
          { path: 'ussd-analytics',  element: w(USSDAnalyticsPage) },
          // Shared
          { path: 'disease-map',     element: w(DiseaseMapPage) },
          { path: 'settings',        element: w(SettingsPage) },
          { path: 'admin',           element: w(AdminPage) },
        ],
      },
    ],
  },
]);

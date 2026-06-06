import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
const AuthLayout = lazy(() => import('../features/auth/layouts/AuthLayout').then(m => ({ default: m.AuthLayout })));
const DashboardLayout = lazy(() => import('../features/dashboard/layouts/DashboardLayout').then(m => ({ default: m.DashboardLayout })));

// Pages
const Login = lazy(() => import('../features/auth/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const CandidatesPage = lazy(() => import('../features/candidates/CandidatesPage').then(m => ({ default: m.CandidatesPage })));
const VisasPage = lazy(() => import('../features/visas/VisasPage').then(m => ({ default: m.VisasPage })));
const JobsPage = lazy(() => import('../features/jobs/JobsPage').then(m => ({ default: m.JobsPage })));
const FlightsPage = lazy(() => import('../features/flights/FlightsPage').then(m => ({ default: m.FlightsPage })));
const PassportsPage = lazy(() => import('../features/passports/PassportsPage').then(m => ({ default: m.PassportsPage })));
const PaymentsPage = lazy(() => import('../features/payments/PaymentsPage').then(m => ({ default: m.PaymentsPage })));
const UmrahPage = lazy(() => import('../features/umrah/UmrahPage').then(m => ({ default: m.UmrahPage })));
const HotelsPage = lazy(() => import('../features/hotels/HotelsPage').then(m => ({ default: m.HotelsPage })));
const GroupsPage = lazy(() => import('../features/groups/GroupsPage').then(m => ({ default: m.GroupsPage })));
const ReportsPage = lazy(() => import('../features/reports/ReportsPage').then(m => ({ default: m.ReportsPage })));
const PackagesPage = lazy(() => import('../features/packages/PackagesPage').then(m => ({ default: m.PackagesPage })));
const WorkersPage = lazy(() => import('../features/workers/WorkersPage').then(m => ({ default: m.WorkersPage })));
const AdminsPage = lazy(() => import('../features/admins/AdminsPage').then(m => ({ default: m.AdminsPage })));
const BranchesPage = lazy(() => import('../features/branches/BranchesPage').then(m => ({ default: m.BranchesPage })));
const OrdersPage = lazy(() => import('../features/orders/OrdersPage').then(m => ({ default: m.OrdersPage })));
const PRPage = lazy(() => import('../features/pr/PRPage').then(m => ({ default: m.PRPage })));
const HRPage = lazy(() => import('../features/hr/HRPage').then(m => ({ default: m.HRPage })));

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: withSuspense(AuthLayout),
    children: [
      {
        path: '',
        element: withSuspense(Login),
      },
    ],
  },
  {
    path: '/dashboard',
    element: withSuspense(DashboardLayout),
    children: [
      {
        path: '',
        element: withSuspense(Dashboard),
      },
      { path: 'patients',     element: withSuspense(CandidatesPage) },
      { path: 'wellness',      element: withSuspense(PassportsPage) },
      { path: 'ai-risk',       element: withSuspense(VisasPage) },
      { path: 'disease-map',   element: withSuspense(ReportsPage) },
      { path: 'alerts',        element: withSuspense(OrdersPage) },
      { path: 'fhir',          element: withSuspense(PackagesPage) },
      { path: 'facilities',    element: withSuspense(BranchesPage) },
      { path: 'clinicians',    element: withSuspense(WorkersPage) },
      { path: 'ussd',          element: withSuspense(PRPage) },
      { path: 'fayda',         element: withSuspense(AdminsPage) },
      { path: 'appointments',  element: withSuspense(UmrahPage) },
      { path: 'labs',          element: withSuspense(FlightsPage) },
      { path: 'medications',   element: withSuspense(HotelsPage) },
      { path: 'surveillance',  element: withSuspense(GroupsPage) },
      { path: 'supplies',      element: withSuspense(PaymentsPage) },
      { path: 'reports',       element: withSuspense(ReportsPage) },
      { path: 'hr',            element: withSuspense(HRPage) },
      { path: 'tasks',         element: <div className="p-8 text-gray-500">Follow-up Tasks — Coming Soon</div> },
      { path: 'settings',      element: <div className="p-8 text-gray-500">System Settings — Coming Soon</div> },
    ],
  },
]);

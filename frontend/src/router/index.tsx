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
      { path: 'clients', element: withSuspense(CandidatesPage) },
      { path: 'passports', element: withSuspense(PassportsPage) },
      { path: 'visas', element: withSuspense(VisasPage) },
      { path: 'jobs', element: withSuspense(JobsPage) },
      { path: 'umrah', element: withSuspense(UmrahPage) },
      { path: 'flights', element: withSuspense(FlightsPage) },
      { path: 'hotels', element: withSuspense(HotelsPage) },
      { path: 'groups', element: withSuspense(GroupsPage) },
      { path: 'payments', element: withSuspense(PaymentsPage) },
      { path: 'reports', element: withSuspense(ReportsPage) },
      { path: 'packages', element: withSuspense(PackagesPage) },
      { path: 'workers', element: withSuspense(WorkersPage) },
      { path: 'admins', element: withSuspense(AdminsPage) },
      { path: 'branches', element: withSuspense(BranchesPage) },
      { path: 'orders', element: withSuspense(OrdersPage) },
      { path: 'pr', element: withSuspense(PRPage) },
      { path: 'hr', element: withSuspense(HRPage) },
      { path: 'tasks', element: <div className="p-8">Tasks Feature Placeholder</div> },
      { path: 'settings', element: <div className="p-8">Settings Feature Placeholder</div> },
    ],
  },
]);

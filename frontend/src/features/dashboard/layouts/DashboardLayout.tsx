import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, Activity,
  PieChart, CheckSquare, Settings, Bell, Search, Plus, Mail,
  Users2, Shield, Building2, PackageOpen,
  TrendingUp, HeartPulse, Brain, AlertTriangle,
  MapPin, Smartphone, FlaskConical, Pill
} from 'lucide-react';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'MoH Dashboard',        path: '/dashboard' },
    { icon: Users,           label: 'Patients',             path: '/dashboard/patients' },
    { icon: HeartPulse,      label: 'Wellness Scores',      path: '/dashboard/wellness' },
    { icon: Brain,           label: 'AI Risk Engine',       path: '/dashboard/ai-risk' },
    { icon: MapPin,          label: 'Disease Map',          path: '/dashboard/disease-map' },
    { icon: AlertTriangle,   label: 'Disease Alerts',       path: '/dashboard/alerts' },
    { icon: Activity,        label: 'FHIR Records',         path: '/dashboard/fhir' },
    { icon: Building2,       label: 'Health Facilities',    path: '/dashboard/facilities' },
    { icon: Users2,          label: 'Clinicians',           path: '/dashboard/clinicians' },
    { icon: Smartphone,      label: 'USSD / SMS',           path: '/dashboard/ussd' },
    { icon: Shield,          label: 'Fayda ID Registry',   path: '/dashboard/fayda' },
    { icon: BookOpen,        label: 'Appointments',         path: '/dashboard/appointments' },
    { icon: FlaskConical,    label: 'Lab Results',          path: '/dashboard/labs' },
    { icon: Pill,            label: 'Medications',          path: '/dashboard/medications' },
    { icon: TrendingUp,      label: 'Outbreak Surveillance',path: '/dashboard/surveillance' },
    { icon: PackageOpen,     label: 'Medical Supplies',     path: '/dashboard/supplies' },
    { icon: PieChart,        label: 'Reports & Analytics',  path: '/dashboard/reports' },
    { icon: CheckSquare,     label: 'Follow-up Tasks',      path: '/dashboard/tasks' },
    { icon: Settings,        label: 'System Settings',      path: '/dashboard/settings' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-img">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#5c59f0"/>
              <path d="M12 5 L12 19 M7 10 Q12 5 17 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <h2>TenaLink</h2>
            <span>National Health Platform</span>
          </div>
        </div>
        
        <div className="sidebar-scrollable">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.path === '/dashboard'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="pro-upgrade-card">
            <div className="pro-header">
              <div className="crown-icon">🏥</div>
              <h4>MoH God-View</h4>
            </div>
            <p>Real-time national surveillance across all 11 regions.</p>
            <button className="btn-upgrade">
              Open Live Map <span>→</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search anything..." />
            <span className="search-shortcut">⌘K</span>
          </div>
          
          <div className="header-actions">
            <button className="action-btn-primary">
              <Plus size={18} />
            </button>
            <div className="action-btn badge-container">
              <Bell size={18} />
              <span className="notification-badge">8</span>
            </div>
            <button className="action-btn">
              <Mail size={18} />
            </button>
            
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=MoH+Analyst&background=ede9fe&color=5c59f0" alt="MoH Analyst" className="avatar-img" />
              <div className="user-info">
                <span className="user-name">MoH Analyst</span>
                <span className="user-role">National Dashboard</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

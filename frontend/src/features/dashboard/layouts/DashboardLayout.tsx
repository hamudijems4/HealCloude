import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, FileCheck, PackageOpen, 
  Plane, Building, Users2, CreditCard, PieChart, CheckSquare, 
  Settings, Plus, Bell, Mail, Search, Briefcase,
  Package, UsersRound, Shield, Building2, ShoppingCart, 
  Megaphone, BriefcaseBusiness
} from 'lucide-react';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Leads & Clients', path: '/dashboard/clients' },
    { icon: Package, label: 'Packages', path: '/dashboard/packages' },
    { icon: BookOpen, label: 'Passports', path: '/dashboard/passports' },
    { icon: FileCheck, label: 'Visa Management', path: '/dashboard/visas' },
    { icon: Briefcase, label: 'Job Orders', path: '/dashboard/jobs' },
    { icon: PackageOpen, label: 'Umrah Packages', path: '/dashboard/umrah' },
    { icon: Plane, label: 'Flights', path: '/dashboard/flights' },
    { icon: Building, label: 'Hotels', path: '/dashboard/hotels' },
    { icon: Users2, label: 'Group Management', path: '/dashboard/groups' },
    { icon: ShoppingCart, label: 'Sales & Orders', path: '/dashboard/orders' },
    { icon: CreditCard, label: 'Payments & Finance', path: '/dashboard/payments' },
    { icon: UsersRound, label: 'Workers Management', path: '/dashboard/workers' },
    { icon: Shield, label: 'Admin Management', path: '/dashboard/admins' },
    { icon: Building2, label: 'Branch Management', path: '/dashboard/branches' },
    { icon: Megaphone, label: 'PR Module', path: '/dashboard/pr' },
    { icon: BriefcaseBusiness, label: 'HR Module', path: '/dashboard/hr' },
    { icon: PieChart, label: 'Reports & Analytics', path: '/dashboard/reports' },
    { icon: CheckSquare, label: 'Tasks & Reminders', path: '/dashboard/tasks' },
    { icon: Settings, label: 'System Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-img">
            {/* Logo placeholder mimicking AlSafar blue triangle */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="#3b82f6"/>
            </svg>
          </div>
          <div className="logo-text">
            <h2>AlSafar</h2>
            <span>Agent Management System</span>
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
              <div className="crown-icon">👑</div>
              <h4>Upgrade to Pro</h4>
            </div>
            <p>Unlock all features and get exclusive benefits.</p>
            <button className="btn-upgrade">
              Upgrade Now <span>→</span>
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
              <img src="https://ui-avatars.com/api/?name=Ahmed+Khan&background=f1f5f9&color=334155" alt="Ahmed Khan" className="avatar-img" />
              <div className="user-info">
                <span className="user-name">Ahmed Khan</span>
                <span className="user-role">Super Admin</span>
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

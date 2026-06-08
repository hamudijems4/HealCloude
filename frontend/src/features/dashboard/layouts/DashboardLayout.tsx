import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Activity, MapPin, AlertTriangle,
  HeartPulse, Building2, Smartphone, Calendar, PieChart,
  Settings, Bell, Search, LogOut, MessageCircle,
  ChevronDown, Menu, X, Heart, FileText,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { usePermissions } from '../../../rbac/usePermissions';
import type { Permission } from '../../../rbac/permissions';
import './DashboardLayout.css';

const EthLogo = () => (
  <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#1d4ed8"/>
    <polyline points="10,34 18,34 22,22 28,46 33,34 38,34 41,28 44,40 48,34 54,34"
      fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  require: Permission;
}
interface NavSection {
  section: string;
  roles?: string[];
}
type NavEntry = NavItem | NavSection;

const NAV: NavEntry[] = [
  // MoH / super_admin national view
  { section: 'Overview' },
  { icon: LayoutDashboard, label: 'National Dashboard',  path: '/dashboard',              require: 'view_moh_dashboard'  },
  { icon: PieChart,        label: 'Reports',             path: '/dashboard/reports',       require: 'view_reports'        },

  // NGO research
  { section: 'Research' },
  { icon: LayoutDashboard, label: 'NGO Dashboard',       path: '/dashboard/ngo',           require: 'view_disease_map'    },

  // Patient personal
  { section: 'My Health' },
  { icon: Heart,           label: 'My Health',           path: '/dashboard/my-health',     require: 'view_own_health'     },
  { icon: Calendar,        label: 'My Appointments',     path: '/dashboard/my-appointments',require:'view_own_appointments'},
  { icon: HeartPulse,      label: 'My Wellness',         path: '/dashboard/my-wellness',   require: 'view_own_wellness'   },

  // Clinician / facility
  { section: 'Patients & Care' },
  { icon: Users,           label: 'Patient Queue',       path: '/dashboard/my-patients',   require: 'view_all_patients'   },
  { icon: Users,           label: 'All Patients',        path: '/dashboard/patients',      require: 'view_all_patients'   },
  { icon: Calendar,        label: 'Appointments',        path: '/dashboard/appointments',  require: 'manage_appointments' },
  { icon: HeartPulse,      label: 'Wellness Scores',     path: '/dashboard/wellness',      require: 'view_all_wellness'   },
  { icon: MessageCircle,   label: 'HealthBot AI',        path: '/dashboard/healthbot',     require: 'use_healthbot'       },

  // Surveillance
  { section: 'Surveillance' },
  { icon: MapPin,          label: 'Disease Map',         path: '/dashboard/disease-map',   require: 'view_disease_map'    },
  { icon: AlertTriangle,   label: 'Disease Alerts',      path: '/dashboard/alerts',        require: 'view_disease_alerts' },

  // Infrastructure
  { section: 'Infrastructure' },
  { icon: Building2,       label: 'Health Facilities',   path: '/dashboard/facilities',    require: 'view_facilities'     },
  { icon: Smartphone,      label: 'USSD / SMS',          path: '/dashboard/ussd',          require: 'view_ussd'           },
  { icon: Activity,        label: 'FHIR Records',        path: '/dashboard/fhir',          require: 'view_fhir_records'   },
  { icon: FileText,        label: 'Reports',             path: '/dashboard/reports',       require: 'view_reports'        },

  // Settings always last
  { section: 'Account' },
  { icon: Settings,        label: 'Settings',            path: '/dashboard/settings',      require: 'view_settings'       },
];

const ROLE_COLORS: Record<string, string> = {
  patient:        '#059669',
  clinician:      '#0891b2',
  facility_admin: '#7c3aed',
  moh_analyst:    '#2563eb',
  ngo_analyst:    '#d97706',
  super_admin:    '#dc2626',
};

export const DashboardLayout: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  const { can, meta, role }  = usePermissions();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => { await signOut(); navigate('/login'); };

  // Build visible nav — deduplicate paths, filter by permission, collapse empty sections
  const visibleNav = (() => {
    const result: NavEntry[] = [];
    const seenPaths = new Set<string>();
    let pendingSection: NavSection | null = null;

    for (const item of NAV) {
      if ('section' in item) {
        pendingSection = item;
        continue;
      }
      if (!can(item.require)) continue;
      if (seenPaths.has(item.path)) continue;
      seenPaths.add(item.path);

      if (pendingSection) {
        result.push(pendingSection);
        pendingSection = null;
      }
      result.push(item);
    }
    return result;
  })();

  const roleColor = ROLE_COLORS[role] ?? '#2563eb';

  return (
    <div className={`dl ${sidebarOpen ? 'dl--open' : 'dl--collapsed'}`}>

      {/* ── SIDEBAR ── */}
      <aside className="dl-sidebar">
        <div className="dl-sidebar__head">
          <EthLogo/>
          {sidebarOpen && (
            <div className="dl-brand">
              <span className="dl-brand__name">CloudHeal</span>
              <span className="dl-brand__sub">National Health Platform</span>
            </div>
          )}
          <button className="dl-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={16}/> : <Menu size={16}/>}
          </button>
        </div>

        {/* Role badge strip */}
        {sidebarOpen && (
          <div className="dl-role-strip" style={{ background: `${roleColor}12`, borderBottom: `1px solid ${roleColor}25` }}>
            <div className="dl-role-dot" style={{ background: roleColor }}/>
            <span style={{ color: roleColor }}>{meta.label}</span>
          </div>
        )}

        <div className="dl-sidebar__scroll">
          <nav className="dl-nav">
            {visibleNav.map((item, i) => {
              if ('section' in item) {
                return sidebarOpen
                  ? <span key={i} className="dl-nav__section">{item.section}</span>
                  : <div key={i} className="dl-nav__divider"/>;
              }
              const Icon = item.icon;
              return (
                <NavLink key={item.path + item.label} to={item.path}
                  end={item.path === '/dashboard' || item.path === '/dashboard/ngo'}
                  className={({ isActive }) => `dl-nav__item ${isActive ? 'dl-nav__item--active' : ''}`}>
                  <Icon size={18} strokeWidth={1.8}/>
                  {sidebarOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="dl-sidebar__foot">
          {sidebarOpen ? (
            <div className="dl-user">
              <div className="dl-user__avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)` }}>
                {profile?.full_name?.[0] ?? 'U'}
              </div>
              <div className="dl-user__info">
                <span className="dl-user__name">{profile?.full_name ?? 'User'}</span>
                <span className="dl-user__role" style={{ color: roleColor }}>{meta.label}</span>
              </div>
              <button className="dl-user__logout" onClick={handleSignOut} title="Sign out">
                <LogOut size={15}/>
              </button>
            </div>
          ) : (
            <button className="dl-user__logout-mini" onClick={handleSignOut} title="Sign out">
              <LogOut size={16}/>
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="dl-main">
        <header className="dl-header">
          <div className="dl-search">
            <Search size={16} className="dl-search__icon"/>
            <input placeholder={meta.searchPlaceholder}/>
            <span className="dl-search__kbd">⌘K</span>
          </div>
          <div className="dl-header__actions">
            <button className="dl-hbtn" title="Notifications">
              <Bell size={18}/>
              <span className="dl-notif">3</span>
            </button>
            {can('use_healthbot') && (
              <button className="dl-hbtn dl-hbtn--primary" onClick={() => navigate('/dashboard/healthbot')}>
                <MessageCircle size={16}/>
                TenaBot
              </button>
            )}
            <div className="dl-header__user">
              <div className="dl-header__avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)` }}>
                {profile?.full_name?.[0] ?? 'U'}
              </div>
              <span>{profile?.full_name?.split(' ')[0] ?? 'User'}</span>
              <ChevronDown size={14}/>
            </div>
          </div>
        </header>

        <div className="dl-content">
          <Outlet/>
        </div>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Users, Activity, AlertTriangle, HeartPulse,
  Search, ChevronRight, MapPin, Shield, Zap,
  Calendar, MessageCircle, Building2, FileText,
  Settings, LogOut, Menu, X, Smartphone
} from 'lucide-react';
import { usePermissions } from '../../rbac/usePermissions';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './MapDashboard.css';

// ═══════════════════════════════════════════════════════════════════════════
// ETHIOPIA DATA
// ═══════════════════════════════════════════════════════════════════════════

const REGIONS = [
  { name: 'Addis Ababa',      lat: 9.03,  lng: 38.74, patients: 847391, wellness: 71.2, alerts: 1 },
  { name: 'Oromia',           lat: 8.00,  lng: 38.50, patients: 612847, wellness: 58.4, alerts: 3 },
  { name: 'Amhara',           lat: 11.00, lng: 37.50, patients: 489203, wellness: 61.8, alerts: 2 },
  { name: 'Tigray',           lat: 14.00, lng: 38.50, patients: 234819, wellness: 54.1, alerts: 2 },
  { name: 'SNNPR',            lat: 6.50,  lng: 37.00, patients: 318742, wellness: 63.7, alerts: 1 },
  { name: 'Somali',           lat: 7.00,  lng: 44.00, patients: 187341, wellness: 44.2, alerts: 3 },
  { name: 'Afar',             lat: 12.00, lng: 41.00, patients: 96283,  wellness: 49.8, alerts: 2 },
  { name: 'Benishangul-Gumuz',lat: 10.50, lng: 35.50, patients: 54218,  wellness: 66.3, alerts: 0 },
  { name: 'Gambella',         lat: 8.00,  lng: 34.50, patients: 38471,  wellness: 52.9, alerts: 1 },
  { name: 'Harari',           lat: 9.31,  lng: 42.12, patients: 29847,  wellness: 69.1, alerts: 0 },
  { name: 'Dire Dawa',        lat: 9.60,  lng: 41.85, patients: 38129,  wellness: 67.5, alerts: 1 },
];

const DISEASE_ALERTS = [
  { id: 1, region: 'Oromia',    zone: 'East Hararghe', disease: 'Acute Watery Diarrhea', cases: 342, severity: 'critical', lat: 9.30, lng: 42.12, trend: '+18%' },
  { id: 2, region: 'Amhara',    zone: 'South Gondar',  disease: 'Malaria',               cases: 289, severity: 'critical', lat: 11.90, lng: 37.85, trend: '+12%' },
  { id: 3, region: 'Tigray',    zone: 'Southern',      disease: 'Malnutrition',          cases: 267, severity: 'critical', lat: 13.07, lng: 39.48, trend: '+9%' },
  { id: 4, region: 'Somali',    zone: 'Fafan',         disease: 'Malnutrition',          cases: 310, severity: 'critical', lat: 9.55, lng: 44.07, trend: '+22%' },
  { id: 5, region: 'Gambella',  zone: 'Nuer',          disease: 'Malaria',               cases: 198, severity: 'warning',  lat: 8.25, lng: 34.59, trend: '+15%' },
  { id: 6, region: 'Afar',      zone: 'Zone 2',        disease: 'Measles',               cases: 87,  severity: 'warning',  lat: 12.50, lng: 41.50, trend: '+7%' },
];

const FACILITIES = [
  { name: 'Black Lion Hospital',   type: 'hospital', region: 'Addis Ababa', lat: 9.03, lng: 38.74, status: 'online' },
  { name: 'Mekelle Hospital',      type: 'hospital', region: 'Tigray',      lat: 13.49, lng: 39.47, status: 'online' },
  { name: 'Hawassa University',    type: 'hospital', region: 'Sidama',      lat: 7.05, lng: 38.47, status: 'online' },
  { name: 'Gondar Hospital',       type: 'hospital', region: 'Amhara',      lat: 12.60, lng: 37.46, status: 'offline' },
  { name: 'Jimma University',      type: 'hospital', region: 'Oromia',      lat: 7.67, lng: 36.83, status: 'online' },
  { name: 'Adwa Health Center',    type: 'clinic',   region: 'Tigray',      lat: 14.17, lng: 38.89, status: 'online' },
];

const MATERNAL_HEATMAP = [
  { lat: 9.0, lng: 38.7, risk: 85, label: 'High maternal mortality' },
  { lat: 7.6, lng: 36.8, risk: 78, label: 'Low prenatal care access' },
  { lat: 13.5, lng: 39.5, risk: 72, label: 'Limited facility access' },
  { lat: 9.5, lng: 44.0, risk: 91, label: 'Critical malnutrition risk' },
  { lat: 8.2, lng: 34.6, risk: 68, label: 'Moderate risk zone' },
];

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG BY ROLE
// ═══════════════════════════════════════════════════════════════════════════

interface NavItem { icon: React.ElementType; label: string; path: string; perm: string; }
interface NavSection { section: string; items: NavItem[]; }

const NAV_CONFIG: Record<string, NavSection[]> = {
  patient: [
    { section: 'My Health', items: [
      { icon: HeartPulse,    label: 'Health Overview', path: '/dashboard/my-health', perm: 'view_own_health' },
      { icon: Calendar,      label: 'Appointments',    path: '/dashboard/my-appointments', perm: 'view_own_appointments' },
      { icon: Activity,      label: 'Wellness Score',  path: '/dashboard/my-wellness', perm: 'view_own_wellness' },
    ]},
    { section: 'Access', items: [
      { icon: Smartphone,    label: 'USSD / SMS',      path: '/dashboard/ussd', perm: 'view_ussd' },
      { icon: MessageCircle, label: 'TenaBot AI',      path: '/dashboard/healthbot', perm: 'use_healthbot' },
    ]},
  ],
  clinic: [
    { section: 'Patient Care', items: [
      { icon: Users,         label: 'Patient Queue',   path: '/dashboard/patients', perm: 'view_all_patients' },
      { icon: Search,        label: 'Fayda ID Lookup', path: '/dashboard/fayda', perm: 'fayda_lookup' },
      { icon: Calendar,      label: 'Appointments',    path: '/dashboard/appointments', perm: 'manage_appointments' },
      { icon: Activity,      label: 'FHIR Records',    path: '/dashboard/fhir', perm: 'view_fhir_records' },
    ]},
    { section: 'Tools', items: [
      { icon: MessageCircle, label: 'TenaBot AI',      path: '/dashboard/healthbot', perm: 'use_healthbot' },
    ]},
  ],
  ngo: [
    { section: 'Research', items: [
      { icon: MapPin,        label: 'Research Map',    path: '/dashboard/research', perm: 'view_research_maps' },
      { icon: AlertTriangle, label: 'Maternal Heatmap',path: '/dashboard/heatmaps', perm: 'view_heatmaps' },
      { icon: Zap,           label: 'High-Need Areas', path: '/dashboard/high-need', perm: 'identify_high_need_areas' },
      { icon: FileText,      label: 'Funding Reports', path: '/dashboard/funding', perm: 'view_funding_allocation' },
    ]},
    { section: 'Data', items: [
      { icon: Building2,     label: 'Facilities',      path: '/dashboard/facilities', perm: 'view_facilities' },
      { icon: FileText,      label: 'Analytics',       path: '/dashboard/reports', perm: 'view_reports' },
    ]},
  ],
  moh: [
    { section: 'Surveillance', items: [
      { icon: MapPin,        label: 'Disease Map',     path: '/dashboard/surveillance', perm: 'view_disease_map' },
      { icon: AlertTriangle, label: 'Outbreak Alerts', path: '/dashboard/alerts', perm: 'view_disease_alerts' },
      { icon: Activity,      label: 'Epidemiology',    path: '/dashboard/epidemiology', perm: 'view_epidemiology' },
      { icon: Building2,     label: 'Facilities',      path: '/dashboard/facilities', perm: 'view_facilities' },
    ]},
    { section: 'Analytics', items: [
      { icon: FileText,      label: 'National Reports',path: '/dashboard/reports', perm: 'view_reports' },
    ]},
  ],
  super_admin: [
    { section: 'Command', items: [
      { icon: MapPin,        label: 'Disease Map',     path: '/dashboard/surveillance', perm: 'view_disease_map' },
      { icon: Users,         label: 'All Patients',    path: '/dashboard/patients', perm: 'view_all_patients' },
      { icon: AlertTriangle, label: 'Alerts',          path: '/dashboard/alerts', perm: 'view_disease_alerts' },
    ]},
    { section: 'System', items: [
      { icon: Shield,        label: 'User Management', path: '/dashboard/admin', perm: 'manage_users' },
      { icon: Settings,      label: 'Settings',        path: '/dashboard/settings', perm: 'view_settings' },
    ]},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (v: boolean) => void }> = ({ collapsed, setCollapsed }) => {
  const { role, meta, can } = usePermissions();
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navSections = NAV_CONFIG[role] ?? [];

  const handleNav = (path: string) => navigate(path);
  const handleLogout = async () => { await signOut(); navigate('/login'); };

  return (
    <aside className={`map-sidebar ${collapsed ? 'map-sidebar--collapsed' : ''}`}>
      <div className="map-sidebar__head">
        <div className="map-sidebar__brand">
          <span className="map-sidebar__logo">🇪🇹</span>
          {!collapsed && <span className="map-sidebar__title">CloudHeal</span>}
        </div>
        <button className="map-sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={16}/> : <X size={16}/>}
        </button>
      </div>

      <div className="map-sidebar__role" style={{ background: `${meta.color}15`, borderLeftColor: meta.color }}>
        {!collapsed && (
          <>
            <span className="map-sidebar__role-icon">{NAV_CONFIG[role] ? role === 'patient' ? '👤' : role === 'clinic' ? '🏥' : role === 'ngo' ? '🌍' : '🏛️' : '⚙️'}</span>
            <span className="map-sidebar__role-label" style={{ color: meta.color }}>{meta.label}</span>
          </>
        )}
      </div>

      <nav className="map-sidebar__nav">
        {navSections.map((section, i) => (
          <div key={i} className="map-nav-section">
            {!collapsed && <div className="map-nav-section__title">{section.section}</div>}
            {section.items.map(item => {
              if (!can(item.perm as any)) return null;
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  className={`map-nav-item ${isActive ? 'map-nav-item--active' : ''}`}
                  onClick={() => handleNav(item.path)}
                  style={isActive ? { background: `${meta.color}12`, color: meta.color } : {}}
                >
                  <Icon size={18}/>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="map-sidebar__foot">
        {!collapsed ? (
          <div className="map-sidebar__user">
            <div className="map-sidebar__avatar" style={{ background: meta.color }}>
              {profile?.full_name?.[0] ?? 'U'}
            </div>
            <div className="map-sidebar__user-info">
              <span className="map-sidebar__user-name">{profile?.full_name ?? 'User'}</span>
              <span className="map-sidebar__user-role" style={{ color: meta.color }}>{meta.label}</span>
            </div>
            <button className="map-sidebar__logout" onClick={handleLogout}>
              <LogOut size={14}/>
            </button>
          </div>
        ) : (
          <button className="map-sidebar__logout-mini" onClick={handleLogout}>
            <LogOut size={14}/>
          </button>
        )}
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTROL PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ControlPanel: React.FC<{
  selectedRegion: typeof REGIONS[0] | null;
  selectedAlert: typeof DISEASE_ALERTS[0] | null;
  mapLayer: string;
  setMapLayer: (v: string) => void;
}> = ({ selectedRegion, selectedAlert, mapLayer, setMapLayer }) => {
  const { role } = usePermissions();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="map-control-panel">
      <div className="map-control-panel__search">
        <Search size={16}/>
        <input
          placeholder={role === 'clinic' ? 'Search by Fayda ID (ET...)' : 'Search regions, facilities...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="map-control-panel__layers">
        {role === 'moh' && (
          <>
            <button
              className={`map-layer-btn ${mapLayer === 'disease' ? 'map-layer-btn--active' : ''}`}
              onClick={() => setMapLayer('disease')}
            >🦠 Disease</button>
            <button
              className={`map-layer-btn ${mapLayer === 'wellness' ? 'map-layer-btn--active' : ''}`}
              onClick={() => setMapLayer('wellness')}
            >💚 Wellness</button>
          </>
        )}
        {role === 'ngo' && (
          <>
            <button
              className={`map-layer-btn ${mapLayer === 'maternal' ? 'map-layer-btn--active' : ''}`}
              onClick={() => setMapLayer('maternal')}
            >🤰 Maternal Risk</button>
            <button
              className={`map-layer-btn ${mapLayer === 'funding' ? 'map-layer-btn--active' : ''}`}
              onClick={() => setMapLayer('funding')}
            >💰 Funding Gaps</button>
          </>
        )}
        {role === 'clinic' && (
          <>
            <button
              className={`map-layer-btn ${mapLayer === 'facilities' ? 'map-layer-btn--active' : ''}`}
              onClick={() => setMapLayer('facilities')}
            >🏥 Facilities</button>
          </>
        )}
        {role === 'patient' && (
          <button
            className={`map-layer-btn ${mapLayer === 'my-facility' ? 'map-layer-btn--active' : ''}`}
            onClick={() => setMapLayer('my-facility')}
          >📍 My Facility</button>
        )}
      </div>

      {selectedRegion && (
        <div className="map-info-card">
          <div className="map-info-card__head">
            <span className="map-info-card__title">{selectedRegion.name}</span>
            <button className="map-info-card__close" onClick={() => {}}>✕</button>
          </div>
          <div className="map-info-card__stats">
            <div className="map-info-stat">
              <span className="map-info-stat__val">{selectedRegion.patients.toLocaleString()}</span>
              <span className="map-info-stat__label">Patients</span>
            </div>
            <div className="map-info-stat">
              <span className="map-info-stat__val">{selectedRegion.wellness}%</span>
              <span className="map-info-stat__label">Wellness</span>
            </div>
            <div className="map-info-stat">
              <span className="map-info-stat__val" style={{ color: selectedRegion.alerts > 0 ? '#ef4444' : '#22c55e' }}>
                {selectedRegion.alerts}
              </span>
              <span className="map-info-stat__label">Alerts</span>
            </div>
          </div>
        </div>
      )}

      {selectedAlert && (
        <div className="map-info-card map-info-card--alert">
          <div className="map-info-card__head">
            <span className={`map-severity-badge map-severity-badge--${selectedAlert.severity}`}>
              {selectedAlert.severity.toUpperCase()}
            </span>
            <button className="map-info-card__close" onClick={() => {}}>✕</button>
          </div>
          <div className="map-info-card__title">{selectedAlert.disease}</div>
          <div className="map-info-card__subtitle">📍 {selectedAlert.region} · {selectedAlert.zone}</div>
          <div className="map-info-card__stats">
            <div className="map-info-stat">
              <span className="map-info-stat__val">{selectedAlert.cases}</span>
              <span className="map-info-stat__label">Cases</span>
            </div>
            <div className="map-info-stat">
              <span className="map-info-stat__val" style={{ color: '#ef4444' }}>{selectedAlert.trend}</span>
              <span className="map-info-stat__label">Trend</span>
            </div>
          </div>
          <button className="map-info-card__action" onClick={() => navigate('/dashboard/alerts')}>
            View Full Alert <ChevronRight size={12}/>
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STATS OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

const StatsOverlay: React.FC = () => {
  const { role } = usePermissions();
  const [now, setNow] = useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const stats = {
    patient: [
      { icon: HeartPulse, label: 'Wellness', value: '72%', color: '#22c55e' },
      { icon: Calendar, label: 'Next Appt', value: '15 Jun', color: '#2563eb' },
    ],
    clinic: [
      { icon: Users, label: 'Today\'s Queue', value: '24', color: '#2563eb' },
      { icon: AlertTriangle, label: 'Critical', value: '3', color: '#ef4444' },
    ],
    ngo: [
      { icon: MapPin, label: 'High-Risk Zones', value: '7', color: '#ef4444' },
      { icon: Zap, label: 'Funding Gaps', value: '12', color: '#d97706' },
    ],
    moh: [
      { icon: Users, label: 'Total Patients', value: '2.8M', color: '#2563eb' },
      { icon: AlertTriangle, label: 'Critical Alerts', value: '4', color: '#ef4444' },
      { icon: Building2, label: 'Facilities', value: '1,204', color: '#059669' },
    ],
    super_admin: [
      { icon: Users, label: 'Total Patients', value: '2.8M', color: '#2563eb' },
      { icon: AlertTriangle, label: 'Critical Alerts', value: '4', color: '#ef4444' },
    ],
  };

  type StatsKey = keyof typeof stats;
  const roleStats = stats[role as StatsKey] ?? stats.moh;

  return (
    <div className="map-stats-overlay">
      <div className="map-stats-time">
        <span className="map-stats-live">● LIVE</span>
        <span className="map-stats-clock">{now.toLocaleTimeString('en-ET', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
      <div className="map-stats-items">
        {roleStats.map((s: { icon: React.ElementType; label: string; value: string; color: string }, i: number) => {
          const Icon = s.icon;
          return (
            <div key={i} className="map-stat-item">
              <div className="map-stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                <Icon size={14}/>
              </div>
              <div className="map-stat-content">
                <span className="map-stat-value" style={{ color: s.color }}>{s.value}</span>
                <span className="map-stat-label">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAP LAYERS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MapLayers: React.FC<{
  role: string;
  onRegionClick: (r: typeof REGIONS[0]) => void;
  onAlertClick: (a: typeof DISEASE_ALERTS[0]) => void;
}> = ({ role, onRegionClick, onAlertClick }) => {
  const severityColors = { critical: '#ef4444', warning: '#f59e0b', watch: '#3b82f6' };

  return (
    <>
      {/* Region bubbles - always show for MoH/NGO */}
      {(role === 'moh' || role === 'ngo' || role === 'super_admin') && REGIONS.map(r => (
        <CircleMarker
          key={r.name}
          center={[r.lat, r.lng]}
          radius={Math.sqrt(r.patients / 15000) + 6}
          pathOptions={{
            color: r.wellness >= 60 ? '#22c55e' : r.wellness >= 50 ? '#f59e0b' : '#ef4444',
            fillColor: r.wellness >= 60 ? '#22c55e' : r.wellness >= 50 ? '#f59e0b' : '#ef4444',
            fillOpacity: 0.2,
            weight: 1.5,
          }}
          eventHandlers={{ click: () => onRegionClick(r) }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{r.name}</strong>
              <span>👥 {r.patients.toLocaleString()} patients</span>
              <span>💚 Wellness: {r.wellness}%</span>
              <span>🚨 {r.alerts} alerts</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Disease alerts - MoH only */}
      {role === 'moh' && DISEASE_ALERTS.map(alert => (
        <CircleMarker
          key={alert.id}
          center={[alert.lat, alert.lng]}
          radius={alert.severity === 'critical' ? 20 : 14}
          pathOptions={{
            color: severityColors[alert.severity as keyof typeof severityColors],
            fillColor: severityColors[alert.severity as keyof typeof severityColors],
            fillOpacity: 0.4,
            weight: 2,
          }}
          eventHandlers={{ click: () => onAlertClick(alert) }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{alert.disease}</strong>
              <span>📍 {alert.region} · {alert.zone}</span>
              <span>🦠 {alert.cases} cases</span>
              <span style={{ color: severityColors[alert.severity as keyof typeof severityColors] }}>
                {alert.trend} trend
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Maternal heatmap - NGO only */}
      {role === 'ngo' && MATERNAL_HEATMAP.map((m, i) => (
        <CircleMarker
          key={i}
          center={[m.lat, m.lng]}
          radius={m.risk / 3}
          pathOptions={{
            color: m.risk > 80 ? '#ef4444' : m.risk > 60 ? '#f59e0b' : '#22c55e',
            fillColor: m.risk > 80 ? '#ef4444' : m.risk > 60 ? '#f59e0b' : '#22c55e',
            fillOpacity: 0.35,
            weight: 1,
          }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{m.label}</strong>
              <span>Risk Score: {m.risk}%</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Facilities - Clinic only */}
      {role === 'clinic' && FACILITIES.map((f, i) => (
        <CircleMarker
          key={i}
          center={[f.lat, f.lng]}
          radius={12}
          pathOptions={{
            color: f.status === 'online' ? '#22c55e' : '#ef4444',
            fillColor: f.status === 'online' ? '#22c55e' : '#ef4444',
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Popup>
            <div className="map-popup">
              <strong>{f.name}</strong>
              <span>🏥 {f.type}</span>
              <span>📍 {f.region}</span>
              <span style={{ color: f.status === 'online' ? '#22c55e' : '#ef4444' }}>
                ● {f.status}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MAP DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export const MapDashboard: React.FC = () => {
  const { role } = usePermissions();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mapLayer, setMapLayer] = useState('disease');
  const [selectedRegion, setSelectedRegion] = useState<typeof REGIONS[0] | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<typeof DISEASE_ALERTS[0] | null>(null);

  return (
    <div className="map-dashboard" data-collapsed={sidebarCollapsed ? 'true' : 'false'}>
      {/* Full-bleed map background */}
      <MapContainer
        center={[9.0, 39.5]}
        zoom={6}
        zoomControl={false}
        attributionControl={false}
        className="map-leaflet-container"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        <MapLayers
          role={role}
          onRegionClick={setSelectedRegion}
          onAlertClick={setSelectedAlert}
        />
      </MapContainer>

      {/* Sidebar overlay */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Control panel overlay */}
      <ControlPanel
        selectedRegion={selectedRegion}
        selectedAlert={selectedAlert}
        mapLayer={mapLayer}
        setMapLayer={setMapLayer}
      />

      {/* Stats overlay */}
      <StatsOverlay />

      {/* Page content — rendered on top of map, right of sidebar */}
      <div className="map-content">
        <Outlet/>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div className="map-legend__title">LEGEND</div>
        {role === 'moh' && (
          <>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#ef4444' }}/> Critical Alert</div>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#f59e0b' }}/> Warning</div>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#22c55e' }}/> Healthy</div>
          </>
        )}
        {role === 'ngo' && (
          <>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#ef4444' }}/> High Risk</div>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#f59e0b' }}/> Moderate</div>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#22c55e' }}/> Low Risk</div>
          </>
        )}
        {role === 'clinic' && (
          <>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#22c55e' }}/> Online</div>
            <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#ef4444' }}/> Offline</div>
          </>
        )}
        {role === 'patient' && (
          <div className="map-legend__item"><span className="map-legend__dot" style={{ background: '#2563eb' }}/> Your Facility</div>
        )}
      </div>
    </div>
  );
};

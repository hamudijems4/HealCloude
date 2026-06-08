import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Users, Activity, AlertTriangle, TrendingUp, Wifi, WifiOff,
  RefreshCw, ArrowUpRight, Brain, Smartphone, ChevronRight,
  Zap, Shield, HeartPulse
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

// ── Ethiopia regions with real coordinates ───────────────────────────────────
const REGIONS = [
  { name: 'Addis Ababa',      lat: 9.005,  lng: 38.763, patients: 847391, wellness: 71.2, alerts: 1, color: '#2563eb' },
  { name: 'Oromia',           lat: 8.000,  lng: 38.500, patients: 612847, wellness: 58.4, alerts: 3, color: '#dc2626' },
  { name: 'Amhara',           lat: 11.000, lng: 37.500, patients: 489203, wellness: 61.8, alerts: 2, color: '#d97706' },
  { name: 'Tigray',           lat: 14.000, lng: 38.500, patients: 234819, wellness: 54.1, alerts: 2, color: '#dc2626' },
  { name: 'SNNPR',            lat: 6.500,  lng: 37.000, patients: 318742, wellness: 63.7, alerts: 1, color: '#d97706' },
  { name: 'Somali',           lat: 7.000,  lng: 44.000, patients: 187341, wellness: 44.2, alerts: 3, color: '#dc2626' },
  { name: 'Afar',             lat: 12.000, lng: 41.000, patients: 96283,  wellness: 49.8, alerts: 2, color: '#d97706' },
  { name: 'Benishangul-Gumuz',lat: 10.500, lng: 35.500, patients: 54218,  wellness: 66.3, alerts: 0, color: '#059669' },
  { name: 'Gambella',         lat: 8.000,  lng: 34.500, patients: 38471,  wellness: 52.9, alerts: 1, color: '#d97706' },
  { name: 'Harari',           lat: 9.310,  lng: 42.120, patients: 29847,  wellness: 69.1, alerts: 0, color: '#059669' },
  { name: 'Dire Dawa',        lat: 9.600,  lng: 41.850, patients: 38129,  wellness: 67.5, alerts: 1, color: '#2563eb' },
];

const ALERTS = [
  { id:1,  region:'Oromia',    zone:'East Hararghe', disease:'Acute Watery Diarrhea', cases:342, severity:'critical', lat:9.30,  lng:42.12, trend:'+18%' },
  { id:2,  region:'Amhara',    zone:'South Gondar',  disease:'Malaria',               cases:289, severity:'critical', lat:11.90, lng:37.85, trend:'+12%' },
  { id:3,  region:'Tigray',    zone:'Southern',      disease:'Malnutrition',          cases:267, severity:'critical', lat:13.07, lng:39.48, trend:'+9%'  },
  { id:4,  region:'Somali',    zone:'Fafan',         disease:'Malnutrition',          cases:310, severity:'critical', lat:9.55,  lng:44.07, trend:'+22%' },
  { id:5,  region:'Gambella',  zone:'Nuer',          disease:'Malaria',               cases:198, severity:'warning',  lat:8.25,  lng:34.59, trend:'+15%' },
  { id:6,  region:'Afar',      zone:'Zone 2',        disease:'Measles',               cases:87,  severity:'warning',  lat:12.50, lng:41.50, trend:'+7%'  },
  { id:7,  region:'SNNPR',     zone:'Wolayita',      disease:'Tuberculosis',          cases:134, severity:'warning',  lat:6.85,  lng:37.75, trend:'+4%'  },
  { id:8,  region:'Benishangul',zone:'Metekel',      disease:'Malaria',               cases:76,  severity:'watch',    lat:10.75, lng:35.55, trend:'+3%'  },
];

const SEVERITY_CFG = {
  critical: { color: '#ef4444', fill: '#ef4444', r: 26, glow: 'rgba(239,68,68,0.35)' },
  warning:  { color: '#f59e0b', fill: '#f59e0b', r: 18, glow: 'rgba(245,158,11,0.30)' },
  watch:    { color: '#3b82f6', fill: '#3b82f6', r: 12, glow: 'rgba(59,130,246,0.25)' },
};

const SPARKLINE = [42,45,41,48,44,52,49,55,51,58,54,62];

const FEED = [
  { icon:'🧬', text:'Fayda ID ET8823710293 synced across 3 facilities', time:'2m ago',  color:'#2563eb' },
  { icon:'🚨', text:'Critical malnutrition spike — Somali Region 310 cases', time:'8m ago',  color:'#dc2626' },
  { icon:'🤖', text:'AI sent 847 prenatal SMS nudges this hour', time:'15m ago', color:'#7c3aed' },
  { icon:'🏥', text:'Tikur Anbessa synced 42 FHIR records', time:'22m ago', color:'#059669' },
  { icon:'📡', text:'Afar Zone 2 facility back online after 4h offline', time:'31m ago', color:'#059669' },
  { icon:'⚠️',  text:'Malaria cases rising +22% — East Hararghe flagged', time:'45m ago', color:'#d97706' },
];

// Animated counter hook
function useCount(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

// Live clock
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return time;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<typeof ALERTS[0] | null>(null);
  const [feedPaused, setFeedPaused]        = useState(false);
  const [lastRefresh, setLastRefresh]       = useState(new Date());
  const [refreshing, setRefreshing]         = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const clock   = useClock();

  const totalPatients     = useCount(2_847_391);
  const aiInterventions   = useCount(14_823);
  const ussdSessions      = useCount(3_421);
  const facilitiesOnline  = useCount(1_204);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setLastRefresh(new Date()); }, 1200);
  };

  // Auto-scroll feed
  useEffect(() => {
    if (feedPaused) return;
    const el = feedRef.current;
    if (!el) return;
    const t = setInterval(() => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) el.scrollTop = 0;
      else el.scrollTop += 1;
    }, 40);
    return () => clearInterval(t);
  }, [feedPaused]);

  const criticalCount = ALERTS.filter(a => a.severity === 'critical').length;
  const totalCases    = ALERTS.reduce((s, a) => s + a.cases, 0);

  return (
    <div className="moh">

      {/* ── TOP BAR ───────────────────────────────────────────────────── */}
      <div className="moh__topbar">
        <div className="moh__topbar-left">
          <div className="moh__live-dot"/>
          <span className="moh__live-label">LIVE</span>
          <span className="moh__clock">
            {clock.toLocaleTimeString('en-ET', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
          </span>
          <span className="moh__date">
            {clock.toLocaleDateString('en-ET', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </span>
        </div>
        <div className="moh__topbar-center">
          <span className="moh__platform-badge">🇪🇹 Ethiopia National Health Command Center</span>
        </div>
        <div className="moh__topbar-right">
          <span className="moh__last-sync">
            Last sync: {lastRefresh.toLocaleTimeString('en-ET', { hour:'2-digit', minute:'2-digit' })}
          </span>
          <button className={`moh__refresh-btn ${refreshing ? 'moh__refresh-btn--spinning' : ''}`} onClick={handleRefresh}>
            <RefreshCw size={13}/>
          </button>
        </div>
      </div>

      {/* ── KPI STRIP ─────────────────────────────────────────────────── */}
      <div className="moh__kpis">

        <div className="moh__kpi moh__kpi--blue">
          <div className="moh__kpi-icon"><Users size={20}/></div>
          <div className="moh__kpi-body">
            <span className="moh__kpi-val">{totalPatients.toLocaleString()}</span>
            <span className="moh__kpi-label">Registered Patients</span>
            <span className="moh__kpi-trend moh__kpi-trend--up"><TrendingUp size={11}/> +3.2% this month</span>
          </div>
          <div className="moh__kpi-spark">
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={SPARKLINE.map(v => ({ v }))}>
                <defs><linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#sg1)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="moh__kpi moh__kpi--red" onClick={() => navigate('/dashboard/alerts')} style={{cursor:'pointer'}}>
          <div className="moh__kpi-icon"><AlertTriangle size={20}/></div>
          <div className="moh__kpi-body">
            <span className="moh__kpi-val">{criticalCount} <small>critical</small></span>
            <span className="moh__kpi-label">Active Disease Alerts</span>
            <span className="moh__kpi-trend moh__kpi-trend--danger"><Zap size={11}/> {totalCases.toLocaleString()} total cases</span>
          </div>
          <div className="moh__kpi-spark">
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={[8,12,10,15,13,18,16,22,19,24,21,28].map(v => ({ v }))}>
                <defs><linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#sg2)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="moh__kpi moh__kpi--purple">
          <div className="moh__kpi-icon"><Brain size={20}/></div>
          <div className="moh__kpi-body">
            <span className="moh__kpi-val">{aiInterventions.toLocaleString()}</span>
            <span className="moh__kpi-label">AI Interventions Today</span>
            <span className="moh__kpi-trend moh__kpi-trend--up"><TrendingUp size={11}/> +9.4% vs yesterday</span>
          </div>
          <div className="moh__kpi-spark">
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={[30,35,28,42,38,45,40,52,47,56,50,62].map(v => ({ v }))}>
                <defs><linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#sg3)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="moh__kpi moh__kpi--green">
          <div className="moh__kpi-icon"><Smartphone size={20}/></div>
          <div className="moh__kpi-body">
            <span className="moh__kpi-val">{ussdSessions.toLocaleString()}</span>
            <span className="moh__kpi-label">USSD Sessions Today</span>
            <span className="moh__kpi-trend moh__kpi-trend--up"><TrendingUp size={11}/> *961# active</span>
          </div>
          <div className="moh__kpi-spark">
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={[20,25,22,30,27,33,29,38,34,42,38,48].map(v => ({ v }))}>
                <defs><linearGradient id="sg4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#sg4)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="moh__kpi moh__kpi--teal">
          <div className="moh__kpi-icon"><Wifi size={20}/></div>
          <div className="moh__kpi-body">
            <span className="moh__kpi-val">
              {facilitiesOnline.toLocaleString()}
              <small className="moh__offline"><WifiOff size={10}/> 87 offline</small>
            </span>
            <span className="moh__kpi-label">Facilities Online</span>
            <span className="moh__kpi-trend moh__kpi-trend--up"><Shield size={11}/> 93.3% uptime</span>
          </div>
          <div className="moh__kpi-spark">
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={[90,91,89,92,88,93,91,94,92,95,93,96].map(v => ({ v }))}>
                <defs><linearGradient id="sg5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity={0}/>
                </linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#0891b2" strokeWidth={2} fill="url(#sg5)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── MAIN BODY ─────────────────────────────────────────────────── */}
      <div className="moh__body">

        {/* MAP — HERO ──────────────────────────────────────────────── */}
        <div className="moh__map-panel">

          <div className="moh__map-header">
            <div>
              <h2 className="moh__map-title">Disease Surveillance Command Map</h2>
              <p className="moh__map-sub">All 11 regions · Real-time outbreak monitoring</p>
            </div>
            <button className="moh__map-fullbtn" onClick={() => navigate('/dashboard/disease-map')}>
              Full Map View <ArrowUpRight size={14}/>
            </button>
          </div>

          <div className="moh__map-container">
            <MapContainer
              center={[9.0, 39.5]}
              zoom={6}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
              attributionControl={false}
            >
              <ZoomControl position="bottomright"/>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />

              {/* Region wellness bubbles */}
              {REGIONS.map(r => (
                <CircleMarker
                  key={r.name}
                  center={[r.lat, r.lng]}
                  radius={Math.sqrt(r.patients / 5000) + 8}
                  pathOptions={{
                    color: r.color,
                    fillColor: r.color,
                    fillOpacity: 0.12,
                    weight: 1.5,
                  }}
                >
                  <Popup className="moh__popup">
                    <div className="moh__popup-inner">
                      <strong>{r.name}</strong>
                      <span>👥 {r.patients.toLocaleString()} patients</span>
                      <span>💚 Wellness: {r.wellness}%</span>
                      <span>🚨 {r.alerts} active alerts</span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Disease alert pulses */}
              {ALERTS.map(alert => {
                const cfg = SEVERITY_CFG[alert.severity as keyof typeof SEVERITY_CFG];
                return (
                  <CircleMarker
                    key={alert.id}
                    center={[alert.lat, alert.lng]}
                    radius={cfg.r}
                    pathOptions={{
                      color: cfg.color,
                      fillColor: cfg.fill,
                      fillOpacity: 0.45,
                      weight: 2,
                    }}
                    eventHandlers={{ click: () => setSelectedAlert(alert) }}
                  >
                    <Popup className="moh__popup">
                      <div className="moh__popup-inner">
                        <strong>{alert.disease}</strong>
                        <span>📍 {alert.region} · {alert.zone}</span>
                        <span className="moh__popup-cases">🦠 {alert.cases} cases · <b style={{color: cfg.color}}>{alert.trend}</b></span>
                        <span className={`moh__sev-badge moh__sev-badge--${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Map overlay legend */}
            <div className="moh__map-legend">
              <div className="moh__legend-title">ALERT SEVERITY</div>
              {Object.entries(SEVERITY_CFG).map(([k, v]) => (
                <div key={k} className="moh__legend-row">
                  <span className="moh__legend-dot" style={{ background: v.fill, boxShadow: `0 0 6px ${v.glow}` }}/>
                  <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                </div>
              ))}
              <div className="moh__legend-sep"/>
              <div className="moh__legend-row">
                <span className="moh__legend-circle"/>
                <span>Region Population</span>
              </div>
            </div>

            {/* Selected alert card */}
            {selectedAlert && (
              <div className="moh__alert-card">
                <button className="moh__alert-close" onClick={() => setSelectedAlert(null)}>✕</button>
                <div className={`moh__alert-severity moh__alert-severity--${selectedAlert.severity}`}>
                  {selectedAlert.severity.toUpperCase()}
                </div>
                <div className="moh__alert-disease">{selectedAlert.disease}</div>
                <div className="moh__alert-region">📍 {selectedAlert.region} · {selectedAlert.zone}</div>
                <div className="moh__alert-stat">
                  <span>🦠</span>
                  <div>
                    <b>{selectedAlert.cases.toLocaleString()}</b>
                    <small>confirmed cases</small>
                  </div>
                </div>
                <div className="moh__alert-stat">
                  <span>📈</span>
                  <div>
                    <b style={{ color: '#ef4444' }}>{selectedAlert.trend}</b>
                    <small>7-day trend</small>
                  </div>
                </div>
                <button className="moh__alert-action" onClick={() => navigate('/dashboard/alerts')}>
                  View Full Alert <ChevronRight size={13}/>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN ────────────────────────────────────────────── */}
        <div className="moh__right">

          {/* National wellness score gauge */}
          <div className="moh__wellness-card">
            <div className="moh__wellness-header">
              <HeartPulse size={16} color="#2563eb"/>
              <span>National Wellness Score</span>
            </div>
            <div className="moh__wellness-gauge">
              <svg viewBox="0 0 140 80" className="moh__gauge-svg">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444"/>
                    <stop offset="50%" stopColor="#f59e0b"/>
                    <stop offset="100%" stopColor="#22c55e"/>
                  </linearGradient>
                </defs>
                {/* Track */}
                <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round"/>
                {/* Fill — 62.4% of 180° arc */}
                <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="url(#gaugeGrad)"
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${0.624 * 188.5} 188.5`}/>
                {/* Needle */}
                <line
                  x1="70" y1="70"
                  x2={70 + 44 * Math.cos(Math.PI - 0.624 * Math.PI)}
                  y2={70 - 44 * Math.sin(0.624 * Math.PI)}
                  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="70" cy="70" r="5" fill="white"/>
                <text x="70" y="62" textAnchor="middle" fill="#64748b" fontSize="7">62.4%</text>
              </svg>
              <div className="moh__gauge-labels">
                <span>At Risk</span>
                <span>Healthy</span>
              </div>
            </div>
            <div className="moh__wellness-regions">
              {REGIONS.slice(0, 5).map(r => (
                <div key={r.name} className="moh__wellness-row">
                  <span className="moh__wellness-region">{r.name}</span>
                  <div className="moh__wellness-bar-wrap">
                    <div className="moh__wellness-bar" style={{
                      width: `${r.wellness}%`,
                      background: r.wellness >= 65 ? '#22c55e' : r.wellness >= 55 ? '#f59e0b' : '#ef4444',
                    }}/>
                  </div>
                  <span className="moh__wellness-pct">{r.wellness}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical alerts list */}
          <div className="moh__alerts-card">
            <div className="moh__alerts-head">
              <span>🚨 Active Alerts</span>
              <button className="moh__see-all" onClick={() => navigate('/dashboard/alerts')}>
                See all <ChevronRight size={12}/>
              </button>
            </div>
            <div className="moh__alerts-list">
              {ALERTS.filter(a => a.severity === 'critical' || a.severity === 'warning').map(a => (
                <div key={a.id} className={`moh__al-row moh__al-row--${a.severity}`}
                  onClick={() => setSelectedAlert(a)}>
                  <div className={`moh__al-dot moh__al-dot--${a.severity}`}/>
                  <div className="moh__al-info">
                    <span className="moh__al-disease">{a.disease}</span>
                    <span className="moh__al-region">{a.region} · {a.cases} cases</span>
                  </div>
                  <span className={`moh__al-trend ${a.trend.startsWith('+') ? 'moh__al-trend--up' : 'moh__al-trend--down'}`}>
                    {a.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live activity feed */}
          <div className="moh__feed-card">
            <div className="moh__feed-head">
              <div className="moh__live-dot moh__live-dot--sm"/>
              <span>Live Activity Feed</span>
              <button className="moh__feed-pause" onClick={() => setFeedPaused(!feedPaused)}>
                {feedPaused ? '▶' : '⏸'}
              </button>
            </div>
            <div className="moh__feed-scroll" ref={feedRef}>
              {[...FEED, ...FEED].map((f, i) => (
                <div key={i} className="moh__feed-item">
                  <span className="moh__feed-icon">{f.icon}</span>
                  <div className="moh__feed-text">
                    <span>{f.text}</span>
                    <span className="moh__feed-time">{f.time}</span>
                  </div>
                  <div className="moh__feed-dot" style={{ background: f.color }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div className="moh__quick-nav">
            {[
              { icon: <Activity size={16}/>,    label: 'Disease Map',   path: '/dashboard/disease-map', color: '#dc2626' },
              { icon: <Users size={16}/>,        label: 'All Patients',  path: '/dashboard/patients',    color: '#2563eb' },
              { icon: <Smartphone size={16}/>,   label: 'USSD Monitor',  path: '/dashboard/ussd',        color: '#059669' },
              { icon: <Brain size={16}/>,        label: 'AI Reports',    path: '/dashboard/reports',     color: '#7c3aed' },
            ].map((n, i) => (
              <button key={i} className="moh__qnav-btn" onClick={() => navigate(n.path)}
                style={{ borderColor: `${n.color}30` }}>
                <span style={{ color: n.color }}>{n.icon}</span>
                <span>{n.label}</span>
                <ChevronRight size={12} color="#94a3b8"/>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

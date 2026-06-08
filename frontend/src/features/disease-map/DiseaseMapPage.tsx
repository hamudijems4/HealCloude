import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { AlertTriangle, Users, Activity, Filter, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './DiseaseMapPage.css';

const ALERTS = [
  { id:1,  region:'Oromia',           zone:'East Hararghe',  disease:'Acute Watery Diarrhea', cases:342, severity:'critical', lat:9.30,  lng:42.12, trend:'+18%' },
  { id:2,  region:'Amhara',           zone:'South Gondar',   disease:'Malaria',               cases:289, severity:'critical', lat:11.90, lng:37.85, trend:'+12%' },
  { id:3,  region:'Tigray',           zone:'Southern',       disease:'Malnutrition',          cases:267, severity:'critical', lat:13.07, lng:39.48, trend:'+9%'  },
  { id:4,  region:'Somali',           zone:'Fafan',          disease:'Malnutrition',          cases:310, severity:'critical', lat:9.55,  lng:44.07, trend:'+22%' },
  { id:5,  region:'Gambella',         zone:'Nuer',           disease:'Malaria',               cases:198, severity:'warning',  lat:8.25,  lng:34.59, trend:'+15%' },
  { id:6,  region:'Afar',             zone:'Zone 2',         disease:'Measles',               cases:87,  severity:'warning',  lat:12.50, lng:41.50, trend:'+7%'  },
  { id:7,  region:'SNNPR',            zone:'Wolayita',       disease:'Tuberculosis',          cases:134, severity:'warning',  lat:6.85,  lng:37.75, trend:'+4%'  },
  { id:8,  region:'Benishangul-Gumuz',zone:'Metekel',        disease:'Malaria',               cases:76,  severity:'watch',    lat:10.75, lng:35.55, trend:'+3%'  },
  { id:9,  region:'Addis Ababa',      zone:'Bole',           disease:'COVID-19',              cases:45,  severity:'watch',    lat:9.00,  lng:38.76, trend:'-5%'  },
  { id:10, region:'Dire Dawa',        zone:'Dire Dawa',      disease:'Typhoid',               cases:38,  severity:'watch',    lat:9.59,  lng:41.86, trend:'+2%'  },
  { id:11, region:'Harari',           zone:'Harar',          disease:'Meningitis',            cases:22,  severity:'watch',    lat:9.31,  lng:42.12, trend:'0%'   },
  { id:12, region:'Oromia',           zone:'Borena',         disease:'Acute Watery Diarrhea', cases:156, severity:'warning',  lat:4.80,  lng:38.20, trend:'+11%' },
];

const SEVERITY_CONFIG = {
  critical: { color: '#dc2626', fillColor: '#ef4444', radius: 28, label: 'Critical' },
  warning:  { color: '#d97706', fillColor: '#f59e0b', radius: 20, label: 'Warning'  },
  watch:    { color: '#2563eb', fillColor: '#3b82f6', radius: 14, label: 'Watch'    },
};

const DISEASES = ['All Diseases', ...Array.from(new Set(ALERTS.map(a => a.disease)))];
const SEVERITIES = ['All Severities', 'critical', 'warning', 'watch'];

export const DiseaseMapPage: React.FC = () => {
  const [filterDisease, setFilterDisease]   = useState('All Diseases');
  const [filterSeverity, setFilterSeverity] = useState('All Severities');
  const [selected, setSelected]             = useState<typeof ALERTS[0] | null>(null);

  const filtered = ALERTS.filter(a =>
    (filterDisease   === 'All Diseases'   || a.disease  === filterDisease) &&
    (filterSeverity  === 'All Severities' || a.severity === filterSeverity)
  );

  const counts = {
    critical: ALERTS.filter(a => a.severity === 'critical').length,
    warning:  ALERTS.filter(a => a.severity === 'warning').length,
    watch:    ALERTS.filter(a => a.severity === 'watch').length,
    total:    ALERTS.reduce((s, a) => s + a.cases, 0),
  };

  return (
    <div className="dmp">
      {/* Header */}
      <div className="dmp__header">
        <div>
          <h1>Disease Surveillance Map</h1>
          <p>Real-time outbreak monitoring across all 11 Ethiopian regions</p>
        </div>
        <div className="dmp__header-actions">
          <select className="dmp__select" value={filterDisease} onChange={e => setFilterDisease(e.target.value)}>
            {DISEASES.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="dmp__select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
            {SEVERITIES.map(s => <option key={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <button className="dmp__refresh ch-btn ch-btn--ghost">
            <RefreshCw size={15}/> Refresh
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="dmp__kpis">
        <div className="dmp__kpi dmp__kpi--critical">
          <AlertTriangle size={20}/><div><span>{counts.critical}</span><p>Critical Zones</p></div>
        </div>
        <div className="dmp__kpi dmp__kpi--warning">
          <Activity size={20}/><div><span>{counts.warning}</span><p>Warning Zones</p></div>
        </div>
        <div className="dmp__kpi dmp__kpi--watch">
          <Filter size={20}/><div><span>{counts.watch}</span><p>Under Watch</p></div>
        </div>
        <div className="dmp__kpi dmp__kpi--total">
          <Users size={20}/><div><span>{counts.total.toLocaleString()}</span><p>Total Cases</p></div>
        </div>
      </div>

      <div className="dmp__body">
        {/* MAP */}
        <div className="dmp__map-wrap ch-card">
          <MapContainer
            center={[9.0, 39.5]}
            zoom={6}
            style={{ width:'100%', height:'100%', borderRadius:16 }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright"/>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />
            {filtered.map(alert => {
              const cfg = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG];
              return (
                <CircleMarker
                  key={alert.id}
                  center={[alert.lat, alert.lng]}
                  radius={cfg.radius}
                  pathOptions={{
                    color: cfg.color,
                    fillColor: cfg.fillColor,
                    fillOpacity: 0.35,
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setSelected(alert) }}
                >
                  <Popup>
                    <div className="dmp__popup">
                      <strong>{alert.disease}</strong>
                      <span>{alert.region} · {alert.zone}</span>
                      <span className="dmp__popup-cases">{alert.cases} cases · {alert.trend}</span>
                      <span className={`ch-badge ch-badge--${alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'orange' : 'blue'}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Legend */}
          <div className="dmp__legend">
            {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
              <div key={key} className="dmp__legend-item">
                <span className="dmp__legend-dot" style={{ background: cfg.fillColor }}/>
                <span>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert List */}
        <div className="dmp__list ch-card">
          <div className="ch-card-header">
            <h3>Active Alerts ({filtered.length})</h3>
            <span className="ch-badge ch-badge--blue">Live</span>
          </div>
          <div className="dmp__list-scroll">
            {filtered.map(alert => {
              const cfg = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG];
              return (
                <div
                  key={alert.id}
                  className={`dmp__alert-item ${selected?.id === alert.id ? 'dmp__alert-item--active' : ''}`}
                  onClick={() => setSelected(alert)}
                >
                  <div className="dmp__alert-dot" style={{ background: cfg.fillColor }}/>
                  <div className="dmp__alert-info">
                    <div className="dmp__alert-top">
                      <span className="dmp__alert-disease">{alert.disease}</span>
                      <span className={`ch-badge ch-badge--${alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'orange' : 'blue'}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="dmp__alert-meta">
                      <span>📍 {alert.region} · {alert.zone}</span>
                      <span className="dmp__alert-cases">{alert.cases} cases <strong style={{color: alert.trend.startsWith('+') ? '#dc2626' : '#16a34a'}}>{alert.trend}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

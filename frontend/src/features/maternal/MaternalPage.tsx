import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { Heart, AlertTriangle, Baby, TrendingDown } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './MaternalPage.css';

const HEATMAP_ZONES = [
  { lat: 9.55,  lng: 44.07, region: 'Somali',      zone: 'Fafan',        mmr: 920, anc: 18, label: 'Critical malnutrition + low ANC' },
  { lat: 12.50, lng: 41.50, region: 'Afar',         zone: 'Zone 2',       mmr: 880, anc: 22, label: 'Remote, low facility access'      },
  { lat: 8.25,  lng: 34.59, region: 'Gambella',     zone: 'Nuer',         mmr: 760, anc: 31, label: 'Conflict-affected, limited reach'  },
  { lat: 13.07, lng: 39.48, region: 'Tigray',       zone: 'Southern',     mmr: 720, anc: 35, label: 'Post-conflict maternal gaps'       },
  { lat: 4.80,  lng: 38.20, region: 'Oromia',       zone: 'Borena',       mmr: 680, anc: 38, label: 'Pastoral, high mobility population'},
  { lat: 6.85,  lng: 37.75, region: 'SNNPR',        zone: 'Wolayita',     mmr: 540, anc: 47, label: 'Moderate risk, improving coverage' },
  { lat: 11.90, lng: 37.85, region: 'Amhara',       zone: 'South Gondar', mmr: 490, anc: 52, label: 'Rural highland risk factors'       },
  { lat: 7.67,  lng: 36.83, region: 'Oromia',       zone: 'Jimma',        mmr: 320, anc: 64, label: 'University hospital coverage'      },
  { lat: 9.03,  lng: 38.74, region: 'Addis Ababa',  zone: 'Kirkos',       mmr: 140, anc: 91, label: 'High urban access, low MMR'        },
];

const PRENATAL_TREND = [
  { month: 'Jan', anc1: 72, anc4: 38, skilled: 52 },
  { month: 'Feb', anc1: 74, anc4: 41, skilled: 55 },
  { month: 'Mar', anc1: 76, anc4: 43, skilled: 57 },
  { month: 'Apr', anc1: 78, anc4: 46, skilled: 60 },
  { month: 'May', anc1: 80, anc4: 49, skilled: 63 },
  { month: 'Jun', anc1: 82, anc4: 52, skilled: 66 },
];

const ANC_FUNNEL = [
  { name: 'Registered Pregnancies', value: 100, color: '#2563eb' },
  { name: 'ANC Visit 1',            value: 82,  color: '#3b82f6' },
  { name: 'ANC Visit 2',            value: 68,  color: '#7c3aed' },
  { name: 'ANC Visit 4+',           value: 52,  color: '#ec4899' },
  { name: 'Skilled Birth',          value: 66,  color: '#059669' },
  { name: 'Postnatal Check',        value: 41,  color: '#f59e0b' },
];

const BIRTH_OUTCOMES = [
  { name: 'Live Birth',       value: 94.2, color: '#059669' },
  { name: 'Stillbirth',       value: 3.1,  color: '#f59e0b' },
  { name: 'Neonatal Death',   value: 2.7,  color: '#ef4444' },
];

const INTERVENTIONS = [
  { region: 'Somali',   sms: 1240, ussd: 890, appts: 312, risk: 'critical' },
  { region: 'Afar',     sms: 980,  ussd: 670, appts: 241, risk: 'critical' },
  { region: 'Gambella', sms: 760,  ussd: 510, appts: 198, risk: 'high'     },
  { region: 'Tigray',   sms: 1100, ussd: 820, appts: 287, risk: 'high'     },
  { region: 'Oromia',   sms: 2340, ussd: 1870,appts: 651, risk: 'warning'  },
  { region: 'SNNPR',    sms: 1680, ussd: 1210,appts: 445, risk: 'warning'  },
];

const RISK_BADGE: Record<string, string> = { critical: 'ch-badge--red', high: 'ch-badge--orange', warning: 'ch-badge--blue' };

const mmrColor = (mmr: number) =>
  mmr >= 800 ? '#dc2626' : mmr >= 600 ? '#ef4444' : mmr >= 400 ? '#f59e0b' : '#22c55e';

export const MaternalPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof HEATMAP_ZONES[0] | null>(null);

  return (
    <div className="mat">
      <div className="mat__header">
        <div>
          <h1>Maternal Health Tracker</h1>
          <p>Prenatal care coverage, maternal mortality risk, and AI-driven intervention intelligence</p>
        </div>
        <div className="mat__header-badges">
          <span className="mat__badge mat__badge--red">MMR: 401 / 100K live births</span>
          <span className="mat__badge mat__badge--amber">Target: &lt; 70 by 2030</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="mat__kpis">
        {[
          { icon: <Heart size={18}/>,        label: 'Active Pregnancies Tracked', value: '48,291',  color: '#ec4899', sub: 'across 11 regions'           },
          { icon: <Baby size={18}/>,         label: 'ANC 4+ Coverage',            value: '52%',     color: '#2563eb', sub: '+14% vs last year'            },
          { icon: <AlertTriangle size={18}/>,label: 'High-Risk Zones',            value: '5',       color: '#dc2626', sub: 'MMR > 700 / 100K'             },
          { icon: <TrendingDown size={18}/>, label: 'AI Interventions (Mo.)',     value: '8,247',   color: '#059669', sub: 'SMS + USSD reminders sent'    },
        ].map((k, i) => (
          <div key={i} className="mat__kpi" style={{ borderLeftColor: k.color }}>
            <div className="mat__kpi-icon" style={{ background: `${k.color}15`, color: k.color }}>{k.icon}</div>
            <div>
              <span className="mat__kpi-val" style={{ color: k.color }}>{k.value}</span>
              <span className="mat__kpi-lbl">{k.label}</span>
              <span className="mat__kpi-sub">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mat__top">
        {/* Risk Heatmap */}
        <div className="ch-card mat__map-card">
          <div className="mat__card-head">
            <div><h3>Maternal Mortality Risk Map</h3><p>Circle size = MMR · Color = severity</p></div>
          </div>
          <div className="mat__map-wrap">
            <MapContainer center={[9.0, 39.5]} zoom={5} style={{ width: '100%', height: '100%', borderRadius: 12 }} zoomControl={false}>
              <ZoomControl position="bottomright"/>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO'/>
              {HEATMAP_ZONES.map((z, i) => (
                <CircleMarker key={i} center={[z.lat, z.lng]}
                  radius={Math.sqrt(z.mmr / 8) + 5}
                  pathOptions={{ color: mmrColor(z.mmr), fillColor: mmrColor(z.mmr), fillOpacity: 0.45, weight: 2 }}
                  eventHandlers={{ click: () => setSelected(z) }}
                >
                  <Popup>
                    <div className="mat__popup">
                      <strong>{z.region} · {z.zone}</strong>
                      <span>MMR: <strong style={{ color: mmrColor(z.mmr) }}>{z.mmr}</strong> / 100K</span>
                      <span>ANC Coverage: {z.anc}%</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{z.label}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            {selected && (
              <div className="mat__map-detail">
                <div className="mat__map-detail-head">
                  <strong>{selected.region}</strong>
                  <button onClick={() => setSelected(null)}>✕</button>
                </div>
                <div className="mat__map-detail-body">
                  <div><span>Zone</span><span>{selected.zone}</span></div>
                  <div><span>MMR</span><span style={{ color: mmrColor(selected.mmr), fontWeight: 700 }}>{selected.mmr} / 100K</span></div>
                  <div><span>ANC Coverage</span><span>{selected.anc}%</span></div>
                  <div><span>Note</span><span style={{ fontSize: '0.75rem' }}>{selected.label}</span></div>
                </div>
              </div>
            )}

            <div className="mat__map-legend">
              {[['#dc2626','Critical (800+)'],['#ef4444','High (600–799)'],['#f59e0b','Moderate (400–599)'],['#22c55e','Low (<400)']].map(([c, l]) => (
                <div key={l}><span style={{ background: c }}/>{l}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ANC Funnel + Birth Outcomes */}
        <div className="mat__right-col">
          <div className="ch-card mat__card">
            <div className="mat__card-head">
              <div><h3>Care Continuum Funnel</h3><p>% of registered pregnancies reaching each step</p></div>
            </div>
            <div className="mat__funnel">
              {ANC_FUNNEL.map((s, i) => (
                <div key={i} className="mat__funnel-row">
                  <span className="mat__funnel-label">{s.name}</span>
                  <div className="mat__funnel-track">
                    <div className="mat__funnel-fill" style={{ width: `${s.value}%`, background: s.color }}/>
                  </div>
                  <span className="mat__funnel-pct" style={{ color: s.color }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ch-card mat__card">
            <div className="mat__card-head">
              <div><h3>Birth Outcomes</h3><p>Last 12 months — national average</p></div>
            </div>
            <div className="mat__outcomes">
              <div className="mat__outcomes-donut">
                <div className="mat__outcomes-center">
                  <span>94.2%</span><small>live birth</small>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={BIRTH_OUTCOMES} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={3} dataKey="value">
                      {BIRTH_OUTCOMES.map((e, i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mat__outcomes-legend">
                {BIRTH_OUTCOMES.map((d, i) => (
                  <div key={i}><i style={{ background: d.color }}/><span>{d.name}</span><strong style={{ color: d.color }}>{d.value}%</strong></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mat__bottom">
        {/* Prenatal Trend */}
        <div className="ch-card mat__card mat__card--wide">
          <div className="mat__card-head">
            <div><h3>Prenatal Care Trend</h3><p>ANC1, ANC4+, and skilled birth attendance — 6 months</p></div>
          </div>
          <div style={{ height: 220, padding: '0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRENATAL_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {[['a1', '#2563eb'],['a2','#7c3aed'],['a3','#059669']].map(([id, c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={c} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`}/>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: unknown, n: unknown) => [`${v as number}%`, n === 'anc1' ? 'ANC Visit 1' : n === 'anc4' ? 'ANC 4+' : 'Skilled Birth']}/>
                <Area type="monotone" dataKey="anc1"    stroke="#2563eb" strokeWidth={2.5} fill="url(#a1)" name="anc1"/>
                <Area type="monotone" dataKey="anc4"    stroke="#7c3aed" strokeWidth={2.5} fill="url(#a2)" name="anc4"/>
                <Area type="monotone" dataKey="skilled" stroke="#059669" strokeWidth={2.5} fill="url(#a3)" name="skilled"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Interventions Table */}
        <div className="ch-card mat__card">
          <div className="mat__card-head">
            <div><h3>AI Interventions by Region</h3><p>Monthly SMS · USSD · Appointments</p></div>
          </div>
          <div className="mat__table-wrap">
            <table className="mat__table">
              <thead>
                <tr><th>Region</th><th>SMS</th><th>USSD</th><th>Appts</th><th>Risk</th></tr>
              </thead>
              <tbody>
                {INTERVENTIONS.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.region}</strong></td>
                    <td>{r.sms.toLocaleString()}</td>
                    <td>{r.ussd.toLocaleString()}</td>
                    <td>{r.appts}</td>
                    <td><span className={`ch-badge ${RISK_BADGE[r.risk]}`}>{r.risk.charAt(0).toUpperCase() + r.risk.slice(1)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

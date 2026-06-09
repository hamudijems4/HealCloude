import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { Users, TrendingUp, Baby, HeartPulse } from 'lucide-react';
import './PopulationPage.css';

const AGE_PYRAMID = [
  { group: '70+',   male: 210,  female: 260  },
  { group: '60–69', male: 380,  female: 420  },
  { group: '50–59', male: 620,  female: 680  },
  { group: '40–49', male: 980,  female: 1040 },
  { group: '30–39', male: 1540, female: 1620 },
  { group: '20–29', male: 2100, female: 2240 },
  { group: '10–19', male: 2680, female: 2590 },
  { group: '0–9',   male: 3120, female: 3050 },
];

const GENDER_DIST = [
  { name: 'Female', value: 51.3, color: '#ec4899' },
  { name: 'Male',   value: 48.7, color: '#3b82f6' },
];

const DISEASE_BURDEN = [
  { region: 'Somali',      malaria: 12, malnutrition: 38, tb: 8,  hiv: 4  },
  { region: 'Afar',        malaria: 18, malnutrition: 29, tb: 6,  hiv: 3  },
  { region: 'Gambella',    malaria: 31, malnutrition: 22, tb: 5,  hiv: 7  },
  { region: 'Tigray',      malaria: 9,  malnutrition: 24, tb: 12, hiv: 5  },
  { region: 'Oromia',      malaria: 22, malnutrition: 18, tb: 9,  hiv: 6  },
  { region: 'SNNPR',       malaria: 15, malnutrition: 20, tb: 11, hiv: 5  },
  { region: 'Amhara',      malaria: 8,  malnutrition: 15, tb: 14, hiv: 4  },
  { region: 'Addis Ababa', malaria: 2,  malnutrition: 5,  tb: 7,  hiv: 9  },
];

const REGISTRATION_TREND = [
  { month: 'Jan', registered: 12400, active: 9800  },
  { month: 'Feb', registered: 15200, active: 12100 },
  { month: 'Mar', registered: 18900, active: 15600 },
  { month: 'Apr', registered: 22300, active: 18900 },
  { month: 'May', registered: 28700, active: 24100 },
  { month: 'Jun', registered: 34200, active: 29400 },
];

const COVERAGE = [
  { region: 'Addis Ababa', pct: 94, color: '#059669' },
  { region: 'Oromia',      pct: 61, color: '#2563eb' },
  { region: 'Amhara',      pct: 58, color: '#2563eb' },
  { region: 'SNNPR',       pct: 52, color: '#2563eb' },
  { region: 'Tigray',      pct: 47, color: '#f59e0b' },
  { region: 'Somali',      pct: 31, color: '#ef4444' },
  { region: 'Afar',        pct: 28, color: '#ef4444' },
  { region: 'Gambella',    pct: 35, color: '#ef4444' },
];

export const PopulationPage: React.FC = () => {
  const [pyramidMode, setPyramidMode] = useState<'count' | 'pct'>('count');

  const pyramidData = AGE_PYRAMID.map(d => {
    const total = d.male + d.female;
    return pyramidMode === 'count'
      ? { group: d.group, male: -d.male, female: d.female }
      : { group: d.group, male: -Math.round(d.male / total * 100), female: Math.round(d.female / total * 100) };
  });

  return (
    <div className="pop">
      <div className="pop__header">
        <div>
          <h1>Population Insights</h1>
          <p>Demographic breakdown and health coverage across Ethiopia's 126 million people</p>
        </div>
        <span className="pop__badge">📊 Anonymized · No PII</span>
      </div>

      <div className="pop__kpis">
        {[
          { icon: <Users size={18}/>,      label: 'Registered Patients', value: '2,847,391', color: '#2563eb', sub: '+34K this month'    },
          { icon: <Baby size={18}/>,       label: 'Under-5 Registered',  value: '184,200',   color: '#ec4899', sub: '6.5% of registered' },
          { icon: <HeartPulse size={18}/>, label: 'Avg Wellness Score',  value: '62.4 / 100', color: '#059669', sub: '+1.4 vs last month'  },
          { icon: <TrendingUp size={18}/>, label: 'National Coverage',   value: '2.3%',       color: '#7c3aed', sub: 'of 126M Ethiopians'  },
        ].map((k, i) => (
          <div key={i} className="pop__kpi" style={{ borderLeftColor: k.color }}>
            <div className="pop__kpi-icon" style={{ background: `${k.color}15`, color: k.color }}>{k.icon}</div>
            <div>
              <span className="pop__kpi-val" style={{ color: k.color }}>{k.value}</span>
              <span className="pop__kpi-lbl">{k.label}</span>
              <span className="pop__kpi-sub">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pop__grid">

        {/* Age Pyramid */}
        <div className="ch-card pop__card pop__card--wide">
          <div className="pop__card-head">
            <div>
              <h3>Age &amp; Gender Pyramid</h3>
              <p>Registered patient population by age group</p>
            </div>
            <div className="pop__toggle">
              <button className={pyramidMode === 'count' ? 'pop__toggle--on' : ''} onClick={() => setPyramidMode('count')}>Count</button>
              <button className={pyramidMode === 'pct'   ? 'pop__toggle--on' : ''} onClick={() => setPyramidMode('pct')}>%</button>
            </div>
          </div>
          <div className="pop__pyramid">
            <div className="pop__pyramid-groups">
              {AGE_PYRAMID.map(d => <span key={d.group}>{d.group}</span>)}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pyramidData} layout="vertical" stackOffset="sign" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                <XAxis type="number" tickFormatter={v => Math.abs(v) + (pyramidMode === 'pct' ? '%' : '')} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}/>
                <YAxis type="category" dataKey="group" hide/>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: unknown, n: unknown) => [Math.abs(v as number) + (pyramidMode === 'pct' ? '%' : ''), n === 'male' ? 'Male' : 'Female']}/>
                <Bar dataKey="male"   fill="#3b82f6" radius={[4, 0, 0, 4]} barSize={20} name="male"/>
                <Bar dataKey="female" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} name="female"/>
              </BarChart>
            </ResponsiveContainer>
            <div className="pop__pyramid-legend">
              <span><i style={{ background: '#3b82f6' }}/> Male</span>
              <span><i style={{ background: '#ec4899' }}/> Female</span>
            </div>
          </div>
        </div>

        {/* Gender Donut */}
        <div className="ch-card pop__card">
          <div className="pop__card-head">
            <div><h3>Gender Distribution</h3><p>Registered patient split</p></div>
          </div>
          <div className="pop__donut">
            <div className="pop__donut-center"><span>2.8M</span><small>patients</small></div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={GENDER_DIST} cx="50%" cy="50%" innerRadius={65} outerRadius={88} paddingAngle={4} dataKey="value">
                  {GENDER_DIST.map((e, i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${v as number}%`, 'Share']} contentStyle={{ borderRadius: 8, border: 'none' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="pop__donut-legend">
              {GENDER_DIST.map((d, i) => (
                <div key={i}>
                  <i style={{ background: d.color }}/><span>{d.name}</span>
                  <strong style={{ color: d.color }}>{d.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Growth */}
        <div className="ch-card pop__card pop__card--wide">
          <div className="pop__card-head">
            <div><h3>Registration Growth</h3><p>New registrations vs active users — last 6 months</p></div>
          </div>
          <div style={{ height: 210, padding: '0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REGISTRATION_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#059669" stopOpacity={0.2}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Legend iconType="circle" iconSize={8}/>
                <Area type="monotone" dataKey="registered" stroke="#2563eb" strokeWidth={2.5} fill="url(#rG)" name="Registered"/>
                <Area type="monotone" dataKey="active"     stroke="#059669" strokeWidth={2.5} fill="url(#aG)" name="Active"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Burden */}
        <div className="ch-card pop__card pop__card--wide">
          <div className="pop__card-head">
            <div><h3>Disease Burden by Region</h3><p>Cases per 100,000 — top 4 conditions</p></div>
          </div>
          <div style={{ height: 240, padding: '0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISEASE_BURDEN} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}/>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Legend iconType="circle" iconSize={8}/>
                <Bar dataKey="malaria"      fill="#ef4444" radius={[4,4,0,0]} barSize={10} name="Malaria"/>
                <Bar dataKey="malnutrition" fill="#f59e0b" radius={[4,4,0,0]} barSize={10} name="Malnutrition"/>
                <Bar dataKey="tb"           fill="#8b5cf6" radius={[4,4,0,0]} barSize={10} name="Tuberculosis"/>
                <Bar dataKey="hiv"          fill="#06b6d4" radius={[4,4,0,0]} barSize={10} name="HIV"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage */}
        <div className="ch-card pop__card">
          <div className="pop__card-head">
            <div><h3>Coverage by Region</h3><p>% of regional population registered</p></div>
          </div>
          <div className="pop__coverage">
            {COVERAGE.map((r, i) => (
              <div key={i} className="pop__cov-row">
                <div className="pop__cov-top">
                  <span>{r.region}</span>
                  <span style={{ color: r.color, fontWeight: 700 }}>{r.pct}%</span>
                </div>
                <div className="pop__cov-track">
                  <div className="pop__cov-fill" style={{ width: `${r.pct}%`, background: r.color }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

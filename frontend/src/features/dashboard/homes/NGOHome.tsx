import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, MapPin, FileText } from 'lucide-react';
import './NGOHome.css';

const DISEASE_TREND = [
  { month:'Jan', malaria:180, malnutrition:210, tb:45 },
  { month:'Feb', malaria:165, malnutrition:198, tb:42 },
  { month:'Mar', malaria:190, malnutrition:220, tb:50 },
  { month:'Apr', malaria:240, malnutrition:205, tb:48 },
  { month:'May', malaria:280, malnutrition:190, tb:55 },
  { month:'Jun', malaria:310, malnutrition:175, tb:52 },
];

const REGIONAL = [
  { region:'Somali',    score:45, alerts:4 },
  { region:'Afar',     score:42, alerts:3 },
  { region:'Gambella', score:49, alerts:3 },
  { region:'Tigray',   score:53, alerts:2 },
  { region:'Oromia',   score:58, alerts:2 },
  { region:'SNNPR',    score:57, alerts:1 },
  { region:'Amhara',   score:61, alerts:1 },
];

export const NGOHome: React.FC = () => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Analyst';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="ngo">
      <div className="ngo__header">
        <div>
          <h1>{greeting}, {firstName} 🌍</h1>
          <p>NGO Research Dashboard — anonymized regional health intelligence</p>
        </div>
        <div className="ngo__role-badge">
          <span>NGO Analyst</span>
          <span className="ngo__data-note">📊 No patient PII visible</span>
        </div>
      </div>

      <div className="ngo__kpis">
        {[
          { label:'Active Outbreak Alerts',  value:'9',       color:'#dc2626', icon:<AlertTriangle size={18}/> },
          { label:'Regions Under Watch',     value:'7',       color:'#d97706', icon:<MapPin size={18}/> },
          { label:'Avg National Wellness',   value:'62.4%',   color:'#2563eb', icon:<TrendingUp size={18}/> },
          { label:'Reports Available',       value:'14',      color:'#059669', icon:<FileText size={18}/> },
        ].map((k, i) => (
          <div key={i} className="ngo__kpi" style={{ borderLeftColor: k.color }}>
            <div className="ngo__kpi-icon" style={{ background:`${k.color}15`, color:k.color }}>{k.icon}</div>
            <div>
              <span style={{ color:k.color, fontSize:'1.5rem', fontWeight:700, lineHeight:1 }}>{k.value}</span>
              <span style={{ fontSize:'0.72rem', color:'#64748b', display:'block' }}>{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ngo__charts">
        {/* Disease trend */}
        <div className="ch-card ngo__chart-card ngo__chart-card--wide">
          <div className="ngo__chart-header">
            <div>
              <h3>Disease Case Trends</h3>
              <p>Monthly active cases — Malaria, Malnutrition, TB</p>
            </div>
          </div>
          <div style={{ height:240, padding:'0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DISEASE_TREND} margin={{ top:10, right:10, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="nGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Area type="monotone" dataKey="malaria"      stroke="#ef4444" strokeWidth={2.5} fill="url(#mGrad)" name="Malaria"/>
                <Area type="monotone" dataKey="malnutrition" stroke="#f59e0b" strokeWidth={2.5} fill="url(#nGrad)" name="Malnutrition"/>
                <Area type="monotone" dataKey="tb"           stroke="#8b5cf6" strokeWidth={2}   fill="none"        name="Tuberculosis"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional wellness */}
        <div className="ch-card ngo__chart-card">
          <div className="ngo__chart-header">
            <div><h3>Regional Wellness Scores</h3><p>Lowest scoring regions</p></div>
          </div>
          <div style={{ height:240, padding:'0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL} layout="vertical" margin={{ top:0, right:20, left:10, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                <XAxis type="number" domain={[0,100]} hide/>
                <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#475569' }} width={65}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v)=>[`${v ?? ''}/100`,'Score'] as [string,string]}/>
                <Bar dataKey="score" radius={[0,6,6,0]} barSize={14}>
                  {REGIONAL.map((e,i) => <Cell key={i} fill={e.score>=60?'#22c55e':e.score>=50?'#3b82f6':e.score>=45?'#f59e0b':'#ef4444'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div className="ngo__actions">
        {[
          { label:'Disease Surveillance Map',  path:'/dashboard/disease-map',  color:'#dc2626', bg:'#fff5f5',  desc:'Live outbreak heatmap' },
          { label:'Active Alerts',             path:'/dashboard/alerts',        color:'#d97706', bg:'#fffbf0',  desc:'All active disease alerts' },
          { label:'Health Facilities',         path:'/dashboard/facilities',    color:'#059669', bg:'#f0fdf4',  desc:'National facility directory' },
          { label:'Reports & Analytics',       path:'/dashboard/reports',       color:'#2563eb', bg:'#f0f6ff',  desc:'Full health analytics' },
        ].map((a, i) => (
          <div key={i} className="ngo__action-card ch-card" style={{ borderTopColor: a.color }} onClick={() => navigate(a.path)}>
            <div className="ngo__action-icon" style={{ background: a.bg, color: a.color }}>→</div>
            <div>
              <div className="ngo__action-label">{a.label}</div>
              <div className="ngo__action-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

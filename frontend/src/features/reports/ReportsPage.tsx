import React, { useState } from 'react';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import './ReportsPage.css';

const WELLNESS_TREND = [
  { month:'Jan', score:54 }, { month:'Feb', score:56 }, { month:'Mar', score:57 },
  { month:'Apr', score:59 }, { month:'Jun', score:61 }, { month:'Jul', score:62 },
  { month:'Aug', score:63 }, { month:'Sep', score:61 }, { month:'Oct', score:64 },
  { month:'Nov', score:65 }, { month:'Dec', score:66 },
];

const DISEASE_CASES = [
  { disease:'Malaria',              cases:1842 },
  { disease:'Malnutrition',         cases:1540 },
  { disease:'Diarrhea',             cases:987  },
  { disease:'Tuberculosis',         cases:612  },
  { disease:'Hypertension',         cases:540  },
  { disease:'Measles',              cases:287  },
];

const RISK_DIST = [
  { name:'Low',      value:48, color:'#22c55e' },
  { name:'Medium',   value:31, color:'#f59e0b' },
  { name:'High',     value:15, color:'#ef4444' },
  { name:'Critical', value:6,  color:'#dc2626' },
];

const REGIONAL_WELLNESS = [
  { region:'Addis Ababa', score:72 },
  { region:'Oromia',      score:58 },
  { region:'Amhara',      score:61 },
  { region:'Tigray',      score:53 },
  { region:'SNNPR',       score:57 },
  { region:'Somali',      score:45 },
  { region:'Afar',        score:42 },
  { region:'Gambella',    score:49 },
];

const PRENATAL_ADHERENCE = [
  { month:'Jan', attended:62, missed:38 },
  { month:'Feb', attended:65, missed:35 },
  { month:'Mar', attended:67, missed:33 },
  { month:'Apr', attended:70, missed:30 },
  { month:'May', attended:71, missed:29 },
  { month:'Jun', attended:74, missed:26 },
];

const RANGES = ['Last 6 Months', 'Last 12 Months', 'This Year'];

export const ReportsPage: React.FC = () => {
  const [range, setRange] = useState('Last 6 Months');

  return (
    <div className="rp">
      <div className="rp__header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>National health performance metrics and trend analysis</p>
        </div>
        <div className="rp__header-actions">
          <div className="rp__range-select">
            <CalendarIcon size={14}/>
            <select value={range} onChange={e => setRange(e.target.value)}>
              {RANGES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button className="ch-btn ch-btn--primary">
            <Download size={15}/> Export PDF
          </button>
        </div>
      </div>

      <div className="rp__kpis">
        {[
          { label:'Avg Wellness Score',    value:'62.4 / 100', color:'#2563eb', delta:'+1.4%' },
          { label:'Prenatal Adherence',    value:'74%',        color:'#059669', delta:'+12%'  },
          { label:'Active Disease Alerts', value:'9',          color:'#dc2626', delta:'-3'    },
          { label:'AI Interventions (Mo.)',value:'14,823',     color:'#7c3aed', delta:'+9.4%' },
        ].map((k,i) => (
          <div key={i} className="rp__kpi" style={{ borderLeftColor:k.color }}>
            <span style={{ color:k.color, fontSize:'1.4rem', fontWeight:700 }}>{k.value}</span>
            <span style={{ fontSize:'0.72rem', color:'#64748b' }}>{k.label}</span>
            <span style={{ fontSize:'0.72rem', color: k.delta.startsWith('+') ? '#059669' : '#dc2626', fontWeight:600 }}>{k.delta} vs last period</span>
          </div>
        ))}
      </div>

      <div className="rp__grid">
        {/* National Wellness Trend */}
        <div className="rp__card ch-card rp__card--wide">
          <div className="rp__card-header">
            <div>
              <h3>National Wellness Score Trend</h3>
              <p>Monthly average across all registered patients</p>
            </div>
          </div>
          <div className="rp__chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WELLNESS_TREND} margin={{ top:10, right:20, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }} domain={[40,80]} tickFormatter={v=>`${v}`}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v)=>[`${v ?? ''}/100`,'Score'] as [string,string]}/>
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fill="url(#wGrad)" dot={{ r:4, fill:'#2563eb', strokeWidth:0 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="rp__card ch-card">
          <div className="rp__card-header">
            <div><h3>Risk Distribution</h3><p>% of patient population by risk level</p></div>
          </div>
          <div className="rp__chart-body rp__chart-body--donut">
            <div className="rp__donut-inner">
              <span>2.8M</span>
              <small>Patients</small>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK_DIST} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value">
                  {RISK_DIST.map((e, i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v)=>[`${v ?? ''}%`, 'Share'] as [string,string]}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rp__legend">
            {RISK_DIST.map((item, i) => (
              <div key={i} className="rp__legend-item">
                <div className="rp__legend-dot" style={{ background:item.color }}/>
                <span>{item.name}</span>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Top diseases */}
        <div className="rp__card ch-card">
          <div className="rp__card-header">
            <div><h3>Top Reported Conditions</h3><p>Active case count this period</p></div>
          </div>
          <div className="rp__chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISEASE_CASES} layout="vertical" margin={{ top:0, right:20, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                <XAxis type="number" hide/>
                <YAxis dataKey="disease" type="category" axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#475569' }} width={110}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="cases" radius={[0,6,6,0]} barSize={16}>
                  {DISEASE_CASES.map((_, i) => <Cell key={i} fill={['#ef4444','#f59e0b','#3b82f6','#8b5cf6','#06b6d4','#10b981'][i % 6]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional wellness */}
        <div className="rp__card ch-card rp__card--wide">
          <div className="rp__card-header">
            <div><h3>Wellness Score by Region</h3><p>Average wellness score per Ethiopian region</p></div>
          </div>
          <div className="rp__chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_WELLNESS} margin={{ top:10, right:20, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }} domain={[0,100]}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v)=>[`${v ?? ''}/100`,'Score'] as [string,string]}/>
                <Bar dataKey="score" radius={[6,6,0,0]} barSize={28}>
                  {REGIONAL_WELLNESS.map((e,i) => <Cell key={i} fill={e.score >= 65 ? '#22c55e' : e.score >= 55 ? '#3b82f6' : e.score >= 45 ? '#f59e0b' : '#ef4444'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prenatal adherence */}
        <div className="rp__card ch-card">
          <div className="rp__card-header">
            <div><h3>Prenatal Visit Adherence</h3><p>Attended vs missed appointments (%)</p></div>
          </div>
          <div className="rp__chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRENATAL_ADHERENCE} margin={{ top:10, right:10, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }} tickFormatter={v=>`${v}%`}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v, n)=>[`${v ?? ''}%`, n==='attended'?'Attended':'Missed'] as [string,string]}/>
                <Legend iconType="circle" iconSize={8}/>
                <Area type="monotone" dataKey="attended" stroke="#22c55e" strokeWidth={2.5} fill="url(#aGrad)" name="attended"/>
                <Area type="monotone" dataKey="missed"   stroke="#ef4444" strokeWidth={2.5} fill="url(#mGrad)" name="missed"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

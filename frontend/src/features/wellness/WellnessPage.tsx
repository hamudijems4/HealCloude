import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './WellnessPage.css';

const DATA = [
  { name:'Almaz Tesfaye',   id:'ET8823710293', score:62, risk:'high',     region:'Tigray',      condition:'Prenatal Care',  trend:'down',  prev:71 },
  { name:'Biruk Tadesse',   id:'ET5590183421', score:18, risk:'critical', region:'Oromia',      condition:'Malnutrition',   trend:'down',  prev:31 },
  { name:'Fatima Abdi',     id:'ET6601290087', score:44, risk:'high',     region:'Somali',      condition:'Diabetes T2',    trend:'up',    prev:38 },
  { name:'Kebede Mulugeta', id:'ET7712340012', score:58, risk:'medium',   region:'Amhara',      condition:'Hypertension',   trend:'up',    prev:52 },
  { name:'Hiwot Girma',     id:'ET4482910034', score:67, risk:'medium',   region:'Addis Ababa', condition:'Cancer Screening',trend:'same', prev:67 },
  { name:'Solomon Bekele',  id:'ET3371820056', score:21, risk:'critical', region:'SNNPR',       condition:'Tuberculosis',   trend:'down',  prev:35 },
  { name:'Mekdes Haile',    id:'ET2260918743', score:78, risk:'low',      region:'Tigray',      condition:'Prenatal Care',  trend:'up',    prev:72 },
  { name:'Dawit Alemu',     id:'ET1150837621', score:41, risk:'high',     region:'Afar',        condition:'Malaria',        trend:'up',    prev:29 },
  { name:'Selamawit Yonas', id:'ET0040726510', score:55, risk:'medium',   region:'Amhara',      condition:'Anemia',         trend:'up',    prev:48 },
  { name:'Abebe Worku',     id:'ET9930615409', score:14, risk:'critical', region:'Oromia',      condition:'Heart Disease',  trend:'down',  prev:22 },
  { name:'Tigist Lemma',    id:'ET8820504308', score:82, risk:'low',      region:'Addis Ababa', condition:'Hypertension',   trend:'up',    prev:79 },
  { name:'Yonas Getachew',  id:'ET7710393207', score:37, risk:'high',     region:'Gambella',    condition:'Malaria',        trend:'down',  prev:45 },
];

const RISK_CFG: Record<string, { cls:string; color:string; bar:string }> = {
  critical: { cls:'ch-badge--red',    color:'#dc2626', bar:'#ef4444' },
  high:     { cls:'ch-badge--orange', color:'#d97706', bar:'#f59e0b' },
  medium:   { cls:'ch-badge--blue',   color:'#2563eb', bar:'#3b82f6' },
  low:      { cls:'ch-badge--green',  color:'#16a34a', bar:'#22c55e' },
};

export const WellnessPage: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const filtered = DATA.filter(d => filter === 'all' || d.risk === filter);
  const avg = Math.round(DATA.reduce((s,d)=>s+d.score,0)/DATA.length);

  return (
    <div className="wp">
      <div className="wp__header">
        <div><h1>Wellness Scores</h1><p>AI-computed health risk scores across registered patients</p></div>
      </div>

      <div className="wp__kpis">
        {[
          { label:'Avg National Score', value:`${avg}/100`,                                         color:'#2563eb' },
          { label:'Critical',           value:DATA.filter(d=>d.risk==='critical').length,            color:'#dc2626' },
          { label:'High Risk',          value:DATA.filter(d=>d.risk==='high').length,                color:'#d97706' },
          { label:'Improved This Week', value:DATA.filter(d=>d.trend==='up').length,                 color:'#16a34a' },
        ].map((k,i) => (
          <div key={i} className="wp__kpi" style={{borderLeftColor:k.color}}>
            <span style={{color:k.color,fontSize:'1.6rem',fontWeight:700}}>{k.value}</span>
            <span style={{fontSize:'0.75rem',color:'#64748b'}}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="wp__controls ch-card">
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',padding:'0.85rem 1.25rem'}}>
          {['all','critical','high','medium','low'].map(r => (
            <button key={r} className={`ap__filter-btn ${filter===r?'ap__filter-btn--active':''}`} onClick={()=>setFilter(r)}>
              {r==='all'?'All':r.charAt(0).toUpperCase()+r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="wp__table-wrap ch-card">
        <table className="wp__table">
          <thead>
            <tr><th>Patient</th><th>Fayda ID</th><th>Condition</th><th>Region</th><th>Wellness Score</th><th>Risk</th><th>Trend</th></tr>
          </thead>
          <tbody>
            {filtered.map((d,i) => {
              const rc = RISK_CFG[d.risk];
              return (
                <tr key={i}>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                    <div style={{width:30,height:30,borderRadius:8,background:`${rc.color}15`,color:rc.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.8rem'}}>{d.name[0]}</div>
                    <span style={{fontWeight:600,color:'#0f1f3d',fontSize:'0.85rem'}}>{d.name}</span>
                  </div></td>
                  <td><span style={{fontFamily:'monospace',fontSize:'0.75rem',color:'#94a3b8'}}>{d.id}</span></td>
                  <td style={{fontSize:'0.82rem',color:'#475569'}}>{d.condition}</td>
                  <td style={{fontSize:'0.78rem',color:'#64748b'}}>{d.region}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      <div style={{flex:1,height:6,background:'#f0f6ff',borderRadius:4,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${d.score}%`,background:rc.bar,borderRadius:4,transition:'width 0.5s'}}/>
                      </div>
                      <span style={{fontWeight:700,color:rc.color,fontSize:'0.88rem',minWidth:28}}>{d.score}</span>
                    </div>
                  </td>
                  <td><span className={`ch-badge ${rc.cls}`}>{d.risk.charAt(0).toUpperCase()+d.risk.slice(1)}</span></td>
                  <td>
                    {d.trend==='up'   && <span style={{color:'#16a34a',display:'flex',alignItems:'center',gap:3,fontSize:'0.78rem'}}><TrendingUp size={13}/> +{d.score-d.prev}</span>}
                    {d.trend==='down' && <span style={{color:'#dc2626',display:'flex',alignItems:'center',gap:3,fontSize:'0.78rem'}}><TrendingDown size={13}/> -{d.prev-d.score}</span>}
                    {d.trend==='same' && <span style={{color:'#94a3b8',display:'flex',alignItems:'center',gap:3,fontSize:'0.78rem'}}><Minus size={13}/> 0</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

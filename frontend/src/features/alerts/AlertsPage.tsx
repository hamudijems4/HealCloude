import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, MapPin, Users } from 'lucide-react';

const ALERTS = [
  { id:1,  region:'Somali',           zone:'Fafan',         disease:'Malnutrition',          cases:310, severity:'critical', date:'Jun 8',  resolved:false },
  { id:2,  region:'Oromia',           zone:'East Hararghe', disease:'Acute Watery Diarrhea', cases:342, severity:'critical', date:'Jun 7',  resolved:false },
  { id:3,  region:'Amhara',           zone:'South Gondar',  disease:'Malaria',               cases:289, severity:'critical', date:'Jun 5',  resolved:false },
  { id:4,  region:'Tigray',           zone:'Southern',      disease:'Malnutrition',          cases:267, severity:'critical', date:'Jun 4',  resolved:false },
  { id:5,  region:'Gambella',         zone:'Nuer',          disease:'Malaria',               cases:198, severity:'warning',  date:'Jun 5',  resolved:false },
  { id:6,  region:'SNNPR',            zone:'Wolayita',      disease:'Tuberculosis',          cases:134, severity:'warning',  date:'Jun 3',  resolved:false },
  { id:7,  region:'Afar',             zone:'Zone 2',        disease:'Measles',               cases:87,  severity:'warning',  date:'Jun 1',  resolved:false },
  { id:8,  region:'Oromia',           zone:'Borena',        disease:'Acute Watery Diarrhea', cases:156, severity:'warning',  date:'Jun 2',  resolved:false },
  { id:9,  region:'Benishangul-Gumuz',zone:'Metekel',       disease:'Malaria',               cases:76,  severity:'watch',    date:'May 30', resolved:false },
  { id:10, region:'Addis Ababa',      zone:'Bole',          disease:'COVID-19',              cases:45,  severity:'watch',    date:'May 28', resolved:true  },
];

const SEV: Record<string,{cls:string;bg:string;label:string}> = {
  critical: { cls:'ch-badge--red',    bg:'#fff5f5', label:'Critical' },
  warning:  { cls:'ch-badge--orange', bg:'#fffbf0', label:'Warning'  },
  watch:    { cls:'ch-badge--blue',   bg:'#f0f6ff', label:'Watch'    },
};

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a =>
    (filter === 'all' || filter === 'resolved' ? (filter==='resolved'?a.resolved:true) : a.severity === filter) &&
    (filter === 'active' ? !a.resolved : true)
  ).filter(a => filter === 'resolved' ? a.resolved : filter === 'active' ? !a.resolved : true);

  const resolve = (id: number) => setAlerts(prev => prev.map(a => a.id===id ? {...a,resolved:true} : a));

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1 style={{fontSize:'1.4rem',fontWeight:700,color:'#0f1f3d'}}>Disease Alerts</h1>
          <p style={{fontSize:'0.83rem',color:'#64748b'}}>Active outbreak alerts across Ethiopia</p></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          { label:'Critical', value:alerts.filter(a=>a.severity==='critical'&&!a.resolved).length, color:'#dc2626' },
          { label:'Warning',  value:alerts.filter(a=>a.severity==='warning'&&!a.resolved).length,  color:'#d97706' },
          { label:'Watch',    value:alerts.filter(a=>a.severity==='watch'&&!a.resolved).length,    color:'#2563eb' },
          { label:'Resolved', value:alerts.filter(a=>a.resolved).length,                           color:'#16a34a' },
        ].map((k,i) => (
          <div key={i} style={{background:'white',borderRadius:14,padding:'1rem 1.25rem',border:'1px solid #e2eaf6',borderLeft:`4px solid ${k.color}`,display:'flex',flexDirection:'column',gap:'0.25rem'}}>
            <span style={{color:k.color,fontSize:'1.6rem',fontWeight:700}}>{k.value}</span>
            <span style={{fontSize:'0.75rem',color:'#64748b'}}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="ch-card" style={{padding:'0.85rem 1.25rem'}}>
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
          {['all','critical','warning','watch','active','resolved'].map(f => (
            <button key={f} className={`ap__filter-btn ${filter===f?'ap__filter-btn--active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="ch-card" style={{overflow:'hidden'}}>
        {filtered.map(a => {
          const sc = SEV[a.severity];
          return (
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:'1.25rem',padding:'1rem 1.5rem',borderBottom:'1px solid #f0f6ff',background:a.resolved?'white':sc.bg,transition:'background 0.2s',opacity:a.resolved?0.6:1}}>
              <div style={{width:40,height:40,borderRadius:10,background:a.resolved?'#f0f6ff':sc.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {a.resolved ? <CheckCircle size={18} color="#16a34a"/> : <AlertTriangle size={18} color={a.severity==='critical'?'#dc2626':a.severity==='warning'?'#d97706':'#2563eb'}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.2rem'}}>
                  <span style={{fontWeight:600,fontSize:'0.9rem',color:'#0f1f3d'}}>{a.disease}</span>
                  <span className={`ch-badge ${sc.cls}`}>{sc.label}</span>
                  {a.resolved && <span className="ch-badge ch-badge--green">Resolved</span>}
                </div>
                <div style={{display:'flex',gap:'1rem',fontSize:'0.78rem',color:'#64748b'}}>
                  <span><MapPin size={11}/> {a.region} · {a.zone}</span>
                  <span><Users size={11}/> {a.cases} cases</span>
                  <span>{a.date}</span>
                </div>
              </div>
              {!a.resolved && (
                <button className="ch-btn ch-btn--ghost" style={{fontSize:'0.78rem',padding:'0.35rem 0.8rem'}} onClick={()=>resolve(a.id)}>
                  Mark Resolved
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

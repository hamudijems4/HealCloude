import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Search, AlertCircle, Calendar, Users, HeartPulse, Eye } from 'lucide-react';
import './ClinicianHome.css';

const QUEUE = [
  { id:'ET5590183421', name:'Biruk Tadesse',   age:7,  condition:'Malnutrition',    risk:'critical', time:'8:00 AM',  status:'waiting' },
  { id:'ET8823710293', name:'Almaz Tesfaye',   age:28, condition:'Prenatal Care',   risk:'high',     time:'9:00 AM',  status:'waiting' },
  { id:'ET1150837621', name:'Dawit Alemu',     age:38, condition:'Malaria',         risk:'high',     time:'9:30 AM',  status:'in-progress' },
  { id:'ET7712340012', name:'Kebede Mulugeta', age:54, condition:'Hypertension',    risk:'medium',   time:'10:00 AM', status:'waiting' },
  { id:'ET4482910034', name:'Hiwot Girma',     age:45, condition:'Cancer Screening',risk:'medium',   time:'11:00 AM', status:'waiting' },
  { id:'ET2260918743', name:'Mekdes Haile',    age:24, condition:'Prenatal Care',   risk:'low',      time:'11:30 AM', status:'waiting' },
];

const RISK_COLOR: Record<string, string> = { critical:'#dc2626', high:'#d97706', medium:'#2563eb', low:'#16a34a' };
const RISK_CLS:   Record<string, string> = { critical:'ch-badge--red', high:'ch-badge--orange', medium:'ch-badge--blue', low:'ch-badge--green' };
const STATUS_CLS: Record<string, string> = { waiting:'cl__status--waiting', 'in-progress':'cl__status--active' };

export const ClinicianHome: React.FC = () => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [faydaInput, setFaydaInput] = useState('');
  const [search, setSearch]         = useState('');

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Doctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const filtered = QUEUE.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.id.includes(q) || p.condition.toLowerCase().includes(q);
  });

  const handleFaydaLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = faydaInput.trim();
    if (id) navigate(`/dashboard/patients/${id}`);
  };

  const criticalCount = QUEUE.filter(p => p.risk === 'critical').length;
  const highCount     = QUEUE.filter(p => p.risk === 'high').length;

  return (
    <div className="cl">
      <div className="cl__header">
        <div>
          <h1>{greeting}, Dr. {firstName} 👨‍⚕️</h1>
          <p>You have {QUEUE.length} patients scheduled today · {criticalCount + highCount} require urgent attention</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="cl__kpis">
        {[
          { label:"Today's Queue",   value: QUEUE.length,                                    color:'#2563eb', icon:<Users size={18}/> },
          { label:'Critical',        value: criticalCount,                                   color:'#dc2626', icon:<AlertCircle size={18}/> },
          { label:'High Risk',       value: highCount,                                       color:'#d97706', icon:<HeartPulse size={18}/> },
          { label:'In Progress',     value: QUEUE.filter(p=>p.status==='in-progress').length,color:'#059669', icon:<Calendar size={18}/> },
        ].map((k, i) => (
          <div key={i} className="cl__kpi" style={{ borderLeftColor: k.color }}>
            <div className="cl__kpi-icon" style={{ background:`${k.color}15`, color:k.color }}>{k.icon}</div>
            <div>
              <span style={{ color:k.color, fontSize:'1.6rem', fontWeight:700, lineHeight:1 }}>{k.value}</span>
              <span style={{ fontSize:'0.72rem', color:'#64748b', display:'block' }}>{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cl__body">
        {/* Patient queue */}
        <div className="cl__queue ch-card">
          <div className="cl__queue-header">
            <h3>Today's Patient Queue</h3>
            <div className="cl__search">
              <Search size={13}/>
              <input placeholder="Search queue…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>

          <table className="cl__table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Condition</th>
                <th>Time</th>
                <th>Risk</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="cl__row" onClick={() => navigate(`/dashboard/patients/${p.id}`)}>
                  <td>
                    <div className="cl__patient">
                      <div className="cl__avatar" style={{ background:`${RISK_COLOR[p.risk]}15`, color:RISK_COLOR[p.risk] }}>{p.name[0]}</div>
                      <div>
                        <div className="cl__name">{p.name}</div>
                        <div className="cl__meta">{p.age}y · <span className="cl__fayda">{p.id}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="cl__condition">{p.condition}</td>
                  <td className="cl__time">{p.time}</td>
                  <td><span className={`ch-badge ${RISK_CLS[p.risk]}`}>{p.risk.charAt(0).toUpperCase()+p.risk.slice(1)}</span></td>
                  <td><span className={`cl__status ${STATUS_CLS[p.status]}`}>{p.status === 'in-progress' ? 'In Progress' : 'Waiting'}</span></td>
                  <td>
                    <button className="cl__view" onClick={e => { e.stopPropagation(); navigate(`/dashboard/patients/${p.id}`); }}>
                      <Eye size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fayda ID lookup */}
        <div className="cl__right">
          <div className="ch-card cl__fayda-card">
            <h3>🆔 Fayda ID Lookup</h3>
            <p>Scan or enter a patient's Fayda ID to instantly load their full health history from all facilities.</p>
            <form className="cl__fayda-form" onSubmit={handleFaydaLookup}>
              <input
                className="cl__fayda-input"
                placeholder="ET8823710293"
                value={faydaInput}
                onChange={e => setFaydaInput(e.target.value.toUpperCase())}
                maxLength={14}
              />
              <button className="ch-btn ch-btn--primary" type="submit">Load Record</button>
            </form>
            <div className="cl__fayda-hint">Try: ET8823710293 · ET5590183421</div>
          </div>

          <div className="ch-card cl__alerts-card">
            <h3><AlertCircle size={15} color="#dc2626"/> Needs Urgent Attention</h3>
            <div className="cl__urgent-list">
              {QUEUE.filter(p => p.risk === 'critical' || p.risk === 'high').map(p => (
                <div key={p.id} className="cl__urgent-row" onClick={() => navigate(`/dashboard/patients/${p.id}`)}>
                  <div className="cl__urgent-dot" style={{ background: RISK_COLOR[p.risk] }}/>
                  <div className="cl__urgent-info">
                    <span className="cl__urgent-name">{p.name}</span>
                    <span className="cl__urgent-cond">{p.condition}</span>
                  </div>
                  <span className={`ch-badge ${RISK_CLS[p.risk]}`}>{p.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

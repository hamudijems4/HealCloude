import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, User, MapPin, Phone, Calendar, Shield, AlertTriangle, Clock } from 'lucide-react';
import './FaydaPage.css';

interface FaydaProfile {
  fayda_id: string;
  full_name: string;
  gender: string;
  dob: string;
  region: string;
  woreda: string;
  phone: string;
  status: 'verified' | 'pending' | 'flagged';
  photo_initial: string;
  registered_at: string;
  facilities_visited: string[];
  risk: string;
}

const REGISTRY: Record<string, FaydaProfile> = {
  'ET8823710293': {
    fayda_id: 'ET8823710293', full_name: 'Almaz Tesfaye', gender: 'Female',
    dob: '15 Mar 1996', region: 'Tigray', woreda: 'Adwa', phone: '+251922334455',
    status: 'verified', photo_initial: 'A', registered_at: '12 Jan 2023',
    facilities_visited: ['Adwa Health Center', 'Mekelle General Hospital'],
    risk: 'high',
  },
  'ET5590183421': {
    fayda_id: 'ET5590183421', full_name: 'Biruk Tadesse', gender: 'Male',
    dob: '03 Sep 2017', region: 'Oromia', woreda: 'Jimma', phone: '+251944556677',
    status: 'verified', photo_initial: 'B', registered_at: '5 Mar 2023',
    facilities_visited: ['Jimma University Hospital', 'Jimma Health Center'],
    risk: 'critical',
  },
  'ET7712340012': {
    fayda_id: 'ET7712340012', full_name: 'Kebede Mulugeta', gender: 'Male',
    dob: '22 Jul 1970', region: 'Amhara', woreda: 'Gondar', phone: '+251911223344',
    status: 'verified', photo_initial: 'K', registered_at: '19 Feb 2023',
    facilities_visited: ['Gondar University Hospital'],
    risk: 'medium',
  },
  'ET6601290087': {
    fayda_id: 'ET6601290087', full_name: 'Fatima Abdi', gender: 'Female',
    dob: '11 Apr 1992', region: 'Somali', woreda: 'Jijiga', phone: '+251933445566',
    status: 'flagged', photo_initial: 'F', registered_at: '01 Aug 2023',
    facilities_visited: ['Jijiga General Hospital'],
    risk: 'high',
  },
  'ET0000000001': {
    fayda_id: 'ET0000000001', full_name: 'Tigist Haile', gender: 'Female',
    dob: '04 Jun 1985', region: 'Addis Ababa', woreda: 'Bole', phone: '+251911000001',
    status: 'verified', photo_initial: 'T', registered_at: '01 Jan 2023',
    facilities_visited: ['Black Lion Specialized Hospital'],
    risk: 'low',
  },
};

const STATUS_CFG = {
  verified: { icon: <CheckCircle size={14}/>, label: 'Verified',  cls: 'ch-badge--green',  bg: '#dcfce7', color: '#15803d' },
  pending:  { icon: <Clock size={14}/>,       label: 'Pending',   cls: 'ch-badge--blue',   bg: '#dbeafe', color: '#1d4ed8' },
  flagged:  { icon: <AlertTriangle size={14}/>,label:'Flagged',   cls: 'ch-badge--red',    bg: '#fee2e2', color: '#dc2626' },
};

const RISK_COLOR: Record<string, string> = { critical:'#dc2626', high:'#d97706', medium:'#2563eb', low:'#16a34a' };

const ProfileCard: React.FC<{ profile: FaydaProfile }> = ({ profile }) => {
  const sc = STATUS_CFG[profile.status];
  const riskColor = RISK_COLOR[profile.risk];

  return (
    <div className="fayda__profile-card ch-card">
      <div className="fayda__profile-hero" style={{ background: sc.bg }}>
        <div className="fayda__profile-avatar" style={{ background: `${riskColor}20`, color: riskColor }}>
          {profile.photo_initial}
        </div>
        <div className="fayda__profile-hero-info">
          <h2>{profile.full_name}</h2>
          <div className="fayda__profile-badges">
            <span className={`ch-badge ${sc.cls}`} style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}>
              {sc.icon}{sc.label}
            </span>
            <span className="fayda__id-badge">
              <Shield size={11}/> {profile.fayda_id}
            </span>
          </div>
        </div>
      </div>

      <div className="fayda__profile-body">
        <div className="fayda__profile-grid">
          {[
            { icon: <User size={14}/>,     label: 'Gender',       value: profile.gender },
            { icon: <Calendar size={14}/>, label: 'Date of Birth', value: profile.dob },
            { icon: <MapPin size={14}/>,   label: 'Region',        value: profile.region },
            { icon: <MapPin size={14}/>,   label: 'Woreda',        value: profile.woreda },
            { icon: <Phone size={14}/>,    label: 'Phone',         value: profile.phone },
            { icon: <Shield size={14}/>,   label: 'Registered',    value: profile.registered_at },
          ].map((row, i) => (
            <div key={i} className="fayda__profile-row">
              <span className="fayda__profile-row-icon">{row.icon}</span>
              <span className="fayda__profile-row-label">{row.label}</span>
              <span className="fayda__profile-row-value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="fayda__facilities">
          <h4>Facilities on Record</h4>
          {profile.facilities_visited.map((f, i) => (
            <div key={i} className="fayda__facility-tag">
              <CheckCircle size={12} color="#16a34a"/> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FaydaPage: React.FC = () => {
  const [query, setQuery]       = useState('');
  const [result, setResult]     = useState<FaydaProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setTimeout(() => {
      const key = query.trim().toUpperCase();
      const found = REGISTRY[key] ?? Object.values(REGISTRY).find(p => p.phone === query.trim() || p.full_name.toLowerCase() === query.trim().toLowerCase());
      if (found) { setResult(found); } else { setNotFound(true); }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fayda">
      <div className="fayda__header">
        <div>
          <h1>Fayda ID Registry</h1>
          <p>National digital identity verification for Ethiopia's health system</p>
        </div>
      </div>

      <div className="fayda__kpis">
        {[
          { label: 'Registered Citizens', value: '126M+',  color: '#2563eb' },
          { label: 'Verified Profiles',   value: '98.2%',  color: '#059669' },
          { label: 'Linked Facilities',   value: '1,204',  color: '#7c3aed' },
          { label: 'Pending Verifications',value:'42,318', color: '#d97706' },
        ].map((k, i) => (
          <div key={i} className="fayda__kpi" style={{ borderLeftColor: k.color }}>
            <span style={{ color: k.color, fontSize: '1.4rem', fontWeight: 700 }}>{k.value}</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="fayda__lookup ch-card">
        <h3>Identity Lookup</h3>
        <p>Search by Fayda ID (e.g. ET8823710293), phone number, or full name</p>
        <form className="fayda__lookup-form" onSubmit={lookup}>
          <div className="fayda__lookup-input">
            <Search size={16} className="fayda__lookup-icon"/>
            <input
              placeholder="Enter Fayda ID, phone, or name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              required
            />
          </div>
          <button className="ch-btn ch-btn--primary" type="submit" disabled={loading}>
            {loading ? <span className="login-spinner"/> : 'Verify Identity'}
          </button>
        </form>

        <div className="fayda__quick-picks">
          <span>Quick lookup:</span>
          {Object.keys(REGISTRY).map(id => (
            <button key={id} className="fayda__quick-btn" onClick={() => { setQuery(id); setResult(null); setNotFound(false); }}>
              {id}
            </button>
          ))}
        </div>
      </div>

      {notFound && (
        <div className="fayda__not-found ch-card">
          <XCircle size={32} color="#dc2626"/>
          <div>
            <h3>No Match Found</h3>
            <p>No Fayda ID record found for "<strong>{query}</strong>". The citizen may not be registered or the ID may be incorrect.</p>
          </div>
        </div>
      )}

      {result && <ProfileCard profile={result}/>}

      {!result && !notFound && (
        <div className="fayda__all ch-card">
          <div className="fayda__all-header">
            <h3>All Registered Profiles</h3>
            <span className="ch-badge ch-badge--blue">{Object.keys(REGISTRY).length} loaded</span>
          </div>
          <table className="fayda__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Fayda ID</th>
                <th>Region</th>
                <th>Status</th>
                <th>Facilities</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(REGISTRY).map(p => {
                const sc = STATUS_CFG[p.status];
                return (
                  <tr key={p.fayda_id} className="fayda__table-row" onClick={() => { setQuery(p.fayda_id); setResult(p); setNotFound(false); }}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:`${RISK_COLOR[p.risk]}18`, color:RISK_COLOR[p.risk], display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem' }}>{p.photo_initial}</div>
                        <span style={{ fontWeight:600, fontSize:'0.85rem', color:'#0f1f3d' }}>{p.full_name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#64748b' }}>{p.fayda_id}</span></td>
                    <td style={{ fontSize:'0.82rem', color:'#475569' }}>{p.region}</td>
                    <td><span className={`ch-badge ${sc.cls}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.25rem' }}>{sc.icon}{sc.label}</span></td>
                    <td style={{ fontSize:'0.78rem', color:'#64748b' }}>{p.facilities_visited.length} facilities</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

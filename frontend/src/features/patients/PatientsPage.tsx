import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, HeartPulse, MapPin, X, User, Phone, MapPin as MapPinIcon, Activity } from 'lucide-react';
import './PatientsPage.css';

const PATIENTS = [
  { id:'ET8823710293', name:'Almaz Tesfaye',    age:28, gender:'F', region:'Tigray',      facility:'Adwa Health Center',          condition:'Prenatal Care',   risk:'high',     phone:'+251922334455', lastVisit:'2 weeks ago' },
  { id:'ET7712340012', name:'Kebede Mulugeta',  age:54, gender:'M', region:'Amhara',      facility:'Gondar University Hospital',  condition:'Hypertension',    risk:'medium',   phone:'+251911223344', lastVisit:'1 month ago' },
  { id:'ET6601290087', name:'Fatima Abdi',      age:32, gender:'F', region:'Somali',      facility:'Jijiga General Hospital',     condition:'Diabetes T2',     risk:'high',     phone:'+251933445566', lastVisit:'3 days ago'  },
  { id:'ET5590183421', name:'Biruk Tadesse',    age:7,  gender:'M', region:'Oromia',      facility:'Jimma University Hospital',   condition:'Malnutrition',    risk:'critical', phone:'+251944556677', lastVisit:'Today'       },
  { id:'ET4482910034', name:'Hiwot Girma',      age:45, gender:'F', region:'Addis Ababa', facility:'Black Lion Hospital',         condition:'Cancer Screening',risk:'medium',   phone:'+251955667788', lastVisit:'1 week ago'  },
  { id:'ET3371820056', name:'Solomon Bekele',   age:61, gender:'M', region:'SNNPR',       facility:'Hawassa University Hospital', condition:'Tuberculosis',    risk:'critical', phone:'+251966778899', lastVisit:'5 days ago'  },
  { id:'ET2260918743', name:'Mekdes Haile',     age:24, gender:'F', region:'Tigray',      facility:'Mekelle General Hospital',    condition:'Prenatal Care',   risk:'low',      phone:'+251977889900', lastVisit:'3 weeks ago' },
  { id:'ET1150837621', name:'Dawit Alemu',      age:38, gender:'M', region:'Afar',        facility:'Semera Regional Hospital',    condition:'Malaria',         risk:'high',     phone:'+251988990011', lastVisit:'Yesterday'   },
  { id:'ET0040726510', name:'Selamawit Yonas',  age:19, gender:'F', region:'Amhara',      facility:'Gondar University Hospital',  condition:'Anemia',          risk:'medium',   phone:'+251999001122', lastVisit:'2 weeks ago' },
  { id:'ET9930615409', name:'Abebe Worku',      age:72, gender:'M', region:'Oromia',      facility:'Nekemte Referral Hospital',   condition:'Heart Disease',   risk:'critical', phone:'+251900112233', lastVisit:'Today'       },
  { id:'ET8820504308', name:'Tigist Lemma',     age:41, gender:'F', region:'Addis Ababa', facility:'St. Paul Hospital',           condition:'Hypertension',    risk:'low',      phone:'+251911223300', lastVisit:'1 month ago' },
  { id:'ET7710393207', name:'Yonas Getachew',   age:15, gender:'M', region:'Gambella',    facility:'Gambella Regional Hospital',  condition:'Malaria',         risk:'high',     phone:'+251922334400', lastVisit:'4 days ago'  },
];

const RISK_CONFIG = {
  critical: { label:'Critical', cls:'ch-badge--red'   },
  high:     { label:'High',     cls:'ch-badge--orange' },
  medium:   { label:'Medium',   cls:'ch-badge--blue'   },
  low:      { label:'Low',      cls:'ch-badge--green'  },
};

const REGIONS = ['Addis Ababa','Oromia','Amhara','Tigray','SNNPR','Somali','Afar','Benishangul-Gumuz','Gambella','Harari','Dire Dawa','Sidama'];
const FACILITIES = ['Black Lion Specialized Hospital','St. Paul Hospital','Mekelle General Hospital','Adwa Health Center','Hawassa University Hospital','Gondar University Hospital','Jimma University Hospital','Nekemte Referral Hospital','Assosa General Hospital','Gambella Regional Hospital','Dire Dawa Referral Hospital','Harar Regional Hospital','Jijiga General Hospital','Semera Regional Hospital','Arba Minch General Hospital'];
const CONDITIONS = ['Prenatal Care','Hypertension','Diabetes T2','Malnutrition','Cancer Screening','Tuberculosis','Malaria','Anemia','Heart Disease','HIV/AIDS','General Checkup'];

interface RegisterForm {
  full_name: string; fayda_id: string; phone: string;
  dob: string; gender: string; region: string;
  facility: string; condition: string;
}

const EMPTY_FORM: RegisterForm = { full_name:'', fayda_id:'', phone:'', dob:'', gender:'', region:'', facility:'', condition:'' };

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(PATIENTS);
  const [search, setSearch]     = useState('');
  const [risk, setRisk]         = useState('all');
  const [region, setRegion]     = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState<RegisterForm>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);

  const regions = ['all', ...Array.from(new Set(patients.map(p => p.region)))];

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    return (
      (!q || p.name.toLowerCase().includes(q) || p.id.includes(q) || p.condition.toLowerCase().includes(q)) &&
      (risk   === 'all' || p.risk   === risk) &&
      (region === 'all' || p.region === region)
    );
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Generate a mock Fayda ID if not provided
    const faydaId = form.fayda_id.trim() || `ET${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const age = form.dob ? Math.floor((Date.now() - new Date(form.dob).getTime()) / 31557600000) : 0;

    setTimeout(() => {
      setPatients(prev => [{
        id: faydaId,
        name: form.full_name,
        age,
        gender: form.gender === 'female' ? 'F' : 'M',
        region: form.region,
        facility: form.facility,
        condition: form.condition || 'General Checkup',
        risk: 'low',
        phone: form.phone,
        lastVisit: 'Today',
      }, ...prev]);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setShowModal(false); setForm(EMPTY_FORM); }, 1500);
    }, 800);
  };

  const f = (k: keyof RegisterForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="pp">
      <div className="pp__header">
        <div>
          <h1>Patients</h1>
          <p>{patients.length} registered patients across Ethiopia</p>
        </div>
        <button className="ch-btn ch-btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={16}/> Register Patient
        </button>
      </div>

      <div className="pp__kpis">
        {[
          { label:'Total Patients', value:'2,847,391',                                             color:'#2563eb' },
          { label:'Critical Risk',  value: patients.filter(p=>p.risk==='critical').length,        color:'#dc2626' },
          { label:'High Risk',      value: patients.filter(p=>p.risk==='high').length,            color:'#d97706' },
          { label:'Due Follow-up',  value:'87',                                                    color:'#7c3aed' },
        ].map((k,i) => (
          <div key={i} className="pp__kpi" style={{ borderLeftColor: k.color }}>
            <span className="pp__kpi-val" style={{ color: k.color }}>{k.value}</span>
            <span className="pp__kpi-lbl">{k.label}</span>
          </div>
        ))}
      </div>

      <div className="pp__controls ch-card">
        <div className="pp__search">
          <Search size={16} className="pp__search-icon"/>
          <input placeholder="Search by name, Fayda ID, or condition…"
            value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="pp__filters">
          <select value={risk} onChange={e => setRisk(e.target.value)}>
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={region} onChange={e => setRegion(e.target.value)}>
            {regions.map(r => <option key={r} value={r}>{r === 'all' ? 'All Regions' : r}</option>)}
          </select>
        </div>
      </div>

      <div className="pp__table-wrap ch-card">
        <table className="pp__table">
          <thead>
            <tr>
              <th>Patient</th><th>Fayda ID</th><th>Condition</th>
              <th><MapPin size={13}/> Region</th><th><HeartPulse size={13}/> Risk</th>
              <th>Last Visit</th><th>Facility</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const rc = RISK_CONFIG[p.risk as keyof typeof RISK_CONFIG];
              return (
                <tr key={p.id} onClick={() => navigate(`/dashboard/patients/${p.id}`)} className="pp__row">
                  <td>
                    <div className="pp__patient">
                      <div className="pp__avatar" data-risk={p.risk}>{p.name[0]}</div>
                      <div>
                        <div className="pp__name">{p.name}</div>
                        <div className="pp__meta">{p.age}y · {p.gender === 'F' ? 'Female' : 'Male'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="pp__fayda">{p.id}</span></td>
                  <td>{p.condition}</td>
                  <td><span className="pp__region">{p.region}</span></td>
                  <td><span className={`ch-badge ${rc.cls}`}>{rc.label}</span></td>
                  <td className="pp__visit">{p.lastVisit}</td>
                  <td className="pp__facility">{p.facility}</td>
                  <td>
                    <button className="pp__view" onClick={e => { e.stopPropagation(); navigate(`/dashboard/patients/${p.id}`); }}>
                      <Eye size={15}/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="pp__empty">No patients match your filters.</div>}
      </div>

      {/* ── Register Patient Modal ── */}
      {showModal && (
        <div className="pp__modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="pp__modal" onClick={e => e.stopPropagation()}>
            <div className="pp__modal-header">
              <h2>Register New Patient</h2>
              <button className="pp__modal-close" onClick={() => setShowModal(false)}><X size={18}/></button>
            </div>

            {success ? (
              <div className="pp__modal-success">
                <span>✅</span>
                <p>Patient registered successfully!</p>
              </div>
            ) : (
              <form className="pp__modal-form" onSubmit={handleRegister}>
                <div className="pp__modal-section">
                  <div className="pp__modal-section-title"><User size={14}/> Personal Info</div>
                  <div className="pp__modal-grid">
                    <div className="pp__field pp__field--full">
                      <label>Full Name *</label>
                      <input required placeholder="e.g. Almaz Tesfaye" value={form.full_name} onChange={e => f('full_name', e.target.value)}/>
                    </div>
                    <div className="pp__field">
                      <label>Fayda ID</label>
                      <input placeholder="ET… (auto-generated if blank)" value={form.fayda_id} onChange={e => f('fayda_id', e.target.value.toUpperCase())} style={{ fontFamily:'monospace' }}/>
                    </div>
                    <div className="pp__field">
                      <label>Date of Birth</label>
                      <input type="date" value={form.dob} onChange={e => f('dob', e.target.value)}/>
                    </div>
                    <div className="pp__field">
                      <label>Gender *</label>
                      <select required value={form.gender} onChange={e => f('gender', e.target.value)}>
                        <option value="">Select…</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="pp__field">
                      <label><Phone size={12}/> Phone</label>
                      <input placeholder="+251…" value={form.phone} onChange={e => f('phone', e.target.value)}/>
                    </div>
                  </div>
                </div>

                <div className="pp__modal-section">
                  <div className="pp__modal-section-title"><MapPinIcon size={14}/> Location & Facility</div>
                  <div className="pp__modal-grid">
                    <div className="pp__field">
                      <label>Region *</label>
                      <select required value={form.region} onChange={e => f('region', e.target.value)}>
                        <option value="">Select region…</option>
                        {REGIONS.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="pp__field">
                      <label>Facility *</label>
                      <select required value={form.facility} onChange={e => f('facility', e.target.value)}>
                        <option value="">Select facility…</option>
                        {FACILITIES.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pp__modal-section">
                  <div className="pp__modal-section-title"><Activity size={14}/> Clinical</div>
                  <div className="pp__modal-grid">
                    <div className="pp__field pp__field--full">
                      <label>Primary Condition</label>
                      <select value={form.condition} onChange={e => f('condition', e.target.value)}>
                        <option value="">Select condition…</option>
                        {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pp__modal-footer">
                  <button type="button" className="ch-btn ch-btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="ch-btn ch-btn--primary" disabled={saving}>
                    {saving ? <span className="login-spinner"/> : 'Register Patient'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Plus, Brain, X, User, Calendar } from 'lucide-react';
import './AppointmentsPage.css';

const APPTS_INIT = [
  { id:1,  patient:'Almaz Tesfaye',    fayda:'ET8823710293', type:'Prenatal Check',      facility:'Adwa Health Center',          date:'15 Jun 2025', time:'9:00 AM',  status:'scheduled', ai:true,  ussd:true  },
  { id:2,  patient:'Biruk Tadesse',    fayda:'ET5590183421', type:'Nutrition Follow-up',  facility:'Jimma University Hospital',   date:'10 Jun 2025', time:'8:00 AM',  status:'scheduled', ai:true,  ussd:false },
  { id:3,  patient:'Hiwot Girma',      fayda:'ET4482910034', type:'Cancer Screening',    facility:'Black Lion Hospital',          date:'12 Jun 2025', time:'11:00 AM', status:'confirmed', ai:false, ussd:false },
  { id:4,  patient:'Solomon Bekele',   fayda:'ET3371820056', type:'TB Follow-up',         facility:'Hawassa University Hospital', date:'11 Jun 2025', time:'10:00 AM', status:'confirmed', ai:true,  ussd:true  },
  { id:5,  patient:'Dawit Alemu',      fayda:'ET1150837621', type:'Malaria Review',       facility:'Semera Regional Hospital',    date:'9 Jun 2025',  time:'9:30 AM',  status:'attended',  ai:false, ussd:true  },
  { id:6,  patient:'Kebede Mulugeta',  fayda:'ET7712340012', type:'Hypertension Check',   facility:'Gondar University Hospital',  date:'8 Jun 2025',  time:'2:00 PM',  status:'attended',  ai:false, ussd:false },
  { id:7,  patient:'Fatima Abdi',      fayda:'ET6601290087', type:'Diabetes Review',      facility:'Jijiga General Hospital',     date:'7 Jun 2025',  time:'10:00 AM', status:'missed',    ai:true,  ussd:true  },
  { id:8,  patient:'Mekdes Haile',     fayda:'ET2260918743', type:'Prenatal Check',       facility:'Mekelle General Hospital',    date:'20 Jun 2025', time:'9:00 AM',  status:'scheduled', ai:true,  ussd:true  },
];

const STATUS_CFG: Record<string, { cls: string; label: string }> = {
  scheduled: { cls:'ch-badge--blue',   label:'Scheduled' },
  confirmed:  { cls:'ch-badge--green',  label:'Confirmed' },
  attended:   { cls:'ch-badge--gray',   label:'Attended'  },
  missed:     { cls:'ch-badge--red',    label:'Missed'    },
};

const FACILITIES = ['Black Lion Specialized Hospital','St. Paul Hospital','Mekelle General Hospital','Adwa Health Center','Hawassa University Hospital','Gondar University Hospital','Jimma University Hospital','Nekemte Referral Hospital','Semera Regional Hospital','Arba Minch General Hospital'];
const APPT_TYPES = ['Prenatal Check','Nutrition Follow-up','Cancer Screening','TB Follow-up','Malaria Review','Hypertension Check','Diabetes Review','General Checkup','Vaccination','Emergency'];

interface NewApptForm {
  patient: string; fayda: string; type: string;
  facility: string; date: string; time: string; ussd: boolean;
}
const EMPTY: NewApptForm = { patient:'', fayda:'', type:'', facility:'', date:'', time:'', ussd:false };

export const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [appts, setAppts]       = useState(APPTS_INIT);
  const [filter, setFilter]     = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState<NewApptForm>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);

  const filtered = appts.filter(a => filter === 'all' || a.status === filter);
  const counts = {
    scheduled: appts.filter(a=>a.status==='scheduled').length,
    confirmed:  appts.filter(a=>a.status==='confirmed').length,
    missed:     appts.filter(a=>a.status==='missed').length,
    ai:         appts.filter(a=>a.ai).length,
  };

  const f = (k: keyof NewApptForm, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setAppts(prev => [{
        id: prev.length + 1,
        patient:  form.patient,
        fayda:    form.fayda || 'ET0000000000',
        type:     form.type,
        facility: form.facility,
        date:     new Date(form.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }),
        time:     form.time,
        status:   'scheduled',
        ai:       false,
        ussd:     form.ussd,
      }, ...prev]);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setShowModal(false); setForm(EMPTY); }, 1500);
    }, 800);
  };

  return (
    <div className="ap">
      <div className="ap__header">
        <div><h1>Appointments</h1><p>AI-scheduled and manual appointments across all facilities</p></div>
        <button className="ch-btn ch-btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={15}/> New Appointment
        </button>
      </div>

      <div className="ap__kpis">
        {[
          { label:'Upcoming',     value:counts.scheduled, color:'#2563eb' },
          { label:'Confirmed',    value:counts.confirmed,  color:'#16a34a' },
          { label:'Missed',       value:counts.missed,     color:'#dc2626' },
          { label:'AI Scheduled', value:counts.ai,         color:'#7c3aed' },
        ].map((k,i) => (
          <div key={i} className="ap__kpi" style={{ borderLeftColor:k.color }}>
            <span style={{ color:k.color, fontSize:'1.6rem', fontWeight:700 }}>{k.value}</span>
            <span style={{ fontSize:'0.75rem', color:'#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="ap__controls ch-card">
        <div className="ap__filters">
          {['all','scheduled','confirmed','attended','missed'].map(s => (
            <button key={s} className={`ap__filter-btn ${filter===s?'ap__filter-btn--active':''}`}
              onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="ap__list ch-card">
        {filtered.map(a => {
          const sc = STATUS_CFG[a.status];
          return (
            <div key={a.id} className="ap__row" onClick={() => navigate(`/dashboard/patients/${a.fayda}`)}
              style={{ cursor:'pointer' }}>
              <div className="ap__date-box">
                <span>{a.date.split(' ').slice(0,2).join(' ')}</span>
                <span>{a.date.split(' ')[2]}</span>
              </div>
              <div className="ap__info">
                <div className="ap__top">
                  <span className="ap__type">{a.type}</span>
                  <div className="ap__badges">
                    {a.ai   && <span className="ap__badge ap__badge--ai"><Brain size={10}/> AI</span>}
                    {a.ussd && <span className="ap__badge ap__badge--ussd">📱 USSD</span>}
                  </div>
                </div>
                <div className="ap__patient">{a.patient} · <span>{a.fayda}</span></div>
                <div className="ap__meta"><Clock size={12}/>{a.time} &nbsp;·&nbsp;<MapPin size={12}/>{a.facility}</div>
              </div>
              <span className={`ch-badge ${sc.cls}`}>{sc.label}</span>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ padding:'2rem', textAlign:'center', color:'#94a3b8' }}>No appointments match this filter.</div>}
      </div>

      {/* ── New Appointment Modal ── */}
      {showModal && (
        <div className="pp__modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="pp__modal" onClick={e => e.stopPropagation()}>
            <div className="pp__modal-header">
              <h2>New Appointment</h2>
              <button className="pp__modal-close" onClick={() => setShowModal(false)}><X size={18}/></button>
            </div>

            {success ? (
              <div className="pp__modal-success"><span>✅</span><p>Appointment scheduled!</p></div>
            ) : (
              <form className="pp__modal-form" onSubmit={handleSubmit}>
                <div className="pp__modal-section">
                  <div className="pp__modal-section-title"><User size={14}/> Patient</div>
                  <div className="pp__modal-grid">
                    <div className="pp__field">
                      <label>Patient Name *</label>
                      <input required placeholder="Full name" value={form.patient} onChange={e => f('patient', e.target.value)}/>
                    </div>
                    <div className="pp__field">
                      <label>Fayda ID</label>
                      <input placeholder="ET…" value={form.fayda} onChange={e => f('fayda', e.target.value.toUpperCase())} style={{ fontFamily:'monospace' }}/>
                    </div>
                  </div>
                </div>

                <div className="pp__modal-section">
                  <div className="pp__modal-section-title"><Calendar size={14}/> Appointment Details</div>
                  <div className="pp__modal-grid">
                    <div className="pp__field pp__field--full">
                      <label>Appointment Type *</label>
                      <select required value={form.type} onChange={e => f('type', e.target.value)}>
                        <option value="">Select type…</option>
                        {APPT_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="pp__field pp__field--full">
                      <label>Facility *</label>
                      <select required value={form.facility} onChange={e => f('facility', e.target.value)}>
                        <option value="">Select facility…</option>
                        {FACILITIES.map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="pp__field">
                      <label>Date *</label>
                      <input required type="date" value={form.date} onChange={e => f('date', e.target.value)}/>
                    </div>
                    <div className="pp__field">
                      <label>Time *</label>
                      <input required type="time" value={form.time} onChange={e => f('time', e.target.value)}/>
                    </div>
                    <div className="pp__field pp__field--full">
                      <label style={{ flexDirection:'row', gap:'0.6rem', alignItems:'center', cursor:'pointer' }}>
                        <input type="checkbox" checked={form.ussd} onChange={e => f('ussd', e.target.checked)} style={{ width:'auto' }}/>
                        Send USSD/SMS reminder to patient
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pp__modal-footer">
                  <button type="button" className="ch-btn ch-btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="ch-btn ch-btn--primary" disabled={saving}>
                    {saving ? <span className="login-spinner"/> : 'Schedule Appointment'}
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

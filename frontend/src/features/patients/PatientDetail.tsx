import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import './PatientDetail.css';

interface PatientRecord {
  name: string; age: number; gender: string; region: string; woreda: string;
  phone: string; fayda: string; dob: string; facility: string; clinician: string;
  condition: string; risk: string; score: number;
  bloodType: string; weight: string; height: string; bmi: string;
  allergies: string[]; chronicConditions: string[];
  history: { date: string; facility: string; type: string; notes: string; doctor: string }[];
  appointments: { date: string; time: string; type: string; facility: string; status: string; ai: boolean }[];
  riskFactors: string[];
}

const PATIENTS: Record<string, PatientRecord> = {
  'ET8823710293': {
    name:'Almaz Tesfaye', age:28, gender:'Female', region:'Tigray', woreda:'Adwa',
    phone:'+251922334455', fayda:'ET8823710293', dob:'15 Mar 1996',
    facility:'Adwa Health Center', clinician:'Dr. Mekdes Haile',
    condition:'Prenatal Care', risk:'high', score:62,
    bloodType:'B+', weight:'62kg', height:'161cm', bmi:'23.9',
    allergies:['Penicillin'], chronicConditions:['Iron Deficiency Anemia'],
    history:[
      { date:'2 Jun 2025', facility:'Adwa Health Center',     type:'Prenatal Check',    notes:'32 weeks. Iron low. Supplements prescribed.',      doctor:'Dr. Mekdes Haile' },
      { date:'10 May 2025',facility:'Mekelle General Hospital',type:'Prenatal Check',   notes:'28 weeks. Normal. Fetal heartbeat 148bpm.',        doctor:'Dr. Kebede Alemu' },
      { date:'15 Mar 2025',facility:'Adwa Health Center',     type:'First Antenatal',   notes:'Confirmed pregnancy 12 weeks. Folic acid started.', doctor:'Dr. Mekdes Haile' },
      { date:'10 Jan 2025',facility:'Adwa Health Center',     type:'General Checkup',   notes:'Healthy. No concerns.',                            doctor:'Dr. Mekdes Haile' },
    ],
    appointments:[
      { date:'15 Jun 2025', time:'9:00 AM',  type:'Prenatal Check',  facility:'Adwa Health Center',    status:'scheduled', ai:true  },
      { date:'10 May 2025', time:'10:30 AM', type:'Prenatal Check',  facility:'Mekelle General Hospital',status:'attended', ai:false },
      { date:'15 Mar 2025', time:'9:00 AM',  type:'First Antenatal', facility:'Adwa Health Center',    status:'attended', ai:false },
    ],
    riskFactors:['2 missed follow-ups','Low iron (Hgb 9.8 g/dL)','Gestational week 32 — critical period'],
  },
  'ET5590183421': {
    name:'Biruk Tadesse', age:7, gender:'Male', region:'Oromia', woreda:'Jimma',
    phone:'+251944556677', fayda:'ET5590183421', dob:'03 Sep 2017',
    facility:'Jimma University Hospital', clinician:'Dr. Abebe Negash',
    condition:'Malnutrition', risk:'critical', score:18,
    bloodType:'O+', weight:'14kg', height:'108cm', bmi:'12.0',
    allergies:[], chronicConditions:['Severe Acute Malnutrition'],
    history:[
      { date:'8 Jun 2025', facility:'Jimma University Hospital', type:'Emergency Admission', notes:'SAM with complications. RUTF initiated.', doctor:'Dr. Abebe Negash' },
      { date:'1 Jun 2025', facility:'Jimma Health Center',       type:'Screening',           notes:'MUAC red zone. Referred to hospital.',   doctor:'HEW Tigist' },
    ],
    appointments:[
      { date:'10 Jun 2025', time:'8:00 AM', type:'Follow-up',   facility:'Jimma University Hospital', status:'scheduled', ai:true  },
    ],
    riskFactors:['MUAC < 11.5cm','Weight-for-height Z-score < -3','No caregiver support'],
  },
};

const RISK_COLOR: Record<string, string> = {
  critical:'#dc2626', high:'#d97706', medium:'#2563eb', low:'#16a34a'
};

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'history'|'appointments'|'risk'>('history');

  const p = PATIENTS[id ?? ''] ?? PATIENTS['ET8823710293'];
  const riskColor = RISK_COLOR[p.risk];

  return (
    <div className="pd">
      {/* Back */}
      <button className="pd__back" onClick={() => navigate('/dashboard/patients')}>
        <ArrowLeft size={16}/> Back to Patients
      </button>

      {/* Header card */}
      <div className="pd__hero ch-card">
        <div className="pd__hero-left">
          <div className="pd__avatar" style={{ background:`${riskColor}15`, color:riskColor }}>
            {p.name[0]}
          </div>
          <div>
            <h1>{p.name}</h1>
            <div className="pd__hero-meta">
              <span><Calendar size={13}/> {p.dob} · {p.age} yrs · {p.gender}</span>
              <span><MapPin size={13}/> {p.region}, {p.woreda}</span>
              <span><Phone size={13}/> {p.phone}</span>
            </div>
            <div className="pd__badges">
              <span className="pd__fayda">🆔 {p.fayda}</span>
              <span className={`ch-badge ch-badge--${p.risk==='critical'?'red':p.risk==='high'?'orange':p.risk==='medium'?'blue':'green'}`}>
                {p.risk.charAt(0).toUpperCase()+p.risk.slice(1)} Risk
              </span>
              <span className="ch-badge ch-badge--gray">{p.condition}</span>
            </div>
          </div>
        </div>

        {/* Wellness Score */}
        <div className="pd__score-wrap">
          <div className="pd__score-ring" style={{ '--score-color': riskColor } as React.CSSProperties}>
            <svg viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f6ff" strokeWidth="8"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke={riskColor} strokeWidth="8"
                strokeDasharray={`${2*Math.PI*34*p.score/100} ${2*Math.PI*34}`}
                strokeLinecap="round" transform="rotate(-90 40 40)"/>
            </svg>
            <div className="pd__score-val">
              <span style={{color:riskColor}}>{p.score}</span>
              <small>/ 100</small>
            </div>
          </div>
          <span className="pd__score-lbl">Wellness Score</span>
        </div>
      </div>

      {/* Vitals row */}
      <div className="pd__vitals">
        {[
          { label:'Blood Type', value:p.bloodType, icon:'🩸' },
          { label:'Weight',     value:p.weight,    icon:'⚖️' },
          { label:'Height',     value:p.height,    icon:'📏' },
          { label:'BMI',        value:p.bmi,       icon:'📊' },
          { label:'Clinician',  value:p.clinician, icon:'👨‍⚕️' },
          { label:'Facility',   value:p.facility,  icon:'🏥' },
        ].map((v,i) => (
          <div key={i} className="pd__vital ch-card">
            <span className="pd__vital-icon">{v.icon}</span>
            <span className="pd__vital-val">{v.value}</span>
            <span className="pd__vital-lbl">{v.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="pd__tabs">
        {(['history','appointments','risk'] as const).map(t => (
          <button key={t} className={`pd__tab ${tab===t?'pd__tab--active':''}`} onClick={() => setTab(t)}>
            {t==='history'?'Visit History':t==='appointments'?'Appointments':'Risk Factors'}
          </button>
        ))}
      </div>

      {/* Visit History */}
      {tab==='history' && (
        <div className="pd__timeline ch-card">
          {p.history.map((h, i) => (
            <div key={i} className="pd__tl-item">
              <div className="pd__tl-dot"><FileText size={13}/></div>
              <div className="pd__tl-content">
                <div className="pd__tl-top">
                  <span className="pd__tl-type">{h.type}</span>
                  <span className="pd__tl-date">{h.date}</span>
                </div>
                <div className="pd__tl-facility">{h.facility} · {h.doctor}</div>
                <p className="pd__tl-notes">{h.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments */}
      {tab==='appointments' && (
        <div className="pd__appts ch-card">
          {p.appointments.map((a, i) => (
            <div key={i} className="pd__appt-row">
              <div className="pd__appt-date">
                <span>{a.date.split(' ')[0]} {a.date.split(' ')[1]}</span>
                <span>{a.date.split(' ')[2]}</span>
              </div>
              <div className="pd__appt-info">
                <div className="pd__appt-type">
                  {a.type}
                  {a.ai && <span className="pd__ai-badge">🤖 AI Scheduled</span>}
                </div>
                <div className="pd__appt-fac"><Clock size={12}/> {a.time} · {a.facility}</div>
              </div>
              <span className={`ch-badge ${a.status==='attended'?'ch-badge--green':a.status==='scheduled'?'ch-badge--blue':'ch-badge--red'}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Risk Factors */}
      {tab==='risk' && (
        <div className="pd__risk ch-card">
          <div className="pd__risk-header">
            <AlertCircle size={18} style={{color:riskColor}}/> 
            <h3>Risk Assessment</h3>
          </div>
          <div className="pd__risk-factors">
            {p.riskFactors.map((f, i) => (
              <div key={i} className="pd__risk-factor">
                <AlertCircle size={14} style={{color:riskColor, flexShrink:0}}/>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="pd__conditions">
            <h4>Chronic Conditions</h4>
            {p.chronicConditions.length > 0 
              ? p.chronicConditions.map((c, i) => (
                  <span key={i} className="ch-badge ch-badge--orange" style={{margin:'0.25rem'}}>{c}</span>
                ))
              : <span className="pd__none">None recorded</span>
            }
          </div>
          {p.allergies.length > 0 && (
            <div className="pd__conditions">
              <h4>Allergies</h4>
              {p.allergies.map((a, i) => (
                <span key={i} className="ch-badge ch-badge--red" style={{margin:'0.25rem'}}>{a}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { usePatientData } from '../../../hooks/usePatientData';
import { HeartPulse, Calendar, MessageCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './PatientHome.css';

const RISK_COLOR: Record<string, string> = { critical:'#dc2626', high:'#d97706', medium:'#2563eb', low:'#16a34a' };
const RISK_BADGE: Record<string, string> = { critical:'ch-badge--red', high:'ch-badge--orange', medium:'ch-badge--blue', low:'ch-badge--green' };

export const PatientHome: React.FC = () => {
  const { profile } = useAuthStore();
  const { wellness, nextAppointment, loading } = usePatientData();
  const navigate = useNavigate();

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Patient';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Use real data, fall back to sensible defaults
  const score     = wellness?.score       ?? 0;
  const riskLevel = wellness?.risk_level  ?? 'low';
  const riskColor = RISK_COLOR[riskLevel] ?? '#16a34a';

  // Parse risk_factors — could be a JSON object or null
  const riskFactors: string[] = wellness?.risk_factors
    ? Object.entries(wellness.risk_factors)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
    : [];

  const apptDate = nextAppointment
    ? new Date(nextAppointment.scheduled_at).toLocaleDateString('en-ET', { day:'numeric', month:'short', year:'numeric' })
    : null;
  const apptTime = nextAppointment
    ? new Date(nextAppointment.scheduled_at).toLocaleTimeString('en-ET', { hour:'2-digit', minute:'2-digit' })
    : null;

  return (
    <div className="ph">
      <div className="ph__header">
        <div>
          <h1>{greeting}, {firstName} 👋</h1>
          <p>Here's your personal health summary for today.</p>
        </div>
        <button className="ch-btn ch-btn--primary" onClick={() => navigate('/dashboard/healthbot')}>
          <MessageCircle size={15}/> Chat with TenaBot
        </button>
      </div>

      {loading ? (
        <div className="ph__loading">Loading your health data…</div>
      ) : (
        <>
          <div className="ph__top">
            {/* Wellness score */}
            <div className="ph__score-card ch-card">
              <div className="ph__score-label">Your Wellness Score</div>
              <div className="ph__score-ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f6ff" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={riskColor} strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * score / 100} ${2 * Math.PI * 50}`}
                    strokeLinecap="round" transform="rotate(-90 60 60)"/>
                </svg>
                <div className="ph__score-val">
                  <span style={{ color: riskColor }}>{Math.round(score)}</span>
                  <small>/ 100</small>
                </div>
              </div>
              <span className={`ch-badge ${RISK_BADGE[riskLevel] ?? 'ch-badge--green'}`}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
              </span>
              {wellness?.ai_notes && (
                <p className="ph__ai-note">{wellness.ai_notes}</p>
              )}
            </div>

            {/* Next appointment */}
            <div className="ph__appt-card ch-card">
              <div className="ph__card-title"><Calendar size={16} color="#2563eb"/> Next Appointment</div>
              {nextAppointment ? (
                <>
                  <div className="ph__appt-date">{apptDate}</div>
                  <div className="ph__appt-type">{nextAppointment.appointment_type}</div>
                  <div className="ph__appt-meta"><Clock size={13}/> {apptTime}</div>
                  {nextAppointment.facilities?.name && (
                    <div className="ph__appt-meta">🏥 {nextAppointment.facilities.name}</div>
                  )}
                  {nextAppointment.ai_scheduled && (
                    <span className="ph__ai-badge">🤖 AI Scheduled</span>
                  )}
                </>
              ) : (
                <div className="ph__no-appt">No upcoming appointments.<br/>Your care team will schedule one.</div>
              )}
              <button className="ch-btn ch-btn--ghost ph__appt-btn" onClick={() => navigate('/dashboard/my-appointments')}>
                View All Appointments
              </button>
            </div>

            {/* Quick stats from real profile */}
            <div className="ph__stats-col">
              {[
                { label:'Fayda ID',  value: profile?.fayda_id  ?? '—', icon:'🆔', color:'#2563eb', mono:true  },
                { label:'Region',    value: profile?.region     ?? '—', icon:'📍', color:'#7c3aed', mono:false },
                { label:'Gender',    value: profile?.gender     ?? '—', icon:'👤', color:'#0891b2', mono:false },
              ].map((s, i) => (
                <div key={i} className="ph__stat-pill ch-card">
                  <span className="ph__stat-icon">{s.icon}</span>
                  <div>
                    <div className="ph__stat-label">{s.label}</div>
                    <div className="ph__stat-value" style={{ color:s.color, fontFamily:s.mono?'monospace':undefined }}>
                      {s.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk factors — only shown if data exists */}
          {riskFactors.length > 0 && (
            <div className="ph__risks ch-card">
              <div className="ph__card-title">
                <AlertCircle size={16} color={riskColor}/> Active Risk Factors
              </div>
              <div className="ph__risks-list">
                {riskFactors.map((f, i) => (
                  <div key={i} className="ph__risk-item" style={{ borderLeftColor: riskColor }}>
                    <AlertCircle size={13} color={riskColor} style={{ flexShrink:0 }}/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="ph__bottom">
            <div className="ch-card ph__actions-card">
              <div className="ph__card-title"><CheckCircle size={16} color="#16a34a"/> Quick Actions</div>
              <div className="ph__actions">
                {[
                  { label:'My Wellness Score',  icon:<HeartPulse size={18}/>,    path:'/dashboard/my-wellness',     color:'#d97706', bg:'#ffedd5' },
                  { label:'My Appointments',    icon:<Calendar size={18}/>,      path:'/dashboard/my-appointments', color:'#2563eb', bg:'#dbeafe' },
                  { label:'Chat with TenaBot',  icon:<MessageCircle size={18}/>, path:'/dashboard/healthbot',       color:'#059669', bg:'#dcfce7' },
                ].map((a, i) => (
                  <button key={i} className="ph__action-btn" onClick={() => navigate(a.path)}
                    style={{ background:a.bg, color:a.color }}>
                    {a.icon}
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ch-card ph__info-card">
              <div className="ph__card-title">Your Identity</div>
              <div className="ph__identity-rows">
                {[
                  { label:'Full Name',    value: profile?.full_name    ?? '—' },
                  { label:'Fayda ID',     value: profile?.fayda_id     ?? 'Not linked', mono: true },
                  { label:'Phone',        value: profile?.phone        ?? '—' },
                  { label:'Region',       value: profile?.region       ?? '—' },
                  { label:'Woreda',       value: profile?.woreda       ?? '—' },
                ].map((row, i) => (
                  <div key={i} className="ph__identity-row">
                    <span className="ph__identity-label">{row.label}</span>
                    <span className="ph__identity-value" style={{ fontFamily: row.mono ? 'monospace' : undefined }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

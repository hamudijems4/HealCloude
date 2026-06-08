import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Save, Check, Eye, EyeOff, LogOut } from 'lucide-react';
import './SettingsPage.css';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

type Tab = 'profile' | 'notifications' | 'security' | 'system';

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'profile',       icon: <User size={16}/>,   label: 'Profile'       },
  { id: 'notifications', icon: <Bell size={16}/>,   label: 'Notifications' },
  { id: 'security',      icon: <Shield size={16}/>, label: 'Security'      },
  { id: 'system',        icon: <Globe size={16}/>,  label: 'System'        },
];

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    className={`settings__toggle ${checked ? 'settings__toggle--on' : ''}`}
    onClick={onChange}
    type="button"
    role="switch"
    aria-checked={checked}
  >
    <span className="settings__toggle-thumb"/>
  </button>
);

export const SettingsPage: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone:     profile?.phone    ?? '',
    region:    profile?.region   ?? '',
    language:  'English',
  });

  const [notifs, setNotifs] = useState({
    disease_alerts:    true,
    patient_risk:      true,
    appointment_reminders: true,
    ussd_confirmations: false,
    weekly_report:     true,
    system_updates:    false,
  });

  const [showPass, setShowPass] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });

  const [system, setSystem] = useState({
    offline_mode: false,
    fhir_auto_sync: true,
    data_export: false,
    analytics: true,
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roleLabel: Record<string, string> = {
    moh_analyst: 'MoH Analyst', clinician: 'Clinician',
    patient: 'Patient', facility_admin: 'Facility Admin', super_admin: 'Super Admin',
  };

  return (
    <div className="settings">
      <div className="settings__header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account, notifications, and platform preferences</p>
        </div>
      </div>

      <div className="settings__body">
        {/* Sidebar tabs */}
        <div className="settings__sidebar ch-card">
          <div className="settings__avatar-wrap">
            <div className="settings__avatar">{profile?.full_name?.[0] ?? 'U'}</div>
            <div>
              <div className="settings__username">{profile?.full_name ?? 'User'}</div>
              <div className="settings__userrole">{roleLabel[profile?.role ?? ''] ?? profile?.role}</div>
            </div>
          </div>
          <nav className="settings__tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`settings__tab ${tab === t.id ? 'settings__tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
          <button
            className="settings__signout"
            onClick={async () => { await signOut(); navigate('/login'); }}
          >
            <LogOut size={15}/>
            Sign Out
          </button>
        </div>

        {/* Main panel */}
        <div className="settings__panel ch-card">

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div className="settings__section">
              <h2>Profile Information</h2>
              <p>Update your personal details and identity information.</p>

              <div className="settings__form">
                <div className="settings__field">
                  <label>Full Name</label>
                  <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Your full name"/>
                </div>
                <div className="settings__field">
                  <label>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+251..."/>
                </div>
                <div className="settings__field">
                  <label>Region</label>
                  <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                    <option value="">Select region…</option>
                    {['Addis Ababa','Oromia','Amhara','Tigray','SNNPR','Somali','Afar','Benishangul-Gumuz','Gambella','Harari','Dire Dawa','Sidama'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="settings__field">
                  <label>Role</label>
                  <input value={roleLabel[profile?.role ?? ''] ?? profile?.role ?? ''} disabled className="settings__input--disabled"/>
                </div>
                <div className="settings__field">
                  <label>Fayda ID</label>
                  <input value={profile?.fayda_id ?? 'Not linked'} disabled className="settings__input--disabled" style={{ fontFamily:'monospace' }}/>
                </div>
                <div className="settings__field settings__field--full">
                  <label>Language</label>
                  <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                    <option>English</option>
                    <option>አማርኛ (Amharic)</option>
                    <option>Afaan Oromoo</option>
                    <option>Tigrinya</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <div className="settings__section">
              <h2>Notification Preferences</h2>
              <p>Choose which alerts and updates you want to receive.</p>

              <div className="settings__notifs">
                {([
                  { key:'disease_alerts',        label:'Disease Outbreak Alerts',     desc:'Critical and warning level outbreak notifications' },
                  { key:'patient_risk',           label:'Patient Risk Escalations',    desc:'When a patient score changes to High or Critical' },
                  { key:'appointment_reminders',  label:'Appointment Reminders',       desc:'Upcoming appointments across all facilities' },
                  { key:'ussd_confirmations',     label:'USSD Session Confirmations',  desc:'When a patient responds via USSD' },
                  { key:'weekly_report',          label:'Weekly Health Summary',       desc:'National wellness trends report every Monday' },
                  { key:'system_updates',         label:'System & Platform Updates',   desc:'New features and maintenance notifications' },
                ] as { key: keyof typeof notifs; label: string; desc: string }[]).map(item => (
                  <div key={item.key} className="settings__notif-row">
                    <div>
                      <div className="settings__notif-label">{item.label}</div>
                      <div className="settings__notif-desc">{item.desc}</div>
                    </div>
                    <Toggle checked={notifs[item.key]} onChange={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <div className="settings__section">
              <h2>Security</h2>
              <p>Manage your password and authentication settings.</p>

              <div className="settings__form">
                <div className="settings__field settings__field--full">
                  <label>Current Password</label>
                  <div className="settings__pass-wrap">
                    <input type={showPass ? 'text' : 'password'} value={passForm.current} onChange={e => setPassForm({...passForm,current:e.target.value})} placeholder="••••••••"/>
                    <button type="button" onClick={() => setShowPass(!showPass)} className="settings__pass-eye">{showPass ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                  </div>
                </div>
                <div className="settings__field">
                  <label>New Password</label>
                  <input type="password" value={passForm.next} onChange={e => setPassForm({...passForm,next:e.target.value})} placeholder="••••••••"/>
                </div>
                <div className="settings__field">
                  <label>Confirm New Password</label>
                  <input type="password" value={passForm.confirm} onChange={e => setPassForm({...passForm,confirm:e.target.value})} placeholder="••••••••"/>
                </div>
              </div>

              <div className="settings__security-info">
                <Shield size={16} color="#2563eb"/>
                <div>
                  <div className="settings__security-title">Two-Factor Authentication</div>
                  <div className="settings__security-sub">Protect your MoH account with 2FA via SMS to {profile?.phone ?? 'your phone'}</div>
                </div>
                <span className="ch-badge ch-badge--green">Enabled</span>
              </div>
            </div>
          )}

          {/* ── SYSTEM ── */}
          {tab === 'system' && (
            <div className="settings__section">
              <h2>System Preferences</h2>
              <p>Configure platform-level behaviour and data settings.</p>

              <div className="settings__notifs">
                {([
                  { key:'offline_mode',    label:'Offline-First Mode',      desc:'Cache data locally for use in low-connectivity areas' },
                  { key:'fhir_auto_sync',  label:'FHIR Auto-Sync',          desc:'Automatically sync FHIR records when connection is restored' },
                  { key:'data_export',     label:'Allow Data Export',        desc:'Enable CSV/PDF exports for reports and patient data' },
                  { key:'analytics',       label:'Usage Analytics',          desc:'Share anonymous usage data to improve the platform' },
                ] as { key: keyof typeof system; label: string; desc: string }[]).map(item => (
                  <div key={item.key} className="settings__notif-row">
                    <div>
                      <div className="settings__notif-label">{item.label}</div>
                      <div className="settings__notif-desc">{item.desc}</div>
                    </div>
                    <Toggle checked={system[item.key]} onChange={() => setSystem(prev => ({ ...prev, [item.key]: !prev[item.key] }))}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="settings__footer">
            <button className="ch-btn ch-btn--primary" onClick={save} disabled={saved}>
              {saved ? <><Check size={15}/> Saved</> : <><Save size={15}/> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

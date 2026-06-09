import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import './Login.css';

const EthiopianLogo = () => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#1d4ed8"/>
    <polyline points="10,34 18,34 22,22 28,46 33,34 38,34 41,28 44,40 48,34 54,34"
      fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DEMO = [
  { role: 'MoH Analyst', icon: '🏛️', sub: 'moh@cloudheal.et',    email: 'moh@cloudheal.et',    password: 'Demo@2024', color: '#2563eb' },
  { role: 'Clinician',   icon: '🏥', sub: 'clinic@cloudheal.et', email: 'clinic@cloudheal.et', password: 'Demo@2024', color: '#0891b2' },
  { role: 'Patient',     icon: '👤', sub: 'ET8823710293',         email: 'ET8823710293',         password: 'Demo@2024', color: '#059669' },
  { role: 'NGO Analyst', icon: '🌍', sub: 'ngo@cloudheal.et',    email: 'ngo@cloudheal.et',    password: 'Demo@2024', color: '#d97706' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await signIn(email, password);
    if (err) { setError(err); setLoading(false); return; }
    navigate('/dashboard');
  };

  const fill = (c: typeof DEMO[0]) => { setEmail(c.email); setPassword(c.password); setError(null); };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-header">
          <EthiopianLogo/>
          <div>
            <h2>CloudHeal</h2>
            <p>Ethiopia's Health Interoperability Platform</p>
          </div>
        </div>

        <div className="demo-section">
          <span className="demo-label">Demo Access — click any role to fill</span>
          <div className="demo-cards">
            {DEMO.map((c) => (
              <div key={c.role}
                className={`demo-card ${email === c.email ? 'demo-card--active' : ''}`}
                style={{ borderColor: `${c.color}40` }}
                onClick={() => fill(c)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fill(c)}>
                <span className="demo-card__icon">{c.icon}</span>
                <span className="demo-card__role" style={{ color: c.color }}>{c.role}</span>
                <span className="demo-card__sub">{c.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="login-divider"><span>or sign in manually</span></div>

        {error && (
          <div className="login-error">
            <AlertCircle size={15}/>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email or Fayda ID</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={17}/>
              <input type="text" className="input-field with-icon"
                placeholder="email@cloudheal.et or ET..."
                value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={17}/>
              <input type={showPass ? 'text' : 'password'}
                className="input-field with-icon with-icon-right"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required/>
              <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner"/> : <><span>Sign In</span><ArrowRight size={18}/></>}
          </button>
        </form>
        <p className="login-back"><a href="/">← Back to CloudHeal</a></p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Copy, Check, AlertCircle } from 'lucide-react';
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
  { role: 'MoH Analyst', email: 'moh@cloudheal.et',    password: 'Demo@2024', color: '#2563eb' },
  { role: 'Clinician',   email: 'clinic@cloudheal.et', password: 'Demo@2024', color: '#0891b2' },
  { role: 'Patient',     email: 'almaz@cloudheal.et',  password: 'Demo@2024', color: '#059669' },
  { role: 'NGO Analyst', email: 'ngo@cloudheal.et',    password: 'Demo@2024', color: '#d97706' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await signIn(email, password);
    if (err) { setError(err); setLoading(false); return; }
    navigate('/dashboard');
  };

  const fill = (c: typeof DEMO[0]) => { setEmail(c.email); setPassword(c.password); setError(null); };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

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
              <button key={c.role} className="demo-card" style={{ borderColor: `${c.color}30` }}
                onClick={() => fill(c)} type="button">
                <span className="demo-role" style={{ color: c.color }}>{c.role}</span>
                <div className="demo-cred-row">
                  <span className="demo-cred-val">{c.email}</span>
                  <button className="demo-copy" type="button"
                    onClick={(e) => { e.stopPropagation(); copy(c.email, c.role + 'e'); }}>
                    {copied === c.role + 'e' ? <Check size={11}/> : <Copy size={11}/>}
                  </button>
                </div>
                <div className="demo-cred-row">
                  <span className="demo-cred-val">{c.password}</span>
                  <button className="demo-copy" type="button"
                    onClick={(e) => { e.stopPropagation(); copy(c.password, c.role + 'p'); }}>
                    {copied === c.role + 'p' ? <Check size={11}/> : <Copy size={11}/>}
                  </button>
                </div>
              </button>
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
                placeholder="email@cloudheal.et"
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
          <div className="form-actions">
            <label className="checkbox-label">
              <input type="checkbox"/><span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
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

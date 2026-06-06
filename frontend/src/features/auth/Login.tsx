import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-page glass-panel">
      <div className="login-header">
        <div className="login-logo">
          <div className="logo-icon"></div>
          <h2>AgencyOS</h2>
        </div>
        <p className="login-subtitle">Welcome back. Please enter your details.</p>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input type="email" id="email" className="input-field with-icon" placeholder="admin@agency.com" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input type="password" id="password" className="input-field with-icon" placeholder="••••••••" required />
          </div>
        </div>

        <div className="form-actions">
          <label className="checkbox-label">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>

        <button type="submit" className="btn-primary login-btn">
          Sign In
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

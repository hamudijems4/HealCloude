import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout-container">
      <div className="auth-layout-bg-glow"></div>
      <div className="auth-layout-content">
        <Outlet />
      </div>
    </div>
  );
};

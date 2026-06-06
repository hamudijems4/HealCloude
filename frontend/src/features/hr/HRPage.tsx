import React from 'react';
import './HRPage.css';

export const HRPage: React.FC = () => {
  return (
    <div className="hr-page">
      <div className="page-header">
        <h1>HR Module</h1>
        <p>Employee records, attendance, payroll, hiring status, and performance evaluation</p>
      </div>
      <div className="coming-soon">
        <div className="icon">💼</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

import React from 'react';
import './WorkersPage.css';

export const WorkersPage: React.FC = () => {
  return (
    <div className="workers-page">
      <div className="page-header">
        <h1>Worker Management</h1>
        <p>Manage employees, roles, assignments, salary, performance, and branch allocation</p>
      </div>
      <div className="coming-soon">
        <div className="icon">👷</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

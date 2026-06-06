import React from 'react';
import './BranchesPage.css';

export const BranchesPage: React.FC = () => {
  return (
    <div className="branches-page">
      <div className="page-header">
        <h1>Branch Management</h1>
        <p>Manages multiple agency locations with assigned staff and financial performance tracking</p>
      </div>
      <div className="coming-soon">
        <div className="icon">🏢</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

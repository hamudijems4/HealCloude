import React from 'react';
import './PackagesPage.css';

export const PackagesPage: React.FC = () => {
  return (
    <div className="packages-page">
      <div className="page-header">
        <h1>Package Management</h1>
        <p>Create and manage service packages with pricing, duration, and services included</p>
      </div>
      <div className="coming-soon">
        <div className="icon">📦</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

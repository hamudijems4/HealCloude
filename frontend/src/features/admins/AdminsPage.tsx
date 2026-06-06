import React from 'react';
import './AdminsPage.css';

export const AdminsPage: React.FC = () => {
  return (
    <div className="admins-page">
      <div className="page-header">
        <h1>Admin Management</h1>
        <p>Role-based access control for system security and module permissions</p>
      </div>
      <div className="coming-soon">
        <div className="icon">🛡️</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

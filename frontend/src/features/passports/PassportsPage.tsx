import React, { useState } from 'react';
import { Search, Filter, Upload, AlertTriangle, FileCheck, FileSearch } from 'lucide-react';
import './PassportsPage.css';

export const PassportsPage: React.FC = () => {
  const [passports] = useState([
    { id: 'PK1234567', candidate: 'Muhammad Ali', country: 'Pakistan', expiry: 'Oct 2028', status: 'Valid', flag: '🇵🇰' },
    { id: 'PK7654321', candidate: 'Sara Khan', country: 'Pakistan', expiry: 'Jan 2026', status: 'Expiring Soon', flag: '🇵🇰' },
    { id: 'US9876543', candidate: 'John Doe', country: 'USA', expiry: 'May 2025', status: 'Expired', flag: '🇺🇸' },
    { id: 'BD4567890', candidate: 'Amina Ahmed', country: 'Bangladesh', expiry: 'Dec 2030', status: 'Valid', flag: '🇧🇩' },
    { id: 'IN3456789', candidate: 'Rajesh Kumar', country: 'India', expiry: 'Missing', status: 'Missing', flag: '🇮🇳' },
    { id: 'IN9876543', candidate: 'Suresh Patel', country: 'India', expiry: 'Feb 2029', status: 'Valid', flag: '🇮🇳' },
  ]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Valid': return <FileCheck size={16} className="text-green" />;
      case 'Expiring Soon': return <AlertTriangle size={16} className="text-orange" />;
      case 'Expired': return <AlertTriangle size={16} className="text-red" />;
      case 'Missing': return <FileSearch size={16} className="text-muted" />;
      default: return null;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Passport Vault</h1>
          <p className="page-subtitle">Securely manage and monitor candidate passport validities.</p>
        </div>
        <button className="btn-primary">
          <Upload size={18} />
          Upload Passport
        </button>
      </div>

      <div className="table-controls card">
        <div className="search-wrapper">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search by candidate name or passport number..." className="search-input" />
        </div>
        <div className="filters-wrapper">
          <button className="filter-btn">
            <Filter size={16} /> Status
          </button>
          <button className="filter-btn">
            <Filter size={16} /> Country
          </button>
        </div>
      </div>

      <div className="passports-grid">
        {passports.map((passport, i) => (
          <div key={i} className="passport-card card">
            <div className="p-card-header">
              <span className="p-flag">{passport.flag}</span>
              <div className="p-status-wrapper">
                {getStatusIcon(passport.status)}
                <span className={`p-status ${
                  passport.status === 'Valid' ? 'text-green' :
                  passport.status === 'Expired' ? 'text-red' :
                  passport.status === 'Expiring Soon' ? 'text-orange' : 'text-muted'
                }`}>{passport.status}</span>
              </div>
            </div>
            
            <div className="p-card-body">
              <h3 className="p-candidate">{passport.candidate}</h3>
              <p className="p-number">{passport.id === 'Missing' ? 'Not Uploaded' : passport.id}</p>
            </div>

            <div className="p-card-footer">
              <div className="p-expiry">
                <span className="p-label">Expiry Date</span>
                <span className="p-val">{passport.expiry}</span>
              </div>
              <button className={`btn-secondary ${passport.status === 'Missing' ? 'btn-upload-pulse' : ''}`}>
                {passport.status === 'Missing' ? 'Upload Scan' : 'View Scan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

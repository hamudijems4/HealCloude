import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, FileText, ArrowLeft, User, Briefcase, BookOpen } from 'lucide-react';
import './CandidatesPage.css';

export const CandidatesPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [candidates] = useState([
    { id: 'CAN-001', name: 'Muhammad Ali', passport: 'PK1234567', profession: 'Construction Worker', status: 'Medical Pending', date: 'May 20, 2025' },
    { id: 'CAN-002', name: 'Sara Khan', passport: 'PK7654321', profession: 'Nurse', status: 'Visa Ready', date: 'May 21, 2025' },
    { id: 'CAN-003', name: 'John Doe', passport: 'US9876543', profession: 'Engineer', status: 'Interviewing', date: 'May 22, 2025' },
    { id: 'CAN-004', name: 'Amina Ahmed', passport: 'BD4567890', profession: 'Domestic Worker', status: 'Flight Booked', date: 'May 23, 2025' },
    { id: 'CAN-005', name: 'Rajesh Kumar', passport: 'IN3456789', profession: 'Driver', status: 'Registered', date: 'May 24, 2025' },
  ]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Visa Ready': return 'badge-green';
      case 'Medical Pending': return 'badge-orange';
      case 'Interviewing': return 'badge-blue';
      case 'Flight Booked': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Candidates & Leads</h1>
          <p className="page-subtitle">Manage all registered candidates and track their application progress.</p>
        </div>
        {!isRegistering ? (
          <button className="btn-primary" onClick={() => setIsRegistering(true)}>
            <Plus size={18} />
            Add Candidate
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setIsRegistering(false)}>
            <ArrowLeft size={18} />
            Back to List
          </button>
        )}
      </div>

      {isRegistering ? (
        <div className="registration-card card">
          <div className="registration-header">
            <h3>New Candidate Registration</h3>
            <p>Enter the candidate's personal and professional information.</p>
          </div>
          
          <form className="registration-form" onSubmit={(e) => { e.preventDefault(); setIsRegistering(false); }}>
            {/* Section 1: Personal Info */}
            <div className="form-section">
              <h4 className="section-title"><User size={16} /> Personal Information</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="input-field" placeholder="e.g. Ahmed" required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="input-field" placeholder="e.g. Khan" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="input-field" placeholder="ahmed@example.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" className="input-field" placeholder="+92 300 1234567" required />
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <select className="input-field" required>
                    <option value="">Select Nationality</option>
                    <option value="PK">Pakistan</option>
                    <option value="IN">India</option>
                    <option value="BD">Bangladesh</option>
                    <option value="NP">Nepal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" className="input-field" required />
                </div>
              </div>
            </div>

            {/* Section 2: Passport Info */}
            <div className="form-section">
              <h4 className="section-title"><BookOpen size={16} /> Passport Details</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Passport Number</label>
                  <input type="text" className="input-field" placeholder="e.g. PK1234567" required />
                </div>
                <div className="form-group">
                  <label>Issue Date</label>
                  <input type="date" className="input-field" required />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="date" className="input-field" required />
                </div>
              </div>
            </div>

            {/* Section 3: Professional Info */}
            <div className="form-section">
              <h4 className="section-title"><Briefcase size={16} /> Professional Details</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Target Profession</label>
                  <select className="input-field" required>
                    <option value="">Select Profession</option>
                    <option value="driver">Driver</option>
                    <option value="construction">Construction Worker</option>
                    <option value="domestic">Domestic Worker</option>
                    <option value="nurse">Nurse</option>
                    <option value="engineer">Engineer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input type="number" min="0" className="input-field" placeholder="e.g. 5" required />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsRegistering(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Register Candidate</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="table-controls card">
            <div className="search-wrapper">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Search by name, passport, or ID..." className="search-input" />
            </div>
            <div className="filters-wrapper">
              <button className="filter-btn">
                <Filter size={16} /> Status
              </button>
              <button className="filter-btn">
                <Filter size={16} /> Profession
              </button>
            </div>
          </div>

          <div className="table-card card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate Name</th>
              <th>Passport No.</th>
              <th>Profession</th>
              <th>Registration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id}>
                <td className="text-secondary font-medium">{candidate.id}</td>
                <td>
                  <div className="table-user">
                    <div className="avatar-sm">{candidate.name.charAt(0)}</div>
                    <span className="font-semibold">{candidate.name}</span>
                  </div>
                </td>
                <td>{candidate.passport}</td>
                <td>{candidate.profession}</td>
                <td className="text-secondary">{candidate.date}</td>
                <td>
                  <span className={`badge ${getStatusBadge(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-icon" title="View Profile"><FileText size={18} /></button>
                    <button className="action-icon"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
};

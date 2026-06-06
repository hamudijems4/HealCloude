import React, { useState } from 'react';
import { Search, Filter, Plus, Briefcase, Users, Building, ArrowRight } from 'lucide-react';
import './JobsPage.css';

export const JobsPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>('JOB-101');

  const jobs = [
    { id: 'JOB-101', title: 'Heavy Duty Driver', company: 'Al Futtaim Logistics', country: 'UAE', req: 15, filled: 8 },
    { id: 'JOB-102', title: 'Construction Worker', company: 'Saudi Binladin Group', country: 'Saudi Arabia', req: 50, filled: 12 },
    { id: 'JOB-103', title: 'Registered Nurse', company: 'Hamad Medical', country: 'Qatar', req: 10, filled: 9 },
  ];

  const matchingCandidates = [
    { id: 'CAN-005', name: 'Rajesh Kumar', exp: '8 Years', status: 'Available', match: '95%' },
    { id: 'CAN-012', name: 'Ali Hassan', exp: '5 Years', status: 'Interviewing', match: '88%' },
    { id: 'CAN-018', name: 'Zayed Khan', exp: '10 Years', status: 'Available', match: '85%' },
  ];

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Job Orders & Matching</h1>
          <p className="page-subtitle">Manage foreign job orders and match them with registered candidates.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          New Job Order
        </button>
      </div>

      <div className="jobs-split-layout">
        {/* Left Pane: Job Orders */}
        <div className="jobs-pane card">
          <div className="pane-header">
            <h3>Active Job Orders</h3>
            <div className="search-wrapper pane-search">
              <Search size={16} className="text-muted" />
              <input type="text" placeholder="Search jobs..." className="search-input" />
            </div>
          </div>
          <div className="jobs-list">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className={`job-card ${selectedJob === job.id ? 'active' : ''}`}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className="job-c-header">
                  <span className="badge badge-gray">{job.country}</span>
                  <span className="text-secondary text-sm">{job.id}</span>
                </div>
                <h4 className="job-title">{job.title}</h4>
                <div className="job-company"><Building size={14} /> {job.company}</div>
                <div className="job-progress">
                  <div className="progress-labels">
                    <span>Filled</span>
                    <span>{job.filled} / {job.req}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(job.filled / job.req) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Matching Candidates */}
        <div className="candidates-pane card">
          {selectedJob ? (
            <>
              <div className="pane-header">
                <h3>Matching Candidates</h3>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <Filter size={14} /> Refine Match
                </button>
              </div>
              <div className="match-banner bg-blue-light">
                <Briefcase size={20} className="text-blue" />
                <div>
                  <h4>Heavy Duty Driver</h4>
                  <p>Al Futtaim Logistics - UAE</p>
                </div>
              </div>
              <div className="matching-list">
                {matchingCandidates.map(can => (
                  <div key={can.id} className="match-card">
                    <div className="match-info">
                      <div className="avatar-sm">{can.name.charAt(0)}</div>
                      <div>
                        <h4>{can.name}</h4>
                        <p>{can.exp} Experience • {can.status}</p>
                      </div>
                    </div>
                    <div className="match-actions">
                      <div className="match-score">{can.match} Match</div>
                      <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        Shortlist <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Users size={48} className="text-muted" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3>Select a Job Order</h3>
              <p>Click on a job order from the list to see matching candidates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, Plus, Users, UserPlus, MoreVertical } from 'lucide-react';
import './GroupsPage.css';

export const GroupsPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>('GRP-01');

  const groups = [
    { id: 'GRP-01', name: 'Ramadan Group A', leader: 'Ahmed Ali', count: 45, max: 50, status: 'Active' },
    { id: 'GRP-02', name: 'Hajj VIP 2025', leader: 'Omar Farooq', count: 20, max: 20, status: 'Full' },
    { id: 'GRP-03', name: 'Weekend Umrah', leader: 'Tariq Jameel', count: 12, max: 30, status: 'Forming' },
  ];

  const members = [
    { id: 'CAN-001', name: 'Muhammad Ali', passport: 'PK1234567', visa: 'Ready', flight: 'Ticketed' },
    { id: 'CAN-002', name: 'Sara Khan', passport: 'PK7654321', visa: 'Processing', flight: 'Pending' },
    { id: 'CAN-003', name: 'Zayed Khan', passport: 'US9876543', visa: 'Ready', flight: 'Ticketed' },
  ];

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Group Management</h1>
          <p className="page-subtitle">Organize candidates into travel groups and assign group leaders.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Create Group
        </button>
      </div>

      <div className="groups-split-layout">
        {/* Left Pane: Groups */}
        <div className="groups-pane card">
          <div className="pane-header">
            <h3>Travel Groups</h3>
            <div className="search-wrapper pane-search">
              <Search size={16} className="text-muted" />
              <input type="text" placeholder="Search groups..." className="search-input" />
            </div>
          </div>
          <div className="groups-list">
            {groups.map(group => (
              <div 
                key={group.id} 
                className={`group-card ${selectedGroup === group.id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group.id)}
              >
                <div className="group-c-header">
                  <span className={`badge ${group.status === 'Full' ? 'badge-green' : group.status === 'Active' ? 'badge-blue' : 'badge-orange'}`}>
                    {group.status}
                  </span>
                  <span className="text-secondary text-sm">{group.id}</span>
                </div>
                <h4 className="group-title">{group.name}</h4>
                <p className="group-leader">Leader: {group.leader}</p>
                <div className="group-stats">
                  <Users size={14} className="text-muted" />
                  <span className="text-sm font-medium">{group.count} / {group.max} Members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Group Members */}
        <div className="members-pane card">
          {selectedGroup ? (
            <>
              <div className="pane-header">
                <h3>Group Members</h3>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <UserPlus size={14} /> Add Member
                </button>
              </div>
              <div className="members-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Passport</th>
                      <th>Visa Status</th>
                      <th>Flight</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id}>
                        <td>
                          <div className="table-user">
                            <div className="avatar-sm">{member.name.charAt(0)}</div>
                            <span className="font-semibold">{member.name}</span>
                          </div>
                        </td>
                        <td>{member.passport}</td>
                        <td>
                          <span className={`badge ${member.visa === 'Ready' ? 'badge-green' : 'badge-orange'}`}>
                            {member.visa}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${member.flight === 'Ticketed' ? 'badge-blue' : 'badge-gray'}`}>
                            {member.flight}
                          </span>
                        </td>
                        <td>
                          <button className="action-icon"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Users size={48} className="text-muted" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3>Select a Group</h3>
              <p>Click on a group to view and manage its members.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

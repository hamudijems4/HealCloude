import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Plane } from 'lucide-react';
import './FlightsPage.css';

export const FlightsPage: React.FC = () => {
  const [flights] = useState([
    { id: 'FL-001', candidate: 'Muhammad Ali', pnr: 'XYZ123', airline: 'Saudia Airlines', departure: 'May 25, 2025 10:30 AM', destination: 'Jeddah (JED)', status: 'Ticketed' },
    { id: 'FL-002', candidate: 'Sara Khan', pnr: 'ABC987', airline: 'Emirates', departure: 'May 27, 2025 08:00 AM', destination: 'Dubai (DXB)', status: 'Boarding' },
    { id: 'FL-003', candidate: 'John Doe', pnr: 'QWE456', airline: 'Qatar Airways', departure: 'May 28, 2025 11:15 PM', destination: 'Doha (DOH)', status: 'Arrived' },
    { id: 'FL-004', candidate: 'Amina Ahmed', pnr: 'RTY654', airline: 'Air Arabia', departure: 'May 30, 2025 02:45 AM', destination: 'Sharjah (SHJ)', status: 'Pending Booking' },
  ]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Arrived': return 'badge-green';
      case 'Boarding': return 'badge-blue';
      case 'Ticketed': return 'badge-purple';
      case 'Pending Booking': return 'badge-orange';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Flights & Departures</h1>
          <p className="page-subtitle">Track outbound candidates and flight itineraries.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Book Flight
        </button>
      </div>

      <div className="table-controls card">
        <div className="search-wrapper">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search by PNR, candidate, or airline..." className="search-input" />
        </div>
        <div className="filters-wrapper">
          <button className="filter-btn">
            <Filter size={16} /> Status
          </button>
          <button className="filter-btn">
            <Filter size={16} /> Date
          </button>
        </div>
      </div>

      <div className="table-card card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Candidate</th>
              <th>Airline & PNR</th>
              <th>Departure Time</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.id}>
                <td className="text-secondary font-medium">{flight.id}</td>
                <td>
                  <span className="font-semibold">{flight.candidate}</span>
                </td>
                <td>
                  <div className="flight-pnr-info">
                    <span className="font-semibold">{flight.airline}</span>
                    <span className="text-secondary text-sm">PNR: {flight.pnr}</span>
                  </div>
                </td>
                <td>{flight.departure}</td>
                <td className="font-medium">{flight.destination}</td>
                <td>
                  <span className={`badge ${getStatusBadge(flight.status)}`}>
                    {flight.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-icon" title="View Ticket"><Plane size={18} /></button>
                    <button className="action-icon"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

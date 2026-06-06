import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Star, Building, MoreVertical } from 'lucide-react';
import './HotelsPage.css';

export const HotelsPage: React.FC = () => {
  const [hotels] = useState([
    { id: 'HTL-01', name: 'Swissôtel Makkah', city: 'Makkah', stars: 5, distance: '100m to Haram', rooms: 45, status: 'Active' },
    { id: 'HTL-02', name: 'Pullman Zamzam', city: 'Madinah', stars: 5, distance: '150m to Haram', rooms: 30, status: 'Active' },
    { id: 'HTL-03', name: 'Anwar Al Madinah', city: 'Madinah', stars: 4, distance: '300m to Haram', rooms: 20, status: 'Active' },
    { id: 'HTL-04', name: 'Anjum Hotel', city: 'Makkah', stars: 4, distance: '400m to Haram', rooms: 60, status: 'Contract Pending' },
  ]);

  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={14} className="text-orange fill-orange" />
    ));
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Hotel Directory</h1>
          <p className="page-subtitle">Manage partner hotels and room allotments in Makkah and Madinah.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Add Hotel
        </button>
      </div>

      <div className="table-controls card">
        <div className="search-wrapper">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search hotels..." className="search-input" />
        </div>
        <div className="filters-wrapper">
          <button className="filter-btn">
            <Filter size={16} /> City
          </button>
          <button className="filter-btn">
            <Filter size={16} /> Stars
          </button>
        </div>
      </div>

      <div className="table-card card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hotel Name</th>
              <th>City</th>
              <th>Rating</th>
              <th>Location</th>
              <th>Available Rooms</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(hotel => (
              <tr key={hotel.id}>
                <td>
                  <div className="hotel-info-cell">
                    <div className="hotel-icon"><Building size={16} /></div>
                    <span className="font-semibold">{hotel.name}</span>
                  </div>
                </td>
                <td className="font-medium">{hotel.city}</td>
                <td>
                  <div className="flex-center gap-1">
                    {renderStars(hotel.stars)}
                  </div>
                </td>
                <td>
                  <div className="flex-center gap-1 text-secondary">
                    <MapPin size={14} /> {hotel.distance}
                  </div>
                </td>
                <td className="font-semibold">{hotel.rooms} Rooms</td>
                <td>
                  <span className={`badge ${hotel.status === 'Active' ? 'badge-green' : 'badge-orange'}`}>
                    {hotel.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
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

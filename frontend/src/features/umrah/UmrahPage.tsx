import React, { useState } from 'react';
import { Search, Plus, MapPin, Users, ArrowRight } from 'lucide-react';
import './UmrahPage.css';

export const UmrahPage: React.FC = () => {
  const [packages] = useState([
    { id: 'PKG-01', title: 'Premium Ramadan Package', days: 15, makkahHotel: 'Swissôtel Makkah (5★)', madinahHotel: 'Pullman Zamzam (5★)', price: '$2,400', capacity: 50, booked: 45, image: 'bg-primary' },
    { id: 'PKG-02', title: 'Economy Family Package', days: 21, makkahHotel: 'Anjum Hotel (4★)', madinahHotel: 'Anwar Al Madinah (4★)', price: '$1,800', capacity: 100, booked: 62, image: 'bg-blue' },
    { id: 'PKG-03', title: 'Express VIP Weekend', days: 7, makkahHotel: 'Fairmont Makkah (5★)', madinahHotel: 'Dar Al Taqwa (5★)', price: '$3,100', capacity: 20, booked: 8, image: 'bg-orange' },
  ]);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Umrah Packages</h1>
          <p className="page-subtitle">Design, price, and manage Umrah travel itineraries.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Create Package
        </button>
      </div>

      <div className="table-controls card">
        <div className="search-wrapper">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search packages by name or ID..." className="search-input" />
        </div>
      </div>

      <div className="packages-grid">
        {packages.map(pkg => (
          <div key={pkg.id} className="package-card card">
            <div className={`pkg-header ${pkg.image}`}>
              <div className="pkg-badge">{pkg.days} Days</div>
              <h3 className="pkg-title">{pkg.title}</h3>
            </div>
            
            <div className="pkg-body">
              <div className="pkg-detail-row">
                <MapPin size={16} className="text-muted" />
                <div>
                  <p className="pkg-label">Makkah Stay</p>
                  <p className="pkg-val">{pkg.makkahHotel}</p>
                </div>
              </div>
              <div className="pkg-detail-row">
                <MapPin size={16} className="text-muted" />
                <div>
                  <p className="pkg-label">Madinah Stay</p>
                  <p className="pkg-val">{pkg.madinahHotel}</p>
                </div>
              </div>
              <div className="pkg-progress-container">
                <div className="pkg-labels">
                  <span className="flex-center gap-1"><Users size={14}/> {pkg.booked} / {pkg.capacity} Booked</span>
                  <span className="pkg-perc">{Math.round((pkg.booked / pkg.capacity) * 100)}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${(pkg.booked / pkg.capacity) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pkg-footer">
              <div className="pkg-price">
                <span>Starting from</span>
                <h4>{pkg.price}</h4>
              </div>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Manage <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

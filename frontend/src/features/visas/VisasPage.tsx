import React, { useState } from 'react';
import { Plus, MoreHorizontal, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './VisasPage.css';

export const VisasPage: React.FC = () => {
  const [columns] = useState([
    {
      id: 'pending',
      title: 'Pending Review',
      count: 3,
      color: 'orange',
      icon: AlertCircle,
      cards: [
        { id: 'V-101', candidate: 'Rajesh Kumar', country: 'Saudi Arabia', passport: 'IN3456789', date: 'May 22' },
        { id: 'V-102', candidate: 'Amina Ahmed', country: 'UAE', passport: 'BD4567890', date: 'May 23' },
        { id: 'V-103', candidate: 'Suresh Patel', country: 'Qatar', passport: 'IN9876543', date: 'May 24' },
      ]
    },
    {
      id: 'processing',
      title: 'Processing',
      count: 2,
      color: 'blue',
      icon: Clock,
      cards: [
        { id: 'V-104', candidate: 'Muhammad Ali', country: 'Saudi Arabia', passport: 'PK1234567', date: 'May 18' },
        { id: 'V-105', candidate: 'John Doe', country: 'USA', passport: 'US9876543', date: 'May 20' },
      ]
    },
    {
      id: 'approved',
      title: 'Approved',
      count: 1,
      color: 'green',
      icon: CheckCircle,
      cards: [
        { id: 'V-106', candidate: 'Sara Khan', country: 'UK', passport: 'PK7654321', date: 'May 15' },
      ]
    }
  ]);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Visa Management</h1>
          <p className="page-subtitle">Track and manage visa applications across all stages.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          New Application
        </button>
      </div>

      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.id} className="kanban-column">
            <div className={`kanban-col-header border-${col.color}`}>
              <div className="col-title-wrapper">
                <col.icon size={18} className={`text-${col.color}`} />
                <h3>{col.title}</h3>
                <span className="col-count">{col.count}</span>
              </div>
              <button className="action-icon"><MoreHorizontal size={18} /></button>
            </div>

            <div className="kanban-cards">
              {col.cards.map(card => (
                <div key={card.id} className="kanban-card card">
                  <div className="k-card-header">
                    <span className="k-card-id">{card.id}</span>
                    <span className="k-card-date">{card.date}</span>
                  </div>
                  <div className="k-card-body">
                    <h4 className="k-card-title">{card.candidate}</h4>
                    <p className="k-card-desc">Passport: {card.passport}</p>
                  </div>
                  <div className="k-card-footer">
                    <span className={`badge badge-gray`}>{card.country}</span>
                    <button className="k-card-btn" title="View Documents">
                      <FileText size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="add-card-btn">
                <Plus size={16} /> Add Application
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

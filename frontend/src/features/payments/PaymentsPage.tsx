import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Download, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import './PaymentsPage.css';

export const PaymentsPage: React.FC = () => {
  const [payments] = useState([
    { id: 'INV-001', candidate: 'Muhammad Ali', type: 'Service Fee', amount: '$500', date: 'May 20, 2025', status: 'Paid' },
    { id: 'INV-002', candidate: 'Sara Khan', type: 'Visa Fee', amount: '$150', date: 'May 21, 2025', status: 'Pending' },
    { id: 'INV-003', candidate: 'John Doe', type: 'Medical Fee', amount: '$75', date: 'May 22, 2025', status: 'Overdue' },
    { id: 'INV-004', candidate: 'Amina Ahmed', type: 'Flight Ticket', amount: '$450', date: 'May 23, 2025', status: 'Paid' },
    { id: 'INV-005', candidate: 'Rajesh Kumar', type: 'Service Fee', amount: '$500', date: 'May 24, 2025', status: 'Pending' },
  ]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Paid': return 'badge-green';
      case 'Pending': return 'badge-orange';
      case 'Overdue': return 'badge-red';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Payments & Finance</h1>
          <p className="page-subtitle">Manage service fees, generate receipts, and track revenue.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="finance-stats">
        <div className="stat-card card">
          <div className="s-icon bg-green-light text-green"><DollarSign size={24} /></div>
          <div className="s-info">
            <p>Total Revenue</p>
            <h3>$45,250</h3>
          </div>
        </div>
        <div className="stat-card card">
          <div className="s-icon bg-orange-light text-orange"><AlertCircle size={24} /></div>
          <div className="s-info">
            <p>Outstanding Dues</p>
            <h3>$4,150</h3>
          </div>
        </div>
        <div className="stat-card card">
          <div className="s-icon bg-blue-light text-blue"><TrendingUp size={24} /></div>
          <div className="s-info">
            <p>This Month</p>
            <h3>$12,400</h3>
          </div>
        </div>
      </div>

      <div className="table-controls card">
        <div className="search-wrapper">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search by Invoice ID or Candidate..." className="search-input" />
        </div>
        <div className="filters-wrapper">
          <button className="filter-btn">
            <Filter size={16} /> Status
          </button>
          <button className="filter-btn">
            <Filter size={16} /> Type
          </button>
        </div>
      </div>

      <div className="table-card card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Candidate</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td className="text-secondary font-medium">{payment.id}</td>
                <td><span className="font-semibold">{payment.candidate}</span></td>
                <td>{payment.type}</td>
                <td className="font-semibold">{payment.amount}</td>
                <td className="text-secondary">{payment.date}</td>
                <td>
                  <span className={`badge ${getStatusBadge(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-icon" title="View Invoice"><FileText size={18} /></button>
                    <button className="action-icon" title="Download Receipt"><Download size={18} /></button>
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

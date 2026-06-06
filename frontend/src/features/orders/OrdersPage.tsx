import React from 'react';
import './OrdersPage.css';

export const OrdersPage: React.FC = () => {
  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Sales & Orders</h1>
        <p>Handles purchases, assigns packages, tracks payments, generates invoices, and calculates profit per order</p>
      </div>
      <div className="coming-soon">
        <div className="icon">🛒</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  );
};

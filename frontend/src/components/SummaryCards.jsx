import React from 'react';
import { formatCurrency } from '../utils/formatters';
import '../styles/SummaryCards.css';

const SummaryCards = ({ summary }) => {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total units sold</span>
          <span className="info-icon" title="Total quantity of products sold">ℹ️</span>
        </div>
        <div className="summary-card-value">{summary.totalUnitsSold || 0}</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total Amount</span>
          <span className="info-icon" title="Total revenue from sales">ℹ️</span>
        </div>
        <div className="summary-card-value">{formatCurrency(summary.totalAmount || 0)}</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total Discount</span>
          <span className="info-icon" title="Total discount applied">ℹ️</span>
        </div>
        <div className="summary-card-value">{formatCurrency(summary.totalDiscount || 0)}</div>
      </div>
    </div>
  );
};

export default SummaryCards;


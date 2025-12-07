import React from 'react';
import { formatCurrency, formatDate, formatPhoneNumber } from '../utils/formatters';
import '../styles/TransactionTable.css';

const TransactionTable = ({ transactions, loading }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">No transactions found</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id || index}>
              <td>{transaction.transactionId || '-'}</td>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.customerId || '-'}</td>
              <td>{transaction.customerName || '-'}</td>
              <td>
                <div className="phone-cell">
                  <span>{transaction.phoneNumber ? `+91 ${transaction.phoneNumber}` : '-'}</span>
                  {transaction.phoneNumber && (
                    <button
                      className="copy-button"
                      onClick={() => copyToClipboard(transaction.phoneNumber)}
                      title="Copy phone number"
                    >
                      📋
                    </button>
                  )}
                </div>
              </td>
              <td>{transaction.gender || '-'}</td>
              <td>{transaction.age || '-'}</td>
              <td>{transaction.productCategory || '-'}</td>
              <td>{String(transaction.quantity || 0).padStart(2, '0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;


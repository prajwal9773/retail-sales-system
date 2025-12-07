import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="vault-section">
          <div className="vault-logo">V</div>
          <div className="vault-info">
            <div className="vault-title">Vault</div>
            <div className="user-name">Anurag Yadav</div>
          </div>
          <div className="dropdown-arrow">▼</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-item">Dashboard</div>
        <div className="nav-item">Nexus</div>
        <div className="nav-item">Intake</div>
        
        <div className="nav-section">
          <div className="nav-item">Services</div>
          <div className="nav-subitems">
            <div className="nav-subitem">
              <span className="subitem-icon">○</span>
              <span>Pre-active</span>
            </div>
            <div className="nav-subitem active">
              <span className="subitem-icon">✓</span>
              <span>Active</span>
            </div>
            <div className="nav-subitem">
              <span className="subitem-icon">○</span>
              <span>Blocked</span>
            </div>
            <div className="nav-subitem active">
              <span className="subitem-icon">✓</span>
              <span>Closed</span>
            </div>
          </div>
        </div>
        
        <div className="nav-section">
          <div className="nav-item">Invoices</div>
          <div className="nav-subitems">
            <div className="nav-subitem active">Proforma Invoices</div>
            <div className="nav-subitem">Final Invoices</div>
          </div>
        </div>
      </nav>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? '◀' : '▶'}
      </button>
    </div>
  );
};

export default Sidebar;


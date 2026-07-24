import React from 'react';
import { IconHome, IconDoc, IconHelp, IconX } from './icons.jsx';

export function NavDrawer({ open, onClose, view, navigate }) {
  const go = v => { navigate(v); onClose(); };

  const navItems = [
    { id: "home", label: "Home", icon: <IconHome />, badge: null },
    { id: "sow", label: "Partner SOW", icon: <IconDoc />, badge: "SOW" },
    { id: "cr", label: "Partner CR", icon: <IconDoc />, badge: "CR" },
    { id: "cr-from-sow", label: "Partner CR from SOW", icon: <IconDoc />, badge: "Smart" },
    { id: "cr-from-cr", label: "Partner CR from CR", icon: <IconDoc />, badge: "Chain" },
    { id: "help", label: "How to Use", icon: <IconHelp />, badge: null }
  ];

  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo-text">Acquia Doc Builder</div>
          <button className="drawer-close" onClick={onClose}><IconX /></button>
        </div>
        <div className="drawer-body">
          <div className="drawer-section">
            <div className="drawer-label">Navigation</div>
            {navItems.map(item => (
              <div key={item.id} className={`drawer-item ${view === item.id ? "active" : ""}`} onClick={() => go(item.id)}>
                <div className="drawer-item-icon">{item.icon}</div>
                {item.label}
                {item.badge && <span className="drawer-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
          <div className="drawer-section">
            <div className="drawer-label">Document Types</div>
            <div style={{ padding: "0 16px", fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
              <div style={{ marginBottom: 12 }}><span style={{ color: "var(--text)", fontWeight: 700 }}>Partner SOW</span> — Continuous Delivery Statement of Work</div>
              <div style={{ marginBottom: 12 }}><span style={{ color: "var(--text)", fontWeight: 700 }}>Partner Change Request</span> — Standalone Change Request</div>
              <div style={{ marginBottom: 12 }}><span style={{ color: "var(--text)", fontWeight: 700 }}>Partner CR from SOW</span> — Extend a project using SOW data</div>
              <div><span style={{ color: "var(--text)", fontWeight: 700 }}>Partner CR from CR</span> — Chain follow-on extensions</div>
            </div>
          </div>
        </div>
        <div className="drawer-footer">Acquia Inc. · Partner Doc Generator</div>
      </div>
    </>
  );
}

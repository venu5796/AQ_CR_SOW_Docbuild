import React from 'react';

const FLOW_META = {
  sow:          { label: 'SOW · Velir · FY26 Eng Block 3',        startLabel: 'Start a real SOW' },
  cr:           { label: 'CR · Velir · FY26 Block 3 extension',   startLabel: 'Start a real CR' },
  'cr-from-sow':{ label: 'CR from SOW · Velir · FY26 Block 3 → CR', startLabel: 'Start a real CR from SOW' },
  'cr-from-cr': { label: 'CR from CR · Velir · Block 3 → Block 4', startLabel: 'Start a real CR chain' },
};

export function DemoBanner({ flowType, onExit, onStartReal }) {
  return (
    <div className="demo-banner">
      <div className="demo-banner-icon">⚡</div>
      <div className="demo-banner-text">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <strong>You're in sample mode</strong>
          <span className="demo-banner-engagement"> · {FLOW_META[flowType]?.label || 'Sample data'}</span>
        </div>
        <small>fields are editable · nothing is saved · Generate is disabled</small>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn btn-secondary" onClick={onExit}
          style={{ height: 28, fontSize: 12, padding: '0 12px' }}>
          Exit demo
        </button>
        <button className="btn btn-primary" onClick={onStartReal}
          style={{ height: 28, fontSize: 12, padding: '0 14px' }}>
          Looks good? {FLOW_META[flowType]?.startLabel || 'Start real'} →
        </button>
      </div>
    </div>
  );
}

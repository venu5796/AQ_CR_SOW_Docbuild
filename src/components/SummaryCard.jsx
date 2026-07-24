import React from 'react';
import { Card } from './ui/card.jsx';

export function SummaryCard({ title = 'Document summary', items, style }) {
  return (
    <Card style={style}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text2)' }}>{title}</p>
      </div>
      <div>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 18px', gap: '16px', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: '12px', color: 'var(--text2)', flexShrink: 0 }}>{item.label}</span>
            <span style={{ fontSize: '14px', fontWeight: item.value && item.value !== '—' ? 600 : 400, color: item.value && item.value !== '—' ? 'var(--text)' : 'var(--text3)', textAlign: 'right' }}>
              {item.value || '—'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

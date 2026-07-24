import React from 'react';
import { countWorkingDays } from '../utils/dates.js';

export function PeriodEditor({ periods, onChange, label, accentColor }) {
  var up = function(pi, f, v) {
    var ps = periods.slice();
    ps[pi] = Object.assign({}, ps[pi]);
    ps[pi][f] = v;
    onChange(ps);
  };
  var add = function() {
    onChange(periods.concat([{ startDate: '', endDate: '', hoursPerDay: '8' }]));
  };
  var rem = function(pi) {
    onChange(periods.filter(function(_, j) { return j !== pi; }));
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: accentColor || 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      {periods.map(function(p, pi) {
        var days = countWorkingDays(p.startDate, p.endDate);
        var isCust = p.hoursPerDay !== '8' && p.hoursPerDay !== '4';
        var selVal = isCust ? 'custom' : (p.hoursPerDay || '8');
        return (
          <div key={pi} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-end', marginBottom: 6, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 32px 10px 10px', position: 'relative' }}>
            {periods.length > 1 && (
              <button
                onClick={function() { rem(pi); }}
                style={{ position: 'absolute', top: 5, right: 5, background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}
              >×</button>
            )}
            <div className="field" style={{ flex: '1 1 105px' }}>
              <label>Start</label>
              <input type="date" value={p.startDate} onChange={function(e) { up(pi, 'startDate', e.target.value); }} />
            </div>
            <div className="field" style={{ flex: '1 1 105px' }}>
              <label>End</label>
              <input type="date" value={p.endDate} onChange={function(e) { up(pi, 'endDate', e.target.value); }} />
            </div>
            <div className="field" style={{ flex: '0 0 162px' }}>
              <label>Hours / Day</label>
              <select
                value={selVal}
                onChange={function(e) { up(pi, 'hoursPerDay', e.target.value === 'custom' ? 'custom' : e.target.value); }}
                style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', fontSize: 13, color: 'var(--text)' }}
              >
                <option value="8">8 hrs/day (full-time)</option>
                <option value="4">4 hrs/day (half-time)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {(isCust || selVal === 'custom') && (
              <div className="field" style={{ flex: '0 0 80px' }}>
                <label>Custom hrs</label>
                <input
                  type="number"
                  value={p.hoursPerDay === 'custom' ? '' : p.hoursPerDay}
                  onChange={function(e) { up(pi, 'hoursPerDay', e.target.value); }}
                  min="0" max="24" step="0.5"
                  placeholder="hrs"
                />
              </div>
            )}
            <div className="field" style={{ flex: '0 0 56px' }}>
              <label>Holidays</label>
              <input
                type="number"
                value={p.holidays || ''}
                onChange={function(e) { up(pi, 'holidays', e.target.value); }}
                min="0"
                placeholder="0"
              />
            </div>
            {p.startDate && p.endDate && (
              <div style={{ fontSize: 11, color: accentColor || 'var(--text3)', alignSelf: 'flex-end', paddingBottom: 8, whiteSpace: 'nowrap' }}>
                {Math.max(0, days - (parseInt(p.holidays) || 0))} days × {(p.hoursPerDay === 'custom' ? '?' : p.hoursPerDay) || 8} = <strong>{p.hoursPerDay === 'custom' ? '?' : Math.max(0, (days - (parseInt(p.holidays) || 0)) * (parseFloat(p.hoursPerDay) || 0))} hrs</strong>
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={add}
        style={{ background: 'var(--accent-s)', border: '1px dashed var(--accent-t)', color: 'var(--accent)', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', marginTop: 2 }}
      >+ Add Period</button>
    </div>
  );
}

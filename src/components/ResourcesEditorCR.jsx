import React from 'react';
import { calcCRSowHours, calcCRCrHours, calcCRTotalHours, calcCRBudget } from '../utils/dates.js';
import { IconX, IconPlus } from './icons.jsx';
import { PeriodEditor } from './PeriodEditor.jsx';

export function ResourcesEditorCR({ resources, onChange, crStart, crEnd, showSowPeriods = false }) {
  var upRes = function(i, f, v) {
    var r = resources.slice();
    r[i] = Object.assign({}, r[i]);
    r[i][f] = v;
    onChange(r);
  };
  var upSow = function(i, ps) {
    var r = resources.slice();
    r[i] = Object.assign({}, r[i], { sowPeriods: ps });
    onChange(r);
  };
  var upCr = function(i, ps) {
    var r = resources.slice();
    r[i] = Object.assign({}, r[i], { crPeriods: ps });
    onChange(r);
  };
  var addRes = function() {
    onChange(resources.concat([{
      resource: '', name: '', rate: '', sowHours: '', noExtension: false,
      sowPeriods: [{ startDate: '', endDate: '', hoursPerDay: '8', holidays: '0' }],
      crPeriods: [{ startDate: crStart || '', endDate: crEnd || '', hoursPerDay: '8', holidays: '0' }]
    }]));
  };
  var remRes = function(i) {
    onChange(resources.filter(function(_, j) { return j !== i; }));
  };

  return (
    <div>
      {resources.map(function(r, i) {
        var sowH = calcCRSowHours(r);
        var crH  = calcCRCrHours(r);
        var totH = calcCRTotalHours(r);
        var bud  = calcCRBudget(r);
        return (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px', marginBottom: 16, position: 'relative', opacity: r.noExtension ? 0.75 : 1, boxShadow: 'var(--shadow)' }}>
            {/* Header row: remove + no-extension toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: r.noExtension ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', userSelect: 'none', fontWeight: r.noExtension ? 600 : 400 }}>
                <input
                  type="checkbox"
                  checked={!!r.noExtension}
                  onChange={function(e) { upRes(i, 'noExtension', e.target.checked); }}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                Not extending
              </label>
              {resources.length > 1 && (
                <button className="resource-remove" onClick={function() { remRes(i); }} style={{ position: 'static' }}>
                  <IconX />
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div className="field">
                <label>Resource / Role</label>
                <input value={r.resource || ''} onChange={function(e) { upRes(i, 'resource', e.target.value); }} placeholder="Drupal Developer" />
              </div>
              <div className="field">
                <label>Name</label>
                <input value={r.name || ''} onChange={function(e) { upRes(i, 'name', e.target.value); }} placeholder="John Doe" />
              </div>
              <div className="field">
                <label>Hourly Rate ($)</label>
                <input type="number" value={r.rate || ''} onChange={function(e) { upRes(i, 'rate', e.target.value); }} placeholder="150" />
              </div>
              <div className="field">
                <label>{showSowPeriods ? 'SOW Hours (override)' : 'SOW Hours'}</label>
                <input type="number" value={r.sowHours || ''} onChange={function(e) { upRes(i, 'sowHours', e.target.value); }} placeholder={showSowPeriods ? 'auto from periods' : '0'} min="0" step="0.5" />
              </div>
            </div>

            {showSowPeriods && (
              <PeriodEditor
                periods={r.sowPeriods || []}
                onChange={function(ps) { upSow(i, ps); }}
                label="SOW Periods (original)"
                accentColor="var(--success)"
              />
            )}

            {r.noExtension ? (
              <div style={{ fontSize: 12, color: 'var(--accent)', background: 'var(--accent-s)', border: '1px solid var(--accent-t)', borderRadius: 7, padding: '8px 12px' }}>
                This resource is not being extended — no CR period will be added.
              </div>
            ) : (
              <PeriodEditor
                periods={r.crPeriods || []}
                onChange={function(ps) { upCr(i, ps); }}
                label="CR Periods (additional)"
                accentColor="var(--accent)"
              />
            )}

            {(sowH > 0 || crH > 0) && (
              <div style={{ display: 'flex', gap: 20, padding: '10px 0 0', borderTop: '1px solid var(--border)', fontSize: 12, flexWrap: 'wrap' }}>
                {sowH > 0 && <span style={{ color: 'var(--text2)' }}>SOW hrs: <strong style={{ color: 'var(--accent)' }}>{sowH}</strong></span>}
                {!r.noExtension && crH > 0 && <span style={{ color: 'var(--text2)' }}>CR hrs: <strong style={{ color: 'var(--accent)' }}>{crH}</strong></span>}
                {totH > 0 && <span style={{ color: 'var(--text2)' }}>Total: <strong style={{ color: 'var(--text)' }}>{totH}</strong></span>}
                {r.rate && totH > 0 && <span style={{ color: 'var(--text2)' }}>Budget: <strong style={{ color: 'var(--accent)' }}>${bud.toLocaleString()}</strong></span>}
              </div>
            )}
          </div>
        );
      })}
      <button className="btn btn-add" onClick={addRes}><IconPlus /> Add Resource</button>
    </div>
  );
}

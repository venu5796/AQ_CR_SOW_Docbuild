import React from 'react';
import { countWorkingDays, calcResourceHours, calcResourceTotal } from '../utils/dates.js';
import { IconX, IconPlus } from './icons.jsx';

export function ResourcesEditorSOW({ resources, onChange, projectStart, projectEnd }) {
  var updateRes = function(i, field, val) {
    var r = resources.slice();
    r[i] = Object.assign({}, r[i]);
    r[i][field] = val;
    onChange(r);
  };
  var updatePeriod = function(ri, pi, field, val) {
    var r = resources.slice();
    var periods = r[ri].periods.slice();
    periods[pi] = Object.assign({}, periods[pi]);
    periods[pi][field] = val;
    r[ri] = Object.assign({}, r[ri], { periods: periods });
    onChange(r);
  };
  var addPeriod = function(ri) {
    var r = resources.slice();
    r[ri] = Object.assign({}, r[ri], {
      periods: r[ri].periods.concat([{ startDate: projectStart || "", endDate: projectEnd || "", hoursPerDay: "8" }])
    });
    onChange(r);
  };
  var removePeriod = function(ri, pi) {
    var r = resources.slice();
    r[ri] = Object.assign({}, r[ri], {
      periods: r[ri].periods.filter(function(_, j) { return j !== pi; })
    });
    onChange(r);
  };
  var addRes = function() {
    onChange(resources.concat([{ name: "", role: "", rate: "", periods: [{ startDate: projectStart || "", endDate: projectEnd || "", hoursPerDay: "8" }] }]));
  };
  var removeRes = function(i) {
    onChange(resources.filter(function(_, j) { return j !== i; }));
  };

  return (
    <div>
      {resources.map(function(r, ri) {
        var totalHrs = calcResourceHours(r);
        var totalAmt = calcResourceTotal(r);
        return (
          <div key={ri} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px", marginBottom: 16, position: "relative", boxShadow: "var(--shadow)" }}>
            {resources.length > 1 && (
              <button className="resource-remove" onClick={function() { removeRes(ri); }} style={{ position: "absolute", top: 10, right: 10 }}>
                <IconX />
              </button>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr", gap: 10, marginBottom: 14, paddingRight: resources.length > 1 ? "44px" : "0" }}>
              <div className="field">
                <label>Name</label>
                <input value={r.name} onChange={function(e) { updateRes(ri, "name", e.target.value); }} placeholder="John Doe" />
              </div>
              <div className="field">
                <label>Role</label>
                <input value={r.role} onChange={function(e) { updateRes(ri, "role", e.target.value); }} placeholder="Drupal Developer" />
              </div>
              <div className="field">
                <label>Hourly Rate ($)</label>
                <input type="number" value={r.rate} onChange={function(e) { updateRes(ri, "rate", e.target.value); }} placeholder="150" />
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Work Periods</div>
            {r.periods.map(function(p, pi) {
              var days = countWorkingDays(p.startDate, p.endDate);
              var hrs = Math.max(0, days - (parseInt(p.holidays) || 0)) * (parseFloat(p.hoursPerDay) || 0);
              var isCustom = p.hoursPerDay !== "8" && p.hoursPerDay !== "4";
              var selectVal = isCustom ? "custom" : (p.hoursPerDay || "8");
              var customVal = isCustom ? p.hoursPerDay : "";
              return (
                <div key={pi} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end", marginBottom: 8, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 38px 10px 10px", position: "relative" }}>
                  {r.periods.length > 1 && (
                    <button
                      onClick={function() { removePeriod(ri, pi); }}
                      style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}
                    >×</button>
                  )}
                  <div className="field" style={{ flex: "1 1 120px" }}>
                    <label>Start Date</label>
                    <input type="date" value={p.startDate} onChange={function(e) { updatePeriod(ri, pi, "startDate", e.target.value); }} />
                  </div>
                  <div className="field" style={{ flex: "1 1 120px" }}>
                    <label>End Date</label>
                    <input type="date" value={p.endDate} onChange={function(e) { updatePeriod(ri, pi, "endDate", e.target.value); }} />
                  </div>
                  <div className="field" style={{ flex: "0 0 195px" }}>
                    <label>Hours / Day</label>
                    <select
                      value={selectVal}
                      onChange={function(e) { updatePeriod(ri, pi, "hoursPerDay", e.target.value === "custom" ? "custom" : e.target.value); }}
                      style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: "var(--text)" }}
                    >
                      <option value="8">Full-time (8 hrs/day)</option>
                      <option value="4">Half-time (4 hrs/day)</option>
                      <option value="custom">Custom hrs/day...</option>
                    </select>
                  </div>
                  {isCustom && (
                    <div className="field" style={{ flex: "0 0 90px" }}>
                      <label>Hrs / Day</label>
                      <input type="number" value={p.hoursPerDay === "custom" ? "" : p.hoursPerDay} onChange={function(e) { updatePeriod(ri, pi, "hoursPerDay", e.target.value); }} min="0" max="24" step="0.5" placeholder="hrs" />
                    </div>
                  )}
                  <div className="field" style={{ flex: "0 0 90px" }}>
                    <label>Holidays</label>
                    <input type="number" value={p.holidays || "0"} onChange={function(e) { updatePeriod(ri, pi, "holidays", e.target.value); }} min="0" placeholder="0" />
                  </div>
                  {p.startDate && p.endDate && (
                    <div style={{ fontSize: 11, color: "var(--accent)", whiteSpace: "nowrap", alignSelf: "flex-end", paddingBottom: 6 }}>
                      {Math.max(0, days - (parseInt(p.holidays) || 0))} work days x {p.hoursPerDay && p.hoursPerDay !== "custom" ? p.hoursPerDay : "?"}h = <strong>{hrs > 0 ? hrs + "h" : "?"}</strong>
                    </div>
                  )}
                </div>
              );
            })}
            <button className="btn btn-add" onClick={function() { addPeriod(ri); }} style={{ fontSize: 12, padding: "5px 12px", marginBottom: 8 }}>
              <IconPlus /> Add Period
            </button>
            {totalHrs > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, padding: "10px 0 0", borderTop: "1px solid var(--border)", fontSize: 13 }}>
                <span style={{ color: "var(--text2)" }}>Total Hours: <strong style={{ color: "var(--text)" }}>{totalHrs}</strong></span>
                {r.rate && <span style={{ color: "var(--text2)" }}>Subtotal: <strong style={{ color: "var(--accent)" }}>${totalAmt.toLocaleString()}</strong></span>}
              </div>
            )}
          </div>
        );
      })}
      <button className="btn btn-add" onClick={addRes}><IconPlus /> Add Resource</button>
    </div>
  );
}

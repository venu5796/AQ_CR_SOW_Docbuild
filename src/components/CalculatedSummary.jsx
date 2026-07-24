import React from 'react';

export function CalculatedSummary({ metrics = [], onAutoFill = null }) {
  return (
    <div style={{ background: "var(--accent-s)", border: "1.5px solid var(--accent-t)", borderRadius: 12, padding: "18px 22px", marginBottom: 24, boxShadow: "0 2px 6px rgba(37,99,235,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Calculated Summary</div>
        {onAutoFill && (
          <button className="btn btn-primary btn-sm" onClick={onAutoFill} style={{ fontWeight: 600, fontSize: 12, padding: "6px 14px" }}>
            Auto-fill All Fields →
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px 20px", fontSize: 13 }}>
        {metrics.map((m, i) => (
          <span key={i} style={{ color: "var(--text2)" }}>
            {m.label}: <strong style={{ color: m.color || "var(--text)", fontSize: m.size || 14, fontWeight: m.weight || 600 }}>{m.value}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

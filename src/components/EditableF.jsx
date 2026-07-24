import React, { useState, useRef, useEffect } from 'react';

const TEXTAREA_STYLE = { width: '100%', resize: 'vertical' };

// In delta mode: SOW-origin fields show greyed (SowF); CR-delta fields are click-to-edit (EditableF).
export function EditableF({ v, ph = "________", isDelta, fieldKey, onEdit, type = "text" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(v || '');
  const inputRef = useRef(null);

  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);
  useEffect(() => { setDraft(v || ''); }, [v]);

  if (!isDelta) {
    return <span className={`doc-field ${v ? '' : 'empty'}`}>{v || ph}</span>;
  }

  const commit = (val) => { onEdit && onEdit(fieldKey, val); setEditing(false); };
  const cancelEdit = () => { setDraft(v || ''); setEditing(false); };

  if (editing) {
    if (type === 'textarea') {
      return (
        <textarea
          ref={inputRef}
          value={draft}
          className="inline-edit-input"
          rows={3}
          style={TEXTAREA_STYLE}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={e => { if (e.key === 'Escape') cancelEdit(); }}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        className="inline-edit-input"
        onChange={e => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={e => {
          if (e.key === 'Enter') commit(draft);
          if (e.key === 'Escape') cancelEdit();
        }}
      />
    );
  }

  return (
    <span
      className={`delta-field ${v ? '' : 'empty'}`}
      onClick={() => { setDraft(v || ''); setEditing(true); }}
      title="Click to edit"
    >
      {v || ph}
      {v && <span className="delta-edit-hint">✎</span>}
    </span>
  );
}

// Renders a greyed SOW-origin value with a SOW badge.
export function SowF({ v, ph = "________" }) {
  return (
    <span className="sow-cell">
      {v || <span style={{ color: '#ccc', fontStyle: 'italic' }}>{ph}</span>}
      <span className="sow-badge">SOW</span>
    </span>
  );
}

// Simple confidence dot — rendered next to form field labels.
const CONFIDENCE_THEME = {
  colors: { high: 'var(--success)', medium: 'var(--amber)', low: 'var(--error)' },
  widths: { high: '100%', medium: '60%', low: '30%' },
  titles: { high: 'Extracted cleanly', medium: 'Review suggested', low: 'Not found — fill manually' }
};

export function ConfDot({ level }) {
  if (!level) return null;
  return <span className={`conf-dot ${level}`} title={CONFIDENCE_THEME.titles[level]} />;
}

export function ConfBar({ label, level }) {
  if (!level) return null;
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      <div style={{ background: 'var(--surface3)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ background: CONFIDENCE_THEME.colors[level], height: '100%', width: CONFIDENCE_THEME.widths[level], transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

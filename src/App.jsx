import React, { useState, useEffect } from 'react';
import { AuthGate } from './components/AuthGate.jsx';
import { Home } from './components/Home.jsx';
import { SOWForm } from './components/SOWForm.jsx';
import { CRForm } from './components/CRForm.jsx';
import { CRFromSOW } from './components/CRFromSOW.jsx';
import { CRFromCR } from './components/CRFromCR.jsx';
import { Success } from './components/Success.jsx';
import { HelpView } from './components/HelpView.jsx';
import { GDRIVE_CONFIG, saveGDriveConfig } from './utils/gdrive.js';
import { loadContractors, saveContractors, contractorAliases } from './utils/contractors.js';
import { setSubconAliases } from './data/subconData.js';
import { getStoredAuth } from './utils/auth.js';

const IconSun = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5"/><path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

// Populate subcon aliases before first render so child components see them on mount.
const _initContractors = loadContractors();
setSubconAliases(contractorAliases(_initContractors));

// ── Recent docs ───────────────────────────────────────────────────────────────
const RECENT_KEY = 'acquia_recent_docs';
export function getRecentDocs() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch(e) { return []; }
}
export function addRecentDoc(doc) {
  var list = getRecentDocs();
  list.unshift({ ...doc, date: Date.now() });
  if (list.length > 8) list = list.slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}
// ── Contractor settings ───────────────────────────────────────────────────────
const EMPTY_CONTRACTOR = { address: '', msaDate: '', pocName: '', pocEmail: '', alias: '' };

function ContractorSettings({ contractors, onChange }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_CONTRACTOR);
  const [newName, setNewName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const startEdit = (name) => { setAdding(false); setEditing(name); setForm({ ...EMPTY_CONTRACTOR, ...contractors[name] }); };
  const startAdd  = () => { setEditing(null); setNewName(''); setForm(EMPTY_CONTRACTOR); setAdding(true); };

  const saveEdit = () => {
    if (!editing) return;
    onChange({ ...contractors, [editing]: { ...contractors[editing], ...form } });
    setEditing(null);
  };
  const saveAdd = () => {
    const name = newName.trim(); if (!name) return;
    const alias = form.alias.trim() || name.toLowerCase().split(/[\s,]/)[0];
    onChange({ ...contractors, [name]: { ...form, alias } });
    setAdding(false);
  };
  const remove = (name) => {
    const next = { ...contractors }; delete next[name];
    onChange(next); setDeleteConfirm(null);
    if (editing === name) setEditing(null);
  };

  const names = Object.keys(contractors);
  const inp = { className: "cf-input" };

  return (
    <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{names.length} Contractor{names.length !== 1 ? 's' : ''}</div>
        <button onClick={startAdd} style={{ background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', transition: 'opacity 0.2s' }}>+ Add New</button>
      </div>

      {adding && (
        <div className="contractor-edit-form">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Contractor</div>
          <div className="cf-row single"><label className="cf-label">Full Legal Name *</label><input {...inp} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Acme Corp Pvt Ltd" /></div>
          <div className="cf-row single" style={{ marginTop: 8 }}><label className="cf-label">Address</label><textarea {...inp} rows={2} value={form.address} onChange={e => sf('address', e.target.value)} style={{ resize: 'vertical' }} /></div>
          <div className="cf-row" style={{ marginTop: 8 }}>
            <div><label className="cf-label">MSA Date</label><input {...inp} type="date" value={form.msaDate} onChange={e => sf('msaDate', e.target.value)} /></div>
            <div><label className="cf-label">Alias</label><input {...inp} value={form.alias} onChange={e => sf('alias', e.target.value)} placeholder="acme" /></div>
          </div>
          <div className="cf-row" style={{ marginTop: 8 }}>
            <div><label className="cf-label">POC Name</label><input {...inp} value={form.pocName} onChange={e => sf('pocName', e.target.value)} /></div>
            <div><label className="cf-label">POC Email</label><input {...inp} type="email" value={form.pocEmail} onChange={e => sf('pocEmail', e.target.value)} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={saveAdd} disabled={!newName.trim()} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: newName.trim() ? 'pointer' : 'not-allowed', opacity: newName.trim() ? 1 : 0.5 }}>Save</button>
            <button onClick={() => setAdding(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 14px', fontSize: 13, color: 'var(--text2)', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {names.map(name => (
        <div key={name} className="contractor-card">
          {editing === name ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>Editing: {name}</div>
              <div className="cf-row single"><label className="cf-label">Address</label><textarea {...inp} rows={2} value={form.address} onChange={e => sf('address', e.target.value)} style={{ resize: 'vertical' }} /></div>
              <div className="cf-row" style={{ marginTop: 8 }}>
                <div><label className="cf-label">MSA Date</label><input {...inp} type="date" value={form.msaDate} onChange={e => sf('msaDate', e.target.value)} /></div>
                <div><label className="cf-label">Alias</label><input {...inp} value={form.alias} onChange={e => sf('alias', e.target.value)} /></div>
              </div>
              <div className="cf-row" style={{ marginTop: 8 }}>
                <div><label className="cf-label">POC Name</label><input {...inp} value={form.pocName} onChange={e => sf('pocName', e.target.value)} /></div>
                <div><label className="cf-label">POC Email</label><input {...inp} type="email" value={form.pocEmail} onChange={e => sf('pocEmail', e.target.value)} /></div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={saveEdit} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 14px', fontSize: 13, color: 'var(--text2)', cursor: 'pointer' }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="contractor-card-name">{name}</div>
              <div className="contractor-card-meta">
                {contractors[name].msaDate && <span>MSA: {contractors[name].msaDate} · </span>}
                {contractors[name].pocName && <span>{contractors[name].pocName}</span>}
                {contractors[name].pocEmail && <span> · {contractors[name].pocEmail}</span>}
              </div>
              <div className="contractor-card-actions">
                <button onClick={() => startEdit(name)} style={{ fontSize: 12, background: 'var(--accent-s)', border: '1px solid var(--accent-t)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: 'var(--accent)', fontWeight: 600, transition: 'background 0.2s' }}>Edit</button>
                {deleteConfirm === name ? (
                  <>
                    <button onClick={() => remove(name)} style={{ fontSize: 12, background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: 'var(--danger)', fontWeight: 600 }}>Confirm Delete</button>
                    <button onClick={() => setDeleteConfirm(null)} style={{ fontSize: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: 'var(--text2)' }}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(name)} style={{ fontSize: 12, background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: 'var(--danger)', fontWeight: 500 }}>Delete</button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function UserAvatar() {
  const user = getStoredAuth();
  if (!user?.name) return null;
  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="topnav-avatar" title={user.name}>
      {initials}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('home');
  const [sowPrefill, setSowPrefill] = useState(null);
  const [lastType, setLastType] = useState('sow');
  const [dark, setDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('gdrive');
  const [cfgApiKey, setCfgApiKey] = useState(() => GDRIVE_CONFIG.apiKey || '');
  const [cfgClientId, setCfgClientId] = useState(() => GDRIVE_CONFIG.clientId || '');
  const [cfgSaved, setCfgSaved] = useState(false);
  const [contractors, setContractors] = useState(_initContractors);
  const [recentDocs, setRecentDocs] = useState(() => getRecentDocs());
  const [lastMeta, setLastMeta] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    let rafId;
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseDown = () => {
      cursor.classList.add('click');
      dot.classList.add('click');
    };
    const handleMouseUp = () => {
      cursor.classList.remove('click');
      dot.classList.remove('click');
    };

    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' ||
          e.target.closest('button') || e.target.closest('a') ||
          e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ||
          e.target.tagName === 'SELECT') {
        cursor.classList.add('hover');
      }
    };

    const handleMouseLeave = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' ||
          e.target.closest('button') || e.target.closest('a') ||
          e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ||
          e.target.tagName === 'SELECT') {
        cursor.classList.remove('hover');
      }
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      cursor.remove();
      dot.remove();
    };
  }, []);

  useEffect(() => {
    setSubconAliases(contractorAliases(contractors));
  }, [contractors]);

  const handleContractorsChange = (next) => { setContractors(next); saveContractors(next); };

  const saveSettings = () => {
    saveGDriveConfig({ apiKey: cfgApiKey.trim(), clientId: cfgClientId.trim() });
    setCfgSaved(true); setTimeout(() => setCfgSaved(false), 2500);
  };

  const navigate = (v) => { if (v === 'cr') setSowPrefill(null); setView(v); };

  const handleComplete = (type, meta) => {
    const doc = { type: type.toUpperCase(), name: meta?.name || (type === 'sow' ? 'Statement of Work' : 'Change Request') };
    addRecentDoc(doc);
    setRecentDocs(getRecentDocs());
    setLastType(type);
    setLastMeta(meta ?? null);
    setView('success');
  };

  const hasCredentials = GDRIVE_CONFIG.apiKey && GDRIVE_CONFIG.clientId;

  return (
    <AuthGate>
    <>
      {/* ── Top nav ── */}
      <nav className="topnav">
        <div className="topnav-inner">
          <button className="topnav-logo" onClick={() => navigate('home')}>
            <img src="./logo2.png" alt="Acquia Doc Builder" className="topnav-logo-img" />
          </button>
          <div className="nav-right">
            <button className="theme-toggle" onClick={() => setDark(d => !d)} title={dark ? 'Light mode' : 'Dark mode'}>
              {dark ? <IconSun /> : <IconMoon />}
            </button>
            <button
              className="theme-toggle"
              onClick={() => { setCfgApiKey(GDRIVE_CONFIG.apiKey || ''); setCfgClientId(GDRIVE_CONFIG.clientId || ''); setCfgSaved(false); setSettingsOpen(true); }}
              title="Settings"
              style={{ position: 'relative' }}
            >
              <IconSettings />
              {!hasCredentials && <span style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--surface)' }} />}
            </button>
            <UserAvatar />
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {view === 'home'       && <Home onSelect={navigate} recentDocs={recentDocs} />}
        {view === 'sow'        && <SOWForm onBack={() => navigate('home')} onComplete={(m) => handleComplete('sow', m)} />}
        {view === 'cr'         && <CRForm prefill={sowPrefill} onBack={() => navigate('home')} onComplete={(m) => handleComplete('cr', m)} />}
        {view === 'cr-from-sow'&& <CRFromSOW onBack={() => navigate('home')} onContinue={null} onComplete={(m) => handleComplete('cr', m)} />}
        {view === 'cr-from-cr' && <CRFromCR onBack={() => navigate('home')} onComplete={(m) => handleComplete('cr', m)} />}
        {view === 'sow-sample'         && <SOWForm sampleMode onExitSample={() => navigate('home')} onStartReal={() => navigate('sow')} onBack={() => navigate('home')} onComplete={(m) => handleComplete('sow', m)} />}
        {view === 'cr-sample'          && <CRForm sampleMode onExitSample={() => navigate('home')} onStartReal={() => navigate('cr')} prefill={null} onBack={() => navigate('home')} onComplete={(m) => handleComplete('cr', m)} />}
        {view === 'cr-from-sow-sample' && <CRFromSOW sampleMode onExitSample={() => navigate('home')} onStartReal={() => navigate('cr-from-sow')} onBack={() => navigate('home')} onContinue={null} onComplete={(m) => handleComplete('cr', m)} />}
        {view === 'cr-from-cr-sample'  && <CRFromCR sampleMode onExitSample={() => navigate('home')} onStartReal={() => navigate('cr-from-cr')} onBack={() => navigate('home')} onComplete={(m) => handleComplete('cr', m)} />}
        {view === 'help'       && <HelpView onBack={() => navigate('home')} />}
        {view === 'success'    && (
          <Success
            type={lastType}
            meta={lastMeta}
            onBack={() => navigate('home')}
            onNew={() => { setSowPrefill(null); navigate(lastType === 'sow' ? 'sow' : 'cr'); }}
            onFollowOnCR={() => navigate('cr-from-cr')}
            onFixIt={() => navigate(lastMeta?.flow ?? 'home')}
          />
        )}
      </div>

      {/* ── Settings modal ── */}
      {settingsOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', width: 'min(560px,94vw)', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.02em' }}>Settings</div>
              <button onClick={() => { setSettingsOpen(false); setSettingsTab('gdrive'); }} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 20, cursor: 'pointer', color: 'var(--text2)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>×</button>
            </div>
            <div className="settings-tabs">
              <button className={`settings-tab ${settingsTab === 'gdrive' ? 'active' : ''}`} onClick={() => setSettingsTab('gdrive')}>Google Drive</button>
              <button className={`settings-tab ${settingsTab === 'contractors' ? 'active' : ''}`} onClick={() => setSettingsTab('contractors')}>Contractors ({Object.keys(contractors).length})</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {settingsTab === 'gdrive' && (
                <>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.5 }}>Configure OAuth to enable Google Drive integration for uploads.</div>
                  {hasCredentials
                    ? <div style={{ background: 'var(--success-s)', border: '1.5px solid rgba(59,109,17,0.25)', borderRadius: 9, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>✓ Credentials configured — Drive integration active</div>
                    : <div style={{ background: 'var(--amber-s)', border: '1.5px solid rgba(186,117,23,0.25)', borderRadius: 9, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--amber)', fontWeight: 500 }}>⚠️ Not configured — add credentials below or in src/utils/gdrive.js</div>
                  }
                  {!hasCredentials && (
                    <>
                      <div style={{ marginBottom: 14 }}>
                        <label className="cf-label">API Key</label>
                        <input value={cfgApiKey} onChange={e => { setCfgApiKey(e.target.value); setCfgSaved(false); }} placeholder="AIzaSy..." className="cf-input" />
                      </div>
                      <div style={{ marginBottom: 18 }}>
                        <label className="cf-label">OAuth Client ID</label>
                        <input value={cfgClientId} onChange={e => { setCfgClientId(e.target.value); setCfgSaved(false); }} placeholder="000000.apps.googleusercontent.com" className="cf-input" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={saveSettings} disabled={!cfgApiKey.trim() || !cfgClientId.trim()} style={{ flex: 1, background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', opacity: (!cfgApiKey.trim() || !cfgClientId.trim()) ? 0.5 : 1, transition: 'opacity 0.2s' }}>Save Credentials</button>
                        {cfgSaved && <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>✓ Saved</span>}
                      </div>
                    </>
                  )}
                </>
              )}
              {settingsTab === 'contractors' && (
                <>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>Manage your subcontractor directory. Profiles are saved locally in your browser.</div>
                  <ContractorSettings contractors={contractors} onChange={handleContractorsChange} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
    </AuthGate>
  );
}

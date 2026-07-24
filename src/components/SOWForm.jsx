import React, { useState, useEffect, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft, savedAgoLabel } from '../utils/draft.js';
import { DEFAULT_SOW, calcTotalFee, fmt, fmtCurrency } from '../utils/dates.js';
import { generateDocx, downloadBlob } from '../utils/docx.js';
import { SOW_TEMPLATE_B64 } from '../data/templates.js';
import { SUBCON_DATA, getSubconAliases, setSubconAliases } from '../data/subconData.js';
import { StepBar } from './StepBar.jsx';
import { ResourcesEditorSOW } from './ResourcesEditorSOW.jsx';
import { SOWPreview } from './SOWPreview.jsx';
import { IconDownload, IconGDrive } from './icons.jsx';
import { useGDriveUpload } from '../hooks/useGDriveUpload.js';
import { DemoBanner } from './DemoBanner.jsx';
import { SummaryCard } from './SummaryCard.jsx';
import { SAMPLE_SOW_DATA } from '../data/sampleData.js';

const DRAFT_KEY = 'draft_sow';

export function SOWForm({ onBack, onComplete, sampleMode = false, onExitSample, onStartReal }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(sampleMode ? { ...SAMPLE_SOW_DATA } : { ...DEFAULT_SOW });
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');
  const { driveUrl, uploading, upload } = useGDriveUpload(setGenMsg);
  const msgColor = s => s.startsWith('✓') ? 'var(--success)' : s.startsWith('⚠') ? 'var(--danger)' : 'var(--accent)';
  const [sowAliases, setSowAliases] = useState(() => getSubconAliases().slice());
  const [sowAddingNew, setSowAddingNew] = useState(false);
  const [sowNewName, setSowNewName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [draftBanner, setDraftBanner] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [saveFlash, setSaveFlash] = useState(false);
  const autosaveRef = useRef(null);

  useEffect(() => {
    if (sampleMode) return;
    const draft = loadDraft(DRAFT_KEY);
    if (draft && draft.data) setDraftBanner(draft);
  }, []);

  useEffect(() => {
    if (sampleMode) return;
    if (autosaveRef.current) clearInterval(autosaveRef.current);
    autosaveRef.current = setInterval(() => { saveDraft(DRAFT_KEY, data); setSavedAt(Date.now()); }, 30000);
    return () => clearInterval(autosaveRef.current);
  }, [data, sampleMode]);

  useEffect(() => { if (step === 2) setShowPreview(true); }, [step]);

  const handleSave = () => {
    saveDraft(DRAFT_KEY, data); setSavedAt(Date.now()); setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const confirmSowSubcon = () => {
    const t = sowNewName.trim();
    if (!t) return;
    const next = sowAliases.concat([{ match: t.toLowerCase().split(" ")[0], full: t }]);
    setSowAliases(next);
    setSubconAliases(next);
    set("Subcon", t);
    set("Subconname", t);
    setSowNewName("");
    setSowAddingNew(false);
  };

  const steps = ["Project Info", "Timeline & Resources", "Preview & Generate"];

  const buildSOWReplacements = () => ({
    Effecdate: fmt(data.Effecdate) || "",
    Subcon: data.Subcon,
    SubconAddr: data.SubconAddr || data.Subcon,
    Subconname: data.Subconname || data.Subcon,
    MSA_Date: fmt(data.MSA_Date) || "",
    Projname: data.Projname,
    Custname: data.Custname,
    Proj_desc: data.Proj_desc,
    Strtdate: fmt(data.Strtdate) || data.Strtdate,
    Enddate: fmt(data.Enddate) || data.Enddate,
    Total_Fee: data.Total_Fee ? (function() {
      const n = parseFloat(String(data.Total_Fee).replace(/[$,]/g, ''));
      return isNaN(n) ? (data.Total_Fee.startsWith('$') ? '' : '$') + data.Total_Fee : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }()) : "",
    Subpoc: data.Subpoc,
    Subpocemail: data.Subpocemail,
    Resources: "__RESOURCES_TABLE__",
    _rawResources: data.resources
  });

  const sowFilename = () => `SOW_${(data.Projname || "Project").replace(/[^a-zA-Z0-9._-]/g, "_")}_${new Date().toISOString().slice(0, 10)}.docx`;

  const buildSOWSummary = d => [
    { label: 'Customer',      value: d.Custname },
    { label: 'Subcontractor', value: d.Subcon },
    { label: 'Project',       value: d.Projname },
    { label: 'Start date',    value: d.Strtdate ? fmt(d.Strtdate) : '—' },
    { label: 'End date',      value: d.Enddate  ? fmt(d.Enddate)  : '—' },
    { label: 'Total fee',     value: fmtCurrency(d.Total_Fee) },
    { label: 'Resources',     value: d.resources.filter(r => r.name).length + ' defined' },
  ];

  const handleGenerate = async () => {
    if (!data.Projname) { setGenMsg('⚠️ Project Name is required before generating.'); return; }
    if (!data.resources.some(r => r.name)) { setGenMsg('⚠️ At least one resource is required before generating.'); return; }
    setGenerating(true);
    try {
      const blob = await generateDocx(SOW_TEMPLATE_B64, buildSOWReplacements());
      downloadBlob(blob, sowFilename());
      clearDraft(DRAFT_KEY);
      onComplete({ name: `SOW — ${data.Projname || 'Project'}`, flow: 'sow', summary: buildSOWSummary(data) });
    } catch (e) {
      setGenMsg('⚠️ Generation failed: ' + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGDriveUpload = () => {
    upload(generateDocx(SOW_TEMPLATE_B64, buildSOWReplacements()), sowFilename());
  };

  return (
    <>
      {sampleMode && (
        <DemoBanner flowType="sow" onExit={onExitSample} onStartReal={onStartReal} />
      )}
      <div className="split-layout" style={sampleMode ? { height: 'calc(100vh - 102px)' } : {}}>
      <div className="form-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
          <h1 className="page-title" style={{ margin: 0 }}>New Statement of Work</h1>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {savedAt && <span style={{ fontSize: 11, color: "var(--text3)" }}>● Saved {savedAgoLabel(savedAt)}</span>}
            {!sampleMode && (
            <button onClick={handleSave} className="btn btn-secondary btn-sm" style={saveFlash ? { color: "var(--success)", borderColor: "var(--success)" } : {}}>
              {saveFlash ? "✓ Saved" : "Save"}
            </button>
            )}
          </div>
        </div>
        {!sampleMode && draftBanner && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text)" }}>📋 Unsaved draft from <strong>{savedAgoLabel(draftBanner.savedAt)}</strong></span>
            <button onClick={() => { setData(d => ({ ...d, ...draftBanner.data })); setDraftBanner(null); }} style={{ fontSize: 12, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Restore</button>
            <button onClick={() => { setDraftBanner(null); clearDraft(DRAFT_KEY); }} style={{ fontSize: 12, background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "var(--text3)" }}>Dismiss</button>
          </div>
        )}
        {genMsg && <div style={{ fontSize: 13, color: "var(--danger)", marginBottom: 12, padding: "10px 14px", background: "rgba(226,75,74,0.06)", borderRadius: 8, border: "1px solid rgba(226,75,74,0.15)" }}>{genMsg}</div>}
        <p className="page-sub">Fill in the details below to generate your SOW document</p>
        <StepBar steps={steps} current={step} />

        {step === 0 && (
          <>
            <div className="form-section">
              <div className="form-section-title">Contract Information</div>
              <div className="form-row">
                <div className="field">
                  <label>Effective Date</label>
                  <input type="date" value={data.Effecdate} onChange={e => set("Effecdate", e.target.value)} />
                </div>
                <div className="field">
                  <label>MSA Date</label>
                  <input type="date" value={data.MSA_Date} onChange={e => set("MSA_Date", e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Subcontractor</label>
                  {!sowAddingNew ? (
                    <select
                      value={data.Subcon}
                      onChange={e => {
                        const v = e.target.value;
                        if (v === "__add_new__") { setSowAddingNew(true); setSowNewName(""); }
                        else {
                          const updates = { Subcon: v, Subconname: v };
                          if (SUBCON_DATA[v]) {
                            updates.SubconAddr = SUBCON_DATA[v].address;
                            updates.MSA_Date = SUBCON_DATA[v].msaDate;
                            updates.Subpoc = SUBCON_DATA[v].pocName;
                            updates.Subpocemail = SUBCON_DATA[v].pocEmail;
                          }
                          setData(d => ({ ...d, ...updates }));
                        }
                      }}
                      style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 7, color: data.Subcon ? "var(--text)" : "var(--text3)", padding: "9px 12px", fontSize: 13 }}
                    >
                      <option value="" disabled>Select subcontractor...</option>
                      {sowAliases.map((a, i) => <option key={i} value={a.full}>{a.full}</option>)}
                      <option value="__add_new__">+ Add new subcontractor...</option>
                    </select>
                  ) : (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        autoFocus
                        value={sowNewName}
                        onChange={e => setSowNewName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") confirmSowSubcon(); if (e.key === "Escape") { setSowAddingNew(false); setSowNewName(""); } }}
                        placeholder="Full company name"
                        style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--accent)", borderRadius: 8, padding: "11px 14px", color: "var(--text)", fontSize: 14 }}
                      />
                      <button onClick={confirmSowSubcon} style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "8px 14px", color: "var(--accent)", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Add ✓</button>
                      <button onClick={() => { setSowAddingNew(false); setSowNewName(""); }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>✕</button>
                    </div>
                  )}
                </div>
                <div className="field required">
                  <label>Customer Name</label>
                  <input value={data.Custname} onChange={e => set("Custname", e.target.value)} placeholder="Enterprise Client LLC" required />
                </div>
              </div>
              <div className="form-row single">
                <div className="field">
                  <label>Subcontractor and Address</label>
                  <textarea value={data.SubconAddr} onChange={e => set("SubconAddr", e.target.value)} placeholder="Acme Corp, 123 Main St, Boston, MA 02101" rows={3} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "9px 12px", color: "var(--text)", fontSize: 13, resize: "vertical", fontFamily: "inherit" }} />
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Project Details</div>
              <div className="form-row single">
                <div className="field">
                  <label>Project Name</label>
                  <input value={data.Projname} onChange={e => set("Projname", e.target.value)} placeholder="Drupal Migration 2025" />
                </div>
              </div>
              <div className="form-row single">
                <div className="field">
                  <label>Project Description</label>
                  <textarea rows={4} value={data.Proj_desc} onChange={e => set("Proj_desc", e.target.value)} placeholder="Brief description of the project scope and goals..." />
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Subcontractor POC</div>
              <div className="form-row">
                <div className="field">
                  <label>POC Name</label>
                  <input value={data.Subpoc} onChange={e => set("Subpoc", e.target.value)} placeholder="Jane Smith" />
                </div>
                <div className="field">
                  <label>POC Email</label>
                  <input type="email" value={data.Subpocemail} onChange={e => set("Subpocemail", e.target.value)} placeholder="jane@acmecorp.com" />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="form-section">
              <div className="form-section-title">Project Timeline</div>
              <div className="form-row">
                <div className="field required">
                  <label>Start Date</label>
                  <input type="date" value={data.Strtdate} onChange={e => set("Strtdate", e.target.value)} required />
                </div>
                <div className="field required">
                  <label>End Date</label>
                  <input type="date" value={data.Enddate} onChange={e => set("Enddate", e.target.value)} required />
                </div>
              </div>
              <div className="form-row single">
                <div className="field required">
                  <label>Total Fee</label>
                  <input value={data.Total_Fee} onChange={e => set("Total_Fee", e.target.value)} placeholder="$120,000.00" required />
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Staffing Resources</div>
              <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 20 }}>Add all resources that will be staffed on this project.</p>
              <div>
                <ResourcesEditorSOW resources={data.resources} onChange={r => set("resources", r)} projectStart={data.Strtdate} projectEnd={data.Enddate} />
                <div style={{ marginTop: 18, padding: "14px 18px", background: "var(--accent-s)", borderRadius: 10, border: "1.5px solid var(--accent-t)", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 6px rgba(37,99,235,0.08)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Calculated Total Fee</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <strong style={{ color: "var(--accent)", fontSize: 18, fontWeight: 700 }}>${calcTotalFee(data.resources).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <button className="btn btn-secondary btn-sm" onClick={() => set("Total_Fee", calcTotalFee(data.resources).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} style={{ fontSize: 11, padding: "5px 12px", fontWeight: 600 }}>Apply →</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="page-sub" style={{ marginBottom: 12 }}>Verify these values match your intent before generating.</p>
            <SummaryCard items={buildSOWSummary(data)} style={{ marginBottom: 16 }} />
          </>
        )}

        <div className="actions">
          {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Previous</button>}
          <div className="actions-right">
            {step < 2 && <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>}
            {step === 2 && (
              <>
                <button className="btn btn-success" onClick={handleGenerate} disabled={sampleMode || generating || uploading}>
                  {generating ? <span className="loading">⟳</span> : <IconDownload />}
                  {generating ? "Generating..." : "Generate & Download SOW"}
                </button>
                <button className="btn btn-secondary" onClick={handleGDriveUpload} disabled={sampleMode || generating || uploading}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <IconGDrive />
                  {uploading ? "Uploading..." : "Save to Google Docs"}
                </button>
              </>
            )}
          </div>
        </div>
        {step === 2 && (genMsg || driveUrl) && (
          <div style={{ marginTop: 8, marginBottom: 4 }}>
            {genMsg && <div style={{ fontSize: 13, color: msgColor(genMsg) }}>{genMsg}</div>}
            {driveUrl && (
              <a href={driveUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", marginTop: 6, fontSize: 13, color: "var(--accent)" }}>
                Open in Google Docs →
              </a>
            )}
          </div>
        )}
        {step < 2 && (
          <button onClick={() => setShowPreview(p => !p)} className="btn btn-secondary preview-toggle-btn">
            {showPreview ? "Hide Preview ▴" : "Show Preview ▾"}
          </button>
        )}
      </div>
      <SOWPreview data={data} showClass={showPreview ? "show" : ""} />
    </div>
    </>
  );
}

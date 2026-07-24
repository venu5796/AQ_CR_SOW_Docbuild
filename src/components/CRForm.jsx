import React, { useState, useEffect, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft, savedAgoLabel } from '../utils/draft.js';
import { DEFAULT_CR, calcCRTotalBudget, calcCRSowHours, calcCRCrHours, calcCRExtensionDays, effectiveCRHolidays, buildCRSummary } from '../utils/dates.js';
import { CRAcquiaFields, CRRequestorField } from './CRAcquiaFields.jsx';
import { RichTextEditor } from './RichTextEditor.jsx';
import { generateDocx, downloadBlob, buildCRReplacements } from '../utils/docx.js';
import { CR_TEMPLATE_B64 } from '../data/templates.js';
import { getSubconAliases, setSubconAliases } from '../data/subconData.js';
import { StepBar } from './StepBar.jsx';
import { ResourcesEditorCR } from './ResourcesEditorCR.jsx';
import { CRPreview } from './CRPreview.jsx';
import { IconDownload, IconGDrive } from './icons.jsx';
import { useGDriveUpload } from '../hooks/useGDriveUpload.js';
import { DemoBanner } from './DemoBanner.jsx';
import { SummaryCard } from './SummaryCard.jsx';
import { SAMPLE_CR_DATA } from '../data/sampleData.js';

const DRAFT_KEY = 'draft_cr';

export function CRForm({ prefill, onBack, onComplete, sampleMode = false, onExitSample, onStartReal }) {
  const [step, setStep] = useState(prefill ? 1 : 0);
  const [data, setData] = useState(sampleMode ? { ...SAMPLE_CR_DATA } : { ...DEFAULT_CR, ...(prefill || {}) });
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');
  const { driveUrl, uploading, upload } = useGDriveUpload(setGenMsg);
  const msgColor = s => s.startsWith('✓') ? 'var(--success)' : s.startsWith('⚠') ? 'var(--danger)' : 'var(--accent)';
  const [crAliases, setCrAliases] = useState(() => getSubconAliases().slice());
  const [crAddingNew, setCrAddingNew] = useState(false);
  const [crNewName, setCrNewName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [draftBanner, setDraftBanner] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [saveFlash, setSaveFlash] = useState(false);
  const autosaveRef = useRef(null);

  useEffect(() => {
    if (prefill || sampleMode) return; // prefill/sampleMode takes priority over draft
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

  const confirmNewCrSubcon = () => {
    const t = crNewName.trim();
    if (!t) return;
    const next = crAliases.concat({ match: t.toLowerCase().split(" ")[0], full: t });
    setCrAliases(next);
    setSubconAliases(next);
    set("custname", t); set("subcon", t);
    setCrNewName("");
    setCrAddingNew(false);
  };

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const isFromSOW = !!prefill && !prefill.prevcrs;
  const isFromCR = !!prefill && !!prefill.prevcrs;
  const steps = ["Project Info", "Timeline & Resources", "Preview & Generate"];

  const handleGenerate = async () => {
    if (!data.crno) { setGenMsg('⚠️ CR Number is required before generating.'); return; }
    if (!data.resources.some(r => r.resource || r.name)) { setGenMsg('⚠️ At least one resource is required before generating.'); return; }
    setGenerating(true);
    try {
      const blob = await generateDocx(CR_TEMPLATE_B64, buildCRReplacements(data));
      downloadBlob(blob, `CR_${data.projname || "Project"}_${data.crno || "1"}_${new Date().toISOString().slice(0, 10)}.docx`);
      clearDraft(DRAFT_KEY);
      onComplete({
        name: `CR — ${data.projname || 'Project'} #${data.crno || '1'}`,
        flow: 'cr',
        summary: buildCRSummary(data),
      });
    } catch (e) {
      setGenMsg('⚠️ Generation failed: ' + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGDriveUpload = () => {
    const filename = `CR_${data.projname || "Project"}_${data.crno || "1"}_${new Date().toISOString().slice(0, 10)}.docx`;
    upload(generateDocx(CR_TEMPLATE_B64, buildCRReplacements(data)), filename);
  };

  return (
    <>
      {sampleMode && (
        <DemoBanner flowType="cr" onExit={onExitSample} onStartReal={onStartReal} />
      )}
      <div className="split-layout" style={sampleMode ? { height: 'calc(100vh - 102px)' } : {}}>
      <div className="form-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
          <h1 className="page-title" style={{ margin: 0 }}>Change Request</h1>
          {isFromSOW && <span className="tag" style={{ fontSize: 11 }}>From SOW</span>}
          {isFromCR && <span className="tag" style={{ fontSize: 11 }}>From CR</span>}
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
        <p className="page-sub">Complete the change request form to extend the project or resources</p>
        <StepBar steps={steps} current={step} />

        {step === 0 && (
          <>
            {isFromSOW && <div className="alert alert-info">✓ Project details have been pre-filled from the SOW. Review and adjust as needed.</div>}
            {isFromCR && <div className="alert alert-amber">🔁 Details carried forward from the previous CR — previous CR is now listed under "Previous Change Requests". Review and adjust as needed.</div>}
            <div className="form-section">
              <div className="form-section-title">Project Information</div>
              <div className="form-row">
                <div className="field required">
                  <label>Customer / Consultant Name</label>
                  {prefill && prefill.custname ? (
                    <input value={data.custname} onChange={e => set("custname", e.target.value)} style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "9px 12px", color: "var(--text)", fontSize: 13 }} />
                  ) : !crAddingNew ? (
                    <select
                      value={data.custname}
                      onChange={e => { if (e.target.value === "__add_new__") { setCrAddingNew(true); setCrNewName(""); } else { set("custname", e.target.value); } }}
                      style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "9px 12px", color: data.custname ? "var(--text)" : "var(--text3)", fontSize: 13 }}
                    >
                      <option value="" disabled>Select subcontractor...</option>
                      {crAliases.map((a, i) => <option key={i} value={a.full}>{a.full}</option>)}
                      <option value="__add_new__">+ Add new subcontractor...</option>
                    </select>
                  ) : (
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input autoFocus value={crNewName} onChange={e => setCrNewName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") confirmNewCrSubcon(); if (e.key === "Escape") { setCrAddingNew(false); setCrNewName(""); } }} placeholder="Full company name" style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--accent)", borderRadius: 6, padding: "9px 12px", color: "var(--text)", fontSize: 13 }} />
                      <button onClick={confirmNewCrSubcon} style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "8px 14px", color: "var(--accent)", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Add ✓</button>
                      <button onClick={() => { setCrAddingNew(false); setCrNewName(""); }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>✕</button>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Acquia's Customer</label>
                  <input value={data.req} onChange={e => set("req", e.target.value)} placeholder="Acquia Inc." />
                </div>
              </div>
              <CRRequestorField data={data} set={set} />
              <div className="form-row">
                <div className="field">
                  <label>Project Name</label>
                  <input value={data.projname} onChange={e => set("projname", e.target.value)} placeholder="Drupal Migration 2025" />
                </div>
                <div className="field">
                  <label>Original SOW Reference</label>
                  <input value={data.orgsow} onChange={e => set("orgsow", e.target.value)} placeholder="SOW-2025-001" />
                </div>
              </div>
              <div className="form-row">
                <div className="field required">
                  <label>Change Request #</label>
                  <input value={data.crno} onChange={e => set("crno", e.target.value)} placeholder="CR-001" required />
                </div>
                <div className="field">
                  <label>Previous Change Requests</label>
                  <input value={data.prevcrs} onChange={e => set("prevcrs", e.target.value)} placeholder="None" />
                </div>
              </div>
              <CRAcquiaFields data={data} set={set} />
              <div className="form-row">
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Description of Change</label>
                  <textarea rows={2} value={data.purpose} onChange={e => set("purpose", e.target.value)} style={{ resize: "vertical" }} />
                </div>
              </div>
              <div className="form-row">
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Details of Change</label>
                  <RichTextEditor value={data.detailsofchange} onChange={v => set("detailsofchange", v)} placeholder="Add details that appear after 'Contractual changes to the SOW are as follows:'" />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="form-section">
              <div className="form-section-title">Timeline</div>
              <div className="form-row triple">
                <div className="field required">
                  <label>Original Start Date</label>
                  <input type="date" value={data.ogstdate} onChange={e => set("ogstdate", e.target.value)} required />
                </div>
                <div className="field required">
                  <label>Previous End Date</label>
                  <input type="date" value={data.lenddate} onChange={e => set("lenddate", e.target.value)} required />
                </div>
                <div className="field required">
                  <label>New End Date</label>
                  <input type="date" value={data.enddate} onChange={e => set("enddate", e.target.value)} required />
                </div>
              </div>
              <div className="form-row triple">
                <HolidaysField data={data} set={set} />
                <div className="field">
                  <label>Work Days Added</label>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="number" value={data.workdays} onChange={e => set("workdays", e.target.value)} placeholder="30" style={{ flex: 1 }} />
                    {data.lenddate && data.enddate && (
                      <button className="btn btn-secondary btn-sm" onClick={() => set("workdays", String(calcCRExtensionDays(data)))} style={{ fontSize: 11, padding: "4px 8px", whiteSpace: "nowrap" }}>Auto-calc</button>
                    )}
                  </div>
                  {data.lenddate && data.enddate && (
                    <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 4 }}>
                      {calcCRExtensionDays(data)} working days (excl. {effectiveCRHolidays(data)} holiday{effectiveCRHolidays(data) !== 1 ? "s" : ""})
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Effective Date of CR</label>
                  <input type="date" value={data.exstdate} onChange={e => set("exstdate", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Resources</div>
              <div>
                {!(isFromSOW || isFromCR) && !data.ogstdate && <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Tip: fill in the dates above before adding resources so periods are pre-populated.</div>}
                <ResourcesEditorCR resources={data.resources} onChange={r => set("resources", r)} crStart={data.lenddate} crEnd={data.enddate} showSowPeriods={!(isFromSOW || isFromCR)} />
                <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--accent-t)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>Calculated New Total Budget (SOW + CR):</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <strong style={{ color: "var(--accent)", fontSize: 16 }}>{calcCRTotalBudget(data.resources).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <button className="btn btn-secondary btn-sm" onClick={() => {
                      const sowBud = data.resources.reduce((s, r) => s + calcCRSowHours(r) * (parseFloat(r.rate) || 0), 0);
                      const crBud = data.resources.reduce((s, r) => s + calcCRCrHours(r) * (parseFloat(r.rate) || 0), 0);
                      set("prevtotbud", sowBud.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                      set("newbud", crBud.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                      set("newtotbudget", (sowBud + crBud).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                    }} style={{ fontSize: 11, padding: "4px 10px" }}>Apply to Budget</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title">Effort & Budget Overrides</div>
              <div style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--accent)" }}>Auto-fill impact fields from resource calculations:</span>
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  const sowH = data.resources.reduce((s, r) => s + calcCRSowHours(r), 0);
                  const crH = data.resources.reduce((s, r) => s + calcCRCrHours(r), 0);
                  const sowBud = data.resources.reduce((s, r) => s + calcCRSowHours(r) * (parseFloat(r.rate) || 0), 0);
                  const crBud = data.resources.reduce((s, r) => s + calcCRCrHours(r) * (parseFloat(r.rate) || 0), 0);
                  set("effimp", String(sowH));
                  set("inchours", String(crH));
                  set("neffimp", String(sowH + crH));
                  set("prevtotbud", sowBud.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  set("newbud", crBud.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  set("newtotbudget", (sowBud + crBud).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                }} style={{ fontSize: 11, padding: "4px 10px" }}>Auto-fill All</button>
              </div>
              <div className="form-row triple">
                <div className="field"><label>Original Hours (SOW)</label><input type="number" value={data.effimp} onChange={e => set("effimp", e.target.value)} placeholder="800" /></div>
                <div className="field"><label>Additional CR Hours</label><input type="number" value={data.inchours} onChange={e => set("inchours", e.target.value)} placeholder="200" /></div>
                <div className="field"><label>New Total Hours</label><input type="number" value={data.neffimp} onChange={e => set("neffimp", e.target.value)} placeholder="1000" /></div>
              </div>
              <div className="form-row triple">
                <div className="field"><label>Original Budget ($)</label><input value={data.prevtotbud} onChange={e => set("prevtotbud", e.target.value)} placeholder="120,000" /></div>
                <div className="field"><label>Budget Increase ($)</label><input value={data.newbud} onChange={e => set("newbud", e.target.value)} placeholder="30,000" /></div>
                <div className="field"><label>New Total Budget ($)</label><input value={data.newtotbudget} onChange={e => set("newtotbudget", e.target.value)} placeholder="150,000" /></div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="page-sub" style={{ marginBottom: 12 }}>Verify these values match your intent before generating.</p>
            <SummaryCard items={buildCRSummary(data)} style={{ marginBottom: 20 }} />
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
                  {generating ? "Generating..." : "Generate & Download CR"}
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
      <CRPreview data={data} showClass={showPreview ? "show" : ""} />
    </div>
    </>
  );
}

function HolidaysField({ data, set }) {
  const computed = (function() {
    let maxPerResource = 0;
    data.resources.forEach(function(r) {
      if (r.noExtension) return;
      const rTotal = (r.crPeriods || []).reduce(function(s, p) { return s + (parseInt(p.holidays) || 0); }, 0);
      if (rTotal > maxPerResource) maxPerResource = rTotal;
    });
    return maxPerResource;
  })();
  const isOverridden = data.crHolidays !== "" && data.crHolidays !== String(computed);
  return (
    <div className="field">
      <label>Holidays in CR Period</label>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          type="number"
          value={data.crHolidays !== "" ? data.crHolidays : String(computed)}
          onChange={e => set("crHolidays", e.target.value)}
          placeholder="0" min="0"
          style={{ flex: 1 }}
          title="Holidays are calendar events shared across resources."
        />
        <button className="btn btn-secondary btn-sm" onClick={() => set("crHolidays", String(computed))} style={{ fontSize: 11, padding: "4px 8px", whiteSpace: "nowrap", opacity: isOverridden ? 1 : 0.4 }} title="Sync from CR period holidays">Sync</button>
      </div>
      <div style={{ fontSize: 11, color: isOverridden ? "var(--danger)" : "var(--accent)", marginTop: 3 }}>
        {isOverridden ? "Manual override active" : "Auto-synced from CR period rows"}
      </div>
    </div>
  );
}

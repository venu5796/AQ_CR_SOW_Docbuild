import React, { useState, useEffect, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft, savedAgoLabel } from '../utils/draft.js';
import { calcCRSowHours, calcCRCrHours, calcCRExtensionDays, calcCRTotalBudget, DEFAULT_CR_PURPOSE, buildCRSummary } from '../utils/dates.js';
import { CRAcquiaFields, CRRequestorField } from './CRAcquiaFields.jsx';
import { RichTextEditor } from './RichTextEditor.jsx';
import { generateDocx, downloadBlob, buildCRReplacements } from '../utils/docx.js';
import { extractCRData, extractCRDataFromPDF } from '../utils/parsers.js';
import { getSubconAliases, setSubconAliases, resolveSubcon } from '../data/subconData.js';
import { CR_TEMPLATE_B64 } from '../data/templates.js';
import { StepBar } from './StepBar.jsx';
import { ResourcesEditorCR } from './ResourcesEditorCR.jsx';
import { CRPreview } from './CRPreview.jsx';
import { IconDownload, IconGDrive } from './icons.jsx';
import { FileUploadZone } from './FileUploadZone.jsx';
import { CalculatedSummary } from './CalculatedSummary.jsx';
import { useGDriveUpload } from '../hooks/useGDriveUpload.js';
import { DemoBanner } from './DemoBanner.jsx';
import { SummaryCard } from './SummaryCard.jsx';
import { SAMPLE_CR_FROM_CR_DATA } from '../data/sampleData.js';

const STEPS = ["Project Info", "Timeline & Resources", "Preview & Generate"];
const DRAFT_KEY = 'draft_cr_from_cr';

export function CRFromCR({ onBack, onComplete, sampleMode = false, onExitSample, onStartReal }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(sampleMode ? { ...SAMPLE_CR_FROM_CR_DATA } : {
    custname: "", subcon: "", req: "", reqpoc: "", projname: "", orgsow: "", crno: "", prevcrs: "", doctitle: "",
    acquiaprojid: "", psprogmgr: "",
    ogstdate: "", lenddate: "", enddate: "", exstdate: "", workdays: "", crHolidays: "",
    effimp: "", inchours: "", neffimp: "", prevtotbud: "", newbud: "", newtotbudget: "",
    purpose: DEFAULT_CR_PURPOSE,
    detailsofchange: "",
    resources: []
  });
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { driveUrl, uploading, upload } = useGDriveUpload(setGenMsg);
  const [aliases, setAliases] = useState(() => getSubconAliases().slice());
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseMsg, setParseMsg] = useState("");
  const [docxKey, setDocxKey] = useState(0);
  const [pdfKey, setPdfKey] = useState(0);
  const [draftBanner, setDraftBanner] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [saveFlash, setSaveFlash] = useState(false);
  const autosaveRef = useRef(null);

  useEffect(() => {
    if (sampleMode) return;
    const draft = loadDraft(DRAFT_KEY);
    if (draft && draft.data) setDraftBanner(draft);
  }, []);

  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    if (sampleMode) return;
    autosaveRef.current = setInterval(() => { saveDraft(DRAFT_KEY, dataRef.current); setSavedAt(Date.now()); }, 30000);
    return () => clearInterval(autosaveRef.current);
  }, [sampleMode]);

  const handleSave = () => {
    saveDraft(DRAFT_KEY, data); setSavedAt(Date.now()); setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const confirmNewSubcon = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const next = aliases.concat({ match: trimmed.toLowerCase().split(" ")[0], full: trimmed });
    setAliases(next); setSubconAliases(next);
    setData(d => ({ ...d, custname: trimmed, subcon: trimmed }));
    setNewName(""); setAddingNew(false);
  };

  // Transform extracted CR into "new CR perspective" immediately on upload:
  // previous crPeriods fold into sowPeriods, new empty crPeriods are added,
  // effimp accumulates neffimp, prevcrs is chained, new CR fields are cleared.
  const applyExtracted = (extracted, filename) => {
    const docRef = filename ? filename.replace(/\.(docx|pdf)$/i, "").trim() : "";
    const crBoundary = extracted.enddate || extracted.lenddate || "";
    const chain = [extracted.prevcrs, extracted.crno || docRef].filter(Boolean).join(", ");

    const parsedCustname = resolveSubcon(extracted.custname) || "";
    if (parsedCustname && !aliases.some(a => a.full === parsedCustname)) {
      const updated = aliases.concat({ match: parsedCustname.toLowerCase().split(" ")[0], full: parsedCustname });
      setAliases(updated);
      setSubconAliases(updated);
    }

    setData(prev => {
      const transformedResources = (extracted.resources && extracted.resources.length)
        ? extracted.resources.map(r => ({
            ...r,
            sowPeriods: [
              ...(r.sowPeriods && r.sowPeriods.length
                ? r.sowPeriods
                : [{ startDate: extracted.ogstdate || "", endDate: extracted.lenddate || "", hoursPerDay: "8", holidays: "0" }]),
              ...(r.crPeriods || []).filter(p => p.endDate)
            ],
            crPeriods: [{ startDate: crBoundary, endDate: "", hoursPerDay: "8", holidays: "0" }]
          }))
        : prev.resources;

      return {
        ...prev,
        projname:     extracted.projname     || prev.projname,
        orgsow:       extracted.orgsow       || prev.orgsow,
        ogstdate:     extracted.ogstdate     || prev.ogstdate,
        custname:     parsedCustname         || prev.custname,
        subcon:       parsedCustname         || prev.subcon,
        req:          extracted.req          || prev.req,
        doctitle:     docRef                || prev.doctitle,
        prevcrs:      chain                 || prev.prevcrs,
        lenddate:     crBoundary            || prev.lenddate,
        enddate:      "",
        exstdate:     "",
        workdays:     "",
        crHolidays:   "",
        effimp:       (function() { var a = parseFloat(prev.effimp) || 0; var b = parseFloat(extracted.neffimp || extracted.effimp) || 0; return a || b ? String(a + b) : prev.effimp || ''; })(),
        inchours:     "",
        neffimp:      "",
        prevtotbud:   extracted.newtotbudget || extracted.prevtotbud || prev.prevtotbud,
        newbud:       "",
        newtotbudget: "",
        crno:         "",
        resources:    transformedResources
      };
    });
  };

  const handleDocx = e => {
    const file = e.target.files[0]; if (!file) return;
    setParsing(true); setParseMsg("Reading document...");
    extractCRData(file)
      .then(ex => { applyExtracted(ex, file.name); setParseMsg("✓ CR read! Review the fields below."); })
      .catch(err => { setParseMsg("⚠️ Could not read: " + err.message); })
      .finally(() => { setParsing(false); setDocxKey(k => k + 1); });
  };

  const handlePDF = e => {
    const file = e.target.files[0]; if (!file) return;
    setParsing(true); setParseMsg("Loading PDF reader...");
    extractCRDataFromPDF(file)
      .then(ex => { applyExtracted(ex, file.name); setParseMsg("✓ PDF parsed! Review fields below."); })
      .catch(err => { setParseMsg("⚠️ PDF read failed: " + err.message); })
      .finally(() => { setParsing(false); setPdfKey(k => k + 1); });
  };

  const autoCalcWorkdays = () => set("workdays", String(calcCRExtensionDays(data)));

  const syncHolidays = () => {
    setData(d => {
      const computed = d.resources.filter(r => !r.noExtension).reduce((max, r) => {
        const t = (r.crPeriods || []).reduce((s, p) => s + (parseInt(p.holidays) || 0), 0);
        return Math.max(max, t);
      }, 0);
      const isOverridden = d.crHolidays !== "" && d.crHolidays !== String(computed);
      const valueToSync = isOverridden ? d.crHolidays : String(computed);
      return {
        ...d,
        resources: d.resources.map(r => r.noExtension ? r : ({
          ...r,
          crPeriods: (r.crPeriods || []).map((p, idx) => idx === 0 ? { ...p, holidays: valueToSync } : p)
        }))
      };
    });
  };

  const autoFillAll = () => {
    const sowTotal  = data.resources.reduce((s, r) => s + calcCRSowHours(r), 0);
    const crTotal   = data.resources.reduce((s, r) => s + calcCRCrHours(r), 0);
    const newTotal  = sowTotal + crTotal;
    const newTotBud = calcCRTotalBudget(data.resources);
    const prevBud   = parseFloat(String(data.prevtotbud).replace(/[^0-9.]/g, "")) || 0;
    const incBud    = newTotBud - prevBud;
    setData(d => ({
      ...d,
      effimp:       String(sowTotal),
      inchours:     String(crTotal),
      neffimp:      String(newTotal),
      newbud:       incBud > 0 ? incBud.toFixed(2) : d.newbud,
      newtotbudget: newTotBud > 0 ? newTotBud.toFixed(2) : d.newtotbudget
    }));
  };

  const crFilename = () => `CR-${data.crno || "draft"}-${data.projname || "project"}`
    .replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") + ".docx";


  const handleGenerate = async () => {
    if (!data.crno) { setGenMsg('⚠️ CR Number is required before generating.'); return; }
    if (!data.resources.some(r => r.resource || r.name)) { setGenMsg('⚠️ At least one resource is required before generating.'); return; }
    setGenerating(true); setGenMsg("Generating document...");
    try {
      const blob = await generateDocx(CR_TEMPLATE_B64, buildCRReplacements(data));
      downloadBlob(blob, crFilename());
      setGenMsg("✓ Document downloaded!");
      clearDraft(DRAFT_KEY);
      if (onComplete) onComplete({
        name: `CR — ${data.projname || 'Project'} #${data.crno || '1'}`,
        flow: 'cr-from-cr',
        summary: buildCRSummary(data),
      });
    } catch (err) {
      setGenMsg("⚠️ Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGDriveUpload = () => {
    upload(generateDocx(CR_TEMPLATE_B64, buildCRReplacements(data)), crFilename());
  };

  const msgColor = s => s.startsWith("✓") ? "var(--success)" : s.startsWith("⚠") ? "var(--danger)" : "var(--accent)";

  // ── Step 0 — All CR data in one form ────────────────────────────────────────
  const renderStep0 = () => (
    <div style={{ padding: "32px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <h1 className="page-title" style={{ margin: 0 }}>CR from Existing CR</h1>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {savedAt && <span style={{ fontSize: 11, color: "var(--text3)" }}>● Saved {savedAgoLabel(savedAt)}</span>}
          <button onClick={handleSave} className="btn btn-secondary btn-sm"
            style={saveFlash ? { color: "var(--success)", borderColor: "var(--success)" } : {}}>
            {saveFlash ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      {draftBanner && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--text)" }}>📋 Unsaved draft from <strong>{savedAgoLabel(draftBanner.savedAt)}</strong></span>
          <button onClick={() => { setData(d => ({ ...d, ...draftBanner.data })); setDraftBanner(null); }}
            style={{ fontSize: 12, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Restore</button>
          <button onClick={() => { setDraftBanner(null); clearDraft(DRAFT_KEY); }}
            style={{ fontSize: 12, background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "var(--text3)" }}>Dismiss</button>
        </div>
      )}

      <p className="page-sub">Upload your previous CR to auto-fill — or enter manually below</p>
      <StepBar steps={STEPS} current={step} />

      {/* Upload */}
      {!sampleMode && (
        <FileUploadZone
          title="Upload your previous CR document"
          parsing={parsing}
          onDocx={handleDocx}
          onPDF={handlePDF}
          parseMsg={parseMsg}
          msgColor={msgColor}
          docxKey={docxKey}
          pdfKey={pdfKey}
        />
      )}

      {/* Project Info */}
      <div className="form-section">
        <div className="form-section-title">Project Information</div>
        <div className="form-row">
          <div className="field required">
            <label>Customer / Consultant Name</label>
            {!addingNew ? (
              <select value={data.custname}
                onChange={e => { if (e.target.value === "__add_new__") { setAddingNew(true); setNewName(""); } else { setData(d => ({ ...d, custname: e.target.value, subcon: e.target.value })); } }}
                style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", color: data.custname ? "var(--text)" : "var(--text3)", fontSize: 14 }}>
                <option value="" disabled>Select subcontractor...</option>
                {aliases.map((a, i) => <option key={i} value={a.full}>{a.full}</option>)}
                <option value="__add_new__">+ Add new subcontractor...</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") confirmNewSubcon(); if (e.key === "Escape") { setAddingNew(false); setNewName(""); } }}
                  placeholder="Full company name"
                  style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--accent)", borderRadius: 8, padding: "11px 14px", color: "var(--text)", fontSize: 14 }} />
                <button onClick={confirmNewSubcon} style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "8px 14px", color: "var(--accent)", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Add ✓</button>
                <button onClick={() => { setAddingNew(false); setNewName(""); }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>✕</button>
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
            <label>CR Number</label>
            <input value={data.crno} onChange={e => set("crno", e.target.value)} placeholder="CR-002" required />
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

      <div className="actions">
        <div className="actions-right">
          <button className="btn btn-primary" onClick={() => setStep(1)}>Continue →</button>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => {
    const sowTotal        = data.resources.reduce((s, r) => s + calcCRSowHours(r), 0);
    const crTotal         = data.resources.reduce((s, r) => s + calcCRCrHours(r), 0);
    const newTotal        = sowTotal + crTotal;
    const newTotBud       = calcCRTotalBudget(data.resources);
    const prevBud         = parseFloat(String(data.prevtotbud).replace(/[^0-9.]/g, "")) || 0;
    const incBud          = newTotBud - prevBud;
    const holidayComputed = data.resources.filter(r => !r.noExtension).reduce((max, r) => {
      const t = (r.crPeriods || []).reduce((s, p) => s + (parseInt(p.holidays) || 0), 0);
      return Math.max(max, t);
    }, 0);
    const holidayOverridden = data.crHolidays !== "" && data.crHolidays !== String(holidayComputed);
    return (
    <div style={{ padding: "32px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setStep(0)}>← Back</button>
        <h1 className="page-title" style={{ margin: 0 }}>Timeline & Resources</h1>
      </div>
      <p className="page-sub">Set the extension dates, resource periods, and budget impact</p>
      <StepBar steps={STEPS} current={step} />

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
        <div className="form-row">
          <div className="field">
            <label>Effective Date of CR</label>
            <input type="date" value={data.exstdate} onChange={e => set("exstdate", e.target.value)} />
          </div>
          <div className="field">
            <label>Holidays in CR Period</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" min="0" value={data.crHolidays !== "" ? data.crHolidays : String(holidayComputed)} onChange={e => set("crHolidays", e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-secondary btn-sm" onClick={syncHolidays} title="Push to resource CR periods">→ Resources</button>
            </div>
            <div style={{ fontSize: 11, color: holidayOverridden ? "var(--danger)" : "var(--accent)", marginTop: 3 }}>
              {holidayOverridden ? "Manual override active" : `Auto-synced from resources (max: ${holidayComputed})`}
            </div>
          </div>
          <div className="field">
            <label>Work Days Added</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" value={data.workdays} onChange={e => set("workdays", e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-secondary btn-sm" onClick={autoCalcWorkdays}>Auto-calc</button>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Resources</div>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Set the CR extension periods for each resource.</p>
        <ResourcesEditorCR resources={data.resources} onChange={r => set("resources", r)} crStart={data.lenddate} crEnd={data.enddate} />
      </div>

      <CalculatedSummary
        metrics={[
          { label: "SOW Hours", value: sowTotal },
          { label: "CR Hours", value: crTotal },
          { label: "New Total", value: newTotal },
          { label: "Prev Budget", value: `$${prevBud.toLocaleString()}` },
          { label: "Increase", value: incBud > 0 ? `$${incBud.toFixed(2)}` : "—", color: "var(--accent)" },
          { label: "New Total", value: newTotBud > 0 ? `$${newTotBud.toFixed(2)}` : "—", color: "var(--success)", size: 15, weight: 700 }
        ]}
        onAutoFill={autoFillAll}
      />

      <div className="form-section">
        <div className="form-section-title">Effort & Budget Overrides</div>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Click "Auto-fill All" above or enter values manually.</p>
        <div className="form-row triple">
          <div className="field"><label>Current Hours / SOW (effimp)</label><input value={data.effimp} onChange={e => set("effimp", e.target.value)} placeholder="auto-calc above" /></div>
          <div className="field"><label>Additional CR Hours (inchours)</label><input value={data.inchours} onChange={e => set("inchours", e.target.value)} placeholder="auto-calc above" /></div>
          <div className="field"><label>New Total Hours (neffimp)</label><input value={data.neffimp} onChange={e => set("neffimp", e.target.value)} placeholder="auto-calc above" /></div>
        </div>
        <div className="form-row">
          <div className="field"><label>Previous Total Budget ($)</label><input value={data.prevtotbud} onChange={e => set("prevtotbud", e.target.value)} placeholder="5600" /></div>
          <div className="field"><label>Budget Increase ($)</label><input value={data.newbud} onChange={e => set("newbud", e.target.value)} placeholder="auto-calc above" /></div>
          <div className="field"><label>New Total Budget ($)</label><input value={data.newtotbudget} onChange={e => set("newtotbudget", e.target.value)} placeholder="auto-calc above" /></div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
        <div className="actions-right">
          <button className="btn btn-primary" onClick={() => setStep(2)}>Preview & Generate →</button>
        </div>
      </div>
    </div>
    );
  };

  // ── Step 2 — Preview & Generate ─────────────────────────────────────────────
  const renderStep2 = () => {
    const keyValues = buildCRSummary(data);

    return (
      <div className="split-layout" style={{ gap: 24 }}>
        <div className="form-panel" style={{ paddingTop: 32, paddingBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
            <h1 className="page-title" style={{ margin: 0 }}>Preview & Generate</h1>
          </div>
          <p className="page-sub" style={{ marginBottom: 20 }}>Verify these values match your intent before generating.</p>
          <StepBar steps={STEPS} current={step} />

          <SummaryCard items={keyValues} style={{ marginBottom: 20 }} />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={sampleMode || generating || uploading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '12px 28px' }}>
              <IconDownload />
              {generating ? 'Generating...' : 'Generate & Download .docx'}
            </button>
            <button className="btn btn-secondary" onClick={handleGDriveUpload} disabled={sampleMode || generating || uploading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '12px 20px' }}>
              <IconGDrive />
              {uploading ? 'Uploading...' : 'Save to Google Docs'}
            </button>
          </div>
          {genMsg && <div style={{ marginTop: 10, fontSize: 13, color: msgColor(genMsg) }}>{genMsg}</div>}
          {driveUrl && (
            <a href={driveUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: 8, fontSize: 13, color: 'var(--accent)' }}>
              Open in Google Docs →
            </a>
          )}
        </div>

        <CRPreview data={data} sowData={{}} onEdit={(k, v) => setData(d => ({ ...d, [k]: v }))} showClass="show" />
      </div>
    );
  };

  // ── Root render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {sampleMode && (
        <DemoBanner flowType="cr-from-cr" onExit={onExitSample} onStartReal={onStartReal} />
      )}
      {step === 2 ? (
        renderStep2()
      ) : (
        <div className="split-layout" style={sampleMode ? { height: 'calc(100vh - 160px)' } : {}}>
          <div className="form-panel">
            {step === 1 ? renderStep1() : renderStep0()}
            <button onClick={() => setShowPreview(p => !p)} className="btn btn-secondary preview-toggle-btn">
              {showPreview ? "Hide Preview ▴" : "Show Preview ▾"}
            </button>
          </div>
          <CRPreview data={data} sowData={{}} onEdit={(k, v) => setData(d => ({ ...d, [k]: v }))} showClass={showPreview ? "show" : ""} />
        </div>
      )}
    </div>
  );
}

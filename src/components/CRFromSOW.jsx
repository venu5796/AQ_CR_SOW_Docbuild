import React, { useState, useEffect, useRef } from 'react';
import { saveDraft, loadDraft, clearDraft, encodeLink, decodeLink, savedAgoLabel } from '../utils/draft.js';
import { calcCRSowHours, calcCRCrHours, calcCRExtensionDays, calcCRTotalBudget, DEFAULT_CR_PURPOSE, buildCRSummary } from '../utils/dates.js';
import { CRAcquiaFields, CRRequestorField } from './CRAcquiaFields.jsx';
import { RichTextEditor } from './RichTextEditor.jsx';
import { generateDocx, downloadBlob, buildCRReplacements } from '../utils/docx.js';
import { extractSOWData, extractSOWDataFromPDF, scoreSOWConfidence } from '../utils/parsers.js';
import { ConfDot } from './EditableF.jsx';
import { CR_TEMPLATE_B64 } from '../data/templates.js';
import { getSubconAliases, setSubconAliases, resolveSubcon } from '../data/subconData.js';
import { StepBar } from './StepBar.jsx';
import { ResourcesEditorCR } from './ResourcesEditorCR.jsx';
import { CRPreview } from './CRPreview.jsx';
import { IconDownload, IconPlus, IconGDrive } from './icons.jsx';
import { FileUploadZone } from './FileUploadZone.jsx';
import { CalculatedSummary } from './CalculatedSummary.jsx';
import { parsedFieldClass } from '../utils/classHelpers.js';
import { useGDriveUpload } from '../hooks/useGDriveUpload.js';
import { DemoBanner } from './DemoBanner.jsx';
import { SummaryCard } from './SummaryCard.jsx';
import { Button } from './ui/button.jsx';
import { SAMPLE_CR_FROM_SOW_DATA } from '../data/sampleData.js';

const STEPS = ["Project Info", "Timeline & Resources", "Preview & Generate"];
const DRAFT_KEY = 'draft_cr_from_sow';

const EMPTY_RESOURCE = {
  resource: "", name: "", rate: "",
  sowPeriods: [{ startDate: "", endDate: "", hoursPerDay: "8", holidays: "0" }],
  crPeriods:  [{ startDate: "", endDate: "", hoursPerDay: "8", holidays: "0" }]
};

const DEFAULT_DATA = {
  custname: "", subcon: "", req: "", reqpoc: "", projname: "", orgsow: "", crno: "",
  acquiaprojid: "", psprogmgr: "",
  prevcrs: "SOW", ogstdate: "", lenddate: "", enddate: "", exstdate: "",
  workdays: "", crHolidays: "",
  effimp: "", inchours: "", neffimp: "",
  prevtotbud: "", newbud: "", newtotbudget: "",
  purpose: DEFAULT_CR_PURPOSE,
  detailsofchange: "",
  resources: [{ ...EMPTY_RESOURCE }]
};

export function CRFromSOW({ onBack, onContinue, onComplete, sampleMode = false, onExitSample, onStartReal }) {
  const [step, setStep]       = useState(sampleMode ? 1 : 0);
  const [data, setData]       = useState(sampleMode ? { ...DEFAULT_DATA, ...SAMPLE_CR_FROM_SOW_DATA } : { ...DEFAULT_DATA });
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg]   = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { driveUrl, uploading, upload } = useGDriveUpload(setGenMsg);

  // Upload / parse state
  const [parsing, setParsing]   = useState(false);
  const [parseMsg, setParseMsg] = useState("");
  const [docxKey, setDocxKey]   = useState(0);
  const [pdfKey, setPdfKey]     = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [sowData, setSowData]   = useState(null);

  // Draft autosave state
  const [draftBanner, setDraftBanner] = useState(null); // { data, savedAt } | null
  const [savedAt, setSavedAt]         = useState(null);
  const [linkCopied, setLinkCopied]   = useState(false);
  const autosaveRef = useRef(null);

  // On mount: check URL hash first, then localStorage draft
  useEffect(() => {
    if (sampleMode) return;
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      const decoded = decodeLink(hash);
      if (decoded) {
        setData(d => ({ ...d, ...decoded }));
        window.location.hash = '';
        return;
      }
    }
    const draft = loadDraft(DRAFT_KEY);
    if (draft && draft.data) setDraftBanner(draft);
  }, []);

  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    if (sampleMode) return;
    autosaveRef.current = setInterval(() => {
      saveDraft(DRAFT_KEY, dataRef.current);
      setSavedAt(Date.now());
    }, 30000);
    return () => clearInterval(autosaveRef.current);
  }, [sampleMode]);

  const restoreDraft = () => {
    if (!draftBanner) return;
    setData(d => ({ ...d, ...draftBanner.data }));
    setDraftBanner(null);
  };

  const copyLink = () => {
    const encoded = encodeLink(data);
    if (!encoded) { setGenMsg('⚠️ Could not generate shareable link.'); return; }
    const url = window.location.href.split('#')[0] + '#' + encoded;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }).catch(() => setGenMsg('⚠️ Clipboard write failed.'));
  };

  // Subcontractor dropdown state
  const [aliases, setAliases] = useState(() => getSubconAliases().slice());
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName]     = useState("");

  // ── helpers ──────────────────────────────────────────────────────────────
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const confirmNewSubcon = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const next = aliases.concat({ match: trimmed.toLowerCase().split(" ")[0], full: trimmed });
    setAliases(next);
    setSubconAliases(next);
    setData(d => ({ ...d, subcon: trimmed, custname: trimmed }));
    setNewName(""); setAddingNew(false);
  };

  const applyExtracted = (extracted, filename) => {
    const resolved = resolveSubcon(extracted.Subcon || "");
    // Auto-add parsed subcon to dropdown if not already an option
    if (resolved && !aliases.some(a => a.full === resolved)) {
      const updated = aliases.concat({ match: resolved.toLowerCase().split(" ")[0], full: resolved });
      setAliases(updated);
      setSubconAliases(updated);
    }
    const sowRef = filename
      ? filename.replace(/\.(docx|pdf)$/i, "").replace(/[-_]/g, " ").trim()
      : "";
    const next = {
      subcon:     resolved || "",
      custname:   resolved || "",
      req:        extracted.Custname || "",
      projname:   extracted.Projname || "",
      orgsow:     sowRef || "",
      ogstdate:   extracted.Strtdate || "",
      lenddate:   extracted.Enddate  || "",
      prevtotbud: extracted.Total_Fee || "",
      resources:  (extracted.resources && extracted.resources.length)
                    ? extracted.resources
                    : [{ ...EMPTY_RESOURCE }]
    };
    setData(prev => ({ ...prev, ...next }));
    setSowData(next);
    setConfidence(scoreSOWConfidence(extracted, resolved));
  };

  const handleDocx = e => {
    const file = e.target.files[0]; if (!file) return;
    setParsing(true); setParseMsg("Reading document...");
    extractSOWData(file)
      .then(ex => { applyExtracted(ex, file.name); setParseMsg("✓ SOW read! Review the fields below."); })
      .catch(err => { setParseMsg("⚠️ Could not read: " + err.message); })
      .finally(() => { setParsing(false); setDocxKey(k => k + 1); });
  };

  const handlePDF = e => {
    const file = e.target.files[0]; if (!file) return;
    setParsing(true); setParseMsg("Loading PDF reader...");
    extractSOWDataFromPDF(file)
      .then(ex => { applyExtracted(ex, file.name); setParseMsg("✓ PDF parsed! Review fields below."); })
      .catch(err => { setParseMsg("⚠️ PDF read failed: " + err.message); })
      .finally(() => { setParsing(false); setPdfKey(k => k + 1); });
  };

  // ── Auto-calc helpers ─────────────────────────────────────────────────────
  const autoCalcWorkdays = () => {
    const days = calcCRExtensionDays(data);
    set("workdays", String(days));
  };

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
          crPeriods: (r.crPeriods || []).map((p) => ({ ...p, holidays: valueToSync }))
        }))
      };
    });
  };

  const autoFillAll = () => {
    const sowTotal = data.resources.reduce((s, r) => s + calcCRSowHours(r), 0);
    const crTotal  = data.resources.reduce((s, r) => s + calcCRCrHours(r), 0);
    const newTotal = sowTotal + crTotal;
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
        flow: 'cr-from-sow',
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

  const handlePreviewEdit = (fieldKey, value) => set(fieldKey, value);

  // ── Shared colors ─────────────────────────────────────────────────────────
  const msgColor = s =>
    s.startsWith("✓") ? "var(--success)" : s.startsWith("⚠") ? "var(--danger)" : "var(--accent)";

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 0 — SOW Data
  // ─────────────────────────────────────────────────────────────────────────
  const renderStep0 = () => (
    <div style={{ padding: "32px 0 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <h1 className="page-title" style={{ margin: 0 }}>CR from Existing SOW</h1>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {savedAt && (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>● Saved {savedAgoLabel(savedAt)}</span>
          )}
          <button
            onClick={copyLink}
            title="Copy shareable link with current form data"
            style={{ fontSize: 11, fontWeight: 600, background: linkCopied ? "rgba(5,150,105,0.1)" : "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: linkCopied ? "var(--success)" : "var(--text2)", whiteSpace: "nowrap" }}
          >
            {linkCopied ? "✓ Copied!" : "🔗 Copy Link"}
          </button>
        </div>
      </div>
      <p className="page-sub">Upload your SOW to auto-fill — or enter manually below</p>
      <StepBar steps={STEPS} current={step} />

      {/* Draft restore banner */}
      {draftBanner && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--amber-s)", border: "1px solid var(--accent-t)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--text)" }}>
            📋 You have an unsaved draft from <strong>{savedAgoLabel(draftBanner.savedAt)}</strong>
          </span>
          <button onClick={restoreDraft} style={{ fontSize: 12, fontWeight: 600, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>Restore</button>
          <button onClick={() => { setDraftBanner(null); clearDraft(DRAFT_KEY); }} style={{ fontSize: 12, background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "var(--text3)" }}>Dismiss</button>
        </div>
      )}

      {/* Upload block */}
      <FileUploadZone
        title="Upload your SOW document"
        parsing={parsing}
        onDocx={handleDocx}
        onPDF={handlePDF}
        parseMsg={parseMsg}
        msgColor={msgColor}
        confidence={confidence}
        confidenceFields={[
          { label: "Subcontractor", key: "subcon" },
          { label: "Acquia's Customer", key: "req" },
          { label: "Project", key: "projname" },
          { label: "Dates", key: "ogstdate" },
          { label: "Budget", key: "prevtotbud" }
        ]}
        docxKey={docxKey}
        pdfKey={pdfKey}
      />

      {/* Project Information */}
      <div className="form-section">
        <div className="form-section-title">Project Information</div>
        <div className="form-row single">
          <div className="field">
            <label>Subcontractor Company Name<ConfDot level={confidence?.subcon} /></label>
            {!addingNew ? (
              <select
                value={data.subcon}
                onChange={e => {
                  if (e.target.value === "__add_new__") { setAddingNew(true); setNewName(""); }
                  else setData(d => ({ ...d, subcon: e.target.value, custname: e.target.value }));
                }}
                className={parsedFieldClass(sowData, "subcon")}
                style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "11px 14px", color: data.subcon ? "var(--text)" : "var(--text3)", fontSize: 14 }}
              >
                <option value="" disabled>Select subcontractor...</option>
                {aliases.map((a, i) => <option key={i} value={a.full}>{a.full}</option>)}
                <option value="__add_new__">+ Add new subcontractor...</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") confirmNewSubcon(); if (e.key === "Escape") { setAddingNew(false); setNewName(""); } }}
                  placeholder="Full company name"
                  style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--accent)", borderRadius: 8, padding: "11px 14px", color: "var(--text)", fontSize: 14 }}
                />
                <button onClick={confirmNewSubcon} style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "8px 14px", color: "var(--accent)", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>Add ✓</button>
                <button onClick={() => { setAddingNew(false); setNewName(""); }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text2)", fontSize: 12, cursor: "pointer" }}>✕</button>
              </div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="field required">
            <label>Acquia's Customer<ConfDot level={confidence?.req} /></label>
            <input className={parsedFieldClass(sowData, "req")} value={data.req} onChange={e => set("req", e.target.value)} placeholder="Acquia Inc." required />
          </div>
          <div className="field">
            <label>Project Name<ConfDot level={confidence?.projname} /></label>
            <input className={parsedFieldClass(sowData, "projname")} value={data.projname} onChange={e => set("projname", e.target.value)} placeholder="Drupal Migration 2025" />
          </div>
        </div>
        <CRRequestorField data={data} set={set} />
        <div className="form-row">
          <div className="field">
            <label>SOW Reference</label>
            <input className={parsedFieldClass(sowData, "orgsow")} value={data.orgsow} onChange={e => set("orgsow", e.target.value)} placeholder="SOW-2025-001" />
          </div>
          <div className="field required">
            <label>CR Number</label>
            <input value={data.crno} onChange={e => set("crno", e.target.value)} placeholder="CR-001" required />
          </div>
        </div>
        <div className="form-row single">
          <div className="field">
            <label>Previous Change Requests</label>
            <input value={data.prevcrs} onChange={e => set("prevcrs", e.target.value)} />
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>Defaults to "SOW" for a first CR</div>
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

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — Timeline & Resources
  // ─────────────────────────────────────────────────────────────────────────
  const renderStep1 = () => {
    const sowTotal  = data.resources.reduce((s, r) => s + calcCRSowHours(r), 0);
    const crTotal   = data.resources.reduce((s, r) => s + calcCRCrHours(r), 0);
    const newTotal  = sowTotal + crTotal;
    const newTotBud = calcCRTotalBudget(data.resources);
    const prevBud   = parseFloat(String(data.prevtotbud).replace(/[^0-9.]/g, "")) || 0;
    const incBud    = newTotBud - prevBud;
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
          <button onClick={copyLink} title="Copy shareable link" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, background: linkCopied ? "rgba(5,150,105,0.1)" : "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", color: linkCopied ? "var(--success)" : "var(--text2)" }}>
            {linkCopied ? "✓ Copied!" : "🔗 Copy Link"}
          </button>
        </div>
        <p className="page-sub">Set the extension dates, resource periods, and budget impact</p>
        <StepBar steps={STEPS} current={step} />

        {/* Timeline */}
        <div className="form-section">
          <div className="form-section-title">Timeline</div>
          <div className="form-row triple">
            <div className="field required">
              <label>Original Start Date<ConfDot level={confidence?.ogstdate} /></label>
              <input className={parsedFieldClass(sowData, "ogstdate")} type="date" value={data.ogstdate} onChange={e => set("ogstdate", e.target.value)} required />
            </div>
            <div className="field">
              <label>Previous End Date<ConfDot level={confidence?.lenddate} /></label>
              <input className={parsedFieldClass(sowData, "lenddate")} type="date" value={data.lenddate} onChange={e => set("lenddate", e.target.value)} />
            </div>
            <div className="field required">
              <label>New End Date</label>
              <input type="date" value={data.enddate} onChange={e => set("enddate", e.target.value)} required />
            </div>
          </div>
          <div className="form-row triple">
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
                <button className="btn btn-secondary btn-sm" onClick={autoCalcWorkdays} title="Calculate from Previous End Date → New End Date minus holidays">Auto-calc</button>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="form-section">
          <div className="form-section-title">Resources</div>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Set the CR extension periods for each resource.</p>
          <ResourcesEditorCR
            resources={data.resources}
            onChange={r => set("resources", r)}
            crStart={data.lenddate}
            crEnd={data.enddate}
          />
        </div>

        {/* Auto-calc summary bar */}
        <CalculatedSummary
          metrics={[
            { label: "Orig Hours", value: sowTotal },
            { label: "CR Hours", value: crTotal },
            { label: "New Total", value: newTotal },
            { label: "Prev Budget", value: `$${prevBud.toLocaleString()}` },
            { label: "Increase", value: incBud > 0 ? `$${incBud.toFixed(2)}` : "—", color: "var(--accent)" },
            { label: "New Total", value: newTotBud > 0 ? `$${newTotBud.toFixed(2)}` : "—", color: "var(--success)", size: 15, weight: 700 }
          ]}
          onAutoFill={autoFillAll}
        />

        {/* Override fields */}
        <div className="form-section">
          <div className="form-section-title">Effort &amp; Budget Overrides</div>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Click "Auto-fill All" above or enter values manually.</p>
          <div className="form-row triple">
            <div className="field">
              <label>Original Hours (effimp)</label>
              <input value={data.effimp} onChange={e => set("effimp", e.target.value)} placeholder="auto-calc above" />
            </div>
            <div className="field">
              <label>Additional CR Hours (inchours)</label>
              <input value={data.inchours} onChange={e => set("inchours", e.target.value)} placeholder="auto-calc above" />
            </div>
            <div className="field">
              <label>New Total Hours (neffimp)</label>
              <input value={data.neffimp} onChange={e => set("neffimp", e.target.value)} placeholder="auto-calc above" />
            </div>
          </div>
          <div className="form-row triple">
            <div className="field">
              <label>Previous Total Budget ($)<ConfDot level={confidence?.prevtotbud} /></label>
              <input className={parsedFieldClass(sowData, "prevtotbud")} value={data.prevtotbud} onChange={e => set("prevtotbud", e.target.value)} placeholder="120000" />
            </div>
            <div className="field">
              <label>Budget Increase ($) (newbud)</label>
              <input value={data.newbud} onChange={e => set("newbud", e.target.value)} placeholder="auto-calc above" />
            </div>
            <div className="field">
              <label>New Total Budget ($) (newtotbudget)</label>
              <input value={data.newtotbudget} onChange={e => set("newtotbudget", e.target.value)} placeholder="auto-calc above" />
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
          <div className="actions-right">
            <button className="btn btn-primary" onClick={() => setStep(2)}>Preview &amp; Generate →</button>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — Preview & Generate
  // ─────────────────────────────────────────────────────────────────────────
  const renderStep2 = () => {
    const keyValues = buildCRSummary(data);

    return (
      <div className="split-layout" style={{ gap: 24 }}>
        {/* Left — confirm + generate */}
        <div className="form-panel" style={{ paddingTop: 32, paddingBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
            <h1 className="page-title" style={{ margin: 0 }}>Preview &amp; Generate</h1>
          </div>
          <p className="page-sub" style={{ marginBottom: 20 }}>Verify these values match your intent before generating.</p>
          <StepBar steps={STEPS} current={step} />

          <SummaryCard items={keyValues} style={{ marginBottom: 20 }} />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={sampleMode || generating || uploading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '12px 28px' }}
            >
              <IconDownload />
              {generating ? 'Generating...' : 'Generate & Download .docx'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleGDriveUpload}
              disabled={sampleMode || generating || uploading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '12px 20px' }}
            >
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

        {/* Right — live preview */}
        <CRPreview data={data} sowData={sowData} onEdit={handlePreviewEdit} showClass="show" />
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Root render — split layout (form + preview sidebar for steps 0 & 1)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {sampleMode && (
        <DemoBanner flowType="cr-from-sow" onExit={onExitSample} onStartReal={onStartReal} />
      )}

      {step === 2 ? (
        renderStep2()
      ) : (
        <div className="split-layout" style={sampleMode ? { height: 'calc(100vh - 160px)' } : {}}>
          <div className="form-panel">
            {step === 0 && renderStep0()}
            {step === 1 && renderStep1()}
            <button onClick={() => setShowPreview(p => !p)} className="btn btn-secondary preview-toggle-btn">
              {showPreview ? "Hide Preview ▴" : "Show Preview ▾"}
            </button>
          </div>
          <CRPreview data={data} sowData={sowData} onEdit={handlePreviewEdit} showClass={showPreview ? "show" : ""} />
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { IconUpload } from './icons.jsx';
import { ConfBar } from './EditableF.jsx';

export function FileUploadZone({
  title = "Upload document",
  subtitle = "Drop a file here or click to browse",
  parsing = false,
  onDocx,
  onPDF,
  parseMsg = "",
  msgColor = () => "var(--text2)",
  confidence = null,
  confidenceFields = [],
  docxKey = "docx",
  pdfKey = "pdf"
}) {
  return (
    <div className="upload-zone">
      <div className="upload-zone-icon">
        <IconUpload />
      </div>
      <div className="upload-zone-title">{title}</div>
      <div className="upload-zone-subtitle">{subtitle}</div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
        <label className={`upload-btn upload-btn-primary${parsing ? ' disabled' : ''}`}>
          {parsing ? "⏳ Reading..." : "Choose DOCX"}
          <input key={docxKey} type="file" accept=".docx" onChange={onDocx} disabled={parsing} style={{ display: "none" }} />
        </label>
        <label className={`upload-btn upload-btn-secondary${parsing ? ' disabled' : ''}`}>
          {parsing ? "⏳ Reading..." : "Choose PDF"}
          <input key={pdfKey} type="file" accept=".pdf" onChange={onPDF} disabled={parsing} style={{ display: "none" }} />
        </label>
      </div>

      {parseMsg && <div style={{ marginTop: 16, fontSize: 13, color: msgColor(parseMsg), fontWeight: 500 }}>{parseMsg}</div>}

      {confidence && confidenceFields.length > 0 && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text2)", textAlign: "left" }}>
          <div style={{ fontWeight: 600, fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Parse Confidence</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
            {confidenceFields.map((field, i) => (
              <ConfBar key={i} label={field.label} level={confidence[field.key]} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';

// Content here is mirrored in USER-GUIDE.md (repo root) — update both when a flow's steps change.
export function HelpView({ onBack }) {
  const [open, setOpen] = useState(null);

  const sections = [
    {
      id: "overview", icon: "🏠", title: "Overview", color: "var(--accent)",
      content: (
        <>
          <p>This app lets you generate professional <strong>Partner Statements of Work (SOW)</strong> and <strong>Partner Change Requests (CR)</strong> directly from Acquia's official Word templates — no manual editing required.</p>
          <p style={{ marginTop: 10 }}>You fill in a form, the app injects your data into the real <code>.docx</code> template, and you download a ready-to-sign Word document.</p>
          <div style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "12px 16px", marginTop: 12, fontSize: 13, color: "var(--accent)" }}>
            💡 The live preview on the right updates as you type — it mirrors the full document structure so you can catch errors before generating.
          </div>
        </>
      )
    },
    {
      id: "sow", icon: "📄", title: "Creating a New SOW", color: "var(--accent)",
      content: (
        <>
          <p>Use <strong>New SOW</strong> when starting a brand-new project. It generates a complete Subcontractor Statement of Work pre-filled with all your project details.</p>
          <div style={{ marginTop: 12 }}>
            {[
              ["Step 1 — Project Info", "Contract Information (subcontractor name/address, customer name), Project Details (project name, description), and Subcontractor POC (name, email)."],
              ["Step 2 — Timeline & Resources", "Set the project timeline and total fee, then add staffed resources: role, name, hours, and rate. Total cost per resource auto-calculates from hours × rate."],
              ["Step 3 — Preview & Generate", "Check the live preview, then click Generate & Download (or Save to Google Docs)."]
            ].map(([title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--text)", color: "var(--bg)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {["1", "2", "3"][["Step 1", "Step 2", "Step 3"].findIndex(s => title.startsWith(s))]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{title}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: "cr-scratch", icon: "📋", title: "Creating a New CR (from scratch)", color: "var(--accent)",
      content: (
        <>
          <p>Use <strong>New CR</strong> when you need a standalone Change Request and don't have a source document to upload.</p>
          <div style={{ marginTop: 12 }}>
            {[
              ["Step 1 — Project Info", "Customer, requestor, project name, original SOW reference, new CR number, previous CRs, and the Details of Change rich-text block."],
              ["Step 2 — Timeline & Resources", "Set dates and the working-days extension, add resources with SOW/CR hours and rates, then Effort & Budget Overrides — totals auto-calculate but can be overridden."],
              ["Step 3 — Preview & Generate", "Review the summary card and live preview, then generate."]
            ].map(([title, desc], i) => (
              <div key={title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--text)", color: "var(--bg)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{title}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: "cr-from-sow", icon: "🔗", title: "CR from SOW", color: "var(--accent)",
      content: (
        <>
          <p>Use <strong>CR from SOW</strong> for an engagement's first amendment — upload the signed SOW and the form auto-fills.</p>
          <div style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "12px 16px", marginTop: 10, marginBottom: 14, fontSize: 13, color: "var(--accent)" }}>
            ✓ Fields with a green background were auto-filled by the parser — check them, they're still editable.
          </div>
          {[
            ["Step 1 — Project Info", "Upload the SOW (.docx or .pdf) at the top of this step. Customer, requestor, project name, SOW reference, CR number, and details of change all live here."],
            ["Step 2 — Timeline & Resources", "Dates, resources carried forward from the SOW, and budget overrides."],
            ["Step 3 — Preview & Generate", "Summary card and live preview, then generate or save to Google Docs."]
          ].map(([title, desc], i) => (
            <div key={title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--text)", color: "var(--bg)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{title}</div>
                <div style={{ color: "var(--text2)", fontSize: 13 }}>{desc}</div>
              </div>
            </div>
          ))}
        </>
      )
    },
    {
      id: "cr-from-cr", icon: "🔁", title: "CR from existing CR (chaining)", color: "var(--accent)",
      content: (
        <>
          <p>Use <strong>CR from existing CR</strong> when a project with previous CRs needs to be extended again.</p>
          <div style={{ background: "var(--accent-s)", border: "1px solid var(--accent-t)", borderRadius: 8, padding: "12px 16px", marginTop: 10, marginBottom: 14, fontSize: 13, color: "var(--accent)" }}>
            🔁 Example chain: SOW → CR-001 → CR-002. Build CR-002 by uploading CR-001 as the baseline.
          </div>
          {[
            ["Step 1 — Project Info", "Upload the most recent CR (.docx or .pdf). Its numbers become the new baseline — previous CR periods fold into the SOW side, ready for the next extension."],
            ["Step 2 — Timeline & Resources", "Same shape as the other CR flows: dates, resources, and budget overrides."],
            ["Step 3 — Preview & Generate", "Summary card and live preview, then generate or save to Google Docs."]
          ].map(([title, desc], i) => (
            <div key={title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--text)", color: "var(--bg)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{title}</div>
                <div style={{ color: "var(--text2)", fontSize: 13 }}>{desc}</div>
              </div>
            </div>
          ))}
        </>
      )
    },
    {
      id: "output", icon: "📥", title: "Output & .docx Generation", color: "var(--success)",
      content: (
        <>
          <p>Clicking <strong>Generate & Download</strong> produces a <code>.docx</code> file ready for Microsoft Word.</p>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["File name", "Named automatically: [SOW/CR]_[ProjectName]_[Date].docx."],
              ["Formatting", "All original formatting, headers, footers, and table styles are preserved exactly as in the official templates."],
              ["To convert to PDF", "Open in Word and use File → Export → PDF for the highest fidelity."]
            ].map(([label, desc]) => (
              <div key={label} style={{ display: "flex", gap: 10, fontSize: 13 }}>
                <div style={{ color: "var(--success)", fontWeight: 700, flexShrink: 0, minWidth: 120 }}>{label}</div>
                <div style={{ color: "var(--text2)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: "tips", icon: "💡", title: "Tips & Common Questions", color: "var(--text2)",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
          {[
            ["Can I go back and edit?", "Yes — use the Previous button. All data is preserved while you navigate steps within a session (not across a page reload, unless autosave kicked in)."],
            ["Resource auto-calc", "In SOW resources, the Total calculates automatically from Hours × Rate. In CR resources, leave the Total blank to auto-calculate from New Total Hours × Rate."],
            ["Does my work autosave?", "Draft form state autosaves to your browser every 30 seconds, with a restore banner on your next visit. This is per-browser, not shared across devices."],
            ["How do shareable links work?", "Some flows let you copy a link that encodes the full form state in the URL. Don't share these outside your team if the values (customer name, budget) are sensitive."],
            ["A field didn't parse from my PDF upload — now what?", "DOCX uploads parse more reliably than PDF. Just fill the blank field in manually — the rest of the form still works normally."]
          ].map(([q, a]) => (
            <div key={q}>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>Q: {q}</div>
              <div style={{ color: "var(--text2)", paddingLeft: 12, borderLeft: "2px solid var(--border)" }}>{a}</div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="page" style={{ maxWidth: 740 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <h1 className="page-title" style={{ margin: 0 }}>How to Use</h1>
      </div>
      <p className="page-sub">Everything you need to know about creating Partner documents</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sections.map(s => (
          <div key={s.id} style={{ background: "var(--surface)", border: `1px solid ${open === s.id ? s.color + "44" : "var(--border)"}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer", userSelect: "none" }} onClick={() => setOpen(open === s.id ? null : s.id)}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{s.title}</div>
              </div>
              <div style={{ color: open === s.id ? s.color : "var(--text3)", fontSize: 18, transition: "transform 0.2s", transform: open === s.id ? "rotate(180deg)" : "none" }}>▾</div>
            </div>
            {open === s.id && (
              <div style={{ padding: "0 20px 20px", color: "var(--text2)", fontSize: 13, lineHeight: 1.7, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                {s.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

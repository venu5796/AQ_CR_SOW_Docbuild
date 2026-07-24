# User Guide — Acquia Doc Builder

> Content here is mirrored in the in-app "How to Use" page (`src/components/HelpView.jsx`) — update both when a flow's steps change.

Generate Acquia's official Partner **Statement of Work (SOW)** and **Change Request (CR)** documents from a guided form — no manual copy-paste-reformat. Fill in the form, watch the live preview on the right update as you type, then download a ready-to-sign `.docx` (or push it straight to Google Docs).

Sign-in is restricted to `@acquia.com` Google accounts.

## The four flows

| Flow | Use it when... | Typical time |
|---|---|---|
| **New SOW** | Starting a brand-new subcontractor engagement from scratch | ~3 min |
| **New CR** | Drafting a Change Request from scratch, no source document to upload | ~2 min |
| **CR from SOW** | The engagement's first amendment — upload the signed SOW (.docx/.pdf) and the form auto-fills | ~90 sec |
| **CR from existing CR** | A second (or later) amendment — upload the most recent CR and the form chains forward from it | ~90 sec |

Every flow is the same **3-step wizard**: **Project Info → Timeline & Resources → Preview & Generate**. Use the Previous/Next buttons to move between steps — nothing is lost while you navigate within a session.

## 1. New SOW

1. **Project Info** — Contract Information (subcontractor name/address, customer name), Project Details (project name, description), Subcontractor POC (name, email).
2. **Timeline & Resources** — Project timeline dates and total fee, then add staffed resources (role, name, hours, rate). Each resource's total cost auto-calculates from hours × rate.
3. **Preview & Generate** — Review the live preview, then **Generate & Download** (or **Save to Google Docs**).

## 2. New CR (from scratch)

1. **Project Info** — Customer, requestor (`req`), project name, original SOW reference, new CR number, any previous CRs, and the "Details of Change" rich-text block.
2. **Timeline & Resources** — Dates and working-days extension, resources with SOW/CR hours and rates, then Effort & Budget Overrides (original hours/budget, additional CR hours, budget increase — new totals auto-calculate but can be overridden).
3. **Preview & Generate** — Review the summary card and live preview, then generate.

## 3. CR from SOW

1. **Project Info** — Upload the original SOW (.docx or .pdf) at the top of this step; fields with a green background were auto-filled by the parser — check them, they're still editable. Same fields as New CR's step 1 (customer, requestor, project name, SOW reference, CR number, details of change).
2. **Timeline & Resources** — Same as New CR's step 2: dates, resources (carried forward from the SOW), and budget overrides.
3. **Preview & Generate** — Summary card + live preview, then generate or save to Google Docs.

## 4. CR from existing CR (chaining)

1. **Project Info** — Upload the most recent CR (.docx or .pdf). Its numbers become the new baseline — previous CR periods fold into the "SOW" side of the ledger, ready for you to add the next extension on top. Example chain: SOW → CR-001 → CR-002, built by uploading CR-001 to produce CR-002.
2. **Timeline & Resources** — Same shape as the other CR flows: dates, resources, budget overrides.
3. **Preview & Generate** — Summary card + live preview, then generate or save to Google Docs.

## Output

- **File download**: click **Generate & Download** for an immediate `.docx` file, formatted exactly per Acquia's official templates (headers, footers, table styles preserved).
- **Google Docs**: click **Save to Google Docs** to push the same generated document to Drive as a native Google Doc instead of a downloaded file.
- **To get a PDF**: open the downloaded `.docx` in Word and use File → Export → PDF for the highest-fidelity conversion.

## Tips & common questions

**Can I go back and edit a previous step?**
Yes — use the Previous button. Data is preserved while navigating steps within a session. (It isn't preserved across a page reload unless you're relying on autosave — see below.)

**Does my work autosave?**
Draft form state autosaves to your browser every 30 seconds, with a restore banner on your next visit. This is per-browser, not shared across devices.

**How does resource auto-calc work?**
SOW resources: Total = Hours × Rate, calculated automatically. CR resources: leave the New Total budget field blank to have it auto-calculate from New Total Hours × Rate; type a value to override it.

**How do "shareable links" work?**
Some flows let you copy a link that encodes the full form state in the URL itself, so opening it on another device/browser restores your in-progress form. Because the data lives in the URL, don't share these links outside your team if the values (customer name, budget) are sensitive.

**Why didn't a field parse correctly from my uploaded PDF?**
DOCX uploads parse more reliably than PDF. If a field (especially dates) comes through blank after a PDF upload, just fill it in manually — the rest of the form still works normally.

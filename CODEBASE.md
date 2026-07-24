# Acquia SOW/CR Generator — Codebase Map

> Quick-reference for navigating the source. Read this before opening any file.
> Stack: Vite + React 19, no router (manual `view` state), deployed to Acquia Apache (dist committed to repo).

---

## App entry & routing

| File | Lines | Role |
|---|---|---|
| `src/main.jsx` | 10 | Mounts `<App />` into `#root` |
| `src/App.jsx` | 280 | Top-level: `view` state, nav tabs, settings panel, recent-docs list. Calls `setSubconAliases(contractorAliases(loadContractors()))` at **module level** (before first render) so child components see custom contractors on mount. `useEffect([contractors])` keeps aliases in sync on subsequent changes. Wraps everything in `<AuthGate>`. |

**View keys** (set via `navigate(v)`):
- `home` → `Home`
- `sow` → `SOWForm`
- `cr` → `CRForm` (create CR from scratch; receives optional `sowPrefill`)
- `cr-from-sow` → `CRFromSOW` (upload SOW → generate CR)
- `cr-from-cr` → `CRFromCR` (upload existing CR → generate next CR)
- `success` → `Success`

---

## Components (`src/components/`)

| File | Lines | Purpose |
|---|---|---|
| `App.jsx` | 280 | See above |
| `AuthGate.jsx` | 70 | Google OAuth gate — restricts access to `@acquia.com` accounts; reads `sessionStorage['docbuilder_auth']` (bypassed in Playwright tests via `addInitScript`) |
| `Home.jsx` | 181 | Landing page, mode-select cards, recent docs |
| `SOWForm.jsx` | 336 | 3-step SOW wizard (Project Info → Timeline & Resources → Preview & Generate); `buildSOWReplacements()` used by both download and Drive upload handlers; `useEffect` auto-shows preview on step 2 |
| `SOWPreview.jsx` | 159 | Live HTML preview of SOW |
| `CRForm.jsx` | 362 | 3-step CR wizard (same step labels as all other flows); `HolidaysField` auto-syncs from resources; uses `buildCRSummary` from `dates.js` on step 2 |
| `CRFromSOW.jsx` | 618 | Upload SOW (DOCX/PDF) → 3-step CR form. Step 0: upload block + Project Info section. Step 1: Timeline & Resources + budget overrides. Step 2: SummaryCard + CRPreview + generate. `applyExtracted` → `handleGenerate`. |
| `CRFromCR.jsx` | 519 | Upload existing CR → 3-step chain form. `applyExtracted` folds prev `crPeriods` into `sowPeriods`, clears new CR fields. Same 3-step shape as all other flows. |
| `CRPreview.jsx` | 190 | Live HTML preview of CR doc |
| `CRAcquiaFields.jsx` | 35 | `CRAcquiaFields` (Acquia Project ID + PS Program Manager inputs) and `CRRequestorField` (Requestor POC input) — both use `alnum()` sanitizer; imported by all 3 CR flows |
| `RichTextEditor.jsx` | 74 | TipTap v3 rich text editor for the CR "Details of Change" block. Toolbar: Bold/Italic/Underline/Strike/H1-H3/Bullet+Ordered lists/Link/Undo/Redo. Emits HTML via `onChange`; `lastEmitted` ref avoids redundant `getHTML()` per keystroke. |
| `SummaryCard.jsx` | 24 | `<SummaryCard title items style />` — key-value summary grid on step 2 of all 4 flows and on the Success screen |
| `ResourcesEditorCR.jsx` | 116 | CR resource cards: SOW Hours input, CR Periods (`PeriodEditor`), `noExtension` checkbox toggle |
| `ResourcesEditorSOW.jsx` | 135 | SOW resource cards |
| `PeriodEditor.jsx` | 91 | Reusable date-range + hours/day + holidays period editor |
| `NavDrawer.jsx` | 49 | Mobile nav drawer |
| `StepBar.jsx` | 22 | 3-step indicator (`["Project Info", "Timeline & Resources", "Preview & Generate"]`); rendered inside the form panel below the page title on all 4 flows |
| `DemoBanner.jsx` | 33 | "You're in demo mode" banner shown when sample data is loaded |
| `EditableF.jsx` | 79 | Inline-editable field wrapper; supports `type="textarea"` for multi-line inline edit |
| `F.jsx` | 6 | Simple field display |
| `HelpView.jsx` | 178 | Help/docs overlay |
| `Success.jsx` | 54 | Post-generate success screen with SummaryCard, download link, and follow-on CR shortcut |
| `icons.jsx` | 51 | SVG icon components; includes `IconGDrive` (cloud-upload) |

---

## Styling (`src/index.css`)

**1900+ lines of CSS** — All styling, theming, and layout rules.

### Key Layout Classes

| Class | Purpose |
|---|---|
| `.split-layout` | Main 35/65 split container (`display: flex`, `height: calc(100vh - 110px)`) |
| `.form-panel` | Left column (35% width, max 450px, scrollable) |
| `.preview-panel` | Right column (65% width, flex: 1, scrollable) |
| `.preview-doc` | Document display (full-width, 13pt font, 60px/80px padding) |

### Form Structure

| Class | Purpose |
|---|---|
| `.field` | Vertical field container (label above input, 6px spacing) |
| `.form-row` | Grid row (2 columns, 16px gap, 20px margin-bottom) |
| `.form-section` | Section card (24px padding, 20px margin-bottom) |
| `.step-bar` | Progress indicator (3 steps, 12px padding, equal spacing) |

### Layout Proportions

- **Desktop**: 35% form / 65% preview
- **Tablet (1024px)**: 40% form / 60% preview  
- **Mobile (768px)**: Stacked layout, preview toggleable

### Independent Scrolling

- Both columns: `overflow-y: auto`, `height: 100%`
- Container: `overflow: hidden` (locks viewport)
- Form scrolls independently from preview

### Preview Document Specs

- **Font**: 14px base (all internal elements use `inherit`/`em`)
- **Line-height**: 1.6
- **Padding**: 24px/32px (panel padding, no document padding)
- **Width**: 100% of preview panel (no max-width constraint)
- **Background**: White (no floating page effect)

### Material Design Effects

- Flow cards: Deep shadows (2dp → 8dp hover), color-tinted ripples
- Trailing cursor: Circle follows mouse with delay, dot sticks to cursor, click/hover effects
- Input focus: 2px border, 18% opacity ring, label highlights on focus-within
- Upload zone: Hover tints accent, icon lifts; buttons neutral with blue tint hover
- Topnav: 110px height, image logo (logo2.png) at 90px; dark mode adds white background box around logo (100px)

---

## Hooks (`src/hooks/`)

| File | Lines | Purpose |
|---|---|---|
| `useGDriveUpload.js` | 27 | `useGDriveUpload(setGenMsg)` → `{ driveUrl, uploading, upload(blobPromise, filename) }` — manages Drive upload state and callbacks; used by all 4 generate forms |

---

## Utils (`src/utils/`)

### `parsers.js` (~900 lines) — All parsing logic
Imports `loadJSZip` and `unesc` from `docx.js`. All XML entity decoding uses `unesc()`.

Internal helper: `safeExtract(fn, label)` — wraps async extraction in try/catch, logs errors, returns null on failure. Used by all 4 `extract*` functions.

| Export | Description |
|---|---|
| `parseDocxXml(file)` | Unzips DOCX → returns `word/document.xml` text |
| `xmlParagraphs(xml)` | Extracts paragraph text array |
| `xmlTableRows(xml)` | Extracts table rows |
| `xmlCRResourceRows(xml)` | CR-specific resource table rows |
| `xmlFeesTableRows(xml)` | Fees table with 3-tier fallback (paraId → header keywords → rate pattern) |
| `_parseTableRows(tblXml)` | Internal helper using `/<w:tc[\s>]/` |
| `parseDateToISO(raw)` | Converts "March 9th, 2026" → `2026-03-09` |
| `cleanAmount(raw)` | Strips `$`, commas from currency strings |
| `parseParagraphsSOW(paras)` | Extracts SOW fields from paragraph array |
| `parseTableRowsSOW(rows, strtdate, enddate)` | Resource rows from SOW table; reads `cells[2]` for hours |
| `extractSOWData(file)` | Full DOCX SOW → structured data object |
| `parseParagraphsCR(paras)` | Extracts CR fields from paragraphs |
| `parseTableRowsCR(rows, ogstdate, lenddate)` | 7-col: `sowHours=cells[4]`; 6-col: sum SOW+CR; 4-col: `cells[2]` |
| `parseTableFieldsCR(xml)` | Reads CR table fields (dates, budget, etc.) |
| `extractCRData(file)` | Full DOCX CR → structured data; strips `("Subcontractor")` from custname |
| `loadPDFJs()` | Lazy-loads PDF.js from CDN (sets explicit workerSrc) |
| `pdfToLines(file)` | PDF → line array; Y-bucketed in 4pt groups (tolerates sub-pixel drift); gap detection via `item.width > 2` |
| `pdfTableRowsSOW(lines, strtdate, enddate)` | Resource table from PDF; rate scanner starts at `tokens.length-2`; hours regex `/^\d+(\.\d{1,2})?$/` matches integers and decimals |
| `extractSOWDataFromPDF(file)` | Full PDF SOW → structured data |
| `pdfTableRowsCR(lines, ogstdate, lenddate)` | Resource table from PDF CR |
| `extractCRDataFromPDF(file)` | Full PDF CR → structured data; strips `("Subcontractor")` |
| `resolveSubcon(raw)` | Maps raw subcon text → canonical alias full name |
| `stripSubconAddress(raw)` | Trims address lines from subcon text |
| `scoreSOWConfidence(extracted, resolvedSubcon)` | Parse quality score for SOW |
| `scoreCRConfidence(extracted)` | Parse quality score for CR |

### `docx.js` (~396 lines) — DOCX generation
| Export | Description |
|---|---|
| `buildCRReplacements(data)` | **Canonical CR replacements object** — guarded date fmt (`v ? fmt(v) : ''`), budget fields formatted via `fmtUSD` (commas + 2dp), `reqpoc`/`acquiaprojid`/`psprogmgr` via `alnum()`, `detailsofchange` passed raw for OOXML handling. Used by all 3 CR generate+upload handlers. |
| `base64ToArrayBuffer(b64)` | Utility conversion |
| `loadJSZip()` | Lazy-loads JSZip |
| `esc(str)` | XML-escapes a string (single-pass regex with lookup map) |
| `unesc(str)` | XML-unescapes `&amp; &lt; &gt; &quot; &#39; &apos; &nbsp;` (single-pass regex); imported by `parsers.js` |
| `buildCRRow(r, idx)` | Builds one `<w:tr>` row for CR resource table; Budget col has `$` prefix, formatted with 2dp + commas; empty cells → `"0"`; total uses `r.rate` guard (not `totHrs && r.rate`) so 0-hour rows show `$0.00` |
| `buildSOWResourcesTable(resources)` | Full SOW resource table XML; Total col uses `en-US` 2dp formatting |
| `injectBoldRun(xml, placeholder, text)` | Injects bold run for a placeholder (for `$` alignment) |
| `htmlToOOXML(html)` | Converts TipTap HTML to OOXML — returns `{ xml, rels }`. Parses `<p>`, `<ul>/<ol>/<li>`, `<h1>-<h6>`, `<strong>/<em>/<u>/<s>/<a>`. Lists use `•\t`/`1.\t` prefix + `w:ind w:hanging` (no numbering.xml). Hyperlinks injected into `word/_rels/document.xml.rels`. |
| `richTextIsEmpty(html)` | Returns `true` if HTML string has no visible content after stripping tags/whitespace |
| `generateDocx(templateB64, replacements, resourcesXMLHook)` | Main generation: unzips template, pre-processes XML (bold `$` in Section 13, removes double period, removes paraId `00000061` row **only when that row actually contains "Subcontractor Company Name"** — guards against the SOW template, where the same paraId sits on a body paragraph between two tables and an unguarded delete would swallow §5.2–§11 and fuse the tables), handles `{{detailsofchange}}` (replaces surrounding `<w:p>` with OOXML or removes entirely if empty), substitutes all remaining `{{placeholders}}`, rezips. SOW `{{Resources}}` paragraph located by `lastIndexOf('<w:p ', phIdx)`. |
| `downloadBlob(blob, filename)` | Triggers browser download |

### `dates.js` (139 lines) — Date, hour, and summary helpers
| Export | Description |
|---|---|
| `alnum(v)` | Strips all non-alphanumeric/space characters from a string — used by CR fields that feed into the DOCX template |
| `fmt(d)` | ISO date → `"March 9th, 2026"` |
| `buildCRTitle(crno)` | CR preview heading — `"Change Request {crno} for Professional Services"`; falls back to `"Change Request for Professional Services"` when crno is empty. Used by `CRPreview.jsx`. |
| `fmtCurrency(v)` | Number/string → `"$21,400.00"`; passthrough if already `$`-prefixed; returns `"—"` for falsy |
| `countWorkingDays(s, e)` | Business day count between two ISO dates |
| `calcResourceHours(res)` | SOW resource total hours from periods |
| `calcResourceTotal(res)` | SOW resource total fee |
| `calcTotalFee(resources)` | Sum all SOW resource totals |
| `calcCRSowHours(res)` | Uses `res.sowHours` if set, else period-based calculation |
| `calcCRCrHours(res)` | Returns `0` if `res.noExtension`; else sums CR periods |
| `calcCRTotalHours(res)` | SOW + CR hours |
| `calcCRBudget(res)` | CR budget for one resource |
| `calcCRTotalBudget(resources)` | Sum CR budgets |
| `effectiveCRHolidays(data)` | Returns `parseInt(crHolidays)` when manually set; else max across active (non-`noExtension`) resource `crPeriods` |
| `calcCRExtensionDays(data)` | Counts work days added in CR; uses `effectiveCRHolidays`; starts from day after `lenddate`; uses local date components (not UTC) |
| `buildCRSummary(d)` | Returns 9-item summary array for all CR flows — used by `SummaryCard` on step 2 of CRForm, CRFromSOW, CRFromCR |
| `DEFAULT_SOW` | Default SOW form state object |
| `DEFAULT_CR` | Default CR form state object |
| `DEFAULT_CR_PURPOSE` | Default "Description of Change" sentence string |

### `contractors.js` (30 lines) — localStorage contractor management
| Export | Description |
|---|---|
| `loadContractors()` | Reads from `localStorage` |
| `saveContractors(obj)` | Writes to `localStorage` |
| `contractorAliases(data)` | Returns alias array from contractor data |

### `draft.js` (48 lines) — Draft persistence & link sharing
| Export | Description |
|---|---|
| `saveDraft(key, data)` | Saves form state to `localStorage` |
| `loadDraft(key)` | Loads draft by key |
| `clearDraft(key)` | Removes draft |
| `encodeLink(data)` | Base64-encodes form state for shareable URL |
| `decodeLink(encoded)` | Decodes link back to form state |
| `savedAgoLabel(ts)` | Human-readable "saved N minutes ago" |

### `gdrive.js` (~90 lines) — Google Drive integration
| Export | Description |
|---|---|
| `GDRIVE_CONFIG` | Reads/caches config from `localStorage` |
| `saveGDriveConfig(cfg)` | Persists Drive config |
| `uploadAsGoogleDoc(blob, filename, onSuccess, onError)` | Uploads DOCX blob to Drive as a native Google Doc (converts via `mimeType: application/vnd.google-apps.document`); uses separate `drive.file` token client with TTL |

**Internal notes:**
- `loadScript(url, isReady)` — shared helper for idempotent script injection; used by `ensureGIS()`
- `ensureGIS()` — module-level idempotent Promise; loads GIS script once; early-exits via `Promise.resolve()` if already loaded
- `_uploadToken` + `_uploadTokenExpiry` — token cached with TTL (`expires_in - 60`s); stale token clears and re-auths instead of silent 401
- `withUploadToken(cb, onError)` — reads `clientId` from `GDRIVE_CONFIG` directly (no param)

> **Note:** `openGDrivePicker` and `downloadDriveFile` were removed (Google Picker returned HTTP 500 in all tested environments). Restore from git history (`65ced068`) if the feature is revived. Only the upload path remains active.

---

## Data (`src/data/`)

| File | Lines | Exports |
|---|---|---|
| `subconData.js` | 115 | `SUBCON_DATA`, `SUBCON_ALIASES_DEFAULT`, `resolveSubcon(raw)`, `DEFAULT_ACQUIA_SOW_SECTIONS`, `DEFAULT_ACQUIA_SOW` |
| `templates.js` | 3 | (template references — check file for current exports) |

---

## Key data shapes

### CR form state (`DEFAULT_CR`)
Key fields: `custname`, `subcon`, `req`, `reqpoc`, `acquiaprojid`, `psprogmgr`, `crno`, `ogstdate`, `enddate`, `lenddate`, `exstdate`, `prevtotbud`, `newbud`, `newtotbudget`, `crHolidays` (`""` = auto-sync, else manual override), `purpose` (Description of Change sentence), `detailsofchange` (rich HTML from TipTap, serialized to OOXML at generation time), `resources[]`

### Resource object (CR)
```
{ name, role, rate, sowHours, sowPeriods[], crPeriods[], noExtension }
```
`crPeriods[0]` is the primary CR period used for holidays and extension day calc.

### DOCX template placeholders
`{{custname}}`, `{{ogstdate}}`, `{{enddate}}`, `{{lenddate}}`, `{{exstdate}}`,
`{{newtotbudget}}`, `{{newbud}}`, `{{prevtotbud}}`, `{{purpose}}`, `{{resplaceholder}}`,
`{{reqpoc}}`, `{{acquiaprojid}}`, `{{psprogmgr}}`, `{{detailsofchange}}`

`{{detailsofchange}}` is handled specially: `generateDocx` replaces the entire surrounding `<w:p>` with OOXML produced by `htmlToOOXML()`; if the field is empty the paragraph is removed entirely.

Removed at gen time: row with `w14:paraId="00000061"` (Subcontractor Company Name) — deletion is guarded by a `.includes("Subcontractor Company Name")` text check on the matched `<w:tr>`, so it never fires on the SOW template (where that paraId lands on a free body paragraph between two tables)

**Impact section wording (baked into template):**
- Timeline Impact: `The original end date is extended by {{workdays}} days to give the new end date of {{enddate}}.`
- Budget Impact: `The Budget of USD {{prevtotbud}}, is increased by USD {{newbud}}, for a new total of USD {{newtotbudget}}.`
- Budget values (`prevtotbud`, `newbud`, `newtotbudget`) are formatted with commas + 2dp by `fmtUSD` in `buildCRReplacements` before injection.

---

## Flow structure (all 4 forms)

All four generation flows share the same 3-step shape and step labels:

| Step | Label | Content |
|---|---|---|
| 0 | Project Info | Identity fields (customer, subcontractor, project, CR number, description of change). Upload block at top for CR-from-SOW and CR-from-CR. |
| 1 | Timeline & Resources | Dates (start, end, prev end, effective). Resources editor with SOW/CR periods, `noExtension` toggle, auto-calc summary. Effort & budget override fields. |
| 2 | Preview & Generate | `SummaryCard` (key values). Live preview (always visible via `useEffect`). Generate & download + Save to Google Docs buttons. |

`StepBar` renders inside the form panel, below the page title, on all 4 flows.

---

## Build & deploy

```
npm run build        # prebuild: cleans stale assets/ bundles → vite build → dist + root index.html
git add -A
git commit -m "..."
git push origin master   # → svn-15816.prod.hosting.acquia.com:eevtallapragada.git
```

`vite.config.js`: `outDir: '.'`, `base: './'`, `emptyOutDir: false`
`scripts/reset-html.js`: deletes `index-*.js`, `jszip.min-*.js`, `style-*.css` from `assets/` before each build

---

## Known issues
- `enddate` empty in PDF parse debug output — not yet fixed (PDF SOW `parseParagraphsSOW` doesn't reliably parse the end date from PDF lines)

# Acquia SOW CR Generator — Handover Notes

## Changes Made (Latest Session — CR preview dynamic title)

### Dynamic CR title in preview panel
**Files:** `src/utils/dates.js`, `src/components/CRPreview.jsx`
- Added `buildCRTitle(crno)` to `dates.js` — returns `"Change Request {crno} for Professional Services"` or `"Change Request for Professional Services"` when crno is empty
- `CRPreview.jsx`: title heading now uses `buildCRTitle`; result hoisted to `const crTitle` before return; merged two separate `dates.js` import lines into one
- Left panel form titles (CRForm, CRFromSOW, CRFromCR) unchanged — only the right-side preview heading changes

---

## Changes Made (Previous Session — SOW generation fix)

### SOW §5.2–§11 no longer deleted on generation
**File:** `src/utils/docx.js` (`generateDocx`, step 0)
- **Bug:** the CR-only "Subcontractor Company Name" row removal (anchored on `w14:paraId="00000061"`) ran on *every* template. In the SOW template that paraId sits on a free body paragraph *between* two tables, so the `<w:tr>..</w:tr>` boundary search spanned ~28K chars — deleting the rest of §5.2 (Budget tracking row), §5.3 Quality, §6 Staffing Resources, §7 Secure Project Closure, §8 Deliverables, §9 Acceptance, §10 Delivery Timeline, and §11 intro + first row. The §5.2 and §11 tables then became adjacent and Word fused them into one.
- **Fix:** guard the delete with `docXml.slice(trStart, trEnd).includes('Subcontractor Company Name')` — content-based, not template-specific, so a stray paraId can never silently eat content again. CR row removal unchanged.

---

## Changes Made (Previous Session — TipTap Rich Text Editor + CR Field Additions)

### 1. RichTextEditor Component (new)
**File:** `src/components/RichTextEditor.jsx`
- TipTap v3.27.1 (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`) rich text editor
- Toolbar: Bold / Italic / Underline / Strikethrough / H1-H3 / Bullet list / Numbered list / Link / Undo / Redo
- `Btn` helper hoisted outside component (stable React identity — avoids per-render remounts)
- `lastEmitted` ref tracks last emitted HTML so `useEffect` avoids redundant `getHTML()` serialization
- Emits HTML via `onChange`; `useEffect([value, editor])` re-syncs when value is replaced externally (sample load, draft restore)

### 2. CRAcquiaFields + CRRequestorField Components (new)
**File:** `src/components/CRAcquiaFields.jsx`
- `CRAcquiaFields`: two-column row with Acquia Project ID + PS Program Manager inputs (both use `alnum()` sanitizer)
- `CRRequestorField`: single-column Requestor POC input
- Both added to all 3 CR flows (CRForm, CRFromSOW, CRFromCR) in Step 0

### 3. htmlToOOXML + richTextIsEmpty (new)
**File:** `src/utils/docx.js`
- `htmlToOOXML(html)` — converts TipTap HTML output to OOXML paragraphs: `parseHtmlNodes` → `rtRun/rtPara/rtInline/rtList/rtBlocks`; headings use bold+font-size runs; lists use `•\t` / `1.\t` prefix + `w:hanging` indent (no numbering.xml); hyperlinks injected into `word/_rels/document.xml.rels`
- `richTextIsEmpty(html)` — strips tags/whitespace, returns `true` if nothing remains
- `{{detailsofchange}}` placeholder: entire surrounding `<w:p>` replaced with rich-text OOXML block; omitted entirely if content is empty
- `decodeEntities()` removed — functionality merged into `unesc()` (which now also covers `&#39;`, `&apos;`, `&nbsp;`)
- `rtBlocks`: fixed dead `inline` computation — lazy-computed only in else branch (was wasted for blockquote/div nodes)

### 4. alnum() sanitizer
**File:** `src/utils/dates.js`
- `alnum(v)` — strips all non-alphanumeric/space characters (used by new CR fields and CRAcquiaFields inputs)

### 5. New CR fields wired end-to-end
- `DEFAULT_CR` / `DEFAULT_DATA` in all 3 flows: `reqpoc`, `acquiaprojid`, `psprogmgr`, `detailsofchange` added
- `buildCRReplacements` (docx.js): all 4 new fields included — `detailsofchange` receives special OOXML handling at generation time
- `encodeLink` (draft.js): slim payload updated with all 4 new fields
- `sampleData.js`: `SAMPLE_CR_DATA` gets rich-text `detailsofchange` example; `SAMPLE_CR_FROM_CR_DATA` gets empty string
- `CRPreview.jsx`: new preview rows for Requestor, Acquia Project ID, PS Program Manager; rich text block rendered via `dangerouslySetInnerHTML` when non-empty

### 6. Gmail dev allowlist
**File:** `src/utils/auth.js`
- `ALLOWED_EMAILS = ['venutvs5796@gmail.com']` — personal Gmail allowed for local dev/testing

---

## Changes Made (Previous Session — Layout Optimization & Field Alignment)

### 1. Asymmetric Split Screen Layout (35/65)
**File:** `src/index.css` (lines 638-663)
- Changed split-layout from 38/62 to **35/65** proportions for maximum preview area
- Form panel: 35% width, max 450px (was 38%, max 520px)
- Preview panel: 65% width (flex: 1), padding removed (was 40px 48px)
- Both columns independently scrollable with `overflow-y: auto`, `height: 100%`
- Container locked at `height: calc(100vh - 52px)`, `overflow: hidden`

### 2. Preview Document Maximization
**File:** `src/index.css` (lines 784-801)
- Width: 100% of preview panel (removed max-width: 950px constraint)
- Padding: 60px 80px (increased from 56px 72px)
- Font size: 13pt (increased from 12.5pt)
- Line-height: 1.75 (increased from 1.7)
- Border-radius: 0 (full-bleed edge-to-edge design)
- Box-shadow: none (clean appearance)
- Border: Left border only (subtle divider from form)
- Min-height: 100vh (fills viewport)
- Alignment: Left-aligned (removed center justification)

### 3. Responsive Breakpoints
**Files:** `src/index.css` (lines 850-906)
- **Tablet (1024px)**: Form 40%, preview 60%, doc padding 48px/64px, 12pt font
- **Mobile (768px)**: Stacked layout, doc padding 32px/24px, 11pt font, restored card borders
- Custom cursor disabled on mobile (body cursor: auto)

### 4. Strict Field Alignment & Spacing
**File:** `src/index.css` (lines 325-389, 648-686)
- All fields: Reset gap/margin/padding to 0, then explicitly set
- Label-to-input spacing: 6px (consistent)
- Row-to-row spacing: 20px (was 14px)
- Form section padding: 24px (was 18px/20px)
- Section title margin-bottom: 20px (was 16px)
- Input box-sizing: border-box
- Field hints/errors: 4px top margin
- Resource fields (.a-field): Same strict alignment rules applied

### 5. Step Bar Overflow Fix
**File:** `src/index.css` (lines 489-544)
- Container: 100% width, 12px padding, overflow hidden
- Step items: flex: 1 1 0 (equal distribution), min-width: 0
- Step circles: 26px (was 28px)
- Step names: 11px font, text-overflow: ellipsis
- Step lines: 20px fixed width (was flex: 1 with 32px)
- Gap reduced to 6px between elements

### 6. Custom Cursor Implementation
**File:** `src/App.jsx` (useEffect hook)
- 40px circular cursor element with fixed positioning
- Follows mouse with mousemove event
- Scales to 0.8 on mousedown (.active class)
- Scales to 1.5 on hover over interactive elements (.hover class)
- Opacity transitions for smooth appearance
- Automatically disabled on mobile via CSS media query

**Result:**
- Preview documents now use 65% of screen width with full edge-to-edge display
- Form fields have perfect vertical alignment and consistent spacing
- Step bar fits within narrowed form panel without overflow
- Independent scrolling allows reviewing long documents while keeping form visible
- Better use of available screen real estate with larger, more readable preview text

---

## Changes Made (Previous Session — Structural alignment of all 4 flows)

### 1. All 4 flows now share an identical 3-step structure
**Files:** `src/components/SOWForm.jsx`, `src/components/CRForm.jsx`, `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- Steps: `["Project Info", "Timeline & Resources", "Preview & Generate"]` — same labels across every flow
- Step 0 always contains identity/project fields only (customer, subcontractor, project, CR number, description of change). Upload block appears at top of step 0 for CRFromSOW and CRFromCR.
- Step 1 always contains dates, resources, and budget — never identity fields
- Step 2 always contains `SummaryCard` + live preview (auto-shown via `useEffect`) + generate buttons
- CRFromSOW was the structural outlier — originally "SOW Data → CR Details". Collapsed SOW-sourced project fields into the Project Information section at step 0; moved Previous Total Budget to step 1.

### 2. `StepBar` placement fixed — consistent across all 4 flows
**Files:** `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- Root-level `<StepBar>` was rendering outside the split-layout container, appearing as a full-width strip pinned above the page title (left=0, width=1400)
- Fix: moved `<StepBar steps={STEPS} current={step} />` inside each `renderStep` function after the `page-sub` paragraph, matching placement in SOWForm and CRForm (left=24, width=511)
- Playwright geometry check confirmed all 4 flows now render identically

### 3. `buildCRSummary(d)` extracted to shared utility
**File:** `src/utils/dates.js`
- Was duplicated 4× (component scope in CRFromSOW and CRFromCR, IIFE in CRForm step 2, inline in CRForm handleGenerate)
- Extracted to `dates.js` and imported by all 3 CR components; returns 9-item summary array (Customer, Subcontractor, CR Number, Previous end date, New end date, Days added, Previous budget, Budget increase, New total budget)
- `fmtCurrency(v)` also exported from `dates.js` (used internally by `buildCRSummary`)

### 4. Unused imports removed
**Files:** `src/components/CRForm.jsx`, `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- Removed `fmt`, `fmtCurrency`, `effectiveCRHolidays` from import lines in all three files — these became unused after `buildCRSummary` was extracted to `dates.js`

---

## Changes Made (Previous Session — Remove Drive Picker, Simplify gdrive.js)

### 1. Removed "Open from Google Drive" Picker Feature
**Files:** `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- The Google Picker returned HTTP 500 across all environments (dev tunnel and Acquia prod) regardless of `setAppId`, origin config, or API key restrictions
- Root cause was never fully isolated (likely Picker API not enabled on the project, or API key / OAuth client in different GCP projects — but the feature was not worth the debugging cost)
- Removed from both components: `openGDrivePicker`/`downloadDriveFile` imports, `gdFetching` state, `handleGDrivePicker` handler, and the "Open from Google Drive" card UI
- File upload inputs (DOCX + PDF) are **unaffected** — still present in both flows
- "Save to Google Docs" (`uploadAsGoogleDoc`) is **unaffected** — still present in all 4 generate forms

### 2. `gdrive.js` — Removed Dead Picker Exports
**File:** `src/utils/gdrive.js`
- `openGDrivePicker`, `downloadDriveFile`, `loadGapi`, `_gapiReady`, `_tokenClient`, `_accessToken`, `_accessTokenExpiry` all deleted (~86 lines removed)
- `loadScript`, `ensureGIS`, `withUploadToken`, `uploadAsGoogleDoc` retained — all still used by the "Save to Google Docs" upload path
- Restore from git history (`65ced068`) if picker is ever revived

### 3. `gdrive.js` — `setAppId` Added to PickerBuilder (Prior to Removal)
- Added `.setAppId(clientId.split('-')[0])` to the `PickerBuilder` chain — this is the GCP project number, required by Google's picker backend since 2023
- This was the correct fix for the generic 500 (confirmed: `appId=297249856145` appeared in the request URL post-fix) but the 500 persisted, indicating a separate config issue
- The fix is preserved in git history for reference

---

## Changes Made (Previous Latest Session — Google Drive OAuth + Dev HTTPS + Bug fixes)

### 1. `gdrive.js` — `loadGapi()` never loaded the gapi script (root cause of "Google API script failed to load")
- `loadGapi()` was polling for `window.gapi` with `setInterval` but never injected a `<script>` tag — it would always time out after 10s
- Fixed: now injects `<script src="https://apis.google.com/js/api.js">` and resolves on `onload`, resets cache on `onerror` (mirrors `ensureGIS()` pattern)

### 2. `gdrive.js` — Extracted shared `loadScript(url, isReady)` helper
- `loadGapi()` and `ensureGIS()` were structurally identical after the fix — same idempotent-promise + script-injection pattern
- Extracted `loadScript(url, isReady)` helper; both functions now delegate to it with `.catch(() => cache = null)` for retry-on-failure

### 3. `gdrive.js` — `ensureGIS()` re-initialization guard
- Added early return `if (window.google && window.google.accounts) { _gisReady = Promise.resolve(); return; }` before creating the promise
- Prevents the `[GSI_LOGGER]: google.accounts.id.initialize() called multiple times` warning when `_gisReady` was reset to null after a prior rejection but GIS was already loaded

### 4. `gdrive.js` — `.setOrigin()` on PickerBuilder
- Added `.setOrigin(window.location.protocol + '//' + window.location.host)` to `PickerBuilder` chain
- Fixes the hash `parent` parameter in the picker URL (the query-string `parent=.../favicon.ico` is GAPI's internal relay iframe URL — normal behaviour, not fixable in code)

### 5. `ResourcesEditorCR.jsx` — SOW hrs: 560 bug on "+Add Resource" in CRFromCR
- Root cause: `addRes` pre-filled `sowPeriods` with `sowStart`/`sowEnd` (the parsed CR timeline); new resource had `sowHours: ''` so `calcCRSowHours` fell through to period calculation and returned ~560 hrs
- Fix: `sowPeriods` for a new resource now use `startDate: ''` / `endDate: ''` — `countWorkingDays` returns 0 for empty dates → SOW hrs shows 0 as expected
- CR periods still pre-fill `crStart`/`crEnd` (correct — the new extension period)

### 6. `ResourcesEditorCR.jsx` + 4 callers — Removed dead `sowStart`/`sowEnd` props
- After the fix above, `sowStart` and `sowEnd` became unused in `addRes` (and nowhere else in the component)
- Removed from component signature and from all 4 call sites: `CRFromCR.jsx`, `CRFromSOW.jsx` (×2), `CRForm.jsx`

### 7. `vite.config.js` — HTTPS + COOP header for dev server
- Added `server.headers: { 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' }` — allows GIS OAuth popup to postMessage back to the page
- Added `vite-plugin-mkcert` for trusted HTTPS on `https://localhost:5173` (mkcert was already installed and CA trusted via `mkcert -install`)
- Removed `@vitejs/plugin-basic-ssl` (was only used briefly; mkcert replaces it — no "Not Secure" browser warning)

### 8. Google Drive Picker — localhost 500 (unresolved / workaround)
- Picker returns HTTP 500 from `docs.google.com/picker` when hosted on `localhost`, even with: Google Picker API enabled, OAuth client authorized origin set, API key website restriction set to `https://localhost:5173/*`, API key unrestricted (tested)
- Root cause: Google's picker server cannot validate the GAPI relay URL (`parent=https://localhost:5173/favicon.ico`) because `localhost` is unreachable from Google's servers
- **Workaround for dev**: use `cloudflared` tunnel — exposes localhost publicly with a valid HTTPS domain
  ```bash
  cloudflared tunnel --url https://localhost:5173
  # → gives https://abc123.trycloudflare.com
  ```
  Then add the tunnel URL to Cloud Console OAuth client (Authorized JavaScript origins) and API key (Website restrictions). Access the app via the tunnel URL. Note: free-tier tunnel URL changes every run.
- **Production**: picker works natively on Acquia (public HTTPS domain, reachable by Google)
- `cloudflared` installed via `brew install cloudflared` (v2026.6.0)

---

## Changes Made (Previous Latest Session — Code Review & QA fixes)

### 1. `parsers.js` — PDF hours parsing fix
- Hours regex changed from `/^\d+\.\d$/` (one decimal digit only) to `/^\d+(\.\d{1,2})?$/` — now matches integer hours (`40`) and two-decimal hours (`160.00`), not just `160.0`
- Hours loop floor changed from `j >= 1` to `j >= 0`

### 2. `parsers.js` — Y-bucketing fix for PDF line grouping
- `pdfToLines`: Y-bucket changed from `/2)*2` to `/4)*4` (4pt buckets)
- Tolerates sub-pixel Y drift between text items on the same line in Word-generated PDFs; safe since typical line pitch is ≥12pt

### 3. `parsers.js` + `docx.js` — `unesc()` helper
- `unesc(str)` added to `docx.js` alongside `esc()` — single-pass regex, exported
- `parsers.js` imports `unesc` from `docx.js` (removed private copy)
- All 8 inline entity-decode chains in `parsers.js` replaced with `unesc()` calls — including the missing `&quot;` decode that was absent from `_parseTableRows`
- Partial `&amp;`-only decodes in `extractCRDataFromPDF` (lines ~742–744) also switched to `unesc()`

### 4. `docx.js` — falsy-zero budget fix
- `buildCRRow`: `totHrs && r.rate` → `r.rate` — a resource with 0 computed hours now shows `$0.00` instead of a stale `r.totalBudget` value

### 5. `docx.js` — `{{Resources}}` paragraph anchor
- Replaced fragile 130-char rsid-based string match with `docXml.indexOf('{{Resources}}')` + `lastIndexOf('<w:p ', phIdx)` — survives template regeneration in Word; note trailing space in `<w:p ` to avoid matching `<w:pPr>`

### 6. `App.jsx` — custom contractors visible on first render
- `setSubconAliases(contractorAliases(loadContractors()))` now called at **module level** (before component renders), so `CRFromSOW`'s `useState(() => getSubconAliases().slice())` sees custom contractors on first page load
- `useState(() => loadContractors())` reverted to simple `useState(_initContractors)` using the module-level preloaded value
- `useEffect([contractors])` stays for subsequent contractor changes

---

## Changes Made (Previous Latest Session — `planning/app-v2` branch)

### 1. New Spec: Project Ledger
**File:** `specs/project-ledger/PRODUCT.md` (new)
- Product spec for a new "Project Ledger" feature: link a Project to a Google Drive folder containing a customer's SOW + CR chain history
- Enables a future "CR from Project" flow that pre-fills from the project's latest known state without re-uploading the most recent document
- Covers: connecting a Drive folder, reconcile (detect/repair discrepancies between project record and folder contents), multi-chain projects (one chain per subcontractor), populating chain entries (import/select/manual), and audit trail
- No code implemented yet — spec only

### 2. Docs Reorganization
- Stray design/sample files moved out of repo root into organized locations:
  - Wireframe/design handoff JSX files (`app.jsx`, `design-canvas.jsx`, `home-*.jsx`, `sow-*.jsx`, `hiw-patterns.jsx`, `wf-primitives.jsx`, `tweaks-panel.jsx`, `Docbuilder Wireframes.html`, `README.md`) → `docs/design-handoff/`
  - Sample document `IN_Veolia_UK_CR02_2026.docx` → `docs/samples/`
- No functional/code changes — file moves only

---

## Project Overview
Vite + React app deployed to Acquia Apache hosting via git push.
- Build: `npm run build` → outputs to project root (`outDir: '.'`, `base: './'`)
- Deploy: `git push origin master` → `svn-15816.prod.hosting.acquia.com:eevtallapragada.git`
- Dist files committed to repo (Apache serves `index.html` directly)

---

## Changes Made (Latest Session)

### 1. Dynamic "Description of Change" (`purpose` field)
**Files:** `src/utils/dates.js`, `src/utils/docx.js`, `src/data/templates.js`, `src/components/CRPreview.jsx`, `src/components/CRForm.jsx`, `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`, `src/components/EditableF.jsx`
- Added `purpose` field to `DEFAULT_CR`, `CRFromSOW.DEFAULT_DATA`, and `CRFromCR` inline state — pre-filled with the old hardcoded sentence so existing usage is unchanged
- CR template `{{purpose}}` placeholder replaces the hardcoded purpose sentence in the DOCX
- `buildCRReplacements` includes `purpose` (fallback to default if blank)
- **CRPreview**: purpose text is now a `CRF` field — click-to-edit inline in delta mode (SOW→CR, CR→CR flows)
- **EditableF**: added `type="textarea"` support — renders a `<textarea>` instead of `<input>` when editing, for multi-line fields
- **Form textarea**: full-width "Description of Change" textarea added to the CR Info section in all three CR form flows (step 0 in CRForm, step 1 in CRFromSOW, Project Information section in CRFromCR)

### 2. CR Template — Impact Section Wording Updated
**File:** `src/data/templates.js` (CR_TEMPLATE_B64)
- **Timeline Impact** sentence changed from:
  `The original end date was {{lenddate}}; {{workdays}} days added and timeline is moving to {{enddate}}`
  to: `The original end date is extended by {{workdays}} days to give the new end date of {{enddate}}.`
  `{{lenddate}}` is no longer used in this sentence.
- **Budget Impact** sentence changed from:
  `The change Request increases the budget by ${{newbud}}. The original Budget was ${{prevtotbud}}, bringing the final budget to ${{newtotbudget}}..`
  to: `The Budget of USD {{prevtotbud}}, is increased by USD {{newbud}}, for a new total of USD {{newtotbudget}}.`
- **Purpose sentence** — added missing trailing period.

### 2. Budget Values: Comma + 2dp Formatting
**File:** `src/utils/docx.js`
- Added `fmtUSD(val)` helper: strips leading `$` and commas, parses float, re-formats with `en-US` locale and 2 decimal places (e.g. `21400` → `21,400.00`)
- Applied to `prevtotbud`, `newbud`, `newtotbudget` in `buildCRReplacements` — fixes missing thousand-separator comma in Section 13 and impact section
- Removed now-dead `dollarFields` strip loop in `generateDocx` (no-op since `fmtUSD` never emits `$`)
- Removed five obsolete XML `.replace()` calls that moved `$` into bold runs for the old Budget Impact sentence structure

### 3. CR Resource Table — Budget Column `.0` → `.00`
**File:** `src/utils/docx.js` — `buildCRRow()`
- Changed `toLocaleString` options from `minimumFractionDigits: 1` to `2` and locale from `undefined` to `'en-US'`
- Also applied same fix to `buildSOWResourcesTable()` for consistency
- Fixed stray `$` bug in `buildSOWResourcesTable` when `rowTotal` is empty (`"$"` → `""`)

### 4. Code Quality — `docx.js`
- `esc()` rewritten from four chained `.replace()` calls to a single-pass regex with a lookup map
- Two mutually-exclusive `newtotbudget` XML replace calls merged into one regex `(\.?)`
- `fmtUSD` falsy guard fixed from `!val` to `val == null || val === ''` so `0` is formatted correctly

---

## Changes Made (Previous Latest Session)

### 1. "Save to Google Docs" Button — All Four Generate Flows
**Files:** `src/components/SOWForm.jsx`, `src/components/CRForm.jsx`, `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- Added "Save to Google Docs" button alongside the existing "Generate & Download .docx" button on every generate step
- After a successful upload an "Open in Google Docs →" link appears inline
- The generated DOCX blob is uploaded to Google Drive with `mimeType: application/vnd.google-apps.document` so Drive converts it to a native Google Doc (no `.docx` extension or Microsoft Word icon)
- Both buttons are mutually disabled while the other is in progress

### 2. `useGDriveUpload` Hook
**File:** `src/hooks/useGDriveUpload.js` (new)
- Encapsulates `driveUrl`, `uploading` state and the full upload callback flow
- API: `const { driveUrl, uploading, upload } = useGDriveUpload(setGenMsg)`
- `upload(blobPromise, filename)` — accepts a `generateDocx(...)` Promise directly; handles generation errors, upload errors, and success in one place
- Replaced 4 × duplicate `[driveUrl, uploading]` state pairs and `handleGDriveUpload` bodies

### 3. `buildCRReplacements(data)` — Canonical CR Replacements Helper
**File:** `src/utils/docx.js`
- Single source of truth for the CR `replacements` object passed to `generateDocx`
- Eliminated 6 near-identical copies spread across `handleGenerate` and `handleGDriveUpload` in three CR components
- Uses guarded date formatting `v ? fmt(v) : ''` throughout — fixes a latent bug in `CRForm.handleGenerate` that was passing bare `fmt(x)` and would have produced `"Invalid Date"` strings in the DOCX for any empty date field

### 4. `gdrive.js` Refactor
**File:** `src/utils/gdrive.js`
- `ensureGIS()` promoted to module-level idempotent Promise — eliminates duplicate GIS `<script>` injection that existed in both `openGDrivePicker` and `withUploadToken`
- `withUploadToken` no longer takes a misleading `clientId` parameter — reads from `GDRIVE_CONFIG` directly (parameter was silently ignored on second call)
- Token TTL tracking: `_uploadTokenExpiry = Date.now() + (expires_in - 60) * 1000` — stale tokens now trigger re-auth instead of a silent 401 after the first hour
- `openGDrivePicker` updated to use `ensureGIS()` in its Promise chain

### 5. `SOWForm.handleGenerate` Uses `buildSOWReplacements()`
**File:** `src/components/SOWForm.jsx`
- `buildSOWReplacements()` was previously only called by `handleGDriveUpload`; `handleGenerate` still had the full object inlined
- Now both call `buildSOWReplacements()` — single source of truth for SOW replacements including the `Total_Fee` formatting IIFE

### 6. `msgColor` 3-branch Helper — CRForm and SOWForm
**Files:** `src/components/CRForm.jsx`, `src/components/SOWForm.jsx`
- Added `const msgColor = s => s.startsWith('✓') ? 'var(--success)' : s.startsWith('⚠') ? 'var(--danger)' : 'var(--accent)'`
- Previously only 2 branches existed, so the "Uploading to Google Docs..." in-progress message was showing in red (danger) instead of accent

---

## Changes Made (Previous Latest Session — Prebuild / Deploy fixes)

### 1. Prebuild: Auto-clean Stale Assets
**File:** `scripts/reset-html.js`
- Added `readdirSync` + `rmSync` loop that deletes any `index-*.js`, `jszip.min-*.js`, `style-*.css` from `assets/` before each build
- Prevents stale hashed bundles accumulating in git; `npm run build` now always leaves exactly one copy of each artifact
- `vite.config.js` keeps `emptyOutDir: false` (safe — outDir is the project root)

### 2. Deploy: Remote Name Corrected
- Remote is `origin`, not `acquia` — deployment steps in this file updated accordingly

### 3. Site Was Blank — Root Cause & Fix
- `index.html` had reverted to the dev template (`src/main.jsx` reference); Apache served it and browsers couldn't execute JSX → blank page
- Fix: `npm run build` rewrites `index.html` with the compiled bundle reference; 24 accumulated stale asset files removed from git

---

## Changes Made (Previous Latest Session)

### 1. Holidays Sync Bug — "→ Resources" Wiped Resource Holidays
**Files:** `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- Root cause: `crHolidays` initialised to `"0"`; when resources had holidays (e.g. 2), `isOverridden` saw `"0" !== "2"` → incorrectly showed "Manual override active". Clicking "→ Resources" then pushed `"0"` to all resources, wiping their holidays.
- Fix: initialise `crHolidays` to `""` (also reset to `""` in `applyExtracted` of CRFromCR)
- Global input now displays `computed` max from resources when `crHolidays === ""` (matches CRForm.jsx pattern)
- `syncHolidays` now recomputes the effective value (computed max when not overridden) and pushes that, instead of blindly pushing `crHolidays`

### 2. Work Days Added Not Accounting for Holidays
**File:** `src/utils/dates.js`
- Root cause: `calcCRExtensionDays` read `data.crHolidays` directly; with `crHolidays = ""` (auto-sync), `parseInt("") || 0` = 0 holidays → wrong day count.
- Added `effectiveCRHolidays(data)` helper: returns `parseInt(crHolidays)` when manually set, otherwise computes max across active (non-`noExtension`) resource `crPeriods`.
- `calcCRExtensionDays` now uses `effectiveCRHolidays`.
- Inline "excl. N holidays" label in `CRForm.jsx` and "Holidays in CR" summary rows in both SOW and CR flows also updated to use `effectiveCRHolidays`.
- `effectiveCRHolidays` imported in `CRForm.jsx`, `CRFromSOW.jsx`, `CRFromCR.jsx`.

### 3. CR from Existing CR — Custname Parsed with `("Subcontractor")` Suffix / Wrong Dropdown Value
**Files:** `src/utils/parsers.js`, `src/components/CRFromCR.jsx`
- Root cause 1: DOCX table cell and PDF text contain `Innoraft Solutions Private Limited ("Subcontractor")`; both `extractCRData` and `extractCRDataFromPDF` stored it verbatim.
- Fix: after merging extracted fields, strip `("Subcontractor")` (and curly-quote variants) from `custname` in both functions.
- Root cause 2: `applyExtracted` in `CRFromCR` set `custname`/`subcon` from raw extracted value but never added it to `aliases` → `<select value={data.custname}>` found no matching option and showed first alias (Axelerant).
- Fix: imported `resolveSubcon` into `CRFromCR.jsx`; `applyExtracted` now calls `resolveSubcon(extracted.custname)` which matches on first word against alias list and returns the canonical full name (e.g. `"Innoraft Solutions Private Limited"`). If the resolved name is not already in aliases, it is auto-added — same pattern as `CRFromSOW.jsx`.

---

## Changes Made (Previous Latest Session)

### 1. CR from Existing CR — Full Feature Overhaul
**File:** `src/components/CRFromCR.jsx` (complete rewrite)
- Replaced redirect-to-CRForm flow with self-contained 2-step form: **CR Data → Preview & Generate** (mirrors CRFromSOW)
- Upload now triggers `applyExtracted` which immediately transforms data into new-CR perspective: previous `crPeriods` folded into `sowPeriods`, new empty `crPeriods` added, `prevcrs` chained, `effimp` ← `neffimp`, `prevtotbud` ← `newtotbudget`, new CR fields cleared
- `subcon` field added to state and passed through (was missing — generated docs had blank contractor block)
- `crno` now included in `prevcrs` chain (was using only filename/doctitle)
- Nav tab "CR → CR" added to top nav; no longer aliases to "SOW → CR" tab (`src/App.jsx`)
- `onContinue` prop replaced with `onComplete` — routes to Success page after generation

### 2. CR Resource Parsing: `sowHours` Extracted from CR Tables
**File:** `src/utils/parsers.js` — `parseTableRowsCR()` and `pdfTableRowsCR()`
- DOCX: 7-col table → `sowHours = cells[4]` (Total Hrs); 6-col → sum SOW+CR hrs; 4-col → `cells[2]`
- PDF: last numeric token before rate column stored as `sowHours`
- `calcCRSowHours` now uses real parsed totals instead of `hoursPerDay × working days` estimate

### 3. Work Days Added: Off-By-One Fix + Timezone Fix
**File:** `src/utils/dates.js` — `calcCRExtensionDays()`
- Now starts counting from the day **after** `lenddate` (previous end date belongs to prior period)
- Uses local date components (`getFullYear/getMonth/getDate`) instead of `toISOString()` to avoid UTC offset rolling back one day for UTC+ users

### 4. `noExtension` Toggle per Resource
**File:** `src/components/ResourcesEditorCR.jsx`
- Checkbox "Not extending" added to each resource card header
- When checked: CR Periods editor hidden, replaced with info banner; resource dims to 75% opacity
- CR hrs and budget zeroed in the resource summary row
**File:** `src/utils/dates.js` — `calcCRCrHours()`
- Returns `0` immediately if `res.noExtension === true`

### 5. Holidays: Reverse-Sync from Resources → Global Field
**Files:** `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`
- Holidays field now shows `Auto-synced from resources (max: N)` computed as max across active (non-`noExtension`) resource crPeriods
- Shows "Manual override active" in red when user has typed a different value
- Sync button renamed `→ Resources` (direction: global → resource crPeriods[0])
- `syncHolidays` skips `noExtension` resources
**File:** `src/components/CRForm.jsx` — `HolidaysField()`
- `computed` max now skips `noExtension` resources

---

## Changes Made (Previous Latest Session)

### 1. Create CR: SOW Periods Editor Added to Updated Resources
**File:** `src/components/ResourcesEditorCR.jsx`
- Added `showSowPeriods` prop (default `false`); when `true`, renders green "SOW Periods (original)" `PeriodEditor` per resource
- Added `upSow` handler to update `sowPeriods` on each resource row
- SOW Hours input relabeled "SOW Hours (override)" with placeholder "auto from periods" when `showSowPeriods=true`
- CRFromSOW flow unaffected — no `showSowPeriods` prop passed → defaults `false`

**File:** `src/components/CRForm.jsx`
- Passes `showSowPeriods={!(isFromSOW || isFromCR)}` to `ResourcesEditorCR` — only active in Create CR from scratch
- Added date-first tip shown when `ogstdate` is empty (so user fills dates before adding resources)

### 2. Create CR: "Apply to Budget" Now Sets All Three Budget Fields
**File:** `src/components/CRForm.jsx`
- Step 1 "Apply to Budget" previously only set `newtotbudget`; now also sets `prevtotbud` (SOW budget) and `newbud` (CR budget increase) — consistent with Step 2 "Auto-fill All"
- Budget bar label changed from "Calculated Total Budget" to "Calculated New Total Budget (SOW + CR)"

### 3. Create CR: Date Formatting in Generated DOCX
**File:** `src/components/CRForm.jsx`
- Added `fmt` import from `dates.js`
- `ogstdate`, `enddate`, `lenddate`, `exstdate` in `handleGenerate` now wrapped with `fmt()` — matches existing CRFromSOW behavior
- Fixes dates printing as `2026-04-13` instead of `April 13th, 2026` in Section 10 and effective-date sentence

---

## Changes Made (Session Before That)

### 1. Fixed PDF Resource Table Parsing (Rate vs Total)
**File:** `src/utils/parsers.js` — `pdfTableRowsSOW()`
- Rate scanner now starts at `tokens.length - 2` (skips last token which is always the Total)
- Rate regex changed to `/^\d+(\.\d{1,2})?$/` excluding hours-format (`/^\d+\.\d$/`) to avoid false matches
- Hours (`20.0`, `384.0`) now stored as `sowHours` field on each parsed row
- Fixes case where `$600.00` (total) was being picked as rate instead of `$30`

### 2. Removed SOW Periods Section from CR Form
**File:** `src/components/ResourcesEditorCR.jsx`
- Removed `PeriodEditor` for `sowPeriods` — hours were defaulting to ×8/day calculation instead of actual SOW hours
- Added "SOW Hours" direct number input field (4-column grid: Role, Name, Rate, SOW Hours)
- Summary bar now shows: SOW hrs / CR hrs / Total / Budget (only when > 0)

### 3. SOW Hours Used Directly in Calculations
**File:** `src/utils/dates.js` — `calcCRSowHours()`
- If `res.sowHours` is set (non-empty), uses it directly instead of period × hoursPerDay calculation
- Falls back to period-based calculation if `sowHours` is absent

### 4. DOCX: Removed "Subcontractor Company Name" Row
**File:** `src/utils/docx.js` — `generateDocx()`
- Finds `<w:tr>` containing `w14:paraId="00000061"` (the Subcontractor Company Name label cell)
- Removes entire row including value cell — handles both `<w:tr>` and `<w:tr ` variants
- The row is not in the live preview either; was appearing only in generated DOCX

### 5. DOCX: Date Formatting ("March 9th, 2026" format)
**File:** `src/utils/dates.js` — `fmt()`
- Changed output format from `"9th March, 2026"` to `"March 9th, 2026"`
- Affects live preview and generated DOCX

**File:** `src/components/CRFromSOW.jsx` — `handleGenerate()`
- Added `fmt` import from dates.js
- Date replacements now wrapped with `fmt()`: `ogstdate`, `enddate`, `lenddate`, `exstdate`

### 6. DOCX: Bold $ Symbols in Fees and Budget Sentences
**File:** `src/utils/docx.js` — `generateDocx()` pre-processing
- Template has `$` in non-bold runs just before bold `{{placeholder}}` runs
- Fix: moves `$` into the adjacent bold run by string replacement before final substitution
- Applies to: fees section (`not to exceed $`), budget sentence (3× `$`)

### 7. DOCX: Fixed Double Period in Budget Sentence
**File:** `src/utils/docx.js` — `generateDocx()` pre-processing
- Template had `{{newtotbudget}}.` in bold run followed by a separate `.` run → `..`
- Regex removes the extra standalone period run after `{{newtotbudget}}.`

### 8. DOCX: Resource Table Empty Cells Show "0"
**File:** `src/utils/docx.js` — `buildCRRow()`
- `sowStr`, `crStr`, `totStr` now default to `"0"` instead of `""`
- `total` defaults to `"0"` instead of `""`

### 9. DOCX: New Total Budget Column Has $ Prefix
**File:** `src/utils/docx.js` — `buildCRRow()`
- `crCell('$' + total, true)` — all values in New Total Budget column now prefixed with `$`

---

## Changes Made (Previous Session)

### 1. Removed "Subcontractor Company Name" from CR Live Preview
**File:** `src/components/CRPreview.jsx`
- Removed the `<tr>` row rendering `data.subcon` from the Project Information table

### 2. Fixed Resources Table Not Appearing in CR Preview
**File:** `src/utils/parsers.js`
- Added `_parseTableRows(tblXml)` helper using `/<w:tc[\s>]/` regex
- Refactored `xmlFeesTableRows` with three-tier fallback (paraId anchors → header keywords → rate pattern)
- Updated `parseTableRowsSOW` to read actual hours from `cells[2]`

### 3. Mapped Subcon Name → Consultant/Customer Name
**File:** `src/utils/parsers.js`
- `stripSubconAddress(raw)` trims addresses from parsed subcon text
- `resolveSubcon()` maps raw subcon text to known alias full names

**File:** `src/components/CRFromSOW.jsx`
- `applyExtracted`: auto-adds parsed subcon to aliases array if not already present

### 4. Fixed PDF.js Worker Warning
**File:** `src/utils/parsers.js`
- Set explicit `workerSrc` to cdnjs PDF.js 2.16.105 worker URL

### 5. Fixed PDF Text Spacing (Smart Gap Detection)
**File:** `src/utils/parsers.js` — `pdfToLines()`
- Uses `item.width` to detect gaps; inserts space only if `gap > 2`
- Multi-space normalization: `.replace(/  +/g,' ')` on output lines

### 6. Fixed Multi-Line Subcon Extraction from PDF
**File:** `src/utils/parsers.js` — `extractSOWDataFromPDF()`
- Post-parse multi-line scan for "by and between\n[Subcon Name]" pattern

### 7. Fixed feesStart Anchoring on Wrong Line
**File:** `src/utils/parsers.js` — `pdfTableRowsSOW()`
- Changed feesStart regex from `/not to exceed/i` to `/not to exceed\s+\$?[\d,]+/i`
- Prevents matching "12.10. Business days are deemed not to exceed eight (8) hours."
- Widened feesEnd fallback window from 40 to 60 lines

---

## Known Issues / Pending

| Issue | Status |
|---|---|
| `Enddate` empty in PDF SOW parse — `parseParagraphsSOW` doesn't reliably extract end date from PDF lines | Not yet fixed |
| Google Drive Picker HTTP 500 — removed feature; restore from git `65ced068` if reviving | Closed (removed) |

---

## Debug Output to Watch For
After uploading a PDF SOW, open browser console and look for:
```
[SOW PDF parse] lines: NNN | Subcon: ... | Custname: ... | Projname: ... | Strtdate: ... | Enddate: ... | Total_Fee: ...
[SOW PDF fees] feesStart: NNN ... | feesEnd: NNN
[SOW PDF fees] headerIdx: NNN ...
[SOW PDF parse] resources found: N [...]
```

---

## Key Files
| File | Purpose |
|---|---|
| `src/utils/parsers.js` | All SOW/CR parsing logic (DOCX + PDF) |
| `src/utils/docx.js` | DOCX generation: `buildCRRow`, `generateDocx` pre-processing |
| `src/utils/dates.js` | Date formatting (`fmt`), CR hour/budget/workday calc helpers; `effectiveCRHolidays(data)` |
| `src/components/CRFromSOW.jsx` | SOW→CR multi-step form; `applyExtracted`, `handleGenerate` |
| `src/components/CRFromCR.jsx` | CR→CR chain form; 2-step self-contained flow with direct DOCX generation |
| `src/components/CRForm.jsx` | Create CR from scratch; `HolidaysField` auto-syncs from resources |
| `src/components/ResourcesEditorCR.jsx` | CR resource editor — SOW Hours, CR Periods, `noExtension` toggle |
| `src/components/CRPreview.jsx` | Live preview rendering |
| `src/App.jsx` | Routing, NAV tabs (includes "CR → CR" tab) |
| `vite.config.js` | Build config (`outDir: '.'`, `base: './'`) |

---

## CR Template Structure (Key Placeholders)
| Placeholder | Value | Notes |
|---|---|---|
| `{{custname}}` | Consultant/Customer name | Used in project info + signature |
| `{{ogstdate}}` | SOW start date (formatted) | "March 9th, 2026" |
| `{{enddate}}` | New end date (formatted) | |
| `{{lenddate}}` | Previous end date (formatted) | |
| `{{exstdate}}` | CR effective date (formatted) | |
| `{{newtotbudget}}` | New total budget (no $ prefix) | $ added in template XML (Section 13); `USD` prefix in Budget Impact sentence |
| `{{newbud}}` | Budget increase amount | Formatted with commas + 2dp by `fmtUSD` |
| `{{prevtotbud}}` | Previous total budget | Formatted with commas + 2dp by `fmtUSD` |
| `{{purpose}}` | Description of Change sentence | Editable field; default = "The purpose of this Change Request is to add more hours..." |
| `{{resplaceholder}}` | Resource table rows | Replaced with `buildCRRow()` output |
| `w14:paraId="00000061"` | Subcontractor Company Name row | Removed at generation time |

---

## Deployment Steps
```bash
npm run build
git add -A
git commit -m "your message"
git push origin master
```

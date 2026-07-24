# TA Review — Acquia Doc Builder

Architecture and workflow reference for a Technical Architect review. Deep file/export details live in `CODEBASE.md`; session-by-session change history lives in `handover.md`. This doc covers what those don't: the business workflow and the system-level design/security posture.

## 1. Business workflow

Acquia engages subcontractor firms via a **Statement of Work (SOW)**, then amends scope/timeline/budget via one or more **Change Requests (CRs)** chained off it. This tool generates both document types as Word `.docx` files from Acquia's templates, replacing a manual copy-paste-reformat process.

Four flows cover the lifecycle:

| Flow | When a PS/delivery manager uses it |
|---|---|
| **New SOW** | Kicking off a new subcontractor engagement from scratch |
| **New CR** | Amending an engagement, typed in manually |
| **CR from SOW** | First amendment — upload the signed SOW (.docx/.pdf), fields auto-parse, fill in what's changing |
| **CR from CR** | Second+ amendment — upload the most recent CR, tool folds its numbers forward as the new baseline and chains the CR number |

Each flow is the same 3-step wizard: **Project Info → Timeline & Resources → Preview & Generate**. "Preview & Generate" is a live-rendered document (not a PDF render of the actual docx) with a summary card, so the user confirms values before producing the real file. Output is either a direct `.docx` download or a push to Google Drive as a native Google Doc.

**What the tool does not do:** track engagements after generation, know which CR is "latest" for a customer, or store history — each generation is a stateless, one-shot transform. (A "Project Ledger" feature to close this gap — link a Drive folder per customer, reconcile chain state — is spec'd but unbuilt: `specs/project-ledger/PRODUCT.md`.)

## 2. Architecture

- **Stack:** Vite + React 19, client-only SPA (no router — a single `view` state switch in `App.jsx`), Tailwind v4 + shadcn/ui.
- **No backend, no database.** Everything — DOCX parsing, DOCX generation, PDF text extraction — runs in-browser. `.docx` files are unzipped/rezipped client-side with JSZip; PDF text extraction uses PDF.js loaded from a CDN at runtime.
- **Deployment:** static hosting on Acquia's own Apache. The built `dist` output is committed straight to the repo root (`vite.config.js`: `outDir: '.'`) and served as-is — `git push` **is** the deploy, no build step runs on the server, no CI/CD pipeline.
- **Templates:** the SOW/CR Word templates are baked into the bundle as base64 (`src/data/templates.js`), not fetched from a server.
- **Persistence is all client-side:** drafts autosave to `localStorage` every 30s; "shareable links" base64-encode full form state (including customer name and budget figures) into the URL itself, so anyone with the link can see those values — link-sharing is the only mechanism, there's no server-side session.

## 3. Auth & security posture

- **Gate, not a security boundary.** `AuthGate.jsx` restricts UI access to `@acquia.com` Google accounts (plus one allowlisted personal Gmail for dev) via Google Identity Services sign-in. The ID token's payload is base64-decoded and checked for domain **client-side only** — signature is never verified, and there is no backend to verify against. This is enough to keep casual/wrong users out of an internal tool, but it is not a real access-control boundary: it's enforced entirely in JS the browser controls.
- Session lives in `sessionStorage` (clears on tab close); explicitly bypassed in Playwright tests via `addInitScript`.
- **Google Drive integration** (for "Save to Google Docs") uses a separate OAuth token client with its own scope and a cached-with-TTL access token — this part does go through Google's real OAuth flow, unlike the sign-in gate.
- Drive API key + OAuth Client ID are entered by the user in a Settings panel and stored in `localStorage` — anyone with access to that browser profile can read them. Acceptable for a public/referrer-restricted API key; would not be acceptable for a true secret.
- Rich-text "Details of Change" content goes through TipTap → is rendered in the live preview via `dangerouslySetInnerHTML` and is also converted to OOXML for the generated doc — worth a specific look if a TA wants to assess XSS surface, since it's the one place user-authored HTML flows through the app.

## 4. Known gaps / risks

| Gap | Detail |
|---|---|
| No automated test suite | No `test` script, no test files, no CI config in the repo. Correctness has been verified ad hoc (manual + Playwright checks during dev sessions, not committed as a suite). |
| No CI/CD | `git push origin master` to Acquia's Apache host **is** the deploy. No build/lint gate runs before code goes live. |
| PDF parsing is best-effort | `enddate` doesn't reliably extract from PDF-sourced SOWs (documented in `CODEBASE.md` "Known issues") — DOCX parsing is more reliable than PDF. |
| Auth is a UI gate, not enforcement | See §3 — anyone who can reach the deployed URL and bypass/inspect client JS is not technically blocked by anything server-side, because there is no server. |
| No multi-user/concurrency model | Single-browser, single-user tool by design — no conflict handling because there's nothing shared to conflict over. |

## 5. Go deeper

| Question | Where |
|---|---|
| "What does file X export / where is Y implemented?" | `CODEBASE.md` |
| "What changed recently and why?" | `handover.md` |
| "What's the UI/layout spec?" | `plan.md` |
| "What's the unbuilt Project Ledger feature?" | `specs/project-ledger/PRODUCT.md` |
| "How do I run/build/deploy it?" | `README.md` |

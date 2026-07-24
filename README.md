# Acquia Doc Builder

Browser-based DOCX generator for Acquia's Statement of Work and Change Request documents. Fill out a guided form and download a ready-to-send Word file from Acquia's templates — no manual formatting.

## Four document flows

| Flow | Description |
|---|---|
| **New SOW** | Author a Statement of Work from scratch |
| **New CR** | Author a Change Request from scratch |
| **CR from SOW** | Upload an existing SOW (.docx/.pdf) — auto-parses fields to seed the CR |
| **CR from CR** | Carry a previous CR forward into a follow-on CR |

All four flows share a consistent **3-step wizard**: _Project Info → Timeline & Resources → Preview & Generate_.

## Key features

- **Asymmetric split screen** — 35% form / 65% preview for maximum document readability
- **Independent scrolling** — Form and preview scroll separately while viewport stays locked
- **Live document preview** — Full-width edge-to-edge display (13pt font), redraws as you type
- **Rich text editor** — TipTap-powered "Details of Change" block on all CR flows; supports bold/italic/underline/headings/lists/links; serialized directly to OOXML in the generated Word file
- **Resource/effort editor** — Per-resource rate and date periods, auto-calculated fees, working-day extensions, holiday tracking, and manual budget overrides
- **Document parsing** — Reads uploaded SOW/CR (.docx or .pdf) and pre-fills all form fields
- **Pre-generate summary card** — Confirms key values before producing the file
- **Draft autosave** — Saves to browser localStorage every 30 seconds, with restore banner
- **Shareable links** — Encodes full form state in the URL
- **Output options** — Download .docx or push directly to Google Docs/Drive
- **Subcontractor directory** — Saved companies (address, MSA date, POC) that auto-fill on selection
- **Material design UI** — Deep shadows, color-tinted ripple effects, custom circular cursor
- **Google sign-in gate** — Restricted to `@acquia.com` accounts; sample/demo mode available on every flow
- **Responsive design** — Mobile-optimized with stacked layouts, tablet-adjusted proportions

## Stack

Vite + React 19, no router (manual `view` state), Tailwind v4, shadcn/ui. Deployed to Acquia Apache hosting — built dist is committed to the repo.

## Development

```bash
npm install
npm run dev       # https://localhost:5173
```

## Build & deploy

```bash
npm run build
git add -A
git commit -m "your message"
git push origin master   # → svn-15816.prod.hosting.acquia.com:eevtallapragada.git
```

See `handover.md` for detailed change history and known issues. See `CODEBASE.md` for a full file/export/shape reference.

# Handoff: Home v1 + Sample-data mode for Docbuilder

## Overview

This handoff packages the redesign of the **Docbuilder home page (v1)** and a new **Sample-data mode** for the four document-generation flows (SOW, CR, CR-from-SOW, CR-from-CR). It replaces the current `Home.jsx` and adds a `DemoBanner` affordance to the workspaces.

It targets the existing codebase at `acquia-sow-cr-gen/` (Vite + React 19, manual `view` state in `App.jsx`, no router, CSS in `src/App.css` / `src/index.css`).

## About the Design Files

The HTML + JSX files in this bundle are **design references**, not production code.

They are React components running through `@babel/standalone` in a single static HTML page (`Docbuilder Wireframes.html`), wrapped inside a wireframing primitive system (`wf-primitives.jsx`) that uses sketchy/hand-drawn typography. The goal of the wireframe is to communicate **layout, hierarchy, copy, and behavior** — **not** the visual finish.

The task is to **recreate these designs in the existing React + Vite + CSS codebase**, using the existing styling patterns in `src/App.css` and `src/index.css`, the existing icons in `src/components/icons.jsx`, and the existing `App.jsx` `view` routing. Do **not** copy the `wf-*` classes or the handwritten fonts — they are wireframe scaffolding.

## Fidelity

**Low-fidelity wireframes.** Structure, layout, copy, and component composition are settled. Final colors / typography / shadows / radii should follow the existing app's design system (or be cleaned up if none exists yet — see "Visual finish" below).

Per the design conversation:
- **Color direction**: cool neutrals + a single blue accent (`#2563eb` cobalt is the design-time placeholder)
- **Vibe**: clean & professional — internal Acquia tool, not consumer-facing
- **Density**: comfortable / regular by default; consider exposing a compact toggle later

## Screens / Views

### 1. Home — v1

**Purpose**: First-run landing page that explains what Docbuilder is, shows users *how the app works conceptually*, and lets them pick one of four generators. Returning users skim past the hero to Recent documents.

**Existing file to update**: `src/components/Home.jsx` (currently 52 lines, a 2×2 mode-select grid).

**Layout (top-to-bottom, single-column page in main content)**:

1. **Top bar** (sticky, height ~56px, paper background, 1px bottom border)
   - Left: 26×26 accent-color square logo (`D`) + "Docbuilder" wordmark + small "v1.0 · internal" caption
   - Right: user name + theme toggle (32×32 icon button, sun/moon) + settings (32×32 icon button, gear)
   - The theme toggle should drive a `dark` boolean in app state (persist to `localStorage`) and toggle a `data-theme="dark"` attribute on `<html>` so CSS variables can swap. The Settings button is a placeholder for now — wire to a modal stub.

2. **Hero block** (padding 36px 36px 24px, 1px dashed bottom border)
   - Two-column flex, 36px gap, vertical-center
   - **Left column** (max-width 620px):
     - Chip row: accent chip `welcome` + caption "first time? read this · 30 seconds"
     - H1 (2 lines, ~34px): *"Build SOWs & Change Requests in **minutes, not hours**."* The "minutes, not hours" span is colored with the accent
     - Body paragraph (~14px, soft ink): *"Docbuilder replaces the SOW/CR Google Doc juggling with a guided form. Type once, watch a live document render on the right, then export a DOCX or push it straight to Drive. No copy-paste, no broken dates, no 'Invalid Date' in the table."*
     - Button row (gap 8px):
       - Primary CTA: `⚡ Try a sample SOW` (accent background, white text)
       - Secondary: `Skim the 4 flows ↓` (scrolls to the tile grid below)
     - Caption under buttons (faint): *"opens the SOW form pre-filled with a fictional engagement · nothing saves · exit anytime"*
   - **Right column** (fixed width ~280px): a small "what it does" diagram card
     - Three columns: `[form]` placeholder → ⚡ generate label → `[DOCX]` placeholder
     - Caption row underneath: "form fields" left, "signed-ready DOCX" right
     - For v1 these can stay as styled placeholder boxes; eventually they should be tiny iconographic illustrations

3. **"How Docbuilder works" stepper band** (padding 24px 36px 4px)
   - A Box (1px border, paper background) with a heading row + 4-column step grid
   - Heading row: accent caption `how Docbuilder works` + body text "4 steps · same shape for every flow" left, right-aligned secondary "watch a 60-sec tour ↗"
   - 4-column grid, each step centered:
     - 52×52 circular icon container (accent border, paper fill, accent icon) — icons: `grid`, `edit`, `eye`, `download`
     - Accent caption "step N"
     - Title (14–16px medium): *Pick a flow* · *Fill the form* · *Watch preview* · *Generate & ship*
     - Body (~13px, soft): one-line description
   - **Dashed connector line** runs horizontally behind the circles (top: 26px, left: 12.5%, right: 12.5%, opacity 0.5, accent color). The circles sit on `z-index: 1` over it.

4. **"Ready? Pick a flow." tile grid** (padding 28px 36px 8px)
   - Heading row: H3 left, caption "4 generators · pick what fits" right
   - **4-column grid**, gap 14px. Each tile (Box, padding 14px):
     - Top row: 36×36 icon container (accent icon) on the left, accent chip with the flow's badge label on the right
     - H3 title
     - Body paragraph
     - Footer 1 row: time estimate caption left ("~3 min"), `try sample →` accent caption right
     - Dashed 1px separator
     - Footer 2 row: `start blank →` accent caption right-aligned
   - The two distinct affordances ("try sample" vs "start blank") are intentional — see Behavior below

   Flows (in order):
   - **SOW** · doc icon · "New Statement of Work" · *"Fill the standard form, watch the live preview, generate a DOCX."* · ~3 min
   - **CR** · edit icon · "New Change Request" · *"Draft a CR from scratch with delta highlights."* · ~2 min
   - **Smart** · flow icon · "CR from SOW" · *"Upload an SOW · auto-extract resources · tweak · ship."* · ~90 sec
   - **Chain** · chain icon · "CR from CR" · *"Extend an existing Change Request with the next block."* · ~90 sec

5. **Recent documents** (padding 24px 36px 40px)
   - A single Box (padding 14px 18px 6px) wrapping a heading row + a list of recent docs
   - Heading: H3 "Recent documents" left, "view all →" caption right
   - List rows (each row: 1px dashed bottom border, padding 8px 10px, flex with 10px gap):
     - Badge chip (SOW: accent fill; CR: solid ink fill)
     - Document name (14–15px)
     - Time caption ("2h ago")
     - Download icon (14×14)
   - **Empty state**: when no recent docs exist, show "No documents yet — generate your first SOW or CR above." (this is the existing copy from `Home.jsx`)

**Removed from the current Home.jsx**: nothing functional. The new design is purely additive (adds the hero, stepper, and tile-grid sections); the recent docs section moves to the bottom and stays the same.

**Deferred to a later release** (do *not* implement now):
- Left sidebar nav (My SOWs / My CRs / Templates / Profile)
- Templates section on the home page
- The "watch a 60-sec tour" link is a placeholder — wire it to a stub or hide it

---

### 2. SOW Workspace — Sample-data mode

**Purpose**: When a user clicks `Try a sample SOW` (from the home hero) or `try sample →` (from any tile), the corresponding workspace opens **pre-filled with a fictional engagement** so the user can poke around with zero commitment. The Generate button is replaced with a "start a real one" CTA.

**Existing file to update**: `src/components/SOWForm.jsx`, `src/components/CRForm.jsx`, `src/components/CRFromSOW.jsx`, `src/components/CRFromCR.jsx`. Each gets the same `DemoBanner` component at the top when sample mode is active.

**The fictional engagement** (one dataset, used for all four flows):
- Customer: `Velir`
- Project: `FY26 Drupal eng — Block 3`
- Dates: `2026-03-09` → `2026-06-28`
- Total budget: `$184,800` (SOW) / `$147,000` (the demo's smaller resource set)
- Resources:
  - Senior Drupal engineer · A. Mehta · $165/h · 440h
  - Drupal engineer · P. Lopez · $145/h · 360h
  - Tech lead · S. Pereira · $185/h · 120h
- Holidays in range: 2

For CR-from-SOW / CR-from-CR, the **upload step is skipped** — the workspace opens with the sample SOW/CR already "extracted" and the resources/dates filled in.

**Layout — the DemoBanner**:

A persistent banner that sits **above the existing TopBar** of any workspace (the existing `<App />` header stays where it is; the banner is rendered conditionally between the App chrome and the form).

- Background: 10% accent tint on the app background
- Bottom border: 1px, 40% accent
- Padding: 10px 22px
- Color: accent (text, icon)
- Layout (flex row, gap 12px):
  - 24×24 circular accent badge with a bolt icon (white on accent)
  - Two-line label:
    - Line 1 (hand 14px): *"You're in **sample mode** · Velir · FY26 Eng Block 3"*
    - Line 2 (caption, accent at 0.85 opacity): *"fields are editable · nothing is saved · Generate is disabled here"*
  - Flex spacer
  - Outline button (`Exit demo`) — accent border, accent text
  - Primary button (`Looks good? Start a real SOW →`) — solid accent

**Behavior**:
- The Generate / Download / Save-to-Drive actions are **disabled** while sample mode is active.
- `Exit demo` returns to Home, discards the sample state.
- `Start a real SOW →` clears all sample data, keeps the user on the same workspace but with a blank form, and removes the banner.

## Interactions & Behavior

### Home v1

| Trigger | Effect |
|---|---|
| Click `Try a sample SOW` (hero) | `navigate('sow')` with `sampleMode = true`, prefill SOW form with the Velir dataset |
| Click `Skim the 4 flows ↓` (hero) | Smooth-scroll to the tile grid (#flows section) |
| Click `try sample →` on a tile | `navigate(tile.id)` with `sampleMode = true`, prefill that flow with Velir data |
| Click `start blank →` on a tile | `navigate(tile.id)` (normal flow, no prefill) — equivalent to current behavior |
| Click the theme toggle | Flip `dark` boolean; persist to `localStorage`; apply `data-theme="dark"` to `<html>` |
| Click the settings icon | Open a settings modal stub (placeholder for now) |
| Click `watch a 60-sec tour ↗` | Hide for now or stub a modal — deferred |
| Click `view all →` (Recent) | Deferred (was sidebar nav target) |

### Sample mode (any workspace)

| Trigger | Effect |
|---|---|
| Workspace mounts with `sampleMode = true` | Hydrate form state with the Velir sample data; render `<DemoBanner />` above the form |
| Click `Exit demo` | `navigate('home')`, clear `sampleMode` |
| Click `Start a real SOW →` (in banner) | Keep `view` = 'sow', set `sampleMode = false`, reset form to defaults |
| Click `Generate DOCX` / `Save to Drive` while sample | These buttons should be **disabled** with a tooltip explaining why |

## State Management

Add two pieces of state in `App.jsx`:

```js
const [sampleMode, setSampleMode] = useState(false);
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
```

Extend the existing `navigate(view)` to optionally take a `{ sample: true }` payload:

```js
function navigate(view, opts = {}) {
  setView(view);
  setSampleMode(!!opts.sample);
}
```

When `sampleMode === true`, each `*Form.jsx` should hydrate from a shared `SAMPLE_DATA` constant (export it from `src/data/sampleEngagement.js` — new file). The same constant powers all four flows.

Theme: write a small `useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }, [theme])` in `App.jsx`, and pass `theme` + `setTheme` to `Home`.

## Design Tokens

Wireframe-time placeholders (use the existing app's tokens where they exist; treat these as direction, not gospel):

**Color**
- Accent: `#2563eb` (cobalt blue). Alternatives explored: `#1d4ed8`, `#0ea5e9`, `#4f46e5`. Final choice owned by the team.
- Paper / surface: `#fbfaf7` (warm off-white) or `#ffffff` (clean white) — both work
- Ink (primary text): `#1f2937` (slate-800)
- Ink soft: `rgba(31, 41, 55, 0.65)`
- Ink faint: `rgba(31, 41, 55, 0.35)`
- Rule (subtle borders): `rgba(31, 41, 55, 0.18)`
- Fill (subtle backgrounds): `rgba(31, 41, 55, 0.04)`
- Fill-2 (slightly stronger): `rgba(31, 41, 55, 0.08)`

**Dark mode**
- Paper: `#0f172a`
- Ink: `#e5e7eb`
- Ink soft: `rgba(229, 231, 235, 0.7)`
- Rule: `rgba(229, 231, 235, 0.2)`

**Typography** (final fonts to be chosen by the team; wireframe used handwritten faces that should be discarded)
- Suggested polished pair: **Geist** or **Plus Jakarta Sans** or **Manrope** for everything, with **JetBrains Mono** for numeric/code (existing app uses system fonts — consider keeping that and just adjusting weights/sizes)
- Scale: H1 34px, H2 22px, H3 17px, body 14px, caption 10px (uppercase, tracked +0.08em)

**Spacing**
- Base padding: 16px
- Section padding (vertical): 24–36px
- Grid gaps: 14px (tiles) and 18px (rows)
- Tile border radius: 6–10px depending on fidelity
- Hero illustration card: 280×~150px

**Buttons**
- Height: 32px (regular) / 28px (compact) / 38px (comfortable)
- Padding x: 14px
- Border-radius: 6px
- Primary: accent fill, white text
- Secondary: paper fill, ink border

**Chips**
- Height: 22px
- Padding x: 8px
- Border-radius: 999px
- Variants: outline (default), accent-tinted (8% accent fill + 50% accent border + accent text), solid ink (ink fill, paper text)

## Assets

- **Icons**: Use the existing `src/components/icons.jsx` set. The wireframes use a `SketchIcon` component with these kinds — map each one to your real icon export (or add the missing ones):
  - `doc`, `edit`, `flow`, `chain`, `grid`, `eye`, `download`, `bolt`, `clock`, `user`, `settings`, `search`, `plus`, `sparkle`
- **Hero diagram**: the "form → ⚡ → DOCX" diagram on the right side of the hero is currently a styled placeholder. Two paths:
  - Cheapest: keep it as two soft-fill boxes labeled "form" and "DOCX" with the bolt in between — feels low-key and is fine for v1
  - Better: commission a small flat illustration (~280×140) and slot it in
- **No images** are required to ship Home v1

## Files in this bundle

| File | What it is | How to use it |
|---|---|---|
| `Docbuilder Wireframes.html` | Standalone wireframe browser app — open this in a browser to see all designs side-by-side on a pan/zoom canvas. Tweak typography, density, dark mode, and accent color from the panel in the bottom-right. | Visual reference. **Do not ship.** |
| `home-final.jsx` | The `HomeFinal` React component — the canonical mock of Home v1 | Mine layout, copy, and component composition. **Do not copy the `wf-*` classes** — they are wireframe scaffolding. |
| `sow-demo.jsx` | The `SowDemo` wrapper showing the DemoBanner on top of a SOW workspace | Mine the `DemoBanner` component verbatim, then port to your CSS module / styled-components / Tailwind setup |
| `sow-variants.jsx` | Contains `SowA`, the SOW workspace mock that `SowDemo` wraps | Reference only — the existing `SOWForm.jsx` is the source of truth for the form |
| `wf-primitives.jsx` | The wireframe design-token system (CSS variables, Box, ImgPh, SketchIcon, Uline, etc.) | Reference only — gives you the spacing / sizing / hierarchy semantics. **Do not import.** |

## Implementation checklist

1. [ ] Add `src/data/sampleEngagement.js` exporting `SAMPLE_SOW`, `SAMPLE_CR`, `SAMPLE_SUBCON` (use the Velir dataset above)
2. [ ] Add `sampleMode` state to `App.jsx`; update `navigate()` to accept `{ sample: true }`
3. [ ] Add `theme` state + `useEffect` to apply `data-theme` + persist to `localStorage`
4. [ ] Add a `<DemoBanner sampleName="Velir · FY26 Eng Block 3" onExit onStartReal />` component in `src/components/DemoBanner.jsx`
5. [ ] Wire `DemoBanner` into all four `*Form.jsx` workspaces; disable Generate / Download / Drive buttons when `sampleMode`
6. [ ] Rewrite `src/components/Home.jsx` to match the layout above:
    - Top bar with logo, user name, theme toggle, settings
    - Welcoming hero (left text block + right "what it does" diagram)
    - "How Docbuilder works" stepper band (generic, 4 steps)
    - "Ready? Pick a flow." tile grid (4 tiles, each with `try sample →` + `start blank →`)
    - Recent documents at the bottom
7. [ ] In `Home.jsx`, when each tile's `start blank →` is clicked, call `onSelect(tile.id)` (existing behavior). When `try sample →` is clicked, call a new `onSelectSample(tile.id)` prop that triggers `navigate(tile.id, { sample: true })`
8. [ ] Move the existing recent-docs rendering to the bottom of the new layout (the existing markup can stay; just update class names and styling)
9. [ ] Add CSS variables for the design tokens above to `src/index.css`, scoped under `:root` and `[data-theme="dark"]`
10. [ ] Style the new sections using existing CSS class conventions in `src/App.css` (`card-grid`, `card`, `card-icon-wrap`, etc.) — add new class names where needed

## Notes

- The wireframes used a handwritten sketchy aesthetic (Caveat, Patrick Hand, Architects Daughter, etc.). **Discard that for production.** Use whatever the team picks for v1 — Geist, Manrope, Plus Jakarta Sans, or system fonts are all reasonable.
- The accent color in the wireframes is `#2563eb`. Confirm with the team before locking in — this redesign deliberately stays off Acquia's brand orange, since the conversation framed this as an internal tool whose visual identity is the team's call.
- The "watch a 60-sec tour ↗" link is a stub — the actual onboarding mechanism is **Sample-data mode** (the primary CTA). The "tour" link can be removed if you don't want to ship a second onboarding affordance.

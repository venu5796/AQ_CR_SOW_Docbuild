# Acquia SOW/CR Document Generator - Layout & Design

## Latest Updates (2026-06-19)

### ✅ Topnav Logo Redesign
- Replaced text badge ("A" + "Doc Builder") with image logo (logo2.png)
- Topnav height increased to 110px to accommodate larger logo
- Logo height: 90px (light mode), 100px with white background (dark mode)
- Dark mode: Logo displayed in white rounded box for visibility
- Mobile responsive: Logo shrinks to 28px
- Updated `.page` and `.split-layout` height calculations to match new topnav

**Files**: `src/App.jsx` (line 288), `src/index.css` (lines 174-210, 1971-1978)

## Previous Updates (2026-06-18)

### ✅ Preview Panel Improvements
- Full-width document (removed 620px max-width constraint)
- Scalable fonts (14px base, all internal elements use `inherit`/`em`)
- White background, no floating page effect
- Trailing circle cursor with dot and click/hover effects

### ✅ Upload Zone Enhancements
- Hover: border solid accent, background tints, icon lifts
- Buttons: neutral default, blue tint on hover (both DOCX and PDF)
- Removed DOCX/PDF badges below buttons

### ✅ Code Quality Fixes
- RAF memory leak fixed with `cancelAnimationFrame`
- Parser error handling via `safeExtract()` helper
- CSS @import order fixed
- Field `:focus-within` label highlighting for accessibility
- Merged duplicate CSS rules for upload buttons

### ✅ Asymmetric Split Screen Layout (35/65)

**Objective**: Maximize preview area for better document readability

**Changes**:
- Form panel: 35% width (was 38%), max 450px
- Preview panel: 65% width (flex: 1), full viewport usage
- Preview document: Edge-to-edge (no margins), 13pt font, 60px/80px padding
- Independent scrolling: Both columns scroll separately
- Responsive: 40% form on tablet, stacked on mobile

**Files**: `src/index.css` (lines 638-906)

### ✅ Field Alignment & Spacing

**Objective**: Strict vertical layout with perfect left-edge alignment

**Changes**:
- All fields: Reset gap/margin to 0, explicit spacing
- Label-to-input: 6px consistent
- Row spacing: 20px between field rows
- Form sections: 24px padding, 20px title margin
- Resource fields: Same strict alignment rules

**Files**: `src/index.css` (lines 325-389, 648-686)

### ✅ Step Bar Responsive Fix

**Objective**: Prevent overflow in narrowed form panel

**Changes**:
- Container: 100% width, 12px padding, overflow hidden
- Step items: Equal flex (1 1 0), 6px gap
- Step names: 11px font, text truncation
- Step lines: 20px fixed width

**Files**: `src/index.css` (lines 489-544)

---

## Previously Completed

### Homepage Design
- [x] Material design cards with deep shadows (2dp → 8dp hover)
- [x] Color-tinted ripple effects on flow cards
- [x] Trailing circle cursor with dot (smooth follow, click/hover effects, disabled on mobile)
- [x] Center-aligned layout (1440px max-width)
- [x] Enhanced hover states with border highlighting
- [x] "How it Works" section with material effects

### Form Pages (All 4 Flows)
- [x] Step bar in pill container with focus rings
- [x] Section titles with muted grey and separators
- [x] White form panel and white preview panel
- [x] Enhanced input focus (2px border, 18% opacity ring)
- [x] Parsed field highlighting (green background)

### Success Screen
- [x] Blue/teal gradient banner with SVG checkmark
- [x] Document name in subtitle
- [x] Hint card and summary card
- [x] Action buttons (Home / Create another / Follow-on CR)

### Topnav
- [x] Image logo (logo2.png) at 90px height
- [x] 110px topnav height for better logo visibility
- [x] Dark mode: white background box around logo (100px)
- [x] SVG icons for theme toggle and settings
- [x] User avatar circle with initials

### Upload UI
- [x] Drag-and-drop zone with dashed border
- [x] Upload icon and file type badges (DOCX/PDF)
- [x] Parse confidence indicator
- [x] Auto-filled field highlighting

### Settings Panel
- [x] Styled drawer/modal
- [x] Google Drive API key + Client ID fields
- [x] Contractors tab with edit/delete/add flows
- [x] Tab switching between sections

### Resource Editor
- [x] Styled resource cards
- [x] Period editor rows with date ranges
- [x] Hours/day selector and holiday count
- [x] Calculated Total Fee summary bar

### Theme & Responsive
- [x] Dark mode verified across all pages
- [x] Neutral gray backgrounds (light/dark)
- [x] Mobile responsive (stacked layouts)
- [x] Tablet breakpoints (adjusted widths)

---

## Key Technical Details

### Layout Proportions
- Desktop: 35% form / 65% preview
- Tablet (1024px): 40% form / 60% preview
- Mobile (768px): Stacked (form first, preview toggleable)

### Preview Document Specs
- Font: 13pt Times New Roman (12pt tablet, 11pt mobile)
- Line-height: 1.75 (1.6 mobile)
- Padding: 60px/80px desktop, 48px/64px tablet, 32px/24px mobile
- Border: Left border only (desktop), full border mobile
- Width: 100% of preview panel (no max-width)

### Field Spacing Standards
- Label-to-input: 6px
- Row-to-row: 20px
- Section padding: 24px
- Section title margin: 20px

### Responsive Breakpoints
- Desktop: 1440px+ (max-width container)
- Laptop: 1024px (40% form)
- Mobile: 768px (stacked layout)
- Small mobile: 640px (single column forms)

---

## File Structure

**Core Files**:
- `src/index.css` - All styling (1900+ lines)
- `src/App.jsx` - Main app with custom cursor
- `src/components/Home.jsx` - Homepage with flow cards
- `src/components/SOWForm.jsx` - SOW form flow
- `src/components/CRForm.jsx` - CR form flow
- `src/components/CRFromSOW.jsx` - CR from SOW flow
- `src/components/CRFromCR.jsx` - CR from CR flow
- `src/components/Success.jsx` - Success screen

**CSS Classes**:
- `.split-layout` - Main 35/65 container
- `.form-panel` - Left column
- `.preview-panel` - Right column
- `.preview-doc` - Document display
- `.field` - Form field structure
- `.step-bar` - Progress indicator
- `.home-v2-flow-card` - Homepage cards

---

## Future Enhancements

### High Priority
1. Remove Google Auth gate — make app publicly accessible without sign-in
2. Drag-and-drop file uploads (currently click-only)
3. PDF export from preview panel
4. Auto-save drafts to localStorage
5. Keyboard shortcuts for form navigation

### Medium Priority
5. Real-time collaboration indicators
6. Field validation with inline errors
7. Undo/redo for form changes
8. Copy to clipboard for preview text

### Low Priority
9. Print-optimized CSS for documents
10. Export to Google Docs/Drive
11. Template library for common SOW/CR patterns
12. Advanced search/filter for recent documents

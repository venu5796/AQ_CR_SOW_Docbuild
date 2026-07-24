---
name: Modern Editorial Canvas
colors:
  surface: '#fff8f7'
  surface-dim: '#f3d2d3'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f0'
  surface-container: '#ffe9e9'
  surface-container-high: '#ffe1e2'
  surface-container-highest: '#fcdbdb'
  on-surface: '#291718'
  on-surface-variant: '#5d3f40'
  inverse-surface: '#402b2c'
  inverse-on-surface: '#ffedec'
  outline: '#916e70'
  outline-variant: '#e6bcbe'
  surface-tint: '#be0039'
  primary: '#b60036'
  on-primary: '#ffffff'
  primary-container: '#e40046'
  on-primary-container: '#fff7f7'
  inverse-primary: '#ffb2b7'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#006755'
  on-tertiary: '#ffffff'
  tertiary-container: '#00826c'
  on-tertiary-container: '#e7fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadb'
  primary-fixed-dim: '#ffb2b7'
  on-primary-fixed: '#40000d'
  on-primary-fixed-variant: '#920029'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#91f5da'
  tertiary-fixed-dim: '#75d8be'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005142'
  background: '#fff8f7'
  on-background: '#291718'
  surface-variant: '#fcdbdb'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '500'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  ui-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  container-max: 1120px
  gutter: 32px
---

## Brand & Style

This design system is built upon a modern editorial aesthetic, bridging the gap between traditional print media and high-end digital publishing. The brand personality is authoritative yet welcoming, intellectual, and intentionally paced. It targets creators, editors, and sophisticated readers who value clarity over clutter.

The UI leverages a **Minimalist-Editorial** style. It utilizes heavy whitespace to create a "breathing" layout that mimics the experience of reading a premium physical magazine. By eschewing shadows in favor of structural hairlines and focusing on high-quality serif typography, the design system evokes a sense of permanence and credibility. The emotional response should be one of focused calm and intellectual engagement.

## Colors

The palette is anchored by a soft cream background that reduces eye strain and provides a tactile, "paper-like" feel. 

- **Primary (Acquia Magenta):** Reserved for high-impact actions, active navigation states, and critical brand moments.
- **Background & Surface:** The cream base (`#FDFBF7`) serves as the canvas, while pure white (`#FFFFFF`) is used strategically for cards or hover states to provide subtle contrast without relying on elevation.
- **Typography:** Deep charcoal ensures maximum legibility and a classic ink-on-paper appearance.
- **Muted & Borders:** Warm greys are used for metadata and the fine 1px hairlines that define the layout structure.
- **Accent:** A sophisticated emerald green is used exclusively for success indicators and affirmative states.

## Typography

The typographic scale is the primary driver of hierarchy. Note that while Lora was requested, **Literata** is utilized as the primary body face for its superior digital readability and "bookish" quality that aligns perfectly with the editorial narrative.

- **Headlines:** Use Playfair Display for all major titles. Keep tracking tight on larger sizes to maintain the "display" character.
- **Body:** Literata is set with a generous line-height (1.6x) to ensure comfortable long-form reading. Paragraph spacing should be significant to prevent dense "walls of text."
- **UI & Labels:** Inter provides a functional, neutral counterpoint to the serifs. Use `label-caps` for category tags, small buttons, and table headers to create a clear visual distinction from content.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop, mimicking a classic broadsheet or magazine spread. 

- **Grid:** A 12-column grid with a max-width of 1120px, centered on the screen. 
- **Rhythm:** Spacing follows a 4px baseline, but significant vertical rhythm is encouraged. Use `xl` (40px) or `xxl` (64px) for section padding to reinforce the "print" feel.
- **Responsive:** On mobile devices, margins collapse to 20px, and the grid shifts to a 4-column fluid model. Typography scales down (e.g., `display-xl` moves to `headline-lg-mobile`) to maintain balance on smaller viewports.

## Elevation & Depth

This design system avoids shadows entirely to maintain a flat, modernist aesthetic. Depth is achieved through:

- **1px Borders:** Use `#E7E5E4` (Border Subtle) to define containers and divide content.
- **Tonal Contrast:** Using the Surface color (`#FFFFFF`) on top of the Background (`#FDFBF7`) creates a subtle "layering" effect without physical depth.
- **Typographic Weight:** Contrast between the bold Magenta of primary actions and the muted charcoal of the background text creates a hierarchy of attention rather than a hierarchy of physical space.

## Shapes

The shape language is structured and precise. A consistent **4px radius** (Soft) is applied to all interactive elements like buttons and input fields. This provides a hint of approachability while maintaining the overall geometric and professional look of a structured editorial layout. Avoid large radius values or pill shapes, as they conflict with the "print" aesthetic.

## Components

### Buttons
- **Primary:** Solid Acquia Magenta background, White text (`ui-medium`). 4px border radius. No shadow.
- **Secondary:** Transparent background, 1px Border Subtle (`#E7E5E4`), Deep Charcoal text.
- **Ghost:** No border, Deep Charcoal text. Highlighting on hover with the Surface color background.

### Inputs
- **Text Fields:** Minimalist design. No full enclosure. Indicated by a **1px dashed bottom border** using Muted text color. On focus, the border becomes solid Acquia Magenta.
- **Labels:** Always use the `label-caps` style above the input field.

### Cards
- **Structure:** 1px solid border (`#E7E5E4`), white background. 
- **Spacing:** Generous internal padding (24px - 32px).
- **Interactive:** On hover, the border may darken slightly or a Magenta accent bar (2px) may appear at the very top of the card.

### Lists & Navigation
- **Lists:** Use horizontal hairlines between list items to maintain the editorial grid.
- **Navigation:** Top-level links use `label-caps`. The active link is indicated by a Magenta underline or a small Magenta dot below the text.

### Chips & Tags
- **Style:** Rectangular with a 4px radius. Light grey background (`#E7E5E4`) with `label-caps` text. No borders for static tags; 1px borders for interactive chips.
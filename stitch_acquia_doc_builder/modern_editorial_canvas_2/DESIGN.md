---
name: Modern Editorial Canvas
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#5d3f40'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#916e70'
  outline-variant: '#e6bcbe'
  surface-tint: '#be0039'
  primary: '#b60036'
  on-primary: '#ffffff'
  primary-container: '#e40046'
  on-primary-container: '#fff7f7'
  inverse-primary: '#ffb2b7'
  secondary: '#5f5e5f'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfe0'
  on-secondary-container: '#636263'
  tertiary: '#595a5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#727272'
  on-tertiary-container: '#faf8f8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadb'
  primary-fixed-dim: '#ffb2b7'
  on-primary-fixed: '#40000d'
  on-primary-fixed-variant: '#920029'
  secondary-fixed: '#e5e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474647'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 76px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 38px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built for high-density information environments that require both technical precision and editorial elegance. It targets a sophisticated audience—researchers, developers, and analysts—who value clarity and structural integrity.

The design style is a hybrid of **Modern Minimalism** and **Technical Brutalism**. It leverages the raw, geometric nature of its typography against a warm, organic background to create a "digital paper" feel. The aesthetic response is one of authority and focus, stripping away unnecessary decoration in favor of clear content hierarchy and a rigid, unapologetic structure.

## Colors

The palette is anchored by the "Paper" background (#FDFBF7), providing a low-strain, high-readability canvas that feels more premium than pure white. 

- **Primary:** Acquia Magenta (#E40046) is used sparingly for critical actions, active states, and highlights. It serves as the "ink" that demands immediate attention.
- **Secondary/Neutral Dark:** A near-black (#1A1A1B) used for primary typography and structural borders.
- **Neutral Background:** The cream base defines the surface, with slight tonal shifts (grey-washed versions of the cream) used for secondary containers or disabled states.

## Typography

The typography strategy relies on three distinct voices:
1. **Space Grotesk (Headlines):** Provides a geometric, futuristic character. It should be typeset with tight tracking for larger sizes to emphasize its structural nature.
2. **IBM Plex Sans (Body):** Selected for its exceptional legibility and "industrial humanist" feel. It handles long-form reading with ease.
3. **JetBrains Mono (Labels/Data):** Brings a technical, precise tone to metadata, buttons, and tabular data. 

All headings should use a higher optical weight than body text to maintain the editorial "masthead" feel.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy. Content is housed within a 12-column container on desktop (max-width: 1280px) to ensure line lengths remain optimal for reading.

- **Rhythm:** An 8px linear scale is used for most components, while a 4px scale is reserved for tight technical data layouts.
- **Margins:** Generous outer margins (32px on desktop, 16px on mobile) reinforce the "canvas" feel.
- **Reflow:** On mobile, the grid collapses to 4 columns. Typography scales down significantly for display sizes to prevent overflow, while body sizes remain constant for accessibility.

## Elevation & Depth

This system avoids shadows entirely to maintain its flat, editorial aesthetic. Depth is communicated through:

- **Bold Borders:** 1px or 2px solid strokes in #1A1A1B define containers and interactive zones.
- **Tonal Layering:** Using slightly darker or lighter variants of the cream background to distinguish between the global canvas and specific modules.
- **High-Contrast Overlays:** Modals and menus do not float with shadows; instead, they use thick 2px black borders or high-contrast fills to "knock out" the background content.

## Shapes

The shape language is strictly **Sharp**. All corners for buttons, inputs, cards, and images are 0px. 

This mathematical rigidity complements the monospaced labels and geometric headlines. Visual interest is generated through the intersection of lines and color blocks rather than organic curves. Elements should feel like they were cut from physical sheets of paper or drafted on a technical blueprint.

## Components

- **Buttons:** Rectangular with 0px radius. Primary buttons use an Acquia Magenta fill with white text. Secondary buttons use a 1px black border with a transparent fill. All buttons use `label-md` (JetBrains Mono) for text.
- **Input Fields:** 1px black bottom-border only, or full 1px stroke depending on density. Labels sit above the field in `label-sm` uppercase.
- **Chips/Tags:** Small rectangular boxes with 1px borders. Use `label-sm` typography. Active tags can use a solid Magenta fill.
- **Cards:** Defined by a 1px stroke or a subtle tonal shift in background color. No shadows. Padding should be generous (`md` spacing).
- **Data Tables:** High-density layouts using JetBrains Mono for all cell content. Use horizontal rules only; avoid vertical borders to keep the editorial flow.
- **Lists:** Bulleted lists use square markers instead of round dots to align with the sharp-corner theme.
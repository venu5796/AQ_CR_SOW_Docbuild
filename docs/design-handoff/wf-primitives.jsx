// wf-primitives.jsx
// Shared wireframe primitives + CSS. Loaded BEFORE variants.
// Components exported to window so other Babel scripts can use them.

const WF_STYLE = `
  /* ─── design tokens (theme-driven by data-style on artboards) ───────── */
  .wf-root{
    --ink: #1f2937;
    --ink-soft: rgba(31,41,55,0.65);
    --ink-faint: rgba(31,41,55,0.35);
    --paper: #fbfaf7;
    --line: rgba(31,41,55,0.85);
    --accent: var(--wf-accent, #2563eb);
    --rule: rgba(31,41,55,0.18);
    --fill: rgba(31,41,55,0.04);
    --fill-2: rgba(31,41,55,0.08);
    --hand: var(--wf-hand, 'Caveat', 'Patrick Hand', cursive);
    --sans: var(--wf-sans, 'Inter', system-ui, sans-serif);
    --mono: 'JetBrains Mono', ui-monospace, monospace;
    --rad: 6px;
    --bw: 1.6px;            /* base border width */
    --sw: 1.4px;            /* skew/shadow width */
    --dens: var(--wf-dens, 1);
    color: var(--ink);
    background: var(--paper);
    font-family: var(--hand);
    line-height: 1.15;
    width: 100%; height: 100%;
    overflow: hidden;
    position: relative;
    isolation: isolate;
  }

  /* ─── style modes ──────────────────────────────────────────────────── */
  /* sketch: hand-drawn double-shadow, wobbly */
  .wf-root[data-style="sketch"]{
    --bw: 1.6px;
    --line: #1f2937;
  }
  .wf-root[data-style="sketch"] .wf-box{
    box-shadow: 1.5px 1.5px 0 var(--line);
    border-radius: 5px 7px 5px 6px / 6px 5px 7px 5px;
  }
  /* lofi: clean strokes, no shadow */
  .wf-root[data-style="lofi"]{
    --bw: 1.2px;
    --line: rgba(31,41,55,0.75);
  }
  .wf-root[data-style="lofi"] .wf-box{ border-radius: 6px; }

  /* polished: cards w/ subtle elevation */
  .wf-root[data-style="polished"]{
    --bw: 1px;
    --line: rgba(31,41,55,0.10);
    --paper: #ffffff;
    --fill: rgba(31,41,55,0.03);
    --fill-2: rgba(31,41,55,0.06);
    --hand: var(--wf-sans);    /* drop the handwriting */
  }
  .wf-root[data-style="polished"] .wf-box{
    box-shadow: 0 1px 0 rgba(31,41,55,0.04), 0 8px 24px -12px rgba(31,41,55,0.18);
    border-radius: 10px;
    background: #fff;
  }
  .wf-root[data-style="polished"] .wf-imgph{
    border-style: solid;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  }

  /* ─── dark mode ───────────────────────────────────────────────────── */
  .wf-root[data-dark="1"]{
    --ink: #e5e7eb;
    --ink-soft: rgba(229,231,235,0.7);
    --ink-faint: rgba(229,231,235,0.35);
    --paper: #0f172a;
    --line: rgba(229,231,235,0.8);
    --rule: rgba(229,231,235,0.2);
    --fill: rgba(229,231,235,0.04);
    --fill-2: rgba(229,231,235,0.10);
  }
  .wf-root[data-dark="1"][data-style="polished"]{
    --paper: #0b1220;
    --line: rgba(229,231,235,0.08);
  }
  .wf-root[data-dark="1"][data-style="polished"] .wf-box{
    background: #111a2e;
    box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px -12px rgba(0,0,0,0.6);
  }

  /* ─── density ─────────────────────────────────────────────────────── */
  .wf-root{ --pad: calc(16px * var(--dens)); --gap: calc(14px * var(--dens)); }
  /* compact: tighter type, shorter buttons, denser rows */
  .wf-root[data-dens="compact"] .wf-h1{ font-size: 28px; }
  .wf-root[data-dens="compact"] .wf-h2{ font-size: 18px; }
  .wf-root[data-dens="compact"] .wf-h3{ font-size: 14.5px; }
  .wf-root[data-dens="compact"] .wf-p { font-size: 12.5px; line-height: 1.3; }
  .wf-root[data-dens="compact"] .wf-btn{ height: 28px; padding: 0 11px; font-size: 13px; }
  .wf-root[data-dens="compact"] .wf-chip{ height: 20px; }
  .wf-root[data-dens="compact"] .wf-field-input{ height: 30px; }
  .wf-root[data-dens="compact"] .wf-doc-row{ padding: 6px 10px; }
  .wf-root[data-dens="compact"] .wf-nav-item{ height: 26px; font-size: 13.5px; }
  /* comfy: roomier */
  .wf-root[data-dens="comfy"] .wf-h1{ font-size: 40px; }
  .wf-root[data-dens="comfy"] .wf-h2{ font-size: 26px; }
  .wf-root[data-dens="comfy"] .wf-h3{ font-size: 19px; }
  .wf-root[data-dens="comfy"] .wf-p { font-size: 15.5px; line-height: 1.45; }
  .wf-root[data-dens="comfy"] .wf-btn{ height: 38px; padding: 0 18px; font-size: 16px; }
  .wf-root[data-dens="comfy"] .wf-chip{ height: 26px; padding: 0 11px; }
  .wf-root[data-dens="comfy"] .wf-field-input{ height: 42px; }
  .wf-root[data-dens="comfy"] .wf-doc-row{ padding: 12px 14px; }
  .wf-root[data-dens="comfy"] .wf-nav-item{ height: 38px; font-size: 16px; }

  /* ─── core building blocks ────────────────────────────────────────── */
  .wf-box{
    background: var(--paper);
    border: var(--bw) solid var(--line);
    border-radius: var(--rad);
    position: relative;
  }
  .wf-row{ display:flex; align-items:center; }
  .wf-col{ display:flex; flex-direction:column; }
  .wf-gap-1{ gap: 4px; } .wf-gap-2{ gap: 8px; }
  .wf-gap-3{ gap: 12px; } .wf-gap-4{ gap: 16px; }
  .wf-gap-5{ gap: 22px; } .wf-gap-6{ gap: 30px; }
  .wf-grow{ flex: 1 1 auto; min-width: 0; }

  /* image placeholder — striped, monospace label */
  .wf-imgph{
    background:
      repeating-linear-gradient(45deg, transparent 0 6px, var(--fill-2) 6px 7px),
      var(--fill);
    border: 1px dashed var(--rule);
    border-radius: var(--rad);
    display:flex; align-items:center; justify-content:center;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--ink-faint);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    user-select: none;
  }

  /* typography */
  .wf-h1{ font-family: var(--hand); font-size: 34px; font-weight: 400; line-height: 1; letter-spacing: -0.01em; }
  .wf-h2{ font-family: var(--hand); font-size: 22px; font-weight: 400; line-height: 1.05; }
  .wf-h3{ font-family: var(--hand); font-size: 17px; font-weight: 500; }
  .wf-p { font-family: var(--hand); font-size: 14px; color: var(--ink-soft); line-height: 1.35; }
  .wf-cap{ font-family: var(--mono); font-size: 10px; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.08em; }
  .wf-root[data-style="polished"] .wf-h1{ font-weight: 600; letter-spacing: -0.02em; }
  .wf-root[data-style="polished"] .wf-h2{ font-weight: 600; }
  .wf-root[data-style="polished"] .wf-h3{ font-weight: 600; }
  .wf-root[data-style="polished"] .wf-p{ font-size: 13px; }

  /* button */
  .wf-btn{
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    height: 32px; padding: 0 14px;
    border: var(--bw) solid var(--line);
    border-radius: 6px;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--hand);
    font-size: 15px;
    box-shadow: 1px 1px 0 var(--line);
    cursor: pointer;
    white-space: nowrap;
  }
  .wf-btn.wf-primary{
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    box-shadow: 1.5px 1.5px 0 rgba(0,0,0,0.25);
  }
  .wf-root[data-style="polished"] .wf-btn{
    box-shadow: none;
    font-weight: 500;
    background: var(--fill);
    border-color: var(--line);
  }
  .wf-root[data-style="polished"] .wf-btn.wf-primary{
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  }

  /* form field */
  .wf-field{
    display:flex; flex-direction:column; gap: 4px;
    flex: 1 1 0; min-width: 0;
  }
  .wf-field-input{
    height: 36px;
    border: var(--bw) solid var(--rule);
    border-radius: 6px;
    background: var(--fill);
    display:flex; align-items:center; padding: 0 10px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-soft);
  }
  .wf-field-input.tall{ height: 80px; align-items: flex-start; padding-top: 8px; }
  .wf-field-input.placeholder{ color: var(--ink-faint); font-style: italic; }

  /* chip / badge */
  .wf-chip{
    display:inline-flex; align-items:center; gap: 4px;
    height: 22px; padding: 0 8px;
    border: 1px solid var(--rule);
    border-radius: 999px;
    font-family: var(--mono);
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ink-soft);
    background: var(--paper);
  }
  .wf-chip.wf-chip-accent{ color: var(--accent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); background: color-mix(in srgb, var(--accent) 8%, transparent); }
  .wf-chip.wf-chip-solid{ background: var(--ink); color: var(--paper); border-color: var(--ink); }

  /* underline-doodle for headings */
  .wf-uline{ display:block; height: 6px; }

  /* sketchy connector for arrow flows */
  .wf-arrow{ color: var(--ink-soft); display:flex; align-items:center; justify-content:center; }

  /* recent-docs row */
  .wf-doc-row{
    display:flex; align-items:center; gap: 10px;
    padding: 8px 10px;
    border-bottom: 1px dashed var(--rule);
  }
  .wf-doc-row:last-child{ border-bottom: 0; }

  /* sidebar rail */
  .wf-nav-item{
    display:flex; align-items:center; gap: 8px;
    height: 32px; padding: 0 10px;
    border-radius: 6px;
    font-family: var(--hand);
    font-size: 15px;
    color: var(--ink-soft);
  }
  .wf-nav-item.active{ background: var(--fill-2); color: var(--ink); }

  /* annotations (post-it-style notes) */
  .wf-note{
    position: absolute;
    font-family: var(--hand);
    font-size: 12px;
    color: var(--accent);
    line-height: 1.2;
    pointer-events: none;
    max-width: 140px;
  }
  .wf-note::before{
    content: '';
    position: absolute;
    width: 22px; height: 22px;
    border: 1.2px solid var(--accent);
    border-radius: 50%;
    left: -28px; top: -3px;
    background:
      radial-gradient(circle at center, var(--accent) 0 3px, transparent 4px);
    opacity: .6;
  }

  /* dotted callout connector */
  .wf-arrow-svg path{ stroke: var(--ink-soft); fill: none; stroke-width: 1.2; stroke-dasharray: 3 3; }

  /* progress bar (lofi) */
  .wf-progress{ height: 6px; background: var(--fill-2); border-radius: 3px; overflow:hidden; }
  .wf-progress > div{ height: 100%; background: var(--accent); }
`;

if (typeof document !== 'undefined' && !document.getElementById('wf-style')) {
  const s = document.createElement('style');
  s.id = 'wf-style';
  s.textContent = WF_STYLE;
  document.head.appendChild(s);
}

// ─── components ─────────────────────────────────────────────────────────
function WFRoot({ children, style, dark, accent, hand, sans, density, densityKey }) {
  const cssVars = {
    '--wf-accent': accent,
    '--wf-hand': hand,
    '--wf-sans': sans,
    '--wf-dens': density,
  };
  return (
    <div className="wf-root"
         data-style={style}
         data-dark={dark ? '1' : '0'}
         data-dens={densityKey || 'regular'}
         style={cssVars}>
      {children}
    </div>
  );
}

function Box({ children, style, className = '', ...rest }) {
  return <div className={'wf-box ' + className} style={style} {...rest}>{children}</div>;
}

function ImgPh({ label = 'image', style, ratio }) {
  const s = { ...(style || {}) };
  if (ratio) s.aspectRatio = ratio;
  return <div className="wf-imgph" style={s}>{label}</div>;
}

// Tiny sketch icon — a square w/ a diagonal stroke; meant to read as a placeholder icon
function SketchIcon({ size = 22, kind = 'doc' }) {
  const sz = size;
  const paths = {
    doc:    <g><rect x="4" y="2" width="14" height="18" rx="1.5" /><path d="M7 7h8M7 10h8M7 13h5" /></g>,
    chain:  <g><path d="M7 11a4 4 0 0 1 4-4h2" /><path d="M15 11a4 4 0 0 1-4 4H9" /><circle cx="13" cy="7" r="1.5" /><circle cx="9" cy="15" r="1.5" /></g>,
    edit:   <g><path d="M3 17l4-1 11-11-3-3L4 13l-1 4z" /><path d="M13 5l3 3" /></g>,
    flow:   <g><rect x="2" y="3" width="6" height="6" rx="1" /><rect x="14" y="13" width="6" height="6" rx="1" /><path d="M8 6h6M14 6v7" /></g>,
    plus:   <g><path d="M11 4v14M4 11h14" /></g>,
    grid:   <g><rect x="3" y="3" width="6" height="6" /><rect x="13" y="3" width="6" height="6" /><rect x="3" y="13" width="6" height="6" /><rect x="13" y="13" width="6" height="6" /></g>,
    eye:    <g><path d="M2 11s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" /><circle cx="11" cy="11" r="2.5" /></g>,
    bolt:   <g><path d="M12 2L4 13h6l-2 9 9-12h-6l1-8z" /></g>,
    clock:  <g><circle cx="11" cy="11" r="8" /><path d="M11 6v5l3 2" /></g>,
    search: <g><circle cx="9" cy="9" r="5.5" /><path d="M13 13l5 5" /></g>,
    download: <g><path d="M11 3v11M6 10l5 5 5-5M4 19h14" /></g>,
    settings:<g><circle cx="11" cy="11" r="3" /><path d="M11 1v3M11 18v3M1 11h3M18 11h3M4 4l2 2M16 16l2 2M4 18l2-2M16 6l2-2" /></g>,
    user:   <g><circle cx="11" cy="8" r="3.5" /><path d="M3 20c1-4 5-6 8-6s7 2 8 6" /></g>,
    sparkle:<g><path d="M11 2v6M11 14v6M2 11h6M14 11h6M5 5l4 4M13 13l4 4M17 5l-4 4M9 13l-4 4" /></g>,
  };
  return (
    <svg width={sz} height={sz} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {paths[kind] || paths.doc}
    </svg>
  );
}

// hand-drawn squiggly underline
function Uline({ width = 100, color }) {
  const w = width;
  return (
    <svg className="wf-uline" width={w} height="6" viewBox={`0 0 ${w} 6`} preserveAspectRatio="none">
      <path
        d={`M2 4 Q ${w*0.18} 1, ${w*0.32} 3.5 T ${w*0.6} 3 T ${w*0.85} 4 T ${w-2} 3`}
        stroke={color || 'currentColor'}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// dashed arrow connector pointing down (used between hero rows)
function DownArrow({ height = 20 }) {
  return (
    <svg className="wf-arrow-svg" width="14" height={height} viewBox={`0 0 14 ${height}`}>
      <path d={`M7 2 L7 ${height - 4}`} />
      <path d={`M3 ${height - 6} L7 ${height - 2} L11 ${height - 6}`} strokeDasharray="0" />
    </svg>
  );
}

// recipe: top bar of an artboard
function TopBar({ density = 'regular', sectionLabel, right, sticky = true }) {
  return (
    <div className="wf-row wf-gap-3"
         style={{
           padding: '12px 18px',
           borderBottom: 'var(--bw) solid var(--rule)',
           background: 'var(--paper)',
           position: sticky ? 'sticky' : 'static',
           top: 0, zIndex: 2,
         }}>
      <div className="wf-row wf-gap-2" style={{ fontFamily: 'var(--hand)' }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize: 12 }}>D</div>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Docbuilder</span>
        {sectionLabel ? (
          <>
            <span style={{ color: 'var(--ink-faint)', margin: '0 4px' }}>/</span>
            <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{sectionLabel}</span>
          </>
        ) : null}
      </div>
      <div className="wf-grow" />
      {right}
    </div>
  );
}

// expose to window for cross-script use
Object.assign(window, { WFRoot, Box, ImgPh, SketchIcon, Uline, DownArrow, TopBar });

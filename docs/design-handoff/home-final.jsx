// home-final.jsx — Home · v1 (committed)
// Home C scaffold + Stepper band (chosen HIW pattern).
// • Sidebar nav, Templates section: deferred to a later release
// • Top bar now carries a theme toggle and a settings icon
// • Hero softened — welcoming explainer with two soft CTAs (tour / skip)
// • The stepper is now GENERIC (how Docbuilder works overall), not SOW-specific
// • 4 equal feature tiles below — users pick which flow to start

const HF_RECENT = [
  { type: 'SOW', name: 'SOW · Velir · FY26 Eng Block 3', when: '2h ago' },
  { type: 'CR',  name: 'CR · Velir · Block 3 extension',  when: '4h ago' },
  { type: 'SOW', name: 'SOW · Tag1 Consulting · Q2',      when: 'yesterday' },
  { type: 'CR',  name: 'CR · Mediacurrent · April',       when: '2d ago' },
];

const HF_FEATURES = [
  { id: 'sow',          icon: 'doc',   badge: 'SOW',   title: 'New Statement of Work', desc: 'Fill the standard form, watch the live preview, generate a DOCX.',     time: '~3 min' },
  { id: 'cr',           icon: 'edit',  badge: 'CR',    title: 'New Change Request',    desc: 'Draft a CR from scratch with delta highlights.',                       time: '~2 min' },
  { id: 'cr-from-sow',  icon: 'flow',  badge: 'Smart', title: 'CR from SOW',           desc: 'Upload an SOW · auto-extract resources · tweak · ship.',              time: '~90 sec' },
  { id: 'cr-from-cr',   icon: 'chain', badge: 'Chain', title: 'CR from CR',            desc: 'Extend an existing Change Request with the next block.',              time: '~90 sec' },
];

// Generic app-level steps — applies to every flow
const HF_APP_STEPS = [
  { title: 'Pick a flow',     icon: 'grid',     blurb: 'Four generators — choose what fits.' },
  { title: 'Fill the form',   icon: 'edit',     blurb: 'Customer · dates · resources · rates.' },
  { title: 'Watch preview',   icon: 'eye',      blurb: 'A DOCX-shaped preview redraws as you type.' },
  { title: 'Generate & ship', icon: 'download', blurb: 'Download DOCX or push to Google Drive.' },
];

// Toggle this artboard's wf-root data-dark attribute (visual demo —
// the persisted dark mode also lives in the Tweaks panel).
function toggleArtboardDark(e) {
  const root = e.currentTarget.closest('.wf-root');
  if (!root) return;
  const cur = root.getAttribute('data-dark') === '1';
  root.setAttribute('data-dark', cur ? '0' : '1');
}

function HomeFinal() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* ── top bar ─ logo · theme toggle · settings ─────────────────── */}
      <div className="wf-row wf-gap-3" style={{
        padding: '14px 36px',
        borderBottom: 'var(--bw) solid var(--rule)',
        background: 'var(--paper)',
      }}>
        <div className="wf-row wf-gap-2">
          <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--hand)', fontSize: 14 }}>D</div>
          <span style={{ fontFamily: 'var(--hand)', fontSize: 19 }}>Docbuilder</span>
          <span className="wf-cap" style={{ marginLeft: 6, color: 'var(--ink-faint)' }}>v1.0 · internal</span>
        </div>
        <div className="wf-grow" />
        <div className="wf-row wf-gap-2">
          <span className="wf-cap" style={{ color: 'var(--ink-faint)' }}>Kanagaraj · Acquia</span>
          {/* theme toggle */}
          <button onClick={toggleArtboardDark} className="wf-iconbtn" title="Toggle light / dark" style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'var(--bw) solid var(--rule)', background: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-soft)', cursor: 'pointer',
          }}>
            <ThemeIcon />
          </button>
          {/* settings */}
          <button title="Settings" style={{
            width: 32, height: 32, borderRadius: 8,
            border: 'var(--bw) solid var(--rule)', background: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-soft)', cursor: 'pointer',
          }}>
            <SketchIcon size={16} kind="settings" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* ── hero · welcome explainer, not a CTA-jam ─────────────────── */}
        <div style={{ padding: '36px 36px 24px', borderBottom: '1px dashed var(--rule)' }}>
          <div className="wf-row" style={{ alignItems: 'center', gap: 36 }}>
            <div className="wf-col wf-gap-2 wf-grow" style={{ maxWidth: 620 }}>
              <div className="wf-row wf-gap-2">
                <span className="wf-chip wf-chip-accent">welcome</span>
                <span className="wf-cap">first time? read this · 30 seconds</span>
              </div>
              <div className="wf-h1" style={{ marginTop: 4 }}>
                Build SOWs &amp; Change Requests<br />
                in <span style={{ color: 'var(--accent)' }}>minutes, not hours</span>.
              </div>
              <div className="wf-p" style={{ marginTop: 8 }}>
                Docbuilder replaces the SOW/CR Google Doc juggling with a guided form. Type once, watch a live document render on the right, then export a DOCX or push it straight to Drive. No copy-paste, no broken dates, no "Invalid Date" in the table.
              </div>
              <div className="wf-row wf-gap-2" style={{ marginTop: 14 }}>
                <div className="wf-btn wf-primary"><SketchIcon size={14} kind="bolt" /> Try a sample SOW</div>
                <div className="wf-btn">Skim the 4 flows ↓</div>
              </div>
              <div className="wf-cap" style={{ marginTop: 6, color: 'var(--ink-faint)' }}>
                opens the SOW form pre-filled with a fictional engagement · nothing saves · exit anytime
              </div>
            </div>

            {/* hero diagram — input → output */}
            <div className="wf-col wf-gap-2" style={{ flex: '0 0 auto' }}>
              <Box style={{ padding: 12, width: 280 }}>
                <div className="wf-cap" style={{ marginBottom: 8 }}>what it does</div>
                <div className="wf-row wf-gap-2" style={{ alignItems: 'center' }}>
                  <ImgPh label="form" style={{ width: 80, height: 70, flex: '0 0 auto' }} />
                  <div className="wf-col" style={{ alignItems: 'center', flex: 1, color: 'var(--accent)' }}>
                    <SketchIcon size={20} kind="bolt" />
                    <span className="wf-cap" style={{ color: 'var(--accent)', marginTop: 4 }}>generate</span>
                  </div>
                  <ImgPh label="DOCX" style={{ width: 80, height: 70, flex: '0 0 auto' }} />
                </div>
                <div className="wf-row wf-gap-2 wf-cap" style={{ marginTop: 10, color: 'var(--ink-faint)' }}>
                  <span>form fields</span>
                  <span style={{ marginLeft: 'auto' }}>signed-ready DOCX</span>
                </div>
              </Box>
            </div>
          </div>
        </div>

        {/* ── how Docbuilder works (generic) · stepper band ───────────── */}
        <div style={{ padding: '24px 36px 4px' }}>
          <Box style={{ padding: '20px 22px', background: 'var(--fill)' }}>
            <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 12 }}>
              <div className="wf-row wf-gap-2 wf-grow" style={{ alignItems: 'baseline' }}>
                <span className="wf-cap" style={{ color: 'var(--accent)' }}>how Docbuilder works</span>
                <span style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>4 steps · same shape for every flow</span>
              </div>
              <div className="wf-cap">watch a 60-sec tour ↗</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '12.5%', right: '12.5%', top: 26,
                borderTop: '1.4px dashed var(--accent)', opacity: 0.5,
              }} />
              {HF_APP_STEPS.map((s, i) => (
                <div key={i} className="wf-col wf-gap-1" style={{ alignItems: 'center', padding: '0 12px', position: 'relative' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 999,
                    border: 'var(--bw) solid var(--accent)',
                    background: 'var(--paper)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                  }}>
                    <SketchIcon size={22} kind={s.icon} />
                  </div>
                  <div className="wf-cap" style={{ color: 'var(--accent)', marginTop: 4 }}>step {i + 1}</div>
                  <div style={{ fontFamily: 'var(--hand)', fontSize: 15, textAlign: 'center' }}>{s.title}</div>
                  <div className="wf-p" style={{ fontSize: 12.5, textAlign: 'center' }}>{s.blurb}</div>
                </div>
              ))}
            </div>
          </Box>
        </div>

        {/* ── pick a flow · 4 equal tiles ─────────────────────────────── */}
        <div style={{ padding: '28px 36px 8px' }}>
          <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 12 }}>
            <div className="wf-h3 wf-grow">Ready? Pick a flow.</div>
            <div className="wf-cap">4 generators · pick what fits</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {HF_FEATURES.map(f => (
              <Box key={f.id} style={{ padding: 14 }}>
                <div className="wf-row wf-gap-2" style={{ marginBottom: 8 }}>
                  <Box style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    <SketchIcon size={18} kind={f.icon} />
                  </Box>
                  <span className="wf-chip wf-chip-accent" style={{ marginLeft: 'auto' }}>{f.badge}</span>
                </div>
                <div className="wf-h3">{f.title}</div>
                <div className="wf-p" style={{ marginTop: 4 }}>{f.desc}</div>
                <div className="wf-row wf-gap-2" style={{ marginTop: 12 }}>
                  <span className="wf-cap">{f.time}</span>
                  <span className="wf-grow" />
                  <span className="wf-cap" style={{ color: 'var(--ink-faint)' }}>try sample →</span>
                </div>
                <div className="wf-row wf-gap-2" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--rule)' }}>
                  <span className="wf-grow" />
                  <span className="wf-cap" style={{ color: 'var(--accent)' }}>start blank →</span>
                </div>
              </Box>
            ))}
          </div>
        </div>

        {/* ── recent documents ────────────────────────────────────────── */}
        <div style={{ padding: '24px 36px 40px' }}>
          <Box style={{ padding: '14px 18px 6px' }}>
            <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 6 }}>
              <div className="wf-h3 wf-grow">Recent documents</div>
              <div className="wf-cap">view all →</div>
            </div>
            {HF_RECENT.map((d, i) => (
              <div key={i} className="wf-doc-row">
                <span className={'wf-chip ' + (d.type === 'SOW' ? 'wf-chip-accent' : 'wf-chip-solid')} style={{ minWidth: 36, justifyContent: 'center' }}>{d.type}</span>
                <span className="wf-grow" style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>{d.name}</span>
                <span className="wf-cap">{d.when}</span>
                <SketchIcon size={14} kind="download" />
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
}

// sun/moon split icon — visual cue that this toggles light/dark
function ThemeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="5" />
      <path d="M11 1v3M11 18v3M1 11h3M18 11h3M4 4l2 2M16 16l2 2M4 18l2-2M16 6l2-2" />
      <path d="M11 6a5 5 0 0 0 0 10z" fill="currentColor" stroke="none" opacity=".75" />
    </svg>
  );
}

Object.assign(window, { HomeFinal });

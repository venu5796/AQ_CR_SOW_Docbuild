// hiw-patterns.jsx — four ways to answer "How does it work?"
// Each artboard shows the SAME feature (Create SOW) with the pattern in its
// reveal/expanded state, so you can compare them directly.

const HIW_STEPS = [
  { n: 1, title: 'Pick a customer',     blurb: 'Choose from your saved list or type a new one. Dates default to today + the next workable Monday.',                icon: 'user' },
  { n: 2, title: 'Add resources',       blurb: 'Drop in each role with rate, hrs/day and the date range. Totals & fees re-calc as you type.',                       icon: 'flow' },
  { n: 3, title: 'Watch the preview',   blurb: 'A live DOCX-shaped preview sits on the right. Every keystroke re-renders \u2014 no \u201cinvalid date\u201d ever.',  icon: 'eye'  },
  { n: 4, title: 'Generate & upload',   blurb: 'Download the DOCX or push it straight to Google Drive with one click. Drafts auto-save as you go.',                  icon: 'download' },
];

const FEATURE = {
  id: 'sow', icon: 'doc', badge: 'SOW', title: 'Create SOW',
  desc: 'Fill out the standard form, watch the live preview, then export to DOCX or push to Drive.',
  time: '~3 min · 4 steps',
};

/* ── Shared header on every HIW artboard ────────────────────────────── */
function HiwHeader({ name, subtitle }) {
  return (
    <div className="wf-col wf-gap-1" style={{ padding: '18px 24px 14px', borderBottom: '1px dashed var(--rule)' }}>
      <div className="wf-cap" style={{ color: 'var(--accent)' }}>How does it work? · pattern</div>
      <div className="wf-row" style={{ alignItems: 'baseline', gap: 10 }}>
        <div className="wf-h1" style={{ fontSize: 24 }}>{name}</div>
        <Uline width={90} />
      </div>
      <div className="wf-p">{subtitle}</div>
    </div>
  );
}

/* Reusable feature card (collapsed state) */
function FeatureCard({ children, footer, style }) {
  return (
    <Box style={{ padding: 'var(--pad)', ...style }}>
      <div className="wf-row wf-gap-3" style={{ alignItems: 'flex-start' }}>
        <Box style={{ width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', color: 'var(--accent)' }}>
          <SketchIcon size={22} kind={FEATURE.icon} />
        </Box>
        <div className="wf-col wf-gap-1 wf-grow">
          <div className="wf-row wf-gap-2">
            <span className="wf-chip wf-chip-accent">{FEATURE.badge}</span>
            <span className="wf-cap">{FEATURE.time}</span>
          </div>
          <div className="wf-h2" style={{ marginTop: 4 }}>{FEATURE.title}</div>
          <div className="wf-p">{FEATURE.desc}</div>
        </div>
      </div>
      {footer ? (
        <div className="wf-row wf-gap-2" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--rule)' }}>
          {footer}
        </div>
      ) : null}
      {children}
    </Box>
  );
}

/* ╭───────────────────────────────────────────────────────────────────╮ */
/* │ PATTERN 1 · Inline accordion                                       │ */
/* │   Card expands downward to reveal a step list with illustrations.   │ */
/* ╰───────────────────────────────────────────────────────────────────╯ */
function HiwAccordion() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <HiwHeader name="Inline accordion" subtitle="The card unfolds in place. Cheapest to scan, no layout shift around it (we reserve the space)." />
      <div style={{ padding: '20px 24px', overflow: 'auto', flex: 1 }}>
        <FeatureCard
          footer={
            <>
              <div className="wf-cap wf-grow" style={{ color: 'var(--accent)' }}>How does it work? ⌃</div>
              <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Start SOW →</div>
            </>
          }
        >
          {/* expanded body */}
          <div className="wf-col wf-gap-3" style={{
            marginTop: 14, padding: '14px 16px 6px',
            background: 'var(--fill)',
            borderRadius: 6,
            borderTop: '1px solid var(--rule)',
          }}>
            <div className="wf-row" style={{ alignItems: 'baseline' }}>
              <div className="wf-cap wf-grow">walkthrough</div>
              <div className="wf-cap">~ 90 sec read</div>
            </div>
            {HIW_STEPS.map((s) => (
              <div key={s.n} className="wf-row wf-gap-3" style={{ alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  border: 'var(--bw) solid var(--accent)',
                  color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: 11,
                  flex: '0 0 auto', background: 'var(--paper)',
                }}>{s.n}</div>
                <div className="wf-col wf-grow" style={{ gap: 2, paddingBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>{s.title}</div>
                  <div className="wf-p" style={{ fontSize: 13 }}>{s.blurb}</div>
                </div>
                <div style={{ flex: '0 0 auto', color: 'var(--ink-faint)' }}>
                  <SketchIcon size={20} kind={s.icon} />
                </div>
              </div>
            ))}
          </div>
        </FeatureCard>

        <div className="wf-note" style={{ position: 'relative', marginTop: 14, paddingLeft: 32 }}>
          <span style={{ position:'absolute', left: 0, top: -2,
              width: 22, height: 22, borderRadius: 999, border:'1.2px solid var(--accent)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--mono)', fontSize: 10, color:'var(--accent)' }}>
            ✎
          </span>
          good for: 4 cards on one page, no context-switch · trade-off: long pages once 2–3 expanded
        </div>
      </div>
    </div>
  );
}

/* ╭───────────────────────────────────────────────────────────────────╮ */
/* │ PATTERN 2 · Side drawer                                            │ */
/* │   Card stays put, a slide-in panel from the right shows the deep   │ */
/* │   walkthrough w/ screenshots.                                       │ */
/* ╰───────────────────────────────────────────────────────────────────╯ */
function HiwDrawer() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <HiwHeader name="Side drawer" subtitle="Click the card → a deep walkthrough slides in from the right with screenshots and tips. The home page stays still." />
      <div className="wf-row" style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {/* faded back-page */}
        <div className="wf-col wf-gap-3" style={{ flex: 1, padding: '22px 24px', opacity: 0.55, overflow: 'hidden' }}>
          <FeatureCard
            footer={
              <>
                <div className="wf-cap wf-grow">How does it work? →</div>
                <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Start SOW →</div>
              </>
            }
          />
          {/* dimmed second card to imply more below */}
          <Box style={{ padding: 14, opacity: 0.7 }}>
            <div className="wf-row wf-gap-3">
              <div style={{ width: 38, height: 38, background: 'var(--fill-2)', borderRadius: 6 }} />
              <div className="wf-col wf-gap-1 wf-grow">
                <div className="wf-h3">Create CR</div>
                <div className="wf-p">Draft a CR from scratch.</div>
              </div>
            </div>
          </Box>
        </div>

        {/* drawer */}
        <Box style={{
          position: 'absolute', right: 18, top: 18, bottom: 18,
          width: 380, padding: 0, display: 'flex', flexDirection: 'column',
          boxShadow: '0 18px 60px rgba(0,0,0,0.22), 2px 2px 0 var(--line)',
          background: 'var(--paper)',
        }}>
          <div className="wf-row" style={{ padding: '14px 16px', borderBottom: '1px dashed var(--rule)' }}>
            <div className="wf-row wf-gap-2">
              <span className="wf-chip wf-chip-accent">{FEATURE.badge}</span>
              <span style={{ fontFamily: 'var(--hand)', fontSize: 16 }}>{FEATURE.title}</span>
            </div>
            <div className="wf-grow" />
            <span className="wf-cap">esc</span>
            <span style={{ fontFamily: 'var(--hand)', fontSize: 18, color: 'var(--ink-soft)', marginLeft: 6 }}>×</span>
          </div>
          <div className="wf-col wf-gap-3" style={{ padding: '16px', overflow: 'auto', flex: 1 }}>
            <ImgPh label="hero · walkthrough loop" style={{ height: 130 }} />
            <div className="wf-col wf-gap-2">
              <div className="wf-cap">How it works · 4 steps</div>
              {HIW_STEPS.map(s => (
                <div key={s.n} style={{ paddingBottom: 10, borderBottom: '1px dashed var(--rule)' }}>
                  <div className="wf-row wf-gap-2">
                    <div style={{
                      width: 22, height: 22, borderRadius: 999,
                      border: 'var(--bw) solid var(--accent)', color: 'var(--accent)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily: 'var(--mono)', fontSize: 10,
                    }}>{s.n}</div>
                    <span style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>{s.title}</span>
                  </div>
                  <div className="wf-p" style={{ fontSize: 12.5, marginTop: 4 }}>{s.blurb}</div>
                </div>
              ))}
            </div>
            <div className="wf-row wf-gap-2 wf-cap" style={{ color: 'var(--accent)' }}>
              <SketchIcon size={12} kind="bolt" />Pro-tip · upload an existing SOW from CR-from-SOW to pre-fill 90% of fields
            </div>
          </div>
          <div className="wf-row wf-gap-2" style={{ padding: 14, borderTop: '1px dashed var(--rule)' }}>
            <div className="wf-btn wf-grow">Watch demo</div>
            <div className="wf-btn wf-primary wf-grow">Start SOW →</div>
          </div>
        </Box>
      </div>
    </div>
  );
}

/* ╭───────────────────────────────────────────────────────────────────╮ */
/* │ PATTERN 3 · Stepper diagram                                        │ */
/* │   The card lives above; below it a horizontal explainer with       │ */
/* │   numbered illustrated steps. Always visible — no click needed.     │ */
/* ╰───────────────────────────────────────────────────────────────────╯ */
function HiwStepper() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <HiwHeader name="Stepper diagram" subtitle="Always visible — illustrated steps run horizontally under the card. Best for explaining new flows once. Heavier visually." />
      <div className="wf-col wf-gap-4" style={{ padding: '20px 24px', overflow: 'auto', flex: 1 }}>
        <FeatureCard
          footer={
            <>
              <div className="wf-cap wf-grow">how it works · see below ↓</div>
              <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Start SOW →</div>
            </>
          }
        />

        {/* horizontal stepper */}
        <Box style={{ padding: '18px 16px', background: 'var(--fill)' }}>
          <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 14 }}>
            <div className="wf-h3 wf-grow">From blank form to signed PDF — 4 steps</div>
            <div className="wf-cap">total · ~3 min</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            {/* connector line */}
            <div style={{
              position: 'absolute', left: '12.5%', right: '12.5%', top: 32,
              height: 0, borderTop: '1.6px dashed var(--accent)', opacity: 0.5,
            }} />
            {HIW_STEPS.map(s => (
              <div key={s.n} className="wf-col wf-gap-2" style={{ alignItems: 'center', padding: '0 10px', position: 'relative' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 999,
                  border: 'var(--bw) solid var(--accent)',
                  background: 'var(--paper)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: 'var(--accent)',
                  position: 'relative', zIndex: 1,
                }}>
                  <SketchIcon size={22} kind={s.icon} />
                </div>
                <div className="wf-cap" style={{ color: 'var(--accent)' }}>step {s.n}</div>
                <div style={{ fontFamily: 'var(--hand)', fontSize: 15, textAlign: 'center' }}>{s.title}</div>
                <div className="wf-p" style={{ fontSize: 12.5, textAlign: 'center' }}>{s.blurb}</div>
              </div>
            ))}
          </div>
        </Box>

        <div className="wf-note" style={{ position: 'relative', paddingLeft: 32 }}>
          <span style={{ position:'absolute', left: 0, top: -2,
              width: 22, height: 22, borderRadius: 999, border:'1.2px solid var(--accent)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--mono)', fontSize: 10, color:'var(--accent)' }}>
            ✎
          </span>
          good for: new users · onboarding · 1 card per page · trade-off: noisy if shown for all 4 features
        </div>
      </div>
    </div>
  );
}

/* ╭───────────────────────────────────────────────────────────────────╮ */
/* │ PATTERN 4 · Flip card                                              │ */
/* │   Front shows the action; back shows the 4 micro-steps. Click or   │ */
/* │   hover flips. Compact — fits in the 2x2 grid.                      │ */
/* ╰───────────────────────────────────────────────────────────────────╯ */
function HiwFlip() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <HiwHeader name="Flip card" subtitle="Front = action. Click 'How it works?' → the card flips to show 4 micro-steps. Layout never reflows. Most compact." />
      <div className="wf-row" style={{ padding: '20px 24px', gap: 18, overflow: 'auto', flex: 1, alignItems: 'flex-start' }}>
        {/* front (showing for compare) */}
        <div className="wf-col wf-gap-2" style={{ flex: 1, minWidth: 0 }}>
          <div className="wf-cap">front · default</div>
          <Box style={{ padding: 'var(--pad)' }}>
            <div className="wf-row wf-gap-3" style={{ alignItems: 'flex-start' }}>
              <Box style={{ width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', color: 'var(--accent)' }}>
                <SketchIcon size={22} kind={FEATURE.icon} />
              </Box>
              <div className="wf-col wf-gap-1 wf-grow">
                <div className="wf-row wf-gap-2">
                  <span className="wf-chip wf-chip-accent">{FEATURE.badge}</span>
                  <span className="wf-cap">{FEATURE.time}</span>
                </div>
                <div className="wf-h2" style={{ marginTop: 4 }}>{FEATURE.title}</div>
                <div className="wf-p">{FEATURE.desc}</div>
              </div>
            </div>
            <div className="wf-row wf-gap-2" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--rule)' }}>
              <div className="wf-cap wf-grow">how it works? ↻ flip</div>
              <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Start →</div>
            </div>
          </Box>
        </div>

        {/* arrow */}
        <div className="wf-col wf-gap-1" style={{ alignSelf: 'center', alignItems: 'center', color: 'var(--accent)' }}>
          <svg width="50" height="44" viewBox="0 0 50 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M5 22 Q 25 -2, 45 22" strokeDasharray="3 3" />
            <path d="M40 18 L45 22 L41 27" />
          </svg>
          <span className="wf-cap" style={{ color: 'var(--accent)' }}>flip</span>
        </div>

        {/* back */}
        <div className="wf-col wf-gap-2" style={{ flex: 1, minWidth: 0 }}>
          <div className="wf-cap" style={{ color: 'var(--accent)' }}>back · after flip</div>
          <Box style={{ padding: 'var(--pad)', background: 'var(--fill)' }}>
            <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 10 }}>
              <span className="wf-chip wf-chip-accent">{FEATURE.badge}</span>
              <div className="wf-grow" />
              <span className="wf-cap" style={{ color: 'var(--accent)' }}>↺ back</span>
            </div>
            <div className="wf-col wf-gap-2">
              {HIW_STEPS.map(s => (
                <div key={s.n} className="wf-row wf-gap-2">
                  <div style={{
                    width: 24, height: 24, borderRadius: 999,
                    border: 'var(--bw) solid var(--accent)',
                    color: 'var(--accent)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily: 'var(--mono)', fontSize: 10,
                    flex: '0 0 auto', background: 'var(--paper)',
                  }}>{s.n}</div>
                  <div className="wf-col" style={{ gap: 0 }}>
                    <span style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{s.title}</span>
                    <span className="wf-p" style={{ fontSize: 12 }}>{s.blurb.split('.')[0]}.</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="wf-row wf-gap-2" style={{ marginTop: 14, paddingTop: 10, borderTop: '1px dashed var(--rule)' }}>
              <div className="wf-cap wf-grow">{HIW_STEPS.length} steps · ~3 min</div>
              <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Start →</div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HiwAccordion, HiwDrawer, HiwStepper, HiwFlip });

// sow-variants.jsx — three directions for the Create-SOW workspace
// Uses primitives from wf-primitives.jsx (already on window).

const STEPS = [
  { n: 1, label: 'Customer & dates' },
  { n: 2, label: 'Resources & periods' },
  { n: 3, label: 'Preview & generate' },
];

const SOW_FIELDS = [
  { row: ['Customer name', 'Customer signatory'],   vals: ['Velir', 'Jane Wexley'] },
  { row: ['Project name', 'Acquia program lead'],   vals: ['FY26 Drupal eng — Block 3', 'Kanagaraj'] },
  { row: ['Start date', 'End date'],                vals: ['March 9th, 2026', 'June 28th, 2026'] },
  { row: ['Total budget (USD)', 'Holidays in range'], vals: ['$184,800', '2'] },
];

const RESOURCES = [
  { role: 'Senior Drupal engineer', name: 'A. Mehta',  rate: '$165/h', hours: '440 h' },
  { role: 'Drupal engineer',         name: 'P. Lopez',  rate: '$145/h', hours: '360 h' },
  { role: 'Tech lead',               name: 'S. Pereira', rate: '$185/h', hours: '120 h' },
];

/* ────────────────────────────────────────────────────────────────────── */
/* SOW · A — Top header + 50/50 form / preview                          */
/*    Matches the user's wireframe most directly.                        */
/* ────────────────────────────────────────────────────────────────────── */
function SowA() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <TopBar
        sectionLabel="New Statement of Work"
        right={
          <div className="wf-row wf-gap-2">
            <span className="wf-cap">draft auto-saved · 12s ago</span>
            <div className="wf-btn" style={{ height: 28, fontSize: 13 }}>Cancel</div>
            <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Generate DOCX</div>
          </div>
        }
      />

      {/* split */}
      <div className="wf-row" style={{ flex: 1, minHeight: 0 }}>
        {/* form — left */}
        <div className="wf-col" style={{ flex: 1.05, padding: '20px 26px', overflow: 'auto', gap: 18 }}>
          <div className="wf-col wf-gap-1">
            <div className="wf-cap">Form</div>
            <div className="wf-row" style={{ alignItems: 'baseline', gap: 10 }}>
              <div className="wf-h1" style={{ fontSize: 26 }}>SOW details</div>
              <Uline width={92} />
            </div>
          </div>

          {/* progress chips */}
          <div className="wf-row wf-gap-2">
            {STEPS.map((s, i) => (
              <div key={s.n} className="wf-row wf-gap-1" style={{
                  padding: '4px 10px', borderRadius: 999,
                  border: 'var(--bw) solid ' + (i === 0 ? 'var(--accent)' : 'var(--rule)'),
                  color: i === 0 ? 'var(--accent)' : 'var(--ink-soft)',
                  fontFamily: 'var(--hand)', fontSize: 13,
                }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10 }}>{s.n}</span>·<span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* sections */}
          {SOW_FIELDS.map((f, i) => (
            <div key={i} className="wf-row wf-gap-3">
              {f.row.map((label, j) => (
                <div key={j} className="wf-field">
                  <div className="wf-cap">{label}</div>
                  <div className="wf-field-input">{f.vals[j]}</div>
                </div>
              ))}
            </div>
          ))}

          {/* resources */}
          <div className="wf-col wf-gap-2">
            <div className="wf-row" style={{ alignItems: 'baseline' }}>
              <div className="wf-h3 wf-grow">Resources</div>
              <div className="wf-cap" style={{ color: 'var(--accent)' }}>+ add resource</div>
            </div>
            {RESOURCES.map((r, i) => (
              <Box key={i} style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 90px 90px', gap: 12 }}>
                <div className="wf-col" style={{ gap: 2 }}>
                  <span className="wf-cap">Role</span>
                  <span style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{r.role}</span>
                </div>
                <div className="wf-col" style={{ gap: 2 }}>
                  <span className="wf-cap">Name · subcon</span>
                  <span style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{r.name}</span>
                </div>
                <div className="wf-col" style={{ gap: 2 }}>
                  <span className="wf-cap">Rate</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{r.rate}</span>
                </div>
                <div className="wf-col" style={{ gap: 2 }}>
                  <span className="wf-cap">Hours</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{r.hours}</span>
                </div>
              </Box>
            ))}
          </div>

          {/* footer actions */}
          <div className="wf-row wf-gap-2" style={{ paddingTop: 8 }}>
            <div className="wf-btn">← Back</div>
            <div className="wf-grow" />
            <div className="wf-btn">Save draft</div>
            <div className="wf-btn wf-primary">Continue →</div>
          </div>
        </div>

        {/* preview — right */}
        <div className="wf-col" style={{ flex: 1, borderLeft: 'var(--bw) solid var(--rule)', background: 'var(--fill)', minWidth: 0 }}>
          <div className="wf-row" style={{ padding: '12px 18px', borderBottom: '1px dashed var(--rule)' }}>
            <div className="wf-row wf-gap-1 wf-cap"><SketchIcon size={12} kind="eye" />Live preview</div>
            <div className="wf-grow" />
            <div className="wf-cap">page 1 of 4</div>
          </div>
          <div style={{ padding: 22, overflow: 'auto', flex: 1 }}>
            {/* mock document */}
            <div style={{ background: 'var(--paper)', border: 'var(--bw) solid var(--rule)', borderRadius: 4, padding: 28, minHeight: 480, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              <div style={{ fontFamily: 'var(--hand)', fontSize: 16, color: 'var(--ink)', marginBottom: 14 }}>Statement of Work</div>
              <div style={{ height: 1, background: 'var(--rule)', margin: '8px 0 14px' }} />
              {['CUSTOMER ······································· Velir',
                'PROJECT  ······································· FY26 Drupal eng — Block 3',
                'TERM     ······································· Mar 9 — Jun 28, 2026',
                'TOTAL    ······································· $184,800.00',
              ].map((l, i) => <div key={i}>{l}</div>)}
              <div style={{ marginTop: 18, fontFamily: 'var(--hand)', fontSize: 13, color: 'var(--ink)' }}>1. Scope of work</div>
              <div style={{ marginTop: 6 }}>{'═'.repeat(60)}</div>
              <div>{'═'.repeat(54)}</div>
              <div>{'═'.repeat(58)}</div>
              <div style={{ marginTop: 14, fontFamily: 'var(--hand)', fontSize: 13, color: 'var(--ink)' }}>2. Resources & fees</div>
              <div style={{ marginTop: 8, border: '1px solid var(--rule)' }}>
                {['ROLE                NAME       RATE     HOURS    FEE',
                  '─────────────────── ────────── ──────── ──────── ──────────',
                  'Sr Drupal engineer  A. Mehta   $165/h   440 h    $ 72,600',
                  'Drupal engineer     P. Lopez   $145/h   360 h    $ 52,200',
                  'Tech lead           S. Pereira $185/h   120 h    $ 22,200',
                ].map((l, i) => <div key={i} style={{ padding: '0 6px' }}>{l}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* SOW · B — Stepper-led, two columns, preview as collapsible drawer    */
/* ────────────────────────────────────────────────────────────────────── */
function SowB() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <TopBar
        sectionLabel="New Statement of Work"
        right={
          <div className="wf-row wf-gap-2">
            <div className="wf-btn" style={{ height: 28, fontSize: 13 }}><SketchIcon size={12} kind="eye" /> Preview</div>
            <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Generate</div>
          </div>
        }
      />

      {/* stepper bar */}
      <div className="wf-row" style={{ padding: '14px 26px', borderBottom: '1px dashed var(--rule)', gap: 14 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="wf-row wf-gap-2" style={{ flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                border: 'var(--bw) solid ' + (i <= 1 ? 'var(--accent)' : 'var(--rule)'),
                background: i === 0 ? 'var(--accent)' : 'transparent',
                color: i === 0 ? 'white' : (i === 1 ? 'var(--accent)' : 'var(--ink-faint)'),
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily: 'var(--mono)', fontSize: 11
              }}>{i < 1 ? '✓' : s.n}</div>
              <div className="wf-col" style={{ gap: 1 }}>
                <span className="wf-cap" style={{ color: i <= 1 ? 'var(--accent)' : 'var(--ink-faint)' }}>step {s.n}</span>
                <span style={{ fontFamily: 'var(--hand)', fontSize: 14, color: i <= 1 ? 'var(--ink)' : 'var(--ink-faint)' }}>{s.label}</span>
              </div>
            </div>
            {i < STEPS.length - 1 ? <div style={{ flex: '0 0 24px', borderTop: '1px dashed var(--rule)', marginTop: 14 }} /> : null}
          </React.Fragment>
        ))}
      </div>

      {/* progress + meta */}
      <div className="wf-row" style={{ padding: '10px 26px', background: 'var(--fill)', gap: 12 }}>
        <div className="wf-grow" style={{ maxWidth: 340 }}>
          <div className="wf-row wf-gap-2" style={{ marginBottom: 4 }}>
            <span className="wf-cap">step 2 progress</span>
            <span className="wf-cap" style={{ marginLeft: 'auto', color: 'var(--accent)' }}>60%</span>
          </div>
          <div className="wf-progress"><div style={{ width: '60%' }} /></div>
        </div>
        <div className="wf-grow" />
        <div className="wf-row wf-gap-2 wf-cap"><SketchIcon size={12} kind="clock" />~ 90 sec left</div>
        <div className="wf-row wf-gap-2 wf-cap"><SketchIcon size={12} kind="user" />K · auto-saved</div>
      </div>

      <div className="wf-row" style={{ flex: 1, minHeight: 0 }}>
        {/* main form — wider */}
        <div className="wf-col" style={{ flex: 1, padding: '22px 32px', overflow: 'auto', gap: 16 }}>
          <div className="wf-row" style={{ alignItems: 'baseline' }}>
            <div className="wf-h2 wf-grow">Resources & periods</div>
            <div className="wf-cap" style={{ color: 'var(--accent)' }}>+ add</div>
          </div>

          {RESOURCES.map((r, i) => (
            <Box key={i} style={{ padding: 'var(--pad)' }}>
              <div className="wf-row wf-gap-3" style={{ alignItems: 'flex-start' }}>
                <div className="wf-col" style={{ width: 240, gap: 4 }}>
                  <span className="wf-cap">Resource</span>
                  <span style={{ fontFamily: 'var(--hand)', fontSize: 16 }}>{r.role}</span>
                  <span className="wf-cap" style={{ color: 'var(--ink-faint)' }}>{r.name} · {r.rate}</span>
                </div>

                <div className="wf-col wf-grow wf-gap-2">
                  <div className="wf-row wf-gap-2">
                    <div className="wf-field">
                      <div className="wf-cap">Period start</div>
                      <div className="wf-field-input">2026-03-09</div>
                    </div>
                    <div className="wf-field">
                      <div className="wf-cap">Period end</div>
                      <div className="wf-field-input">2026-06-28</div>
                    </div>
                    <div className="wf-field" style={{ maxWidth: 90 }}>
                      <div className="wf-cap">Hrs/day</div>
                      <div className="wf-field-input">{i === 2 ? '3' : '8'}</div>
                    </div>
                    <div className="wf-field" style={{ maxWidth: 90 }}>
                      <div className="wf-cap">Holidays</div>
                      <div className="wf-field-input">2</div>
                    </div>
                  </div>
                  <div className="wf-row wf-gap-2 wf-cap">
                    <span>= {r.hours}</span>
                    <span>×</span>
                    <span>{r.rate}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>fee · ${(i === 0 ? 72600 : i === 1 ? 52200 : 22200).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Box>
          ))}

          {/* totals strip */}
          <Box style={{ padding: 14, background: 'var(--fill)' }}>
            <div className="wf-row wf-gap-4">
              <div className="wf-col wf-gap-1"><span className="wf-cap">Total hours</span><span className="wf-h3">920 h</span></div>
              <div className="wf-col wf-gap-1"><span className="wf-cap">Working days</span><span className="wf-h3">79</span></div>
              <div className="wf-col wf-gap-1"><span className="wf-cap">Holidays</span><span className="wf-h3">2</span></div>
              <div className="wf-grow" />
              <div className="wf-col wf-gap-1" style={{ alignItems: 'flex-end' }}>
                <span className="wf-cap">Total fee</span>
                <span className="wf-h1" style={{ fontSize: 28, color: 'var(--accent)' }}>$147,000</span>
              </div>
            </div>
          </Box>

          <div className="wf-row wf-gap-2" style={{ paddingTop: 8 }}>
            <div className="wf-btn">← Back · customer</div>
            <div className="wf-grow" />
            <div className="wf-btn">Save draft</div>
            <div className="wf-btn wf-primary">Continue → preview</div>
          </div>
        </div>

        {/* collapsible preview drawer */}
        <div className="wf-col" style={{ width: 320, borderLeft: 'var(--bw) solid var(--rule)', background: 'var(--paper)' }}>
          <div className="wf-row" style={{ padding: '12px 16px', borderBottom: '1px dashed var(--rule)' }}>
            <div className="wf-cap wf-grow">Mini preview · live</div>
            <SketchIcon size={12} kind="eye" />
          </div>
          <div style={{ padding: 14, overflow: 'auto', flex: 1 }}>
            <Box style={{ padding: 14, fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-soft)', lineHeight: 1.7, minHeight: 380 }}>
              <div style={{ fontFamily: 'var(--hand)', fontSize: 14, color: 'var(--ink)', marginBottom: 8 }}>SOW · Velir · FY26</div>
              <div style={{ height: 1, background: 'var(--rule)', margin: '6px 0' }} />
              <div>CUSTOMER ······· Velir</div>
              <div>TERM ··········· Mar 9 — Jun 28, 2026</div>
              <div>TOTAL ·········· $147,000.00</div>
              <div style={{ marginTop: 10, color: 'var(--ink)', fontFamily: 'var(--hand)', fontSize: 12 }}>Resources</div>
              <div style={{ marginTop: 4 }}>
                <div>Sr eng · A. Mehta · 440h · $72,600</div>
                <div>Eng · P. Lopez · 360h · $52,200</div>
                <div>Lead · S. Pereira · 120h · $22,200</div>
              </div>
              <div style={{ marginTop: 12, color: 'var(--accent)', fontFamily: 'var(--hand)', fontSize: 12 }}>↳ updated · just now</div>
            </Box>
          </div>
          <div style={{ padding: 12, borderTop: '1px dashed var(--rule)' }}>
            <div className="wf-btn" style={{ width: '100%', height: 30, fontSize: 12 }}>Open full preview ↗</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* SOW · C — Sidebar rail + single-column form + floating preview pill   */
/*    Power-user / Linear vibes                                          */
/* ────────────────────────────────────────────────────────────────────── */
function SowC() {
  return (
    <div className="wf-row" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* slim left rail */}
      <div className="wf-col" style={{ width: 56, borderRight: 'var(--bw) solid var(--rule)', background: 'var(--fill)', padding: '14px 0', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: 5, background: 'var(--accent)', color: 'white', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--hand)', fontSize: 13 }}>D</div>
        <div style={{ height: 1, background: 'var(--rule)', width: 24 }} />
        {['grid', 'doc', 'edit', 'flow', 'clock'].map((k, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 6,
            background: i === 1 ? 'var(--fill-2)' : 'transparent',
            color: i === 1 ? 'var(--accent)' : 'var(--ink-soft)',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <SketchIcon size={16} kind={k} />
          </div>
        ))}
        <div className="wf-grow" />
        <SketchIcon size={16} kind="settings" />
        <div style={{ width: 24, height: 24, borderRadius: 999, border: '1px solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--hand)', fontSize: 11 }}>K</div>
      </div>

      {/* center stack — outline + form */}
      <div className="wf-col wf-grow" style={{ overflow: 'hidden', position: 'relative' }}>
        {/* slim header */}
        <div className="wf-row" style={{ padding: '12px 28px', borderBottom: '1px dashed var(--rule)', gap: 14 }}>
          <div className="wf-row wf-gap-2">
            <span className="wf-cap">My SOWs</span>
            <span className="wf-cap" style={{ color: 'var(--ink-faint)' }}>/</span>
            <span style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>Velir · FY26 Block 3</span>
            <span className="wf-chip wf-chip-accent">SOW</span>
            <span className="wf-chip">draft</span>
          </div>
          <div className="wf-grow" />
          <div className="wf-row wf-gap-2 wf-cap"><SketchIcon size={12} kind="clock" />~ 3 min left</div>
          <div className="wf-btn" style={{ height: 26, fontSize: 12 }}>Save</div>
          <div className="wf-btn wf-primary" style={{ height: 26, fontSize: 12 }}>Generate</div>
        </div>

        <div className="wf-row" style={{ flex: 1, minHeight: 0 }}>
          {/* outline rail */}
          <div className="wf-col" style={{ width: 200, padding: '20px 14px', borderRight: '1px dashed var(--rule)', gap: 4 }}>
            <div className="wf-cap" style={{ padding: '0 8px 6px' }}>Outline</div>
            {[
              { l: 'Customer', a: false, done: true },
              { l: 'Project & dates', a: false, done: true },
              { l: 'Resources', a: true,  done: false },
              { l: 'Periods & holidays', a: false, done: false },
              { l: 'Review & preview', a: false, done: false },
            ].map((s, i) => (
              <div key={i} className={'wf-nav-item ' + (s.a ? 'active' : '')} style={{ fontSize: 14 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 999,
                  border: 'var(--bw) solid ' + (s.done ? 'var(--accent)' : s.a ? 'var(--accent)' : 'var(--rule)'),
                  background: s.done ? 'var(--accent)' : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: 'white', fontFamily: 'var(--mono)', fontSize: 9
                }}>{s.done ? '✓' : i + 1}</span>
                {s.l}
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--rule)', margin: '14px 4px' }} />
            <div className="wf-cap" style={{ padding: '0 8px' }}>Shortcuts</div>
            <div className="wf-nav-item" style={{ fontSize: 13, color: 'var(--ink-soft)' }}><span className="wf-cap" style={{ background:'var(--fill-2)', padding:'2px 6px', borderRadius:4 }}>⌘ K</span>command</div>
            <div className="wf-nav-item" style={{ fontSize: 13, color: 'var(--ink-soft)' }}><span className="wf-cap" style={{ background:'var(--fill-2)', padding:'2px 6px', borderRadius:4 }}>⌘ ↩</span>generate</div>
          </div>

          {/* form — single column, generous */}
          <div className="wf-col wf-grow" style={{ padding: '24px 36px', overflow: 'auto', gap: 18, maxWidth: 720 }}>
            <div className="wf-col wf-gap-1">
              <div className="wf-cap">section 3 of 5</div>
              <div className="wf-h1" style={{ fontSize: 28 }}>Resources</div>
              <div className="wf-p">Add each named resource on the engagement. Hours are calculated from period × hrs/day, minus holidays.</div>
            </div>

            {RESOURCES.map((r, i) => (
              <Box key={i} style={{ padding: 'var(--pad)' }}>
                <div className="wf-row wf-gap-2" style={{ marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--ink-soft)' }}>
                    <SketchIcon size={14} kind="user" />
                  </div>
                  <div className="wf-col" style={{ gap: 1 }}>
                    <span style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>{r.role}</span>
                    <span className="wf-cap">{r.name} · {r.rate}</span>
                  </div>
                  <div className="wf-grow" />
                  <SketchIcon size={14} kind="edit" />
                </div>
                <div className="wf-row wf-gap-2">
                  <div className="wf-field"><div className="wf-cap">Start</div><div className="wf-field-input">2026-03-09</div></div>
                  <div className="wf-field"><div className="wf-cap">End</div><div className="wf-field-input">2026-06-28</div></div>
                  <div className="wf-field" style={{ maxWidth: 88 }}><div className="wf-cap">Hrs/day</div><div className="wf-field-input">{i === 2 ? '3' : '8'}</div></div>
                </div>
              </Box>
            ))}

            <div className="wf-row wf-gap-2">
              <div className="wf-btn" style={{ width: '100%', height: 38, borderStyle: 'dashed', color: 'var(--ink-soft)' }}>+ add resource</div>
            </div>

            <div className="wf-row wf-gap-2" style={{ paddingTop: 12, borderTop: '1px dashed var(--rule)' }}>
              <div className="wf-btn">← Project & dates</div>
              <div className="wf-grow" />
              <div className="wf-btn wf-primary">Periods & holidays →</div>
            </div>
          </div>
        </div>

        {/* floating preview pill (bottom-right) */}
        <Box style={{
          position: 'absolute', right: 22, bottom: 22,
          width: 280, padding: 12, background: 'var(--paper)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18), 1.5px 1.5px 0 var(--line)',
        }}>
          <div className="wf-row" style={{ marginBottom: 6 }}>
            <div className="wf-row wf-gap-1 wf-cap" style={{ color: 'var(--accent)' }}><SketchIcon size={12} kind="eye" />Preview</div>
            <div className="wf-grow" />
            <span className="wf-cap">expand ↗</span>
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-soft)', lineHeight: 1.6,
            background: 'var(--fill)', borderRadius: 4, padding: 8, minHeight: 90
          }}>
            <div>SOW · Velir · FY26 Block 3</div>
            <div>$147,000 · 920 h · 79 days</div>
            <div style={{ marginTop: 6, color: 'var(--accent)' }}>3 resources · 2 holidays</div>
            <div>{'═'.repeat(36)}</div>
            <div>{'═'.repeat(32)}</div>
          </div>
        </Box>
      </div>
    </div>
  );
}

Object.assign(window, { SowA, SowB, SowC });

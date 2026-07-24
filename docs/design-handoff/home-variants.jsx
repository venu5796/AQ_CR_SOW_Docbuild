// home-variants.jsx — three directions for the Home page
// Uses primitives from wf-primitives.jsx (already on window).

const RECENT_DOCS = [
  { type: 'SOW', name: 'SOW · Velir · FY26 Eng Block 3', when: '2h ago' },
  { type: 'CR',  name: 'CR · Velir · Block 3 extension',  when: '4h ago' },
  { type: 'SOW', name: 'SOW · Tag1 Consulting · Q2',      when: 'yesterday' },
  { type: 'CR',  name: 'CR · Mediacurrent · April',       when: '2d ago' },
];

const FEATURES = [
  { id: 'sow',          icon: 'doc',   badge: 'SOW',   title: 'New Statement of Work', desc: 'Fill the form, watch the live preview, generate a DOCX.', time: '~3 min' },
  { id: 'cr',           icon: 'edit',  badge: 'CR',    title: 'New Change Request',    desc: 'Draft a CR from scratch with delta highlights.',          time: '~2 min' },
  { id: 'cr-from-sow',  icon: 'flow',  badge: 'Smart', title: 'CR from SOW',           desc: 'Upload an SOW · auto-extract resources · tweak · ship.', time: '~90 sec' },
  { id: 'cr-from-cr',   icon: 'chain', badge: 'Chain', title: 'CR from CR',            desc: 'Extend an existing Change Request with the next block.', time: '~90 sec' },
];

const TEMPLATES = [
  { name: 'Velir · Block extension',  type: 'CR · template' },
  { name: 'Tag1 · Quarter renewal',   type: 'SOW · template' },
  { name: 'Mediacurrent · Standard',  type: 'SOW · template' },
];

/* ────────────────────────────────────────────────────────────────────── */
/* A · GRID CLASSIC — 2x2 hero grid, recent docs strip                   */
/* ────────────────────────────────────────────────────────────────────── */
function HomeA() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <TopBar
        right={
          <div className="wf-row wf-gap-3">
            <div className="wf-row wf-gap-1 wf-cap" style={{ color: 'var(--ink-faint)' }}><SketchIcon size={14} kind="search" />Search</div>
            <div className="wf-chip">help</div>
            <div style={{ width: 28, height: 28, borderRadius: 999, border: 'var(--bw) solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--hand)', fontSize:14 }}>K</div>
          </div>
        }
      />

      <div className="wf-col wf-gap-5" style={{ padding: '28px 36px', overflow: 'auto', flex: 1 }}>
        {/* greeting */}
        <div className="wf-col wf-gap-1">
          <div className="wf-cap">Welcome back · Kanagaraj</div>
          <div className="wf-row wf-gap-3" style={{ alignItems: 'baseline' }}>
            <div className="wf-h1">What are we building today?</div>
            <Uline width={180} />
          </div>
          <div className="wf-p" style={{ marginTop: 4 }}>Pick a starting point. Each tile is one of the four generators — your live preview is always one click away.</div>
        </div>

        {/* 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
          {FEATURES.map(f => (
            <Box key={f.id} style={{ padding: 'var(--pad)', minHeight: 168 }}>
              <div className="wf-row wf-gap-3" style={{ alignItems: 'flex-start' }}>
                <Box style={{ width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', color: 'var(--accent)' }}>
                  <SketchIcon size={22} kind={f.icon} />
                </Box>
                <div className="wf-col wf-gap-1 wf-grow">
                  <div className="wf-row wf-gap-2"><span className="wf-chip wf-chip-accent">{f.badge}</span><span className="wf-cap">{f.time}</span></div>
                  <div className="wf-h2" style={{ marginTop: 4 }}>{f.title}</div>
                  <div className="wf-p">{f.desc}</div>
                </div>
              </div>
              <div className="wf-row wf-gap-2" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--rule)' }}>
                <div className="wf-cap" style={{ flex: 1 }}>How does it work? ⌄</div>
                <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 13 }}>Start →</div>
              </div>
            </Box>
          ))}
        </div>

        {/* recent docs */}
        <Box style={{ padding: '14px 18px 6px' }}>
          <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 6 }}>
            <div className="wf-h3 wf-grow">Recent documents</div>
            <div className="wf-cap">view all →</div>
          </div>
          {RECENT_DOCS.map((d, i) => (
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
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* B · STACKED EDITORIAL — wide rows per the user's hand-drawn sketch    */
/*    Each feature: [attractive image] [create card] [→ how it works]    */
/* ────────────────────────────────────────────────────────────────────── */
function HomeB() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <TopBar
        right={
          <div className="wf-row wf-gap-3">
            <div className="wf-cap">templates</div>
            <div className="wf-cap">recent</div>
            <div className="wf-cap">help</div>
            <div style={{ width: 28, height: 28, borderRadius: 999, border: 'var(--bw) solid var(--rule)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--hand)', fontSize:14 }}>K</div>
          </div>
        }
      />

      <div className="wf-col wf-gap-4" style={{ padding: '24px 40px 40px', overflow: 'auto', flex: 1 }}>
        {/* page heading */}
        <div className="wf-row" style={{ alignItems: 'flex-end', gap: 24 }}>
          <div className="wf-col wf-gap-1 wf-grow">
            <div className="wf-cap">Docbuilder · home</div>
            <div className="wf-h1">Four ways to ship paperwork.</div>
            <div className="wf-p" style={{ marginTop: 4 }}>One generator per row — start blank, or upload an existing doc and let it pre-fill.</div>
          </div>
          <div className="wf-row wf-gap-2 wf-cap">
            <SketchIcon size={14} kind="bolt" />avg. 2m 14s
          </div>
        </div>

        {/* feature rows */}
        {FEATURES.map((f, i) => (
          <div key={f.id} className="wf-col wf-gap-2">
            <Box style={{ padding: 'var(--pad)', display: 'grid', gridTemplateColumns: '240px 1fr 220px', gap: 22, alignItems: 'stretch' }}>
              {/* attractive image */}
              <ImgPh label={`hero · ${f.id}`} style={{ minHeight: 130 }} />

              {/* create card (the action) */}
              <div className="wf-col wf-gap-2" style={{ padding: '4px 4px' }}>
                <div className="wf-row wf-gap-2">
                  <span className="wf-chip wf-chip-accent">{f.badge}</span>
                  <span className="wf-cap">{f.time}</span>
                  <span className="wf-cap" style={{ marginLeft: 'auto' }}>step {i + 1} of 4</span>
                </div>
                <div className="wf-h2" style={{ marginTop: 2 }}>{f.title}</div>
                <div className="wf-p">{f.desc}</div>
                <div className="wf-row wf-gap-2" style={{ marginTop: 'auto' }}>
                  <div className="wf-btn wf-primary">Start {f.badge} →</div>
                  <div className="wf-btn">Use template</div>
                </div>
              </div>

              {/* how does it work — expandable */}
              <div className="wf-col wf-gap-2" style={{ borderLeft: '1px dashed var(--rule)', paddingLeft: 18 }}>
                <div className="wf-row wf-gap-1 wf-cap" style={{ color: 'var(--accent)' }}><SketchIcon size={12} kind="eye" />How it works ⌃</div>
                <div className="wf-col wf-gap-2" style={{ marginTop: 4 }}>
                  {['Pick a customer + dates', 'Add resources & periods', 'Preview · download · upload to Drive'].map((step, j) => (
                    <div key={j} className="wf-row wf-gap-2" style={{ fontFamily: 'var(--hand)', fontSize: 13 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 999, border: 'var(--bw) solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 11 }}>{j + 1}</span>
                      <span style={{ color: 'var(--ink-soft)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Box>

            {i < FEATURES.length - 1 ? (
              <div className="wf-row" style={{ justifyContent: 'center' }}>
                <DownArrow height={18} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* C · HERO + QUICK-LAUNCH — one big primary CTA, secondary rail        */
/*    Adds Templates & Recent panels                                     */
/* ────────────────────────────────────────────────────────────────────── */
function HomeC() {
  const primary = FEATURES[0];
  const others = FEATURES.slice(1);
  return (
    <div className="wf-row" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* slim left rail */}
      <div className="wf-col" style={{ width: 200, borderRight: 'var(--bw) solid var(--rule)', padding: '14px 12px', background: 'var(--fill)' }}>
        <div className="wf-row wf-gap-2" style={{ padding: '4px 8px 16px' }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--accent)', color: 'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 12 }}>D</div>
          <span style={{ fontFamily: 'var(--hand)', fontSize: 17 }}>Docbuilder</span>
        </div>
        <div className="wf-col wf-gap-1">
          <div className="wf-cap" style={{ padding: '6px 10px' }}>Workspace</div>
          {[
            { k: 'grid', l: 'Home', a: true },
            { k: 'doc', l: 'My SOWs' },
            { k: 'edit', l: 'My CRs' },
            { k: 'clock', l: 'Drafts · 3' },
            { k: 'flow', l: 'Templates' },
          ].map(n => (
            <div key={n.l} className={'wf-nav-item ' + (n.a ? 'active' : '')}>
              <SketchIcon size={14} kind={n.k} />{n.l}
            </div>
          ))}
        </div>
        <div className="wf-grow" />
        <div className="wf-col wf-gap-1">
          <div className="wf-nav-item"><SketchIcon size={14} kind="settings" />Settings</div>
          <div className="wf-nav-item"><SketchIcon size={14} kind="user" />Kanagaraj</div>
        </div>
      </div>

      {/* main */}
      <div className="wf-col wf-grow" style={{ overflow: 'auto' }}>
        {/* hero — big primary CTA */}
        <div style={{ padding: '28px 36px 14px', borderBottom: '1px dashed var(--rule)' }}>
          <div className="wf-row" style={{ alignItems: 'flex-end', gap: 18 }}>
            <div className="wf-col wf-gap-2 wf-grow">
              <div className="wf-cap">Most-used · jump in</div>
              <div className="wf-h1">Create a new <span style={{ color: 'var(--accent)' }}>Statement of Work</span>.</div>
              <div className="wf-p" style={{ maxWidth: 480 }}>Fill out the standard SOW form on the left, watch the document render on the right, then export to DOCX or push to Drive.</div>
              <div className="wf-row wf-gap-2" style={{ marginTop: 8 }}>
                <div className="wf-btn wf-primary">Start new SOW →</div>
                <div className="wf-btn">Continue draft · Velir FY26</div>
              </div>
            </div>
            <ImgPh label="hero illustration" style={{ width: 220, height: 130, flex: '0 0 auto' }} />
          </div>
        </div>

        {/* quick-launch row */}
        <div style={{ padding: '20px 36px 8px' }}>
          <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 10 }}>
            <div className="wf-h3 wf-grow">Or pick another flow</div>
            <div className="wf-cap">3 more generators</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {others.map(f => (
              <Box key={f.id} style={{ padding: 14 }}>
                <div className="wf-row wf-gap-2" style={{ marginBottom: 6 }}>
                  <Box style={{ width: 32, height: 32, display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--accent)' }}>
                    <SketchIcon size={16} kind={f.icon} />
                  </Box>
                  <span className="wf-chip wf-chip-accent" style={{ marginLeft: 'auto' }}>{f.badge}</span>
                </div>
                <div className="wf-h3">{f.title}</div>
                <div className="wf-p" style={{ marginTop: 4 }}>{f.desc}</div>
                <div className="wf-row wf-gap-2" style={{ marginTop: 10 }}>
                  <span className="wf-cap">{f.time}</span>
                  <span className="wf-cap" style={{ marginLeft: 'auto', color: 'var(--accent)' }}>start →</span>
                </div>
              </Box>
            ))}
          </div>
        </div>

        {/* templates + recent grid */}
        <div style={{ padding: '20px 36px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Box style={{ padding: 16 }}>
            <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 8 }}>
              <div className="wf-h3 wf-grow">Templates</div>
              <div className="wf-cap">manage</div>
            </div>
            {TEMPLATES.map((t, i) => (
              <div key={i} className="wf-doc-row" style={{ padding: '8px 0' }}>
                <div style={{ width: 36, height: 28, borderRadius: 4, background: 'var(--fill-2)', display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--ink-faint)' }}>
                  <SketchIcon size={14} kind="doc" />
                </div>
                <div className="wf-col wf-grow" style={{ gap: 1 }}>
                  <span style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{t.name}</span>
                  <span className="wf-cap">{t.type}</span>
                </div>
                <SketchIcon size={14} kind="plus" />
              </div>
            ))}
          </Box>

          <Box style={{ padding: 16 }}>
            <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 8 }}>
              <div className="wf-h3 wf-grow">Recent</div>
              <div className="wf-cap">view all</div>
            </div>
            {RECENT_DOCS.map((d, i) => (
              <div key={i} className="wf-doc-row" style={{ padding: '8px 0' }}>
                <span className={'wf-chip ' + (d.type === 'SOW' ? 'wf-chip-accent' : 'wf-chip-solid')} style={{ minWidth: 36, justifyContent: 'center' }}>{d.type}</span>
                <span className="wf-grow" style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{d.name}</span>
                <span className="wf-cap">{d.when}</span>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeA, HomeB, HomeC });

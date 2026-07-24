// home-c-hiw.jsx — Home C with each "How it works?" pattern integrated
// One component, switched via `pattern` prop. Renders the same Home C scaffold
// (left rail · hero · secondary tiles · templates+recent), with HIW affordances
// woven in.

const HC_FEATURES = [
  { id: 'cr',           icon: 'edit',  badge: 'CR',    title: 'New Change Request',    desc: 'Draft a CR from scratch with delta highlights.',          time: '~2 min' },
  { id: 'cr-from-sow',  icon: 'flow',  badge: 'Smart', title: 'CR from SOW',           desc: 'Upload an SOW · auto-extract resources · tweak · ship.', time: '~90 sec' },
  { id: 'cr-from-cr',   icon: 'chain', badge: 'Chain', title: 'CR from CR',            desc: 'Extend an existing CR with the next block.',              time: '~90 sec' },
];

const HC_TEMPLATES = [
  { name: 'Velir · Block extension',  type: 'CR · template' },
  { name: 'Tag1 · Quarter renewal',   type: 'SOW · template' },
];

const HC_RECENT = [
  { type: 'SOW', name: 'SOW · Velir · FY26 Eng Block 3', when: '2h ago' },
  { type: 'CR',  name: 'CR · Velir · Block 3 extension',  when: '4h ago' },
  { type: 'SOW', name: 'SOW · Tag1 · Q2',                 when: 'yesterday' },
];

const SOW_STEPS = [
  { title: 'Customer & dates',  icon: 'user',     blurb: 'Pick a customer; dates default to today.' },
  { title: 'Resources & rates', icon: 'flow',     blurb: 'Drop in roles · rates · hours per day.' },
  { title: 'Live preview',      icon: 'eye',      blurb: 'A DOCX-shaped preview redraws as you type.' },
  { title: 'Generate & upload', icon: 'download', blurb: 'Download DOCX or push to Drive.' },
];

// pattern: 'accordion' | 'drawer' | 'stepper' | 'flip'
function HomeCWithHiw({ pattern }) {
  // which tile is "open"/"flipped"/"drawer-target"
  const focused = HC_FEATURES[0]; // CR (always demo on the second card)

  // ─── reusable bits ────────────────────────────────────────────────
  const sidebar = (
    <div className="wf-col" style={{ width: 200, borderRight: 'var(--bw) solid var(--rule)', padding: '14px 12px', background: 'var(--fill)', flex: '0 0 auto' }}>
      <div className="wf-row wf-gap-2" style={{ padding: '4px 8px 16px' }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: 'var(--accent)', color: 'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 12 }}>D</div>
        <span style={{ fontFamily: 'var(--hand)', fontSize: 17 }}>Docbuilder</span>
      </div>
      <div className="wf-col wf-gap-1">
        <div className="wf-cap" style={{ padding: '6px 10px' }}>Workspace</div>
        {[
          { k: 'grid', l: 'Home', a: true },
          { k: 'doc',  l: 'My SOWs' },
          { k: 'edit', l: 'My CRs' },
          { k: 'flow', l: 'Templates' },
          { k: 'clock', l: 'Drafts · 3' },
        ].map(n => (
          <div key={n.l} className={'wf-nav-item ' + (n.a ? 'active' : '')}>
            <SketchIcon size={14} kind={n.k} />{n.l}
          </div>
        ))}
      </div>
      <div className="wf-grow" />
      <div className="wf-nav-item"><SketchIcon size={14} kind="settings" />Settings</div>
      <div className="wf-nav-item"><SketchIcon size={14} kind="user" />Profile · K</div>
    </div>
  );

  const heroBlock = (
    <div style={{ padding: '28px 36px 14px', borderBottom: '1px dashed var(--rule)' }}>
      <div className="wf-row" style={{ alignItems: 'flex-end', gap: 18 }}>
        <div className="wf-col wf-gap-2 wf-grow">
          <div className="wf-cap">Most-used · jump in</div>
          <div className="wf-h1">Create a new <span style={{ color: 'var(--accent)' }}>Statement of Work</span>.</div>
          <div className="wf-p" style={{ maxWidth: 480 }}>Fill out the standard form, watch the live preview, then export to DOCX or push to Drive.</div>
          <div className="wf-row wf-gap-2" style={{ marginTop: 8 }}>
            <div className="wf-btn wf-primary">Start new SOW →</div>
            <div className="wf-btn">Continue draft · Velir FY26</div>
            {/* HIW affordance on the hero */}
            {pattern === 'drawer'    ? <div className="wf-btn">How it works? →</div> : null}
            {pattern === 'accordion' ? <div className="wf-btn">How it works? ⌄</div> : null}
            {pattern === 'flip'      ? <div className="wf-btn">How it works? ↻</div> : null}
          </div>
        </div>
        <ImgPh label="hero illustration" style={{ width: 220, height: 130, flex: '0 0 auto' }} />
      </div>
    </div>
  );

  // Stepper pattern: a dedicated band right under the hero
  const stepperBand = (
    <Box style={{ margin: '18px 36px 0', padding: '16px 18px', background: 'var(--fill)' }}>
      <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 10 }}>
        <div className="wf-row wf-gap-2 wf-grow" style={{ alignItems: 'baseline' }}>
          <span className="wf-cap" style={{ color: 'var(--accent)' }}>how Create SOW works</span>
          <span style={{ fontFamily: 'var(--hand)', fontSize: 15 }}>4 steps · ~3 min total</span>
        </div>
        <div className="wf-cap">switch flow → CR · CR-from-SOW · CR-from-CR</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: '12.5%', right: '12.5%', top: 22,
          borderTop: '1.4px dashed var(--accent)', opacity: 0.5,
        }} />
        {SOW_STEPS.map((s, i) => (
          <div key={i} className="wf-col wf-gap-1" style={{ alignItems: 'center', padding: '0 8px', position: 'relative' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 999,
              border: 'var(--bw) solid var(--accent)',
              background: 'var(--paper)', color: 'var(--accent)',
              display:'flex', alignItems:'center', justifyContent:'center',
              position: 'relative', zIndex: 1,
            }}>
              <SketchIcon size={18} kind={s.icon} />
            </div>
            <div className="wf-cap" style={{ color: 'var(--accent)' }}>step {i + 1}</div>
            <div style={{ fontFamily: 'var(--hand)', fontSize: 14, textAlign: 'center' }}>{s.title}</div>
            <div className="wf-p" style={{ fontSize: 12, textAlign: 'center' }}>{s.blurb}</div>
          </div>
        ))}
      </div>
    </Box>
  );

  // a single secondary tile renderer — varies by pattern
  function secondaryTile(f, idx) {
    const isFocused = pattern === 'flip' && f.id === focused.id;
    const isOpenAccordion = pattern === 'accordion' && f.id === focused.id;

    if (isFocused) {
      // FLIP — show back side
      return (
        <Box key={f.id} style={{ padding: 14, background: 'var(--fill)' }}>
          <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 8 }}>
            <span className="wf-chip wf-chip-accent">{f.badge}</span>
            <div className="wf-grow" />
            <span className="wf-cap" style={{ color: 'var(--accent)' }}>↺ back</span>
          </div>
          <div className="wf-col wf-gap-2">
            {SOW_STEPS.slice(0, 4).map((s, i) => (
              <div key={i} className="wf-row wf-gap-2">
                <div style={{
                  width: 18, height: 18, borderRadius: 999,
                  border: 'var(--bw) solid var(--accent)', color: 'var(--accent)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily: 'var(--mono)', fontSize: 9, flex: '0 0 auto',
                  background: 'var(--paper)',
                }}>{i + 1}</div>
                <span style={{ fontFamily: 'var(--hand)', fontSize: 13 }}>{s.title}</span>
              </div>
            ))}
          </div>
          <div className="wf-row wf-gap-2" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--rule)' }}>
            <span className="wf-cap wf-grow">~ 2 min</span>
            <span className="wf-cap" style={{ color: 'var(--accent)' }}>start →</span>
          </div>
        </Box>
      );
    }

    return (
      <Box key={f.id} style={{
        padding: 14,
        outline: (pattern === 'drawer' && f.id === focused.id) ? '1.6px solid var(--accent)' : 'none',
        outlineOffset: 2,
      }}>
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
          <span className="wf-grow" />
          {/* per-pattern HIW affordance */}
          {pattern === 'accordion' ? <span className="wf-cap" style={{ color: 'var(--accent)' }}>{isOpenAccordion ? 'how ⌃' : 'how ⌄'}</span> : null}
          {pattern === 'drawer'    ? <span className="wf-cap" style={{ color: 'var(--accent)' }}>how →</span> : null}
          {pattern === 'flip'      ? <span className="wf-cap" style={{ color: 'var(--accent)' }}>how ↻</span> : null}
          {pattern === 'stepper'   ? <span className="wf-cap" style={{ color: 'var(--accent)' }}>start →</span> : null}
        </div>

        {/* accordion expanded body */}
        {isOpenAccordion ? (
          <div className="wf-col wf-gap-2" style={{
            marginTop: 12, paddingTop: 12,
            borderTop: '1px dashed var(--rule)',
            background: 'transparent',
          }}>
            {SOW_STEPS.slice(0, 4).map((s, i) => (
              <div key={i} className="wf-row wf-gap-2">
                <div style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: 'var(--bw) solid var(--accent)', color: 'var(--accent)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily: 'var(--mono)', fontSize: 10, flex: '0 0 auto',
                  background: 'var(--paper)',
                }}>{i + 1}</div>
                <div className="wf-col" style={{ gap: 1 }}>
                  <span style={{ fontFamily: 'var(--hand)', fontSize: 13 }}>{s.title}</span>
                  <span className="wf-p" style={{ fontSize: 11.5 }}>{s.blurb}</span>
                </div>
              </div>
            ))}
            <div className="wf-btn wf-primary" style={{ marginTop: 6, height: 28, fontSize: 12, width: '100%' }}>Start {f.badge} →</div>
          </div>
        ) : null}
      </Box>
    );
  }

  const secondaryGrid = (
    <div style={{ padding: '20px 36px 8px' }}>
      <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 10 }}>
        <div className="wf-h3 wf-grow">Or pick another flow</div>
        <div className="wf-cap">3 more generators</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'start' }}>
        {HC_FEATURES.map((f, i) => secondaryTile(f, i))}
      </div>
    </div>
  );

  const bottomGrid = (
    <div style={{ padding: '20px 36px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
      <Box style={{ padding: 16 }}>
        <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 8 }}>
          <div className="wf-h3 wf-grow">Templates</div>
          <div className="wf-cap">manage</div>
        </div>
        {HC_TEMPLATES.map((t, i) => (
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
        {HC_RECENT.map((d, i) => (
          <div key={i} className="wf-doc-row" style={{ padding: '8px 0' }}>
            <span className={'wf-chip ' + (d.type === 'SOW' ? 'wf-chip-accent' : 'wf-chip-solid')} style={{ minWidth: 36, justifyContent: 'center' }}>{d.type}</span>
            <span className="wf-grow" style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{d.name}</span>
            <span className="wf-cap">{d.when}</span>
          </div>
        ))}
      </Box>
    </div>
  );

  // ─── drawer overlay (pattern === 'drawer') ────────────────────────
  const drawerOverlay = (
    <Box style={{
      position: 'absolute', right: 18, top: 18, bottom: 18,
      width: 380, padding: 0, display: 'flex', flexDirection: 'column',
      boxShadow: '0 18px 60px rgba(0,0,0,0.22), 2px 2px 0 var(--line)',
      background: 'var(--paper)', zIndex: 5,
    }}>
      <div className="wf-row" style={{ padding: '14px 16px', borderBottom: '1px dashed var(--rule)' }}>
        <div className="wf-row wf-gap-2">
          <span className="wf-chip wf-chip-accent">SOW</span>
          <span style={{ fontFamily: 'var(--hand)', fontSize: 16 }}>Create SOW</span>
        </div>
        <div className="wf-grow" />
        <span className="wf-cap">esc</span>
        <span style={{ fontFamily: 'var(--hand)', fontSize: 18, color: 'var(--ink-soft)', marginLeft: 6 }}>×</span>
      </div>
      <div className="wf-col wf-gap-3" style={{ padding: 16, overflow: 'auto', flex: 1 }}>
        <ImgPh label="walkthrough loop" style={{ height: 110 }} />
        <div className="wf-cap">How it works · 4 steps</div>
        {SOW_STEPS.map((s, i) => (
          <div key={i} style={{ paddingBottom: 10, borderBottom: '1px dashed var(--rule)' }}>
            <div className="wf-row wf-gap-2">
              <div style={{ width: 22, height: 22, borderRadius: 999, border: 'var(--bw) solid var(--accent)', color: 'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily: 'var(--mono)', fontSize: 10 }}>{i+1}</div>
              <span style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>{s.title}</span>
            </div>
            <div className="wf-p" style={{ fontSize: 12, marginTop: 4 }}>{s.blurb}</div>
          </div>
        ))}
      </div>
      <div className="wf-row wf-gap-2" style={{ padding: 14, borderTop: '1px dashed var(--rule)' }}>
        <div className="wf-btn wf-grow">Watch demo</div>
        <div className="wf-btn wf-primary wf-grow">Start SOW →</div>
      </div>
    </Box>
  );

  return (
    <div className="wf-row" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {sidebar}
      <div className="wf-col wf-grow" style={{ overflow: 'auto', opacity: pattern === 'drawer' ? 0.6 : 1, transition: 'opacity .15s' }}>
        {heroBlock}
        {pattern === 'stepper' ? stepperBand : null}
        {secondaryGrid}
        {bottomGrid}
      </div>
      {pattern === 'drawer' ? drawerOverlay : null}
    </div>
  );
}

function HomeC_Accordion() { return <HomeCWithHiw pattern="accordion" />; }
function HomeC_Drawer()    { return <HomeCWithHiw pattern="drawer"    />; }
function HomeC_Stepper()   { return <HomeCWithHiw pattern="stepper"   />; }
function HomeC_Flip()      { return <HomeCWithHiw pattern="flip"      />; }

Object.assign(window, { HomeC_Accordion, HomeC_Drawer, HomeC_Stepper, HomeC_Flip });

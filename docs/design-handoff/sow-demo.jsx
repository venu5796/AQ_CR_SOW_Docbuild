// sow-demo.jsx — Create SOW workspace in Demo / sample-data mode
// Wraps the existing SowA workspace with a persistent demo banner so the user
// can see exactly what sample mode looks like in context.

function DemoBanner() {
  return (
    <div className="wf-row wf-gap-3" style={{
      padding: '10px 22px',
      background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
      borderBottom: 'var(--bw) solid color-mix(in srgb, var(--accent) 40%, transparent)',
      color: 'var(--accent)',
      flex: '0 0 auto',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 999,
        background: 'var(--accent)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: '0 0 auto',
      }}>
        <SketchIcon size={14} kind="bolt" />
      </div>
      <div className="wf-col" style={{ gap: 1 }}>
        <span style={{ fontFamily: 'var(--hand)', fontSize: 14 }}>You're in <b>sample mode</b> · Velir · FY26 Eng Block 3</span>
        <span className="wf-cap" style={{ color: 'var(--accent)', opacity: 0.85 }}>fields are editable · nothing is saved · Generate is disabled here</span>
      </div>
      <div className="wf-grow" />
      <div className="wf-btn" style={{ height: 28, fontSize: 12, borderColor: 'var(--accent)', color: 'var(--accent)' }}>Exit demo</div>
      <div className="wf-btn wf-primary" style={{ height: 28, fontSize: 12 }}>
        Looks good? Start a real SOW →
      </div>
    </div>
  );
}

function SowDemo() {
  return (
    <div className="wf-col" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <DemoBanner />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <SowA />
      </div>
    </div>
  );
}

Object.assign(window, { SowDemo });

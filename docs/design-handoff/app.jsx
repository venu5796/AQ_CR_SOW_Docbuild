// app.jsx — wires the DesignCanvas + Tweaks for the Docbuilder wireframes
// Loaded last; relies on everything else being on window.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "style": "sketch",
  "dark": false,
  "accent": "#2563eb",
  "fontPair": "space",
  "density": "comfy"
}/*EDITMODE-END*/;

const FONT_PAIRS = {
  /* ── sketchy / handwritten ─────────────────────────────────────────── */
  caveat:     { hand: "'Caveat', cursive",              sans: "'Inter', system-ui, sans-serif",            label: "✎ Caveat · Inter" },
  patrick:    { hand: "'Patrick Hand', cursive",        sans: "'Inter', system-ui, sans-serif",            label: "✎ Patrick · Inter" },
  kalam:      { hand: "'Kalam', cursive",               sans: "'Manrope', system-ui, sans-serif",          label: "✎ Kalam · Manrope" },
  architects: { hand: "'Architects Daughter', cursive", sans: "'Inter', system-ui, sans-serif",            label: "✎ Architects · Inter" },
  shadows:    { hand: "'Shadows Into Light', cursive",  sans: "'Inter', system-ui, sans-serif",            label: "✎ Shadows · Inter" },
  indie:      { hand: "'Indie Flower', cursive",        sans: "'Inter', system-ui, sans-serif",            label: "✎ Indie · Inter" },

  /* ── polished sans (looks shipped) ─────────────────────────────────── */
  inter:      { hand: "'Inter', system-ui, sans-serif",            sans: "'Inter', system-ui, sans-serif",            label: "▣ Inter" },
  geist:      { hand: "'Geist', system-ui, sans-serif",            sans: "'Geist', system-ui, sans-serif",            label: "▣ Geist" },
  jakarta:    { hand: "'Plus Jakarta Sans', system-ui, sans-serif", sans: "'Plus Jakarta Sans', system-ui, sans-serif", label: "▣ Jakarta" },
  space:      { hand: "'Space Grotesk', system-ui, sans-serif",    sans: "'Space Grotesk', system-ui, sans-serif",    label: "▣ Space Grotesk" },
  manrope:    { hand: "'Manrope', system-ui, sans-serif",          sans: "'Manrope', system-ui, sans-serif",          label: "▣ Manrope" },
  dm:         { hand: "'DM Sans', system-ui, sans-serif",          sans: "'DM Sans', system-ui, sans-serif",          label: "▣ DM Sans" },
  outfit:     { hand: "'Outfit', system-ui, sans-serif",           sans: "'Outfit', system-ui, sans-serif",           label: "▣ Outfit" },
  plex:       { hand: "'IBM Plex Sans', system-ui, sans-serif",    sans: "'IBM Plex Sans', system-ui, sans-serif",    label: "▣ IBM Plex" },
};

const DENSITY = { compact: 0.84, regular: 1, comfy: 1.16 };

const ACCENT_OPTS = [
  '#2563eb',  // cobalt
  '#1d4ed8',  // royal
  '#0ea5e9',  // sky
  '#4f46e5',  // indigo
  '#0f172a',  // ink (mono accent)
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const pair = FONT_PAIRS[t.fontPair] || FONT_PAIRS.caveat;
  const density = DENSITY[t.density] || 1;

  // wrap each variant in WFRoot with current tweaks
  const wrap = (Component, extraStyle) => (
    <div style={{ width: '100%', height: '100%', ...extraStyle }}>
      <WFRoot
        style={t.style}
        dark={t.dark}
        accent={t.accent}
        hand={pair.hand}
        sans={pair.sans}
        density={density}
        densityKey={t.density}
      >
        <Component />
      </WFRoot>
    </div>
  );

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection
          id="final"
          title="Home · v1 (committed)"
          subtitle="Home C scaffold + Stepper band · sidebar nav and Templates deferred to a later release"
        >
          <DCArtboard id="home-v1" label="Home · v1" width={1320} height={1020}>
            {wrap(HomeFinal)}
          </DCArtboard>
          <DCArtboard id="sow-demo" label="SOW · Sample-data mode (from Home hero)" width={1280} height={900}>
            {wrap(SowDemo)}
          </DCArtboard>
        </DCSection>

        <DCSection
          id="hiw"
          title="How does it work? — patterns"
          subtitle="Same feature, 4 different ways to answer the question. Pick a winner before we commit on Home."
        >
          <DCArtboard id="hiw-accordion" label="1 · Inline accordion" width={720} height={780}>
            {wrap(HiwAccordion)}
          </DCArtboard>
          <DCArtboard id="hiw-drawer"    label="2 · Side drawer"      width={780} height={780}>
            {wrap(HiwDrawer)}
          </DCArtboard>
          <DCArtboard id="hiw-stepper"   label="3 · Stepper diagram"  width={860} height={780}>
            {wrap(HiwStepper)}
          </DCArtboard>
          <DCArtboard id="hiw-flip"      label="4 · Flip card"        width={860} height={620}>
            {wrap(HiwFlip)}
          </DCArtboard>
        </DCSection>

        <DCSection
          id="home"
          title="Home C · with each HIW pattern in context"
          subtitle="See how each pattern actually lives inside the page. Same Home C scaffold + the affordance woven in."
        >
          <DCArtboard id="home-c-base"      label="0 · Home C baseline (no HIW yet)" width={1280} height={820}>
            {wrap(HomeC)}
          </DCArtboard>
          <DCArtboard id="home-c-accordion" label="1 · Home C + Accordion"           width={1280} height={1080}>
            {wrap(HomeC_Accordion)}
          </DCArtboard>
          <DCArtboard id="home-c-drawer"    label="2 · Home C + Drawer"              width={1280} height={820}>
            {wrap(HomeC_Drawer)}
          </DCArtboard>
          <DCArtboard id="home-c-stepper"   label="3 · Home C + Stepper band"        width={1280} height={1020}>
            {wrap(HomeC_Stepper)}
          </DCArtboard>
          <DCArtboard id="home-c-flip"      label="4 · Home C + Flip card"           width={1280} height={820}>
            {wrap(HomeC_Flip)}
          </DCArtboard>
        </DCSection>

        <DCSection
          id="sow"
          title="Create SOW"
          subtitle="3 directions for the form workspace"
        >
          <DCArtboard id="sow-a" label="A · Split form / preview" width={1280} height={820}>
            {wrap(SowA)}
          </DCArtboard>
          <DCArtboard id="sow-b" label="B · Stepper + mini preview" width={1340} height={880}>
            {wrap(SowB)}
          </DCArtboard>
          <DCArtboard id="sow-c" label="C · Outline + floating preview" width={1280} height={820}>
            {wrap(SowC)}
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Aesthetic" />
        <TweakRadio
          label="Fidelity"
          value={t.style}
          options={['sketch', 'lofi', 'polished']}
          onChange={(v) => setTweak('style', v)}
        />
        <TweakSelect
          label="Font pair"
          value={t.fontPair}
          options={Object.keys(FONT_PAIRS).map(k => ({ value: k, label: FONT_PAIRS[k].label }))}
          onChange={(v) => setTweak('fontPair', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />

        <TweakSection label="Accent" />
        <TweakColor
          label="Color"
          value={t.accent}
          options={ACCENT_OPTS}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

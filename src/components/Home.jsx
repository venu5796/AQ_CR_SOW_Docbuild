import React from 'react';
import { getStoredAuth } from '../utils/auth.js';

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

/* ── Inline SVG icons ── */
const IconSOW = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconCR = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconUpload = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);
const IconChain = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const IconSliders = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);
const IconDownloadHiw = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const FLOWS = [
  { id: 'sow',        Icon: IconSOW,    label: 'SOW',   title: 'New Statement of Work',    desc: 'Fill the form, watch the live preview, generate a DOCX.',                  time: '~3 min',  colorClass: 'flow-accent' },
  { id: 'cr',         Icon: IconCR,     label: 'CR',    title: 'New Change Request',        desc: 'Draft a CR from scratch with resources and budget.',                       time: '~2 min',  colorClass: 'flow-teal'   },
  { id: 'cr-from-sow',Icon: IconUpload, label: 'Smart', title: 'CR from SOW',               desc: 'Upload an SOW · auto-extract resources · tweak · generate.',               time: '~90 sec', colorClass: 'flow-coral'  },
  { id: 'cr-from-cr', Icon: IconChain,  label: 'Chain', title: 'CR from existing CR',       desc: 'Extend an existing Change Request with the next period.',                   time: '~90 sec', colorClass: 'flow-amber'  },
];

const HOW_STEPS = [
  { num: '01', Icon: IconSOW,          label: 'Upload or Input',      blurb: 'Start from scratch or parse an existing document to begin your workflow.' },
  { num: '02', Icon: IconSliders,      label: 'Configure Resources',  blurb: 'Adjust timelines and team allocation to fit your project requirements.'    },
  { num: '03', Icon: IconDownloadHiw,  label: 'Generate',             blurb: 'Review your content and export as a professional DOCX or Google Doc.'       },
];

function DocumentMockup() {
  return (
    <div className="home-v2-mockup">
      <div className="home-v2-mockup-topbar">
        <div className="home-v2-mockup-dots">
          <span /><span /><span />
        </div>
        <span className="home-v2-mockup-filename">Nexus_Corp_SOW_v2.docx</span>
      </div>
      <div className="home-v2-mockup-body">
        <div className="home-v2-mockup-doc-title">Statement of Work</div>
        <div className="home-v2-mockup-rule" />

        <div className="home-v2-mockup-field">
          <span className="home-v2-mockup-field-lbl">Client</span>
          <span className="home-v2-mockup-field-val">Nexus Technologies Inc.</span>
        </div>
        <div className="home-v2-mockup-field">
          <span className="home-v2-mockup-field-lbl">Period</span>
          <span className="home-v2-mockup-field-val">Jan 2025 → Oct 2025</span>
        </div>

        <div className="home-v2-mockup-section">Resources</div>

        <div className="home-v2-mockup-resource">
          <div className="home-v2-mockup-res-row">
            <span>Senior Drupal Dev</span>
            <span>$48,000</span>
          </div>
          <div className="home-v2-mockup-track">
            <div className="home-v2-mockup-bar" style={{ width: '75%' }} />
          </div>
        </div>

        <div className="home-v2-mockup-resource">
          <div className="home-v2-mockup-res-row">
            <span>UI Designer</span>
            <span>$24,000</span>
          </div>
          <div className="home-v2-mockup-track">
            <div className="home-v2-mockup-bar bar-teal" style={{ width: '50%' }} />
          </div>
        </div>

        <div className="home-v2-mockup-total">
          <span>Total Budget</span>
          <strong>$72,000</strong>
        </div>

        <div className="home-v2-mockup-badge">
          <span className="home-v2-mockup-badge-dot" />
          Document ready to generate
        </div>
      </div>
    </div>
  );
}

export function Home({ onSelect, recentDocs = [] }) {
  const user = getStoredAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="home-v2">

      {/* Hero */}
      <section className="home-v2-hero">
        <div className="home-v2-hero-left">
          <h1 className="home-v2-greeting">{timeGreeting()}, {firstName}.</h1>
          <p className="home-v2-tagline">Generate SOWs and Change Requests in minutes.</p>
          <div className="home-v2-hero-pills">
            <span className="home-v2-pill"><span className="home-v2-pill-dot" />4 document flows</span>
            <span className="home-v2-pill"><span className="home-v2-pill-dot" />~2 min avg</span>
            <span className="home-v2-pill"><span className="home-v2-pill-dot" />DOCX + Google Docs</span>
          </div>
        </div>
        <div className="home-v2-hero-right">
          <DocumentMockup />
        </div>
      </section>

      {/* Flow cards */}
      <section className="home-v2-section">
        <p className="home-v2-section-label">Start a new document</p>
        <div className="home-v2-flow-grid">
          {FLOWS.map(f => (
            <div
              key={f.id}
              className={`home-v2-flow-card ${f.colorClass}`}
              onClick={() => onSelect(f.id)}
            >
              <div className="home-v2-flow-header">
                <span className="home-v2-flow-icon-wrap"><f.Icon /></span>
                <span className="home-v2-flow-time">{f.time}</span>
              </div>
              <div className="home-v2-flow-body">
                <div className="home-v2-flow-label">{f.label}</div>
                <div className="home-v2-flow-title">{f.title}</div>
                <div className="home-v2-flow-desc">{f.desc}</div>
              </div>
              <div className="home-v2-flow-footer">
                <span className="home-v2-flow-start">Start →</span>
                <button
                  className="home-v2-flow-sample"
                  onClick={e => { e.stopPropagation(); onSelect(f.id + '-sample'); }}
                >
                  Try sample
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent documents */}
      {recentDocs.length > 0 && (
        <section className="home-v2-section">
          <p className="home-v2-section-label">Recent Documents</p>
          <div className="home-v2-recent-table">
            <div className="home-v2-recent-thead">
              <span>Document Name</span>
              <span>Status</span>
              <span>Last Edited</span>
            </div>
            {recentDocs.map((doc, i) => (
              <div key={i} className="home-v2-recent-row">
                <span className="home-v2-recent-name">{doc.name}</span>
                <span>
                  <span className={`home-v2-chip ${doc.type === 'SOW' ? 'chip-sow' : 'chip-cr'}`}>
                    {doc.type}
                  </span>
                </span>
                <span className="home-v2-recent-date">{timeAgo(doc.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="home-v2-section home-v2-hiw-section">
        <p className="home-v2-hiw-heading">How it Works</p>
        <div className="home-v2-hiw-steps">
          {HOW_STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="home-v2-hiw-step">
                <div className="home-v2-hiw-step-num">{s.num}</div>
                <div className="home-v2-hiw-step-icon"><s.Icon /></div>
                <div className="home-v2-hiw-step-label">{s.label}</div>
                <div className="home-v2-hiw-step-blurb">{s.blurb}</div>
              </div>
              {i < HOW_STEPS.length - 1 && (
                <div className="home-v2-hiw-connector"><IconArrow /></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

    </div>
  );
}

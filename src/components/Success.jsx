import React from 'react';
import { SummaryCard } from './SummaryCard.jsx';

const IconCheck = () => (
  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconHome = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export function Success({ type, meta, onBack, onNew, onFollowOnCR, onFixIt }) {
  const isSow = type === 'sow';
  const summary = meta?.summary || [];
  const docName = meta?.name || (isSow ? 'Statement of Work' : 'Change Request');

  return (
    <div className="success-v2">

      {/* Hero banner */}
      <div className="success-v2-banner">
        <div className="success-v2-check-ring">
          <IconCheck />
        </div>
        <div>
          <h1 className="success-v2-title">Document generated</h1>
          <p className="success-v2-sub">
            <strong>{docName}</strong> has been downloaded to your computer.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="success-v2-body">

        {/* Next steps hint */}
        <div className="success-v2-hint">
          <span className="success-v2-hint-icon">💡</span>
          Open the downloaded file in Microsoft Word or Google Docs to review before sending.
        </div>

        {/* Summary */}
        {summary.length > 0 && (
          <SummaryCard title="Verify these values in your document" items={summary} />
        )}

        {/* Fix it */}
        {onFixIt && (
          <p className="success-v2-fix">
            Something looks off?{' '}
            <button className="success-v2-fix-link" onClick={onFixIt}>← Go back and fix it</button>
          </p>
        )}

        {/* Actions */}
        <div className="success-v2-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            <IconHome /> Home
          </button>
          <button className="btn btn-primary" onClick={onNew}>
            <IconPlus /> Create another
          </button>
          {!isSow && onFollowOnCR && (
            <button className="btn btn-secondary" onClick={onFollowOnCR}>
              <IconRefresh /> Follow-on CR
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

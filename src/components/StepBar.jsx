import React from 'react';
import { IconCheck } from './icons.jsx';

const SHORT_LABELS = {
  "Project Info": "Project",
  "Timeline & Resources": "Timeline",
  "Preview & Generate": "Generate"
};

export function StepBar({ steps, current }) {
  return (
    <div className="step-bar">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="step">
            <div className={`step-circle ${i < current ? "done" : i === current ? "active" : "pending"}`}>
              {i < current ? <IconCheck /> : i + 1}
            </div>
            <span className={`step-name ${i < current ? "done" : i === current ? "active" : "pending"}`}>{SHORT_LABELS[s] || s}</span>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < current ? "done" : ""}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

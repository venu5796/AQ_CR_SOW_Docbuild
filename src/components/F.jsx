import React from 'react';
export { fmt } from '../utils/dates.js';

export const F = ({ v, ph = "________" }) => (
  <span className={`doc-field ${v ? "" : "empty"}`}>{v || ph}</span>
);

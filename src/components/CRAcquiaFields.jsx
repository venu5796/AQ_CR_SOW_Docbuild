import React from 'react';
import { alnum } from '../utils/dates.js';

export function CRRequestorField({ data, set }) {
  return (
    <div className="form-row single">
      <div className="field">
        <label>Requestor</label>
        <input value={data.reqpoc} onChange={e => set("reqpoc", alnum(e.target.value))} placeholder="Requestor POC Name" />
      </div>
    </div>
  );
}

export function CRAcquiaFields({ data, set }) {
  return (
    <div className="form-row">
      <div className="field">
        <label>Acquia Project ID</label>
        <input value={data.acquiaprojid} onChange={e => set("acquiaprojid", alnum(e.target.value))} placeholder="ACQ12345" />
      </div>
      <div className="field">
        <label>PS Program Manager</label>
        <input value={data.psprogmgr} onChange={e => set("psprogmgr", alnum(e.target.value))} placeholder="Jane Doe" />
      </div>
    </div>
  );
}

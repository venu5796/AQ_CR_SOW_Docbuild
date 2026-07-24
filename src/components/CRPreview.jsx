import React from 'react';
import { F } from './F.jsx';
import { EditableF, SowF } from './EditableF.jsx';
import { fmt, buildCRTitle, calcCRSowHours, calcCRCrHours, calcCRTotalHours, calcCRBudget } from '../utils/dates.js';
import { richTextIsEmpty } from '../utils/docx.js';

// sowData: original SOW values (enables delta mode when provided)
// onEdit: (fieldKey, value) => void — called when user edits an amber field inline
export function CRPreview({ data, sowData, onEdit, showClass = "" }) {
  const filled = data.resources.filter(r => r.resource || r.name);
  const delta = !!sowData;
  const crTitle = buildCRTitle(data.crno);

  // Helper: pick EditableF (amber, editable) or SowF (greyed SOW origin) or plain F
  const CRF = ({ v, ph, fieldKey, type }) =>
    delta
      ? <EditableF v={v} ph={ph} isDelta fieldKey={fieldKey} onEdit={onEdit} type={type} />
      : <F v={v} ph={ph} />;

  const SOWF = ({ v, ph }) =>
    delta ? <SowF v={v} ph={ph} /> : <F v={v} ph={ph} />;

  return (
    <div className={`preview-panel ${showClass}`.trim()}>
      <div className="preview-inner">
        <div className="preview-label">Live Preview</div>
        {delta
          ? <div className="delta-preview-badge"><span className="dot" />Delta mode — amber fields are editable</div>
          : <div className="preview-badge"><span className="dot" />Updates as you type</div>
        }
        <div className="doc-paper">
          <p style={{ textAlign: "center", fontWeight: 700, fontSize: "1.2em", letterSpacing: "0.04em", marginBottom: 6 }}>{crTitle}</p>
          <hr className="doc-divider" />

          {/* Project Information */}
          <table className="doc-table" style={{ marginBottom: 14 }}>
            <tbody>
              <tr><td className="lbl"><strong>Project Information</strong></td><td></td></tr>
              <tr>
                <td className="lbl">Consultant/Customer Name:</td>
                <td><strong><SOWF v={data.custname} ph="[Customer Name]" /></strong></td>
              </tr>
              <tr>
                <td className="lbl">Acquia's Customer:</td>
                <td><SOWF v={data.req} ph="[Requestor Name]" /></td>
              </tr>
              <tr>
                <td className="lbl">Requestor:</td>
                <td><SOWF v={data.reqpoc} ph="[Requestor POC Name]" /></td>
              </tr>
              <tr>
                <td className="lbl">Original Statement of Work Reference:</td>
                <td><SOWF v={data.orgsow} ph="[SOW Reference]" /></td>
              </tr>
              <tr>
                <td className="lbl">Name of Project:</td>
                <td><SOWF v={data.projname} ph="[Project Name]" /></td>
              </tr>
              <tr>
                <td className="lbl">Previous Change Requests:</td>
                <td><CRF v={data.prevcrs} ph="None" fieldKey="prevcrs" /></td>
              </tr>
              <tr>
                <td className="lbl">Change Request #:</td>
                <td><CRF v={data.crno} ph="[CR Number]" fieldKey="crno" /></td>
              </tr>
              <tr>
                <td className="lbl">Acquia Project ID:</td>
                <td><CRF v={data.acquiaprojid} ph="[Acquia Project ID]" fieldKey="acquiaprojid" /></td>
              </tr>
              <tr>
                <td className="lbl">PS Program Manager:</td>
                <td><CRF v={data.psprogmgr} ph="[PS Program Manager]" fieldKey="psprogmgr" /></td>
              </tr>
            </tbody>
          </table>

          {/* Description of Change */}
          <p style={{ fontWeight: 700, textDecoration: "underline", marginBottom: 4 }}>Description of Change</p>
          <table className="doc-table" style={{ marginBottom: 10 }}>
            <tbody>
              <tr><td style={{ fontStyle: "italic", color: "#333" }}><CRF v={data.purpose} ph="[Description of change]" fieldKey="purpose" type="textarea" /></td></tr>
            </tbody>
          </table>

          {/* Details of Change */}
          <p style={{ fontWeight: 700, textDecoration: "underline", marginBottom: 4 }}>Details of Change</p>
          <p>Contractual changes to the SOW are as follows:</p>
          {!richTextIsEmpty(data.detailsofchange) && (
            <div className="doc-richtext" dangerouslySetInnerHTML={{ __html: data.detailsofchange }} />
          )}
          <p>
            <strong>Section 10. Delivery Timeline</strong>: The period of performance is{" "}
            <SOWF v={fmt(data.ogstdate)} ph="[Start Date]" /> to{" "}
            <CRF v={fmt(data.enddate)} ph="[New End Date]" fieldKey="enddate" type="date" />.
          </p>
          <p>
            <strong>Section 13. Fees, Invoicing and Payment</strong>: The Services will be delivered on a time and materials basis, not to exceed{" "}$<strong>
              <CRF v={data.newtotbudget} ph="[New Total Budget]" fieldKey="newtotbudget" />
            </strong>
          </p>

          {/* Resources Table */}
          <p style={{ fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Resources Table</p>
          {filled.length > 0 ? (
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Name</th>
                  <th className={delta ? "sow-cell" : ""}>Current Hours (SOW)</th>
                  <th className={delta ? "" : ""} style={delta ? { background: "var(--amber-s)", color: "var(--amber)" } : {}}>Additional CR Hours</th>
                  <th>New Total Hour</th>
                  <th className={delta ? "sow-cell" : ""}>Rate (USD/hr)</th>
                  <th style={delta ? { background: "var(--amber-s)", color: "var(--amber)" } : {}}>New Total Budget</th>
                </tr>
              </thead>
              <tbody>
                {filled.map((r, i) => (
                  <tr key={i}>
                    <td className={delta ? "sow-cell" : ""}>{r.resource || "—"}</td>
                    <td className={delta ? "sow-cell" : ""}>{r.name || "—"}</td>
                    <td className={delta ? "sow-cell" : ""}>{calcCRSowHours(r) || "—"}</td>
                    <td style={delta ? { color: "var(--amber)", fontWeight: 600 } : {}}>{calcCRCrHours(r) || "—"}</td>
                    <td><strong>{calcCRTotalHours(r) || "—"}</strong></td>
                    <td className={delta ? "sow-cell" : ""}>{r.rate ? `$${r.rate}` : "—"}</td>
                    <td style={delta ? { color: "var(--amber)", fontWeight: 600 } : {}}>
                      {calcCRTotalHours(r) && r.rate ? `$${calcCRBudget(r).toLocaleString()}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#aaa", fontStyle: "italic" }}>[Resource table will appear here]</p>
          )}

          {/* Project Impact */}
          <table className="doc-table" style={{ marginTop: 12 }}>
            <thead>
              <tr><th colSpan={2}>Project Impact</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="lbl">Effort Impact</td>
                <td>
                  Original number of hours of{" "}
                  <span className={delta ? "sow-cell" : ""}><F v={data.effimp} ph="[Original Hours]" /></span>{" "}
                  hours is increased by{" "}
                  <span style={delta ? { color: "var(--amber)", fontWeight: 600 } : {}}><F v={data.inchours} ph="[Additional Hours]" /></span>{" "}
                  hours for a new total of{" "}
                  <strong><F v={data.neffimp} ph="[New Total Hours]" /></strong> hours.
                </td>
              </tr>
              <tr>
                <td className="lbl">Timeline Impact:</td>
                <td>
                  The original end date is extended by{" "}
                  <CRF v={data.workdays} ph="[X]" fieldKey="workdays" />{" "}
                  days to give the new end date of{" "}
                  <strong><F v={fmt(data.enddate)} ph="[New End Date]" /></strong>.
                </td>
              </tr>
              <tr>
                <td className="lbl">Budget Impact:</td>
                <td>
                  The Budget of USD{" "}
                  <span className={delta ? "sow-cell" : ""}><F v={data.prevtotbud} ph="[Original Budget]" /></span>,{" "}
                  is increased by USD{" "}
                  <strong><CRF v={data.newbud} ph="[Increase]" fieldKey="newbud" /></strong>,{" "}
                  for a new total of USD{" "}
                  <strong><CRF v={data.newtotbudget} ph="[New Total]" fieldKey="newtotbudget" /></strong>.
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: 10 }}>
            Except as otherwise amended herein, all the terms and conditions of the SOW shall remain in full force and effect. This Change Request is effective from{" "}
            <CRF v={fmt(data.exstdate)} ph="[Effective Date]" fieldKey="exstdate" type="date" />,
          </p>
          <p style={{ marginTop: 6 }}>
            IN WITNESS WHEREOF, each of the parties has caused this Change Request to be executed on its behalf by its duly authorized representatives as of the Effective Date stated above and agrees that an electronic signature of a duly authorized representative constitutes a valid signature for such a party.
          </p>

          {/* Signatories */}
          <table className="sig-table">
            <thead>
              <tr>
                <th>ACQUIA INC.</th>
                <th><F v={data.custname} ph="[Customer Name]" /></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>By: _______________</td><td>By: _______________</td></tr>
              <tr><td>Name: _______________</td><td>Name: _______________</td></tr>
              <tr><td>Title: _______________</td><td>Title: _______________</td></tr>
              <tr><td>Date: _______________</td><td>Date: _______________</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

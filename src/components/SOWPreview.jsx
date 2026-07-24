import React from 'react';
import { F } from './F.jsx';
import { fmt } from '../utils/dates.js';
import { calcResourceHours, calcResourceTotal } from '../utils/dates.js';

export function SOWPreview({ data, showClass = "" }) {
  const filled = data.resources.filter(r => r.name || r.role);
  return (
    <div className={`preview-panel ${showClass}`.trim()}>
      <div className="preview-inner">
        <div className="preview-label">Live Preview</div>
        <div className="preview-badge"><span className="dot" />Updates as you type</div>
        <div className="doc-paper">
          <p style={{ textAlign: "center", fontWeight: 700, fontSize: "1.2em", letterSpacing: "0.04em", marginBottom: 2 }}>Subcontractor Statement of Work</p>
          <hr className="doc-divider" />
          <p style={{ textAlign: "justify", fontStyle: "italic", borderLeft: "3px solid #d4a76a", paddingLeft: 10, color: "#374151", marginBottom: 10 }}>
            This Statement of Work ("SOW") is entered into as of <strong><F v={fmt(data.Effecdate)} ph="[Effective Date]" /></strong> (the "Effective Date") by and between{" "}
            <strong><F v={data.SubconAddr || data.Subcon} ph="[Subcontractor and Address]" /></strong> ("Subcontractor") and <strong>Acquia Inc.</strong>, a Delaware corporation with its principal place of business at 53 State Street, Boston, MA 02109 ("Acquia") and is deemed to be incorporated into that certain Subcontractor Agreement dated as of{" "}
            <strong><F v={fmt(data.MSA_Date)} ph="[MSA Date]" /></strong> by and between Subcontractor and Acquia (the "Agreement"). Any terms used herein but not defined shall have the meaning ascribed to such term in the Agreement. Acquia is contracting the following services from the Subcontractor (the "Services"):
          </p>
          <p><strong>1. Name of Project</strong> – <F v={data.Projname} ph="[Project Name]" /> (the "Project")</p>
          <p><strong>2. Customer Name</strong> – <F v={data.Custname} ph="[Customer Name]" /> (the "Customer")</p>
          <p><strong>3. Description of Project.</strong> <F v={data.Proj_desc} ph="[Project description]" /></p>
          <p><strong>4. Detailed Scope.</strong> Subcontractor will perform the following tasks for the Project <strong>Ongoing Engagement and Project Management. Subcontractor will provide the following:</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 8 }}>
            <li><strong>Weekly status reports.</strong> Each week reports will be shared with Acquia to convey progress of tasks, risks, issues, roadblocks, budget, and milestones completed.</li>
            <li><strong>Project plan.</strong> Subcontractor will maintain and provide to Acquia Project plans with subsequent changes for tracking and updating of various elements throughout the effort.</li>
            <li><strong>Risk management and mitigation.</strong> Subcontractor will proactively identify risks and develop active mitigation strategies.</li>
            <li><strong>Scope and budget management.</strong> Active monitoring and management of both scope and budget burn.</li>
            <li><strong>Development Velocity.</strong> Subcontractor will consistently deliver on the agreed velocity established during Sprint Planning.</li>
            <li><strong>Development Tools.</strong> Subcontractor will use a combination of JIRA and GIT for bug tracking and version control.</li>
          </ul>
          <p>Subcontractor will provide development with the following roles on a scheduled sprint basis:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 8 }}>
            <li><strong>Drupal Front End Developer</strong> – 3+ years Drupal experience, HTML5/CSS/JS/PHP skills.</li>
            <li><strong>Drupal Backend Developer</strong> – 3+ years Drupal, site building, migrations, Git/VCS workflows.</li>
            <li><strong>Quality Assurance</strong> – 3+ years Drupal, functional test cases, UAT support.</li>
          </ul>
          <p><strong>5. Project Approach.</strong> The Project management methodology includes:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 8 }}>
            <li><strong>Development Team Management.</strong> The Project will be broken into 2-week sprints. Key meetings: Sprint Planning, Daily Stand-Ups, Sprint Demo, Sprint Retro.</li>
            <li><strong>Roles and Responsibilities</strong> as defined in the SOW table.</li>
          </ul>
          <p><strong>6. Staffing Resources.</strong> Subcontractor will provide minimum two (2) weeks' written notice for any changes in staff or project allocations.</p>
          <p><strong>7. Secure Project Closure.</strong> At completion, all Subcontractor Staff will complete the Secure Project Closure checklist (Appendix A) within 5 business days of Project completion.</p>
          <p><strong>8. Deliverables.</strong> Subcontractor will provide: weekly status updates, proactive risk identification, and Deliverables through sprint processes.</p>
          <p><strong>9. Acceptance.</strong> Acquia reserves the right to review and test any work provided by Subcontractor to determine conformance to this SOW in all material respects.</p>
          <p>
            <strong>10. Delivery Timeline.</strong> Subcontractor will work with Acquia and Customer to determine a mutually agreeable delivery schedule.<br />
            <strong>The period of performance is <F v={fmt(data.Strtdate)} ph="[Start Date]" /> to <F v={fmt(data.Enddate)} ph="[End Date]" />.</strong>
          </p>
          <p><strong>11. Team Leaders.</strong> The following table lists the team leaders from Acquia and Subcontractor.</p>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Resource/Role</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><u>Professional Services Contact</u><br />Geetali Sodhi, Manager, Professional Services<br /><span style={{ color: "var(--accent)" }}>geetali.sodhi@acquia.com</span></td>
                <td>Acquia</td>
              </tr>
              <tr>
                <td><u>Professional Services Contact</u><br /><F v={data.Subpoc} ph="[POC Name]" />, CEO<br /><F v={data.Subpocemail} ph="[POC Email]" /></td>
                <td><F v={data.Subcon} ph="[Subcontractor]" /></td>
              </tr>
            </tbody>
          </table>
          <p><strong>12. Assumptions.</strong></p>
          <ul style={{ paddingLeft: 20, marginBottom: 8 }}>
            <li>Any delay caused directly by Subcontractor will be the sole responsibility of the Subcontractor.</li>
            <li>Subcontractor will not commit to Deliverables or changes in scope directly with Customer.</li>
            <li>Acquia will maintain all responsibilities for program and project management.</li>
            <li>Written approvals may be provided through e-mail.</li>
            <li>Business days are deemed not to exceed eight (8) hours.</li>
            <li>Subcontractor will not bill hours outside of those approved by Acquia.</li>
          </ul>
          <p><strong>13. Fees, Invoicing and Payment</strong></p>
          <p>
            <strong>Fees.</strong> The Services will be delivered on a time and materials basis, not to exceed <strong>${<F v={data.Total_Fee ? (data.Total_Fee.startsWith("$") ? data.Total_Fee.slice(1) : data.Total_Fee) : null} ph="[Total Fee]" />}</strong> (the "Fees").
          </p>
          {filled.length > 0 ? (
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Name</th>
                  <th>Hours</th>
                  <th>Rate (USD/hr)</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filled.map((r, i) => (
                  <tr key={i}>
                    <td>{r.role || "—"}</td>
                    <td>{r.name || "—"}</td>
                    <td>{calcResourceHours(r) || "—"}</td>
                    <td>{r.rate ? `$${r.rate}/hr` : "—"}</td>
                    <td>{calcResourceHours(r) && r.rate ? `$${calcResourceTotal(r).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#aaa", fontStyle: "italic" }}>[Resource table will appear here]</p>
          )}
          <p><strong>Invoicing.</strong> Subcontractor will invoice monthly in arrears. All invoices must match approved timesheets.</p>
          <p><strong>Expenses.</strong> Acquia will pay for actual and reasonable out-of-pocket expenses pre-approved in writing by Acquia.</p>
          <p><strong>Payment.</strong> Acquia will pay all invoices in accordance with the terms of the Agreement.</p>
          <p><strong>14. Change Management.</strong> Revisions to the scope of the Project or Services that result in incremental effort, costs or fees shall be handled through a Change Request approved by Acquia.</p>
          <p><strong>15. Miscellaneous.</strong> This SOW may only be modified or amended by a document identifying itself as an amendment and signed by an authorized representative of each party.</p>
          <p style={{ marginTop: 12 }}>IN WITNESS WHEREOF, the parties have caused this SOW to be executed by their duly authorized representatives as of the date first written above.</p>
          <table className="sig-table">
            <thead>
              <tr>
                <th>Acquia</th>
                <th><F v={data.Subconname || data.Subcon} ph="[Subcontractor Name]" /></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Authorized Signature: _______________</td><td>Authorized Signature: _______________</td></tr>
              <tr><td>Print Name: _______________</td><td>Print Name: _______________</td></tr>
              <tr><td>Title: _______________</td><td>Title: _______________</td></tr>
              <tr><td>Date: _______________</td><td>Date: _______________</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 10 }}><strong>Does Supplier issue Purchase Orders?&nbsp;&nbsp;&nbsp; YES [ ] &nbsp;&nbsp;&nbsp; NO [ ]</strong></p>
          <hr className="doc-divider" />
          <p style={{ fontWeight: 700, textAlign: "center" }}>Appendix A: Secure Project Closure Checklist</p>
          <p>At the completion of this SOW, all Staffing Resource(s) involved in the Project must complete this Secure Project Closure Checklist within 5 business days of Project closure.</p>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Delete all Acquia and Customer source code from local machine and backups",
                "Delete all Acquia and Customer data elements from local machine and backups",
                "Delete all Customer databases from local machine and backups",
                "Delete all Customer testing data from local machine and backups",
                "Delete all Acquia and Customer access configurations (usernames, passwords, URLs)",
                "Delete all Acquia and Customer-related proprietary information",
                "Delete all references to Customer on internal systems (chat, Confluence, JIRA, etc.)"
              ].map((t, i) => (
                <tr key={i}><td>{t}</td><td></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

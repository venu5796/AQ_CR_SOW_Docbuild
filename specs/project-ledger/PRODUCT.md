# Project Ledger

## Summary

Users can link a "Project" in the app to an existing Google Drive folder that holds a customer's SOW and its subsequent Change Requests (CRs). Once linked, generating the next CR ("CR from Project") pre-fills from the project's latest known state automatically — no need to dig up and re-upload the most recent document.

## Problem

A SOW and its CRs form a chain: each CR extends or alters the state established by the previous document. Today, "CR from SOW" and "CR from CR" require the user to manually find and re-upload the most recent document every time they create a new CR. The Project Ledger removes that manual step for projects the user sets up, while still supporting projects whose history was never tracked in the app.

## Goals / Non-goals

**Goals**
- Eliminate re-uploading the latest document when creating a CR for a known project.
- Support a single Project containing multiple independent SOW→CR chains (e.g., separate chains per subcontractor/partner working under the same customer project).
- Allow projects with pre-existing history (created outside this app, or before this feature existed) to be brought up to date via import or manual entry.
- Preserve a visible history of what changed between consecutive documents in a chain, and who made each change.
- Let users fix mistakes in previously recorded chain entries without losing the record that a correction happened.

**Non-goals (v1)**
- Real-time multi-user collaboration or live sync between simultaneous editors. (Drive folder sharing already provides access control for a future version; nothing special is built for this now.)
- Creating, renaming, or organizing folders/structure within Drive. The app only reads and writes files inside a folder the user has already selected.
- Automatically reconciling or recalculating earlier chain entries when a later correction is made.

## Figma

Figma: none provided

## Behavior

### Connecting a Project to a Drive folder

1. From the app's navigation, the user can open a "Projects" view listing Projects they've previously connected (by `projname` / `custname`), plus a "Connect a Project" action.
2. "Connect a Project" opens a Google Drive folder picker. The user selects any folder they have access to — the app does not create folders.
3. After a folder is selected, the app checks the folder for an existing project record (see "Reconcile", below) before treating the connection as complete.
4. If the folder has no existing project record, the user is asked to confirm/enter the Project's `custname` and `projname` before the project record is created in that folder.
5. If the folder already contains a project record matching different `custname`/`projname` than what the user expects, the user is shown that record's identity and asked: continue with the existing project found in this folder, or pick a different folder.
6. Once connected, the Project appears in the "Projects" list for future sessions. Re-selecting the same folder later (e.g., after access is lost, see "Access & session recovery") re-establishes the connection without creating a duplicate project record.

### Reconcile

7. "Reconcile" is an action available on any connected Project (run automatically right after connecting, and manually re-runnable at any time).
8. Reconcile compares the project record against the actual contents of the linked folder and surfaces discrepancies for the user to resolve — it never silently changes data.
9. If the folder contains files (SOW/CR documents) that are not referenced by any chain entry, Reconcile lists them and offers to add each one to a chain (existing or new) via the same import flow described under "Populating a chain."
10. If a chain entry references a file that no longer exists in the folder (deleted, moved, or trashed), Reconcile flags that entry as having a broken document link. The chain entry's recorded data remains usable for pre-fill; only the document link is marked broken.
11. If the project record itself is missing or unreadable (e.g., corrupted), and the folder contains recognizable SOW/CR documents, Reconcile offers to rebuild the project record from those documents via the import flow. If the folder has no usable documents, the user is told the record could not be found or rebuilt and must start fresh or pick a different folder.
12. Reconcile results are added to the Project's visible activity history (see "Audit trail").

### Projects, chains, and entries

13. A Project can contain multiple chains. Each chain represents one SOW and its sequence of CRs (e.g., one chain per subcontractor/partner brought onto the project).
14. Within a connected Project, the user can choose to "Continue an existing chain" (pick from a list of the project's chains, each labeled by its partner/subcontractor name) or "Start a new chain" (e.g., onboarding a new partner under the same customer project).
15. A chain with zero entries cannot be used for "CR from Project" — it must first receive a SOW entry (via import or manual entry) before any CR can be generated against it.
16. Each chain entry represents one document's worth of state (a SOW or a CR) and reflects the *complete* current state at that point — current resources, current end date, current budget — not just what changed in that one document. This means "CR from Project" always has a complete picture to pre-fill from, regardless of whether the most recent CR only changed resources, only changed the timeline, only changed the budget, or some combination.
17. Each chain entry shows a short, human-readable summary of what changed relative to the previous entry in the chain (e.g., "added 2 resources, no budget or timeline change", "extended end date by 30 days, no budget change", "increased budget by $5,000, no resource or timeline change"). For the first entry in a chain (the SOW), no comparison is shown.

### Populating a chain

18. A chain entry can be added in one of three ways: by uploading a document (DOCX or PDF) that the app extracts data from, by selecting an existing un-referenced file in the folder (via Reconcile), or by entering data manually with no document.
19. When adding an entry from a document, the user specifies whether it is a SOW or a CR before the app extracts data from it.
20. Regardless of how an entry is populated (uploaded or manual), the user is shown the resulting data and must confirm it before it is saved to the chain. Declining the save discards the entry attempt without modifying the project record.
21. During confirmation, any field the extraction was not confident about is visibly highlighted so the user knows to double-check it (this applies only to uploaded entries — manual entries have no extraction confidence to flag).
22. During confirmation, if the entry's totals are internally inconsistent (e.g., the sum of resource budgets doesn't match the stated total budget, or similar for hours), the user is shown a warning describing the mismatch. The user may still choose to save as-is or go back and correct it — the warning does not block saving outright.
23. If the new entry appears out of place relative to the chain's existing order — its CR number is not the next expected number, its dates fall before the previous entry's dates, or its period overlaps the previous entry's period — the user is shown the existing chain for context and asked to confirm the entry's position (and correct its CR number if needed) before it is saved. The user can also cancel adding the entry entirely at this point.

### CR from Project

24. "CR from Project" starts from the last entry of a chosen chain: all of that entry's current state (resources, dates, budget) is pre-filled into the CR form, exactly as if the most recent document had just been uploaded and processed.
25. As with today's "CR from CR" behavior, fields that represent "what's changing in this CR" (the CR's own period/holiday overrides, whether each resource is being extended) start empty/unset in the new CR, even though the resources themselves carry over from the previous entry.
26. After generating a new CR via "CR from Project," the generated document is offered for upload into the Project's linked folder, and — if the user confirms (per "Populating a chain" / confirmation step) — a new entry is appended to the chain reflecting the new current state.
27. If the user generates the CR but does not confirm saving it to the chain, the document is still produced/downloadable as normal, but the chain is left unchanged.

### Editing chain history

28. Any chain entry — not only the most recent — can be opened and edited later to correct a mistake.
29. Every edit to a chain entry is recorded in the audit trail with what changed, who made the change, and when (see "Audit trail"). The correction itself remains visible in history; it is not silently overwritten.
30. Editing an entry does not automatically change any later entries in the same chain. If the edited entry is not the last one in the chain, the user is shown a warning listing the later entries that may now be inconsistent with the correction, so they can review and, if needed, edit those separately. The warning does not block saving the correction.

### Audit trail

31. Each connected Project has a visible activity history showing: chain entries added, chain entries edited (with old vs. new values), Reconcile actions and their outcomes, and access-related issues (see "Access & session recovery").
32. Each activity entry shows who performed it (the signed-in user's account) and when.
33. The activity history is intended for troubleshooting and accountability; it is read-only to the user (entries cannot be deleted or edited directly).

### Access & session recovery

34. If the app's access to Drive expires during a session, it attempts to silently re-establish access. If that fails, the user is prompted to re-authenticate.
35. If the app can no longer access a Project's linked folder (permission revoked, account changed, etc.), the user is shown a "reconnect this Project's folder" action, which re-opens the folder picker. Selecting the same folder again restores access without creating a duplicate project record or losing existing chain data.
36. While a Project's folder is inaccessible, "CR from Project" and Reconcile for that project are unavailable; other projects and the existing upload-based flows remain usable.

### Concurrent edits

37. If the user attempts to save a change to a Project (new chain entry, edit, or Reconcile result) and the project record has been updated elsewhere since it was last loaded, the user is shown who made the other update and when, and is asked to reload the current state before continuing. Their in-progress entry is not silently discarded — they can copy/retry it after reloading.

### Integration with existing CR-from-SOW / CR-from-CR flows

38. The existing "CR from SOW" and "CR from CR" flows (upload a document, extract, edit, generate) continue to work exactly as they do today for users who don't use Projects, with no required changes to that experience.
39. After a successful generation in either flow, if the extracted customer/project identity reasonably matches a connected Project (accounting for known naming variations), the user is offered the option to add the just-generated document as a new entry to one of that project's chains, following the same confirmation/out-of-order checks as any other chain entry addition.
40. If the user declines this suggestion, nothing about the Project is changed, and the already-generated document remains available exactly as if the suggestion had never appeared.

### Empty / first-run states

41. The "Projects" view, when no projects are connected yet, clearly explains what connecting a Project does and offers the "Connect a Project" action as the primary call to action.
42. A connected Project with no chains yet prompts the user to start a chain (via "Start a new chain") before offering any chain-dependent actions.

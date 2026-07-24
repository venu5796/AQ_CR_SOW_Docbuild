export function saveDraft(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, savedAt: Date.now() }));
  } catch(e) {}
}

export function loadDraft(key) {
  try {
    var s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch(e) {}
  return null;
}

export function clearDraft(key) {
  try { localStorage.removeItem(key); } catch(e) {}
}

// Encode a slim subset of CR-from-SOW state into a URL-safe base64 string.
// Resources are simplified (role + name + rate only) to keep the URL short.
export function encodeLink(data) {
  var slim = {
    custname: data.custname, subcon: data.subcon, req: data.req,
    reqpoc: data.reqpoc, acquiaprojid: data.acquiaprojid, psprogmgr: data.psprogmgr,
    projname: data.projname, orgsow: data.orgsow, crno: data.crno,
    prevcrs: data.prevcrs, ogstdate: data.ogstdate, lenddate: data.lenddate,
    enddate: data.enddate, exstdate: data.exstdate,
    prevtotbud: data.prevtotbud, newtotbudget: data.newtotbudget,
    purpose: data.purpose, detailsofchange: data.detailsofchange,
    effimp: data.effimp, inchours: data.inchours, neffimp: data.neffimp,
    newbud: data.newbud, workdays: data.workdays,
    resources: (data.resources || []).map(function(r) {
      return {
        resource: r.resource || '', name: r.name || '', rate: r.rate || '',
        noExtension: r.noExtension || false,
        sowPeriods: r.sowPeriods || [],
        crPeriods: r.crPeriods || []
      };
    })
  };
  try { return btoa(encodeURIComponent(JSON.stringify(slim))); } catch(e) { return null; }
}

export function decodeLink(encoded) {
  try { return JSON.parse(decodeURIComponent(atob(encoded))); } catch(e) { return null; }
}

// Format "saved X ago" label
export function savedAgoLabel(ts) {
  if (!ts) return '';
  var secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return Math.floor(secs / 60) + 'm ago';
  return Math.floor(secs / 3600) + 'h ago';
}

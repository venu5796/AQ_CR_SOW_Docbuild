export function fmtCurrency(v) {
  if (!v) return '—';
  const s = String(v);
  if (s.startsWith('$')) return s;
  const n = Number(s.replace(/[$,]/g, ''));
  return isNaN(n) ? s : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmt(d) {
  if (!d) return null;
  try {
    const dt = new Date(d + "T00:00:00");
    const day = dt.getDate();
    const teen = day >= 11 && day <= 13;
    const ord = !teen && (day % 10 === 1) ? "st" : !teen && (day % 10 === 2) ? "nd" : !teen && (day % 10 === 3) ? "rd" : "th";
    const mon = dt.toLocaleDateString("en-US", { month: "long" });
    const yr = dt.getFullYear();
    return mon + " " + day + ord + ", " + yr;
  } catch {
    return d;
  }
}

export function buildCRTitle(crno) {
  return `Change Request${crno ? ` ${crno}` : ''} for Professional Services`;
}

export function countWorkingDays(s, e) {
  if (!s || !e) return 0;
  var sd = new Date(s + "T00:00:00"), ed = new Date(e + "T00:00:00");
  if (isNaN(sd) || isNaN(ed) || ed < sd) return 0;
  var c = 0, cur = new Date(sd);
  while (cur <= ed) {
    var d = cur.getDay();
    if (d !== 0 && d !== 6) c++;
    cur.setDate(cur.getDate() + 1);
  }
  return c;
}

export function calcResourceHours(res) {
  if (!res.periods || !res.periods.length) return 0;
  return res.periods.reduce(function(sum, p) {
    var wd = Math.max(0, countWorkingDays(p.startDate, p.endDate) - (parseInt(p.holidays) || 0));
    return sum + wd * (parseFloat(p.hoursPerDay) || 0);
  }, 0);
}

export function calcResourceTotal(res) {
  return calcResourceHours(res) * (parseFloat(res.rate) || 0);
}

export function calcTotalFee(resources) {
  return resources.reduce(function(sum, r) {
    return sum + calcResourceTotal(r);
  }, 0);
}

export function calcCRSowHours(res) {
  if (res.sowHours !== undefined && res.sowHours !== '') return parseFloat(res.sowHours) || 0;
  if (!res.sowPeriods || !res.sowPeriods.length) return 0;
  return res.sowPeriods.reduce(function(s, p) {
    var wd = Math.max(0, countWorkingDays(p.startDate, p.endDate) - (parseInt(p.holidays) || 0));
    return s + wd * (parseFloat(p.hoursPerDay) || 0);
  }, 0);
}

export function calcCRCrHours(res) {
  if (res.noExtension) return 0;
  if (!res.crPeriods || !res.crPeriods.length) return 0;
  return res.crPeriods.reduce(function(s, p) {
    var wd = Math.max(0, countWorkingDays(p.startDate, p.endDate) - (parseInt(p.holidays) || 0));
    return s + wd * (parseFloat(p.hoursPerDay) || 0);
  }, 0);
}

export function calcCRTotalHours(res) {
  return calcCRSowHours(res) + calcCRCrHours(res);
}

export function calcCRBudget(res) {
  return calcCRTotalHours(res) * (parseFloat(res.rate) || 0);
}

export function calcCRTotalBudget(resources) {
  return resources.reduce(function(s, r) {
    return s + calcCRBudget(r);
  }, 0);
}

export function effectiveCRHolidays(data) {
  if (data.crHolidays != null && data.crHolidays !== "") return parseInt(data.crHolidays) || 0;
  return (data.resources || []).filter(function(r) { return !r.noExtension; }).reduce(function(max, r) {
    var t = (r.crPeriods || []).reduce(function(s, p) { return s + (parseInt(p.holidays) || 0); }, 0);
    return Math.max(max, t);
  }, 0);
}

export function calcCRExtensionDays(data) {
  if (!data.lenddate || !data.enddate) return 0;
  var d = new Date(data.lenddate + "T00:00:00");
  d.setDate(d.getDate() + 1);
  var nextDay = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  return Math.max(0, countWorkingDays(nextDay, data.enddate) - effectiveCRHolidays(data));
}

export const DEFAULT_SOW = {
  Effecdate: "", Subcon: "", Subconname: "", SubconAddr: "", MSA_Date: "",
  Projname: "", Custname: "", Proj_desc: "", Strtdate: "", Enddate: "",
  Total_Fee: "", Subpoc: "", Subpocemail: "",
  resources: [{ name: "", role: "", rate: "", periods: [{ startDate: "", endDate: "", hoursPerDay: "8", holidays: "0" }] }]
};

export const DEFAULT_CR_PURPOSE = "The purpose of this Change Request is to add more hours to the SOW and extend the timeline.";

const ALNUM_RE = /[^A-Za-z0-9 ]/g;
// ponytail: strip non-alphanumeric (keep spaces) for the alphanumeric CR fields
export const alnum = v => String(v || "").replace(ALNUM_RE, "");

export function buildCRSummary(d) {
  const days = calcCRExtensionDays(d);
  const totalBud = calcCRTotalBudget(d.resources);
  return [
    { label: 'Customer',          value: d.custname },
    { label: 'Subcontractor',     value: d.subcon },
    { label: 'CR Number',         value: d.crno },
    { label: 'Previous end date', value: d.lenddate ? fmt(d.lenddate) : '—' },
    { label: 'New end date',      value: d.enddate  ? fmt(d.enddate)  : '—' },
    { label: 'Days added',        value: days ? `${days} working days` : '—' },
    { label: 'Previous budget',   value: fmtCurrency(d.prevtotbud) },
    { label: 'Budget increase',   value: fmtCurrency(d.newbud) },
    { label: 'New total budget',  value: fmtCurrency(totalBud || d.newtotbudget) },
  ];
}

export const DEFAULT_CR = {
  custname: "", subcon: "", req: "", reqpoc: "", orgsow: "", projname: "", prevcrs: "", crno: "",
  acquiaprojid: "", psprogmgr: "",
  doctitle: "", ogstdate: "", enddate: "", lenddate: "", workdays: "",
  effimp: "", inchours: "", neffimp: "", prevtotbud: "", newbud: "",
  newtotbudget: "", exstdate: "", crHolidays: "",
  purpose: DEFAULT_CR_PURPOSE,
  detailsofchange: "",
  resources: [{
    resource: "", name: "", rate: "",
    sowPeriods: [{ startDate: "", endDate: "", hoursPerDay: "8", holidays: "0" }],
    crPeriods: [{ startDate: "", endDate: "", hoursPerDay: "8", holidays: "0" }]
  }]
};

import { DEFAULT_CR_PURPOSE } from '../utils/dates.js';

export const SAMPLE_SOW_DATA = {
  Effecdate: "2026-03-09",
  Subcon: "Velir",
  Subconname: "Velir",
  SubconAddr: "Velir, 101 Federal St, Suite 1900, Boston, MA 02110",
  MSA_Date: "2024-01-15",
  Projname: "FY26 Drupal eng — Block 3",
  Custname: "Acquia Inc.",
  Proj_desc: "Continued Drupal engineering support for Block 3 of the FY26 engagement. Covers senior engineering, mid-level development, and tech lead oversight across the block period.",
  Strtdate: "2026-03-09",
  Enddate: "2026-06-28",
  Total_Fee: "199680",
  Subpoc: "Jane Wexley",
  Subpocemail: "jane.wexley@velir.com",
  resources: [
    { name: "A. Mehta",   role: "Senior Drupal Engineer", rate: "165", periods: [{ startDate: "2026-03-09", endDate: "2026-06-28", hoursPerDay: "8", holidays: "2" }] },
    { name: "P. Lopez",   role: "Drupal Engineer",        rate: "145", periods: [{ startDate: "2026-03-09", endDate: "2026-06-28", hoursPerDay: "6", holidays: "2" }] },
    { name: "S. Pereira", role: "Tech Lead",              rate: "185", periods: [{ startDate: "2026-03-09", endDate: "2026-06-28", hoursPerDay: "2", holidays: "2" }] },
  ],
};

const SAMPLE_CR_RESOURCES = [
  {
    resource: "Senior Drupal Engineer", name: "A. Mehta", rate: "165",
    sowPeriods: [{ startDate: "2026-03-09", endDate: "2026-06-28", hoursPerDay: "8", holidays: "2" }],
    crPeriods:  [{ startDate: "2026-06-29", endDate: "2026-08-31", hoursPerDay: "8", holidays: "0" }],
  },
  {
    resource: "Drupal Engineer", name: "P. Lopez", rate: "145",
    sowPeriods: [{ startDate: "2026-03-09", endDate: "2026-06-28", hoursPerDay: "6", holidays: "2" }],
    crPeriods:  [{ startDate: "2026-06-29", endDate: "2026-08-31", hoursPerDay: "6", holidays: "0" }],
  },
  {
    resource: "Tech Lead", name: "S. Pereira", rate: "185",
    sowPeriods: [{ startDate: "2026-03-09", endDate: "2026-06-28", hoursPerDay: "2", holidays: "2" }],
    crPeriods:  [{ startDate: "2026-06-29", endDate: "2026-08-31", hoursPerDay: "2", holidays: "0" }],
  },
];

export const SAMPLE_CR_DATA = {
  custname: "Velir",
  subcon: "Velir",
  req: "Acquia Inc.",
  reqpoc: "Jane Doe",
  acquiaprojid: "ACQ12345",
  psprogmgr: "John Smith",
  orgsow: "SOW — FY26 Eng Block 3",
  projname: "FY26 Drupal eng — Block 3 extension",
  crno: "CR-001",
  prevcrs: "SOW",
  doctitle: "Change Request 001 — FY26 Block 3 Extension",
  purpose: DEFAULT_CR_PURPOSE,
  detailsofchange: "<p>The following <strong>changes</strong> apply to this SOW:</p><ul><li><p>Additional engineering hours for Block 3</p></li><li><p>Extended delivery timeline</p></li></ul>",
  ogstdate: "2026-03-09",
  lenddate: "2026-06-28",
  enddate: "2026-08-31",
  exstdate: "2026-06-29",
  workdays: "46",
  crHolidays: "0",
  effimp: "1248",
  inchours: "736",
  neffimp: "1984",
  prevtotbud: "199680",
  newbud: "117760",
  newtotbudget: "317440",
  resources: SAMPLE_CR_RESOURCES,
};

export const SAMPLE_CR_FROM_SOW_DATA = { ...SAMPLE_CR_DATA };

export const SAMPLE_CR_FROM_CR_DATA = {
  custname: "Velir",
  subcon: "Velir",
  orgsow: "SOW — FY26 Eng Block 3",
  projname: "FY26 Drupal eng — Block 4",
  req: "Acquia Inc.",
  reqpoc: "Jane Doe",
  acquiaprojid: "ACQ12345",
  psprogmgr: "John Smith",
  crno: "CR-002",
  prevcrs: "SOW, CR-001",
  doctitle: "Change Request 002 — FY26 Block 4",
  purpose: DEFAULT_CR_PURPOSE,
  detailsofchange: "",
  ogstdate: "2026-03-09",
  lenddate: "2026-08-31",
  enddate: "2026-11-30",
  exstdate: "2026-09-01",
  workdays: "63",
  crHolidays: "2",
  effimp: "1984",
  inchours: "1008",
  neffimp: "2992",
  prevtotbud: "317440",
  newbud: "161280",
  newtotbudget: "478720",
  resources: [
    {
      resource: "Senior Drupal Engineer", name: "A. Mehta", rate: "165",
      sowPeriods: [{ startDate: "2026-03-09", endDate: "2026-08-31", hoursPerDay: "8", holidays: "2" }],
      crPeriods:  [{ startDate: "2026-09-01", endDate: "2026-11-30", hoursPerDay: "8", holidays: "2" }],
    },
    {
      resource: "Drupal Engineer", name: "P. Lopez", rate: "145",
      sowPeriods: [{ startDate: "2026-03-09", endDate: "2026-08-31", hoursPerDay: "6", holidays: "2" }],
      crPeriods:  [{ startDate: "2026-09-01", endDate: "2026-11-30", hoursPerDay: "6", holidays: "2" }],
    },
    {
      resource: "Tech Lead", name: "S. Pereira", rate: "185",
      sowPeriods: [{ startDate: "2026-03-09", endDate: "2026-08-31", hoursPerDay: "2", holidays: "2" }],
      crPeriods:  [{ startDate: "2026-09-01", endDate: "2026-11-30", hoursPerDay: "2", holidays: "2" }],
    },
  ],
};

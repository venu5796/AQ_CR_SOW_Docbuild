// Subcontractor lookup table
export var SUBCON_DATA = {
  "Axelerant Technologies, Inc.": {
    address: "Axelerant Technologies, Inc.\n68 Harrison Ave Ste 605, PMB 64041\nBoston, Massachusetts 02111-1929\nUnited States",
    msaDate: "2012-10-16",
    pocName: "Ankur Gupta",
    pocEmail: "agupta@axelerant.com"
  },
  "QED42 Engineering Private Limited": {
    address: "QED42 Engineering Private Limited\nInnov8, Office No. 101, 1st Floor\nSuman Business Park, Kalyani Nagar\nPune-411014, India",
    msaDate: "2013-09-19",
    pocName: "Dipen Chaudhary",
    pocEmail: "dipen@qed42.com"
  },
  "Innoraft Solutions Private Limited": {
    address: "Innoraft Solutions Private Limited\n5th Floor, Unit No 508, Adventz Infinity 5,\nBlock BN 5, Sector 5, Bidhan Nagar,\nKolkata - 700091, West Bengal, India",
    msaDate: "2018-08-31",
    pocName: "Mukesh Agarwal",
    pocEmail: "mukesh.agarwal@innoraft.com"
  },
  "Specbee Consulting Services Pvt Ltd": {
    address: "Specbee Consulting Services Pvt Ltd\n175 & 176, Dollars Colony,\nPhase 4 J.P Nagar, Bannerghatta Road,\nBangalore, 560076",
    msaDate: "2019-09-12",
    pocName: "Ashirwad Shetty",
    pocEmail: "ashirwad@specbee.com"
  },
  "VL Consulting DWC-LLC": {
    address: "VL Consulting DWC-LLC, with offices at, 418, 419, 420 Building A4-4, Business Park, Dubai World Central, United Arab Emirates",
    msaDate: "2020-04-14",
    pocName: "Ranganath Prasad Babu Dadi",
    pocEmail: "ranganath.dadi@valuelabs.com"
  }
};

// Default aliases for subcontractor resolution
export var SUBCON_ALIASES_DEFAULT = [
  {match:"axelerant",  full:"Axelerant Technologies, Inc."},
  {match:"qed42",      full:"QED42 Engineering Private Limited"},
  {match:"innoraft",   full:"Innoraft Solutions Private Limited"},
  {match:"specbee",    full:"Specbee Consulting Services Pvt Ltd"},
  {match:"valuelabs",  full:"VL Consulting DWC-LLC"}
];


var _subconAliases = null;
export function getSubconAliases() { return _subconAliases || SUBCON_ALIASES_DEFAULT; }
export function setSubconAliases(a) { _subconAliases = a; }

// Resolve subcontractor from raw string
export function resolveSubcon(raw) {
  if (!raw) return raw;
  var lower = raw.toLowerCase();
  var aliases = getSubconAliases();
  for (var i = 0; i < aliases.length; i++) {
    if (lower.includes(aliases[i].match.toLowerCase())) return aliases[i].full;
  }
  return raw;
}


// Default Acquia SOW sections
export var DEFAULT_ACQUIA_SOW_SECTIONS = [
  {id:'raci', title:'Roles & Responsibilities', type:'raci', locked:false,
   rows:[
    {category:'Ongoing PM / Architecture', party:'Acquia', responsibilities:'Responsible for acquisition and approval of business requirements.\nResponsible for keeping the sprint backlog up to date and running sprint planning.'},
    {category:'', party:'Subcontractor', responsibilities:'Responsible for day to day project management including daily stand-ups.\nResponsible for providing weekly status reports.\nResponsible for reporting hours to Acquia weekly via Mavenlink no later than Monday at noon ET.'},
    {category:'', party:'Acquia and Subcontractor', responsibilities:'Jointly responsible for the Drupal architectural concepts which underpin the build.\nJointly responsible for the creation of the Project plan.\nResponsible for preparing and conducting Sprint Demos with the Customer.'},
    {category:'Development', party:'Acquia', responsibilities:'Responsible for provision of all Drupal environments.\nResponsible for providing access to the appropriate development tools.'},
    {category:'', party:'Subcontractor', responsibilities:'Responsible for creation of code that adheres to Drupal best practices.\nEach team member responsible for ensuring their work is accurately reflected in the ticketing system.'},
    {category:'', party:'Acquia and Subcontractor', responsibilities:'Responsible for the set up and development of the in-scope items.\nResponsible for the generation of the development estimates.\nResponsible for the population of features in the tracking tool and keeping them up to date.'},
    {category:'Quality Assurance', party:'Acquia', responsibilities:'Responsible for auditing the code for adherence to standards and best practices.\nResponsible for carrying out quality assurance testing to ensure the code is complete and ready for UAT.'},
    {category:'', party:'Subcontractor', responsibilities:'Responsible for carrying out Quality Assurance testing.\nResponsible for fixing any bugs found during Quality Assurance.\nResponsible for updating tickets after bugs have been fixed.'},
    {category:'', party:'Acquia and Subcontractor', responsibilities:'Responsible for confirming that completed work adheres to the acceptance criteria in tickets.\nResponsible for the deployment to the Staging environment.'},
    {category:'Operational Testing', party:'Acquia', responsibilities:'Responsible for planning and undertaking performance (load) tests.\nResponsible for planning and undertaking the Drupal security assessment.'},
    {category:'', party:'Subcontractor', responsibilities:'Responsible for assisting with preparation for the load test and security assessment.\nResponsible for fixing any bugs found during Operational Testing.'},
    {category:'UAT', party:'Subcontractor', responsibilities:'Responsible for fixing any bugs found during UAT as agreed with Acquia.\nResponsible for updating tickets after bugs have been fixed.'},
    {category:'Deploying to Production', party:'Acquia', responsibilities:'Management and maintenance of all environments, including backup and roll back.\nResponsible for the deployments to the Production environment.'},
    {category:'', party:'Subcontractor', responsibilities:'Responsible for creating the deployment instructions for completed development work and supporting deployments to staging and production.'},
    {category:'Change Control', party:'Acquia', responsibilities:'Responsible for all communication with the Customer regarding changes in scope.\nResponsible for agreeing and drawing up Change Requests to Subcontractor and/or Customer.'},
    {category:'', party:'Acquia and Subcontractor', responsibilities:'Jointly responsible for identifying and communicating potential changes at the earliest opportunity.\nJointly responsible for generation of the development estimates for Change Requests.'},
    {category:'Budget tracking', party:'Subcontractor', responsibilities:'Responsible for tracking actual consumption of hours against the budget.\nResponsible for communicating to Acquia at the earliest opportunity if an overrun is forecast.'},
   ]},
  {id:'warranty', title:'Warranty', type:'paragraph', locked:false,
   content:'The Services and Deliverables will conform to all specifications set forth in this Project for a period of not less than 180 days after Customer\'s acceptance thereof (the "Warranty Period"). Subcontractor shall remedy, without charge to Acquia or Customer, any and all parts of the Services and/or Deliverables that do not conform during the Warranty Period. Subcontractor shall provide periodic written progress reports of Subcontractor\'s correction of such condition upon Acquia\'s request. If Subcontractor is unable to remedy any nonconforming or unsatisfactory Services or Deliverables within the resolution time required by the Customer, Acquia may terminate the SOW and either (i) return the Deliverables, if any, to Subcontractor and receive a refund of all payments made by Acquia to Subcontractor for such Deliverable or nonconforming portion of the Services, or (ii) keep the Deliverables "as is".'},
  {id:'changeManagement', title:'Change Management', type:'paragraph', locked:false,
   content:'Revisions to the scope of the Project or Services described in the SOW that result in incremental effort, costs or fees shall be handled through a Change Request that shall be approved by Acquia and executed by each party.'},
  {id:'closureTasks', title:'Appendix A: Secure Project Closure Checklist', type:'tasklist', locked:false,
   tasks:[
    'Delete all Acquia and Customer source code from your local machine and any other applicable instances, backups or copies',
    'Delete all Acquia and Customer data elements from your local machine and any other applicable instances, backups or copies',
    'Delete all Customer databases from your local machine and any other applicable instances, backups or copies',
    'Delete all Customer testing data from your local machine and any other applicable instances, backups or copies',
    'Delete all Acquia and Customer access configurations, for example usernames, passwords, URLs, from your local machine and any other applicable instances, backups or copies',
    'Delete all Acquia and Customer-related proprietary information from your local machine and any other applicable instances, backups or copies',
    'Delete all references to Customer on internal systems, e.g., chat, Confluence, JIRA, etc.',
   ]},
];


// Default Acquia SOW form state
export var DEFAULT_ACQUIA_SOW = {
  subcontractorName:'', subcontractorAddress:'', masterAgreementDate:'',
  customerName:'', projectName:'', startDate:'', endDate:'',
  acquiaLead:'', subcontractorLead:'',
  projectDescription:'', detailedTasks:'', deliverables:'', outOfScope:'',
  engagementType:'tm', totalBudget:'',
  keyPersonnel:[{name:'',role:''}],
  phases:[{phase:'',duration:''}],
  rateRows:[
    {role:'Technical Architect', rate:'', hours:''},
    {role:'Sr. Project Manager', rate:'', hours:''},
    {role:'Sr. Developer', rate:'', hours:''},
    {role:'Sr. Front End Developer', rate:'', hours:''},
    {role:'Quality Assurance', rate:'', hours:''},
  ],
  milestones:[{phase:'',amount:''}],
  sections: null, // will be initialized from DEFAULT_ACQUIA_SOW_SECTIONS
};


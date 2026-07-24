import { loadJSZip, unesc } from "./docx.js";

async function safeExtract(fn, label) {
  try { return await fn(); }
  catch (e) { console.error(`${label} error:`, e); return null; }
}

export function parseDateToISO(raw) {
  if (!raw) return '';
  raw = raw.trim().replace(/\.$/, '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  var months = {january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',
    july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
  var m = raw.match(/(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i);
  if (m) { var mo=months[m[1].toLowerCase()]; if(mo) return m[3]+'-'+mo+'-'+String(m[2]).padStart(2,'0'); }
  m = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})/i);
  if (m) { var mo=months[m[2].toLowerCase()]; if(mo) return m[3]+'-'+mo+'-'+String(m[1]).padStart(2,'0'); }
  m = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3]+'-'+String(m[1]).padStart(2,'0')+'-'+String(m[2]).padStart(2,'0');
  return '';
}

export function cleanAmount(raw) {
  if (!raw) return '';
  return raw.replace(/[$,\s]/g, '').trim();
}

// ── DOCX helpers ─────────────────────────────────────────────────────────────
export async function parseDocxXml(file) {
  var JSZip = await loadJSZip();
  var buf = await new Promise(function(res,rej){
    var fr=new FileReader(); fr.onload=function(){res(fr.result);}; fr.onerror=rej; fr.readAsArrayBuffer(file);
  });
  var zip = await JSZip.loadAsync(buf);
  return zip.file('word/document.xml').async('string');
}

export function xmlParagraphs(xml) {
  // Return array of full paragraph texts (joining all w:t runs in each w:p)
  var result = [];
  var paraRe = /<w:p[ >][\s\S]*?<\/w:p>/g;
  var pm;
  while ((pm = paraRe.exec(xml)) !== null) {
    var tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    var text = ''; var tm;
    while ((tm = tRe.exec(pm[0])) !== null) text += tm[1];
    var t = unesc(text.trim());
    if (t) result.push(t);
  }
  return result;
}

export function xmlTableRows(xml) {
  // Returns array of rows; each row is array of cell text strings. Skips header row.
  var rows = [];
  var trRe = /<w:tr[ >][\s\S]*?<\/w:tr>/g;
  var m; var first = true;
  while ((m = trRe.exec(xml)) !== null) {
    if (first) { first = false; continue; }
    var cells = [];
    var tcRe = /<w:tc>[\s\S]*?<\/w:tc>/g; var tc;
    while ((tc = tcRe.exec(m[0])) !== null) {
      var tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g; var cell=''; var tt;
      while ((tt = tRe.exec(tc[0])) !== null) cell += tt[1];
      cells.push(unesc(cell.trim()));
    }
    if (cells.length >= 2 && cells.some(function(x){return x;})) rows.push(cells);
  }
  return rows;
}

export function xmlCRResourceRows(xml) {
  var tables = [];
  var tblRe = /<w:tbl[\s>][\s\S]*?<\/w:tbl>/g;
  var tm;
  while ((tm = tblRe.exec(xml)) !== null) tables.push(tm[0]);
  function cellsOfRow(trXml) {
    var cells = [];
    var tcRe = /<w:tc>[\s\S]*?<\/w:tc>/g; var tc;
    while ((tc = tcRe.exec(trXml)) !== null) {
      var tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g; var cell = ""; var tt;
      while ((tt = tRe.exec(tc[0])) !== null) cell += tt[1];
      cells.push(unesc(cell.trim()));
    }
    return cells;
  }
  for (var ti = 0; ti < tables.length; ti++) {
    var tblText = ""; var wt = /<w:t[^>]*>([^<]*)<\/w:t>/g; var wm;
    while ((wm = wt.exec(tables[ti])) !== null) tblText += wm[1] + " ";
    tblText = tblText.toLowerCase();
    if (!/resource/.test(tblText) || !/name/.test(tblText)) continue;
    if (!/hour/.test(tblText) && !/rate/.test(tblText)) continue;
    var rows = []; var trRe = /<w:tr[ >][\s\S]*?<\/w:tr>/g; var tr; var rowIdx = 0;
    while ((tr = trRe.exec(tables[ti])) !== null) {
      rowIdx++;
      if (rowIdx <= 2) continue;
      var cells = cellsOfRow(tr[0]);
      if (cells.length >= 2 && cells.some(function(x){return x && !/^\{\{/.test(x);}))
        rows.push(cells);
    }
    return rows;
  }
  return [];
}

// ── SOW PARSER (matches DEFAULT_SOW field names exactly) ─────────────────────
function _parseTableRows(tblXml) {
  var rows = [];
  var trRe = /<w:tr[ >][\s\S]*?<\/w:tr>/g;
  var m; var first = true;
  while ((m = trRe.exec(tblXml)) !== null) {
    if (first) { first = false; continue; }
    var cells = [];
    var tcRe = /<w:tc[\s>][\s\S]*?<\/w:tc>/g; var tc;
    while ((tc = tcRe.exec(m[0])) !== null) {
      var tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g; var cell = ''; var tt;
      while ((tt = tRe.exec(tc[0])) !== null) cell += tt[1];
      cells.push(unesc(cell.trim()));
    }
    if (cells.length >= 2 && cells.some(function(x) { return x; })) rows.push(cells);
  }
  return rows;
}

export function xmlFeesTableRows(xml) {
  // Primary: use paraId anchors from the generated SOW template
  var anchor92end = xml.indexOf('paraId="00000092"');
  var anchor94start = xml.indexOf('paraId="00000094"');

  if (anchor92end >= 0 && anchor94start >= 0 && anchor94start > anchor92end) {
    var p92close = xml.indexOf('</w:p>', anchor92end);
    if (p92close >= 0) {
      var between = xml.slice(p92close + '</w:p>'.length, anchor94start);
      var tblStart = between.indexOf('<w:tbl>');
      if (tblStart >= 0) {
        var tblEnd = between.indexOf('</w:tbl>') + '</w:tbl>'.length;
        if (tblEnd >= '</w:tbl>'.length) {
          var rows = _parseTableRows(between.slice(tblStart, tblEnd));
          if (rows.length) return rows;
        }
      }
    }
  }

  // Collect all tables for fallbacks
  var tables = [];
  var tblRe = /<w:tbl[\s>][\s\S]*?<\/w:tbl>/g;
  var tm;
  while ((tm = tblRe.exec(xml)) !== null) tables.push(tm[0]);

  // Fallback 1: scan by header keywords (role/resource + name + rate/hour)
  for (var ti = 0; ti < tables.length; ti++) {
    var tblText = '';
    var wt = /<w:t[^>]*>([^<]*)<\/w:t>/g; var wm;
    while ((wm = wt.exec(tables[ti])) !== null) tblText += wm[1] + ' ';
    tblText = tblText.toLowerCase();
    if (!/(role|resource)/.test(tblText)) continue;
    if (!/name/.test(tblText)) continue;
    if (!/(rate|hour)/.test(tblText)) continue;
    var rows = _parseTableRows(tables[ti]);
    if (rows.length) return rows;
  }

  // Fallback 2: any table where rows have 4+ cols and col[3] looks like a dollar rate
  for (var ti = 0; ti < tables.length; ti++) {
    var rows = _parseTableRows(tables[ti]);
    var feeRows = rows.filter(function(cells) {
      return cells.length >= 4 && /^\$?\d+(\.\d{1,2})?$/.test((cells[3] || '').replace(/,/g, '').trim());
    });
    if (feeRows.length) return feeRows;
  }

  return [];
}

function stripSubconAddress(raw) {
  if (!raw) return raw;
  raw = raw.replace(/,?\s+with offices at.*/i, '');
  raw = raw.replace(/\s+\d+\s+\w.*$/, '');
  return raw.trim();
}

export function parseParagraphsSOW(paras) {
  var d = {Effecdate:'',MSA_Date:'',Subcon:'',Subconname:'',Custname:'',Projname:'',
    Proj_desc:'',Strtdate:'',Enddate:'',Total_Fee:'',Subpoc:'',Subpocemail:''};

  paras.forEach(function(p) {
    var t = p.replace(/\s+/g,' ').trim();

    // Para [1]: "...entered into as of EFFECDATE (the "Effective Date") by and between
    //   SUBCON ("Subcontractor") and Acquia Inc....dated as of MSA_DATE by and between..."

    // Effective date: text between "entered into as of" and "(the" / "("
    if (!d.Effecdate) {
      var m = t.match(/entered into as of ([^(]+?)\s*\(the\s*[\u201c"]?Effective Date/i);
      if (m) d.Effecdate = parseDateToISO(m[1].trim());
    }

    // Subcon address: everything between "between " and ' ("Subcontractor")'
    // e.g. "Axelerant Technologies, Inc. 68 Harrison Ave Ste 605 ... United States"
    if (!d.Subcon) {
      var m = t.match(/between\s+(.+?)\s*\([\u201c"]?Subcontractor[\u201d"]?\)/i);
      if (m) { d.Subcon = stripSubconAddress(m[1].trim()); d.Subconname = d.Subcon; }
    }

    // MSA_Date: "dated as of MSA_DATE by and between Subcontractor and Acquia"
    if (!d.MSA_Date) {
      var m = t.match(/dated as of\s+(.+?)\s+by and between Subcontractor/i);
      if (m) d.MSA_Date = parseDateToISO(m[1].trim().replace(/[\u201c\u201d"]/g,''));
    }

    // Para [2]: "Name of Project - PROJNAME (the "Project")"
    if (!d.Projname) {
      var m = t.match(/Name of Project\s*-\s*(.+?)\s*\(the\s*[\u201c"]?Project/i);
      if (m) d.Projname = m[1].trim();
    }

    // Para [3]: "Customer Name - CUSTNAME (the "Customer")"
    if (!d.Custname) {
      var m = t.match(/Customer Name\s*-\s*(.+?)\s*\(the\s*[\u201c"]?Customer/i);
      if (m) d.Custname = m[1].trim();
    }

    // Para [4]: "Description of Project.  PROJ_DESC"
    if (!d.Proj_desc) {
      var m = t.match(/Description of Project\.\s+(.+)/i);
      if (m) d.Proj_desc = m[1].trim();
    }

    // Para [107]: "The period of performance is STRTDATE to ENDDATE."
    if (!d.Strtdate || !d.Enddate) {
      var m = t.match(/period of performance is\s+(.+?)\s+to\s+(.+?)\.?$/i);
      if (m) { d.Strtdate = parseDateToISO(m[1]); d.Enddate = parseDateToISO(m[2]); }
    }

    // Para [133]: "not to exceed $TOTAL_FEE (the "Fees")"
    if (!d.Total_Fee) {
      var m = t.match(/not to exceed\s+\$?([\d,]+(?:\.\d{2})?)/i);
      if (m) d.Total_Fee = cleanAmount(m[1]);
    }

    // Para [116]: standalone email line -> Subpocemail
    if (!d.Subpocemail) {
      var m = t.match(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/);
      // Only take Subcontractor email, not Acquia's (geetali.sodhi@acquia.com)
      if (m && !m[1].includes('@acquia.com')) d.Subpocemail = m[1];
    }

    // Para [115]: "Firstname Lastname, Title" — Subcontractor POC name
    // Appears just before the email line and is NOT Acquia's contact
    if (!d.Subpoc) {
      var m = t.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\s*,\s*(?:CEO|CTO|COO|VP|Director|Manager|President|Lead|Founder|Head|Principal)/);
      if (m && !t.includes('Geetali') && !t.includes('acquia.com'))
        d.Subpoc = m[1].trim();
    }
    // Fallback: once we have the email, look for a name-only line nearby
    if (!d.Subpoc && d.Subpocemail) {
      var m = t.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)$/);
      if (m && !t.includes('Acquia') && !t.includes('Geetali'))
        d.Subpoc = m[1];
    }
  });

  return d;
}


export function parseTableRowsSOW(rows, strtdate, enddate) {
  // SOW fees table: [Role, Name, Hours, Rate, Total]  (or [Role, Name, Hours, Rate])
  // Returns CR-shaped rows so ResourcesEditorCR can display them directly
  return rows.map(function(cells) {
    var rawHours = parseFloat(cleanAmount(cells[2] || '')) || 0;
    var rate = cleanAmount(cells[3] || '');
    return {
      resource:   cells[0] || '',
      name:       cells[1] || '',
      rate:       rate,
      sowHours:   rawHours || '',
      sowPeriods: [{startDate: strtdate||'', endDate: enddate||'', hoursPerDay: rawHours ? String(rawHours) : '8', holidays:'0'}],
      crPeriods:  [{startDate: enddate||'',  endDate: '',          hoursPerDay:'8', holidays:'0'}]
    };
  }).filter(function(r){ return r.name || r.resource; });
}

export async function extractSOWData(file) {
  return safeExtract(async () => {
    var xml = await parseDocxXml(file);
    var paras = xmlParagraphs(xml);
    var d = parseParagraphsSOW(paras);
    var strt = d.Strtdate||d.Effecdate||'';
    var endt = d.Enddate||'';
    var feesRows = xmlFeesTableRows(xml);
    var resources = parseTableRowsSOW(feesRows, strt, endt);
    if (!resources.length) {
      resources = [{resource:'',name:'',rate:'',
        sowPeriods:[{startDate:strt,endDate:endt,hoursPerDay:'8',holidays:'0'}],
        crPeriods:[{startDate:endt,endDate:'',hoursPerDay:'8',holidays:'0'}]}];
    }
    return Object.assign({}, d, {resources: resources});
  }, 'extractSOWData');
}

// ── CR PARSER (matches DEFAULT_CR field names exactly) ───────────────────────
export function parseParagraphsCR(paras) {
  // Extracts: custname, req, projname, orgsow, crno, prevcrs,
  //           ogstdate, lenddate, enddate, exstdate,
  //           effimp, inchours, neffimp, prevtotbud, newbud, newtotbudget, workdays
  var d = {custname:'',req:'',projname:'',orgsow:'',crno:'',prevcrs:'',
    ogstdate:'',lenddate:'',enddate:'',exstdate:'',workdays:'',
    effimp:'',inchours:'',neffimp:'',prevtotbud:'',newbud:'',newtotbudget:''};

  paras.forEach(function(p) {
    var t = p.replace(/\s+/g,' ').trim();

    // "Consultant/Customer Name: VALUE"
    if (!d.custname) {
      var m = t.match(/^(?:Consultant\s*\/?\s*Customer\s*Name|Customer\s*Name)\s*[:\-]\s*([^:\s].+)/i);
      if (m) d.custname = m[1].trim().replace(/\.$/,'');
    }
    // "Requestor: VALUE"
    if (!d.req) {
      var m = t.match(/^Requestor\s*[:\-]\s*(.+)/i);
      if (m) d.req = m[1].trim().replace(/\.$/,'');
    }
    // "Name of Project: VALUE"  or  "Project Name: VALUE"
    if (!d.projname) {
      var m = t.match(/^(?:Name of Project|Project\s*Name)\s*[:\-]\s*([^:\s].+)/i);
      if (m) d.projname = m[1].trim();
    }
    // "Original Statement of Work Reference: VALUE"
    if (!d.orgsow) {
      var m = t.match(/^Original\s+(?:Statement of Work\s+)?(?:Reference|SOW|Ref\.?)\s*[:\-]\s*([^:\s].+)/i);
      if (m) d.orgsow = m[1].trim();
    }
    // "Change Request #: VALUE"  or  "CR No.: VALUE"
    if (!d.crno) {
      var m = t.match(/^(?:Change Request\s*#|CR\s*(?:No\.?|Number|#))\s*[:\-]\s*([^:\s].+)/i);
      if (m) d.crno = m[1].trim();
    }
    // "Previous Change Requests: VALUE"
    if (!d.prevcrs) {
      var m = t.match(/^Previous\s+Change\s+Requests?\s*[:\-]\s*(.+)/i);
      if (m) d.prevcrs = m[1].trim();
    }

    // "Original number of hours of EFFIMP hours (SOW)"  — from Project Impact section
    if (!d.effimp) {
      var m = t.match(/[Oo]riginal\s+number\s+of\s+hours\s+of\s+([\d.,]+)/i);
      if (m) d.effimp = m[1].replace(/,/g,'');
    }
    // "Section 10. Delivery Timeline" context lines:
    // "The original end date was LENDDATE"
    if (!d.lenddate) {
      var m = t.match(/original\s+end\s+date\s+was\s+(.+?)(?:;|\.$|$)/i);
      if (m) d.lenddate = parseDateToISO(m[1].replace(/,\s*$/,'').trim());
    }
    // "The period is being extended to ENDDATE"  or  "new end date of ENDDATE"
    if (!d.enddate) {
      var m = t.match(/(?:extended\s+to|new\s+end\s+date\s+(?:of|is))\s+([A-Za-z0-9 ,]+\d{4})/i);
      if (m) d.enddate = parseDateToISO(m[1].trim());
    }
    // "Original Start Date: DATE"
    if (!d.ogstdate) {
      var m = t.match(/[Oo]riginal\s+[Ss]tart\s*[Dd]ate\s*[:\-]\s*(.+)/i);
      if (m) d.ogstdate = parseDateToISO(m[1].trim());
    }
    // "Section 10. Delivery Timeline: The period of performance is DATE to DATE"
    if (!d.ogstdate || !d.enddate) {
      var m = t.match(/period\s+of\s+performance\s+is\s+(.+?)\s+to\s+([\w ,]+\d{4})/i);
      if (m) {
        if (!d.ogstdate) d.ogstdate = parseDateToISO(m[1].replace(/,\s*$/,'').trim());
        if (!d.enddate)  d.enddate  = parseDateToISO(m[2].replace(/[.,]+$/,'').trim());
      }
    }
    // "Effective Date: DATE"  (CR effective date = exstdate)
    if (!d.exstdate) {
      var m = t.match(/^[Ee]ffective\s*[Dd]ate\s*(?:of\s+CR)?\s*[:\-]\s*(.+)/i);
      if (m) d.exstdate = parseDateToISO(m[1].trim());
    }
    // "Working days added: N"
    if (!d.workdays) {
      var m = t.match(/[Ww]ork(?:ing)?\s+[Dd]ays?\s+(?:[Aa]dded\s*)?[:\-]?\s*(\d+)/i)
             || t.match(/(\d+)\s+[Dd]ays?\s+[Aa]dded/i);
      if (m) d.workdays = m[1];
    }
    // "The Change Request increases the budget by $NEWBUD"
    if (!d.newbud) {
      var m = t.match(/increases?\s+the\s+budget\s+by\s+\$?([\d,]+(?:\.\d{2})?)/i);
      if (m) d.newbud = cleanAmount(m[1]);
    }
    // "not to exceed $NEWTOTBUDGET"  (new total budget)
    if (!d.newtotbudget) {
      var m = t.match(/not\s+to\s+exceed\s+\$?([\d,]+(?:\.\d{2})?)/i)
             || t.match(/final\s+budget\s+to\s+\$?([\d,]+(?:\.\d{2})?)/i);
      if (m) d.newtotbudget = cleanAmount(m[1]);
    }
    // "previous total budget of $PREVTOTBUD"  or budget label patterns
    if (!d.prevtotbud) {
      var m = t.match(/[Pp]revious\s+(?:[Tt]otal\s+)?[Bb]udget\s+(?:of\s+|was\s+|[:\-]\s*)\$?([\d,]+(?:\.\d{2})?)/i)
             || t.match(/[Oo]riginal\s+[Bb]udget\s+was\s+\$?([\d,]+(?:\.\d{2})?)/i);
      if (m) d.prevtotbud = cleanAmount(m[1].replace(/,$/,''));
    }
    // Inchours: "additional CR hours of INCHOURS"
    if (!d.inchours) {
      var m = t.match(/[Aa]dditional\s+(?:CR\s+)?[Hh]ours?\s+(?:of\s+)?([\d.,]+)/i)
             || t.match(/increased\s+by\s+([\d,]+)\s+hours?/i);
      if (m) d.inchours = m[1].replace(/,/g,'');
    }
    // Neffimp: "new total hours of NEFFIMP" or "New Total Hour: N"
    if (!d.neffimp) {
      var m = t.match(/[Nn]ew\s+[Tt]otal\s+(?:[Hh]ours?\s+)?(?:of\s+|[:\-]\s*)?([\d.,]+)\s*[Hh]ours?/i);
      if (m) d.neffimp = m[1].replace(/,/g,'');
    }
  });

  return d;
}

export function parseTableRowsCR(rows, ogstdate, lenddate) {
  // CR resources table: [Resource, Name, SOW Hrs, CR Hrs, Total Hrs, Rate, Total Budget] (7 cols)
  // Shorter variants: 6=[Resource,Name,SOW Hrs,CR Hrs,Rate,Total], 4=[Resource,Name,Hrs,Rate]
  return rows.map(function(cells) {
    var rate = '', sowHours = '';
    if (cells.length >= 7) {
      sowHours = cleanAmount(cells[2]); // SOW Hrs column
      rate     = cleanAmount(cells[5]);
    } else if (cells.length >= 6) {
      sowHours = cleanAmount(cells[2]); // SOW Hrs column
      rate     = cleanAmount(cells[4]);
    } else if (cells.length >= 5) {
      rate     = cleanAmount(cells[4]);
    } else if (cells.length >= 4) {
      sowHours = cleanAmount(cells[2]); // Hrs column
      rate     = cleanAmount(cells[3]);
    }
    return {
      resource:     cells[0] || '',
      name:         cells[1] || '',
      rate:         rate,
      sowHours:     sowHours,
      sowPeriods:   [{startDate: ogstdate||'', endDate: lenddate||'', hoursPerDay:'8', holidays:'0'}],
      crPeriods:    [{startDate: lenddate||'', endDate: '', hoursPerDay:'8', holidays:'0'}]
    };
  }).filter(function(r){ return r.name || r.resource; });
}

export function parseTableFieldsCR(xml) {
  var result = {};
  var labelMap = {
    'consultant/customer name':              'custname',
    'customer name':                        'custname',
    'requestor':                            'req',
    'original statement of work reference': 'orgsow',
    'original sow reference':               'orgsow',
    'sow reference':                        'orgsow',
    'name of project':                      'projname',
    'project name':                         'projname',
    'previous change requests':             'prevcrs',
    'change request #':                     'crno',
    'change request number':                'crno',
    'cr no.':                               'crno',
    'cr #':                                 'crno'
  };
  var trRe = /<w:tr[ >][\s\S]*?<\/w:tr>/g;
  var m;
  while ((m = trRe.exec(xml)) !== null) {
    var cells = [];
    var tcRe = /<w:tc>[\s\S]*?<\/w:tc>/g; var tc;
    while ((tc = tcRe.exec(m[0])) !== null) {
      var tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g; var cell = ''; var tt;
      while ((tt = tRe.exec(tc[0])) !== null) cell += tt[1];
      cells.push(cell.trim());
    }
    if (cells.length >= 2) {
      var label = cells[0].replace(/:$/, '').trim().toLowerCase();
      var value = cells[1].trim();
      if (value && !value.startsWith('{') && labelMap[label]) {
        result[labelMap[label]] = unesc(value).replace(/\.$/,'');
      }
    }
  }
  return result;
}

export async function extractCRData(file) {
  return safeExtract(async () => {
    var xml = await parseDocxXml(file);
    var paras = xmlParagraphs(xml);
    var d = parseParagraphsCR(paras);
    var tableFields = parseTableFieldsCR(xml);
    Object.keys(tableFields).forEach(function(k) { if (tableFields[k]) d[k] = tableFields[k]; });
    if (d.custname) d.custname = d.custname.replace(/\s*\([“”]?Subcontractor[“”]?\)/gi, '').trim().replace(/\.$/,'');
    var rawRows = xmlCRResourceRows(xml);
    var resources = parseTableRowsCR(rawRows, d.ogstdate, d.lenddate||d.enddate);
    if (!resources.length) {
      resources = [{resource:'',name:'',rate:'',
        sowPeriods:[{startDate:d.ogstdate||'',endDate:d.lenddate||'',hoursPerDay:'8',holidays:'0'}],
        crPeriods:[{startDate:d.lenddate||'',endDate:'',hoursPerDay:'8',holidays:'0'}]}];
    }
    return Object.assign({}, d, {resources: resources});
  }, 'extractCRData');
}

// ── PDF.js loader ─────────────────────────────────────────────────────────────
var _pdfJsLoading = null;
export function loadPDFJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfJsLoading) return _pdfJsLoading;
  _pdfJsLoading = new Promise(function(resolve, reject) {
    var sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    sc.onload = function() {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    sc.onerror = function(e) { _pdfJsLoading = null; reject(e); };
    document.head.appendChild(sc);
  });
  return _pdfJsLoading;
}

export async function pdfToLines(file) {
  var lib = await loadPDFJs();
  var buf = await new Promise(function(res,rej){
    var fr=new FileReader(); fr.onload=function(){res(fr.result);}; fr.onerror=rej; fr.readAsArrayBuffer(file);
  });
  var pdf = await lib.getDocument({data: buf}).promise;
  var text = '';
  for (var i = 1; i <= pdf.numPages; i++) {
    var page = await pdf.getPage(i);
    var content = await page.getTextContent();
    var lineMap = {};
    content.items.forEach(function(item) {
      var y = Math.round(item.transform[5] / 4) * 4; // 4pt buckets: tolerates sub-pixel Y drift within a line; safe since typical line pitch ≥12pt
      if (!lineMap[y]) lineMap[y] = [];
      lineMap[y].push({x: item.transform[4], str: item.str, width: item.width || 0});
    });
    Object.keys(lineMap).map(Number).sort(function(a,b){return b-a;}).forEach(function(y){
      var sorted = lineMap[y].sort(function(a,b){return a.x-b.x;});
      var line = '';
      for (var k = 0; k < sorted.length; k++) {
        if (k === 0) { line = sorted[k].str; continue; }
        var prev = sorted[k-1];
        var gap = sorted[k].x - (prev.x + prev.width);
        // Only insert a space when there is a meaningful gap between items
        line += (gap > 2 ? ' ' : '') + sorted[k].str;
      }
      line = line.trim();
      if (line) text += line + '\n';
    });
  }
  return text.split('\n').map(function(l){return l.trim().replace(/  +/g,' ');}).filter(Boolean);
}

export function pdfTableRowsSOW(lines, strtdate, enddate) {
  // Find the fees section: between "not to exceed" and "Invoicing."
  // PDF.js joins each table row into one space-separated line by Y-coordinate.
  // Row format: "Role Name Hours $Rate Total"  e.g. "Drupal Developer Jane Smith 160.0 $150 24,000.00"

  var feesStart = -1, feesEnd = -1;
  for (var i = 0; i < lines.length; i++) {
    if (feesStart < 0 && /not to exceed\s+\$?[\d,]+/i.test(lines[i])) { feesStart = i; }
    if (feesStart >= 0 && /invoicing|section\s+13/i.test(lines[i])) { feesEnd = i; break; }
  }
  if (feesStart < 0) return [];
  if (feesEnd < 0) feesEnd = Math.min(feesStart + 60, lines.length);

  // Find header row — try single-line match first, then check 3-line window
  var headerIdx = -1;
  for (var i = feesStart; i < feesEnd; i++) {
    var combined3 = (lines[i] + ' ' + (lines[i+1]||'') + ' ' + (lines[i+2]||'')).toLowerCase();
    if (/(role|resource)/.test(combined3) && /name/.test(combined3) && /(rate|hour)/.test(combined3)) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx < 0) return [];

  var rows = [];
  for (var i = headerIdx + 1; i < feesEnd; i++) {
    var t = lines[i].trim();
    if (!t) continue;
    if (/^(invoicing|expenses|payment|change management)/i.test(t)) break;

    // Tokenise the line
    var tokens = t.split(/\s+/);
    if (tokens.length < 3) continue;

    // Last token is always the total (e.g. "$600.00" or "$11,520.00"); skip it when finding rate.
    // Rate: integer or simple decimal with no comma (e.g. "$30", "$150", "$125.00")
    var rateIdx = -1;
    for (var j = tokens.length - 2; j >= 1; j--) {
      var tok = tokens[j].replace(/^\$/, '');
      if (/^\d+(\.\d{1,2})?$/.test(tok)) {
        rateIdx = j;
        break;
      }
    }
    if (rateIdx < 0) continue;

    var rate = tokens[rateIdx].replace(/^\$/, '');

    // Find hours token just before rate: float like "20.0" or "384.0"
    var hoursIdx = -1;
    for (var j = rateIdx - 1; j >= 0; j--) {
      if (/^\d+(\.\d{1,2})?$/.test(tokens[j])) { hoursIdx = j; break; }
    }

    // Name: last 2 capitalised tokens before hours (or rate if no hours found)
    var nameEnd = hoursIdx >= 0 ? hoursIdx : rateIdx;
    var nameParts = [];
    var roleEnd = 0;
    for (var j = nameEnd - 1; j >= 0; j--) {
      if (/^[A-Z][a-zA-Z'\-]+$/.test(tokens[j]) && nameParts.length < 2) {
        nameParts.unshift(tokens[j]);
      } else {
        roleEnd = j + 1;
        break;
      }
    }
    if (!nameParts.length) continue;

    var name     = nameParts.join(' ');
    var resource = tokens.slice(0, roleEnd).join(' ');
    if (!resource && roleEnd === 0) {
      resource = tokens.slice(0, nameEnd - nameParts.length).join(' ');
    }

    rows.push({
      resource:   resource,
      name:       name,
      rate:       rate,
      sowHours:   hoursIdx >= 0 ? String(parseFloat(tokens[hoursIdx])) : '',
      sowPeriods: [{startDate: strtdate||'', endDate: enddate||'', hoursPerDay:'8', holidays:'0'}],
      crPeriods:  [{startDate: enddate||'',  endDate: '',          hoursPerDay:'8', holidays:'0'}]
    });
  }
  return rows;
}

export async function extractSOWDataFromPDF(file) {
  return safeExtract(async () => {
    var lines = await pdfToLines(file);
    var d = parseParagraphsSOW(lines);

    // Multi-line subcon: “between” ends one line, subcon name starts next
    if (!d.Subcon) {
      for (var i = 0; i < lines.length - 1; i++) {
        if (/by and between\s*$/i.test(lines[i])) {
          var next = lines[i + 1] || '';
          var sm = next.match(/^(.+?)\s*\([“'”]?Subcontractor/i);
          d.Subcon = stripSubconAddress(sm ? sm[1].trim() : next.trim());
          if (d.Subcon) break;
        }
      }
    }

    var strt = d.Strtdate||d.Effecdate||'';
    var endt = d.Enddate||'';
    var resources = pdfTableRowsSOW(lines, strt, endt);
    if (!resources.length) {
      resources = [{resource:'',name:'',rate:'',
        sowPeriods:[{startDate:strt,endDate:endt,hoursPerDay:'8',holidays:'0'}],
        crPeriods:[{startDate:endt,endDate:'',hoursPerDay:'8',holidays:'0'}]}];
    }
    return Object.assign({}, d, {resources: resources});
  }, 'extractSOWDataFromPDF');
}


export function pdfTableRowsCR(lines, ogstdate, lenddate) {
  var impactIdx = lines.length;
  for (var i = 0; i < lines.length; i++) {
    if (/^project impact/i.test(lines[i])) { impactIdx = i; break; }
  }
  var headerIdx = -1;
  for (var i = 0; i < lines.length; i++) {
    if (/resource/i.test(lines[i]) && /name/i.test(lines[i]) && /hour/i.test(lines[i])) { headerIdx = i; break; }
  }
  var searchFrom = headerIdx >= 0 ? headerIdx + 1 : 0;
  var rows = [];

  for (var i = searchFrom; i < impactIdx; i++) {
    var t = lines[i].trim();
    if (!t) continue;
    if (/^(?:resource|name|current hours?|additional cr|new total|rate|budget|\(sow\))\s*$/i.test(t)) continue;
    if (/^resources? table$/i.test(t)) continue;
    if (/acquia\s*\/|confidential/i.test(t) || /^\d+$/.test(t)) continue;
    if (/not to exceed|budget|increases|original/i.test(t)) continue;

    var hasDollar = /\$[\d,]+/.test(t);
    var numbers   = (t.match(/\b\d{3,}\b/g) || []);
    if (!hasDollar || numbers.length < 2) continue;

    var tokens = t.split(/\s+/);
    var dollarIdxs = [];
    for (var j = 0; j < tokens.length; j++) {
      if (/^\$[\d,]+$/.test(tokens[j])) dollarIdxs.push(j);
    }
    if (!dollarIdxs.length) continue;
    var rateTokenIdx = dollarIdxs.length >= 2 ? dollarIdxs[dollarIdxs.length - 2] : dollarIdxs[0];
    var rate = tokens[rateTokenIdx].replace(/^\$/, '').replace(/,/g, '');

    var numStartIdx = rateTokenIdx;
    while (numStartIdx > 0 && /^[\d,\.]+$/.test(tokens[numStartIdx - 1])) numStartIdx--;

    var textTokens = tokens.slice(0, numStartIdx);
    var nameParts = [], cutAt = textTokens.length;
    for (var j = textTokens.length - 1; j >= 0; j--) {
      if (/^[A-Z][a-zA-Z'\-]+$/.test(textTokens[j]) && nameParts.length < 2) {
        nameParts.unshift(textTokens[j]); cutAt = j;
      } else break;
    }
    var name     = nameParts.join(' ');
    var resource = textTokens.slice(0, cutAt).join(' ');
    if (!name && !resource) continue;

    var numTokens = tokens.slice(numStartIdx, rateTokenIdx).filter(function(t){ return /^[\d,\.]+$/.test(t); });
    var sowHours = numTokens.length ? cleanAmount(numTokens[numTokens.length - 1]) : '';
    rows.push({
      resource:   resource,
      name:       name,
      rate:       rate,
      sowHours:   sowHours,
      sowPeriods: [{startDate: ogstdate||'', endDate: lenddate||'', hoursPerDay:'8', holidays:'0'}],
      crPeriods:  [{startDate: lenddate||'',  endDate: '',           hoursPerDay:'8', holidays:'0'}]
    });
  }
  return rows;
}

export async function extractCRDataFromPDF(file) {
  return safeExtract(async () => {
  var lines = await pdfToLines(file);

  var d = {
    custname:'', req:'', projname:'', orgsow:'', crno:'', prevcrs:'',
    ogstdate:'', lenddate:'', enddate:'', exstdate:'', workdays:'',
    effimp:'', inchours:'', neffimp:'', prevtotbud:'', newbud:'', newtotbudget:'',
    resources:[]
  };

  function isLabel(t) {
    return /^(?:Consultant\/?Customer\s*Name|Requestor|Original Statement of Work Reference|Name of Project|Previous Change Requests|Change Request #)\s*[:\-]?\s*$/i.test(t);
  }
  function isSectionHeader(t) {
    return /^(?:Project Information|Description of Change|Details of Change|Resources? Table|Project Impact)/i.test(t);
  }

  var i = 0;
  while (i < lines.length) {
    var t        = unesc(lines[i]).trim();
    var next     = unesc(lines[i+1]||'').trim();
    var prev     = unesc(i>0 ? lines[i-1] : '').trim();
    var m;

    // ── Inline "Label: Value" ──
    if (!d.custname) {
      m = t.match(/^Consultant\s*\/?\s*Customer\s*Name\s*[:\-]\s*(.+)/i);
      if (m) { d.custname = m[1].trim().replace(/\.$/,''); i++; continue; }
    }
    if (!d.req) {
      m = t.match(/^Requestor\s*[:\-]\s*(.+)/i);
      if (m) {
        var val = m[1].trim(), j = i+1;
        while (j < lines.length && lines[j] &&
               !/^(?:Original Statement|Name of Project|Previous Change|Change Request #|Description)/i.test(lines[j])) {
          var nxt = lines[j].trim();
          if (/^[A-Z][a-z].*:\s*$/.test(nxt)) break;
          val += ' ' + nxt; j++;
        }
        d.req = val.replace(/\.$/,''); i = j; continue;
      }
    }
    if (!d.orgsow) {
      m = t.match(/^Original Statement of Work Reference\s*[:\-]\s*(.+)/i);
      if (m) { d.orgsow = m[1].trim(); i++; continue; }
    }
    if (!d.projname) {
      m = t.match(/^Name of Project\s*[:\-]\s*(.+)/i);
      if (m) { d.projname = m[1].trim(); i++; continue; }
    }
    if (!d.crno) {
      m = t.match(/^Change Request\s*#\s*[:\-]\s*(.+)/i);
      if (m) { d.crno = m[1].trim(); i++; continue; }
    }
    if (!d.prevcrs) {
      m = t.match(/^Previous Change Requests\s*[:\-]\s*(.*)/i);
      if (m) {
        var parts = m[1].trim() ? [m[1].trim().replace(/,$/,'')] : [];
        var j = i+1;
        while (j < lines.length) {
          var nxt = lines[j].trim();
          if (/^(?:Change Request #|Description of Change|Details of Change)/i.test(nxt)) break;
          if (/^(?:Section \d|Acquia|Confidential)/i.test(nxt)) break;
          if (/^\d+$/.test(nxt)) break;
          if (!nxt) { j++; continue; }
          parts.push(nxt.replace(/,$/,'')); j++;
        }
        d.prevcrs = parts.join(', '); i = j; continue;
      }
    }

    // ── Split label: value on PREVIOUS line (PDF sometimes renders value above label) ──
    if (!d.custname && /^Consultant\s*\/?\s*Customer\s*Name\s*:?\s*$/i.test(t)) {
      if (prev && !isLabel(prev) && !isSectionHeader(prev)) { d.custname = prev.replace(/\.$/,''); i++; continue; }
      if (next && !isLabel(next) && !isSectionHeader(next)) { d.custname = next.replace(/\.$/,''); i+=2; continue; }
    }
    if (!d.projname && /^Name of Project\s*:?\s*$/i.test(t)) {
      if (prev && !isLabel(prev) && !isSectionHeader(prev)) { d.projname = prev; i++; continue; }
      if (next && !isLabel(next) && !isSectionHeader(next)) { d.projname = next; i+=2; continue; }
    }

    // ── Section 10: timeline (may wrap) ──
    if (!d.ogstdate) {
      var combined = t + ' ' + next;
      m = combined.match(/period of performance is (.+?) to (.+?)[\.,]?\s*$/i);
      if (m) {
        d.ogstdate = parseDateToISO(m[1].trim());
        var rawEnd = m[2].replace(/[\.,]+$/,'').trim();
        if (rawEnd && !/\d{4}/.test(rawEnd)) {
          var ym = ((lines[i+2]||'').trim()).match(/(\d{4})/);
          if (ym) rawEnd += ' ' + ym[1];
        }
        d.enddate = parseDateToISO(rawEnd);
        i += 2; continue;
      }
    }

    // ── Section 13: fee cap ──
    if (!d.newtotbudget) {
      m = (t + ' ' + next).match(/not to exceed\s+\$?([\d,]+)/i);
      if (m) d.newtotbudget = m[1].replace(/,/g,'');
    }

    // ── Effective date ──
    if (!d.exstdate) {
      m = (t + ' ' + next).match(/effective from\s+(.+?),?\s*$/i);
      if (m) d.exstdate = parseDateToISO(m[1].replace(/,$/,'').trim());
    }

    // ── Effort Impact ──
    if (!d.effimp) {
      m = (t + ' ' + next).match(/hours of\s*([\d,]+)\s*hours?\s+is increased by\s*([\d,]+)\s*hours?\s+for a new total of\s*([\d,]+)/i);
      if (m) { d.effimp=m[1].replace(/,/g,''); d.inchours=m[2].replace(/,/g,''); d.neffimp=m[3].replace(/,/g,''); }
    }

    // ── Timeline Impact ──
    if (!d.lenddate) {
      m = (t + ' ' + next).match(/original end date was\s+(.+?);\s*([\d]+)\s*days added/i);
      if (m) { d.lenddate=parseDateToISO(m[1].trim()); d.workdays=m[2].trim(); }
    }

    // ── Budget Impact ──
    var combined2 = t + ' ' + next;
    if (!d.newbud)     { m=combined2.match(/increases the budget by\s+\$?([\d,]+)/i);     if(m) d.newbud=m[1].replace(/,/g,''); }
    if (!d.prevtotbud) { m=combined2.match(/original Budget was\s+\$?([\d,]+)/i);          if(m) d.prevtotbud=m[1].replace(/,/g,''); }
    if (!d.newtotbudget){ m=combined2.match(/final budget to\s+\$?([\d,]+)/i);             if(m) d.newtotbudget=m[1].replace(/,/g,''); }

    i++;
  }

  if (d.custname) d.custname = d.custname.replace(/\s*\([""]?Subcontractor[""]?\)/gi, '').trim().replace(/\.$/,'');
  var resources = pdfTableRowsCR(lines, d.ogstdate, d.lenddate || d.enddate);
  if (!resources.length) {
    resources = [{resource:'', name:'', rate:'',
      sowPeriods:[{startDate:d.ogstdate||'', endDate:d.lenddate||'', hoursPerDay:'8', holidays:'0'}],
      crPeriods: [{startDate:d.lenddate||'', endDate:'',             hoursPerDay:'8', holidays:'0'}]}];
  }
  d.resources = resources;
  return d;
  }, 'extractCRDataFromPDF');
}


// ── Confidence scoring ────────────────────────────────────────────────────────
function isISO(v) { return !!(v && /^\d{4}-\d{2}-\d{2}$/.test(v)); }
function isNum(v) { return !!(v && /^\d+(\.\d+)?$/.test(String(v).trim())); }
function hasRows(r) { return !!(r && r.length > 0 && (r[0].name || r[0].resource)); }

export function scoreSOWConfidence(extracted, resolvedSubcon) {
  return {
    subcon:     resolvedSubcon ? 'high' : extracted.Subcon ? 'medium' : 'low',
    req:        extracted.Custname ? 'high' : 'low',
    projname:   extracted.Projname ? 'high' : 'low',
    ogstdate:   isISO(extracted.Strtdate) ? 'high' : extracted.Strtdate ? 'medium' : 'low',
    lenddate:   isISO(extracted.Enddate)  ? 'high' : extracted.Enddate  ? 'medium' : 'low',
    prevtotbud: isNum(extracted.Total_Fee) ? 'high' : extracted.Total_Fee ? 'medium' : 'low',
    resources:  hasRows(extracted.resources) ? 'high' : 'low',
  };
}

export function scoreCRConfidence(extracted) {
  return {
    custname:     extracted.custname  ? 'high' : 'low',
    req:          extracted.req       ? 'high' : 'low',
    reqpoc:       extracted.reqpoc    ? 'high' : 'low',
    projname:     extracted.projname  ? 'high' : 'low',
    orgsow:       extracted.orgsow    ? 'medium' : 'low',
    crno:         extracted.crno      ? 'high' : 'low',
    prevcrs:      extracted.prevcrs   ? 'medium' : 'low',
    ogstdate:     isISO(extracted.ogstdate)  ? 'high' : extracted.ogstdate  ? 'medium' : 'low',
    lenddate:     isISO(extracted.lenddate)  ? 'high' : extracted.lenddate  ? 'medium' : 'low',
    enddate:      isISO(extracted.enddate)   ? 'high' : extracted.enddate   ? 'medium' : 'low',
    prevtotbud:   isNum(extracted.prevtotbud)   ? 'high' : extracted.prevtotbud   ? 'medium' : 'low',
    newtotbudget: isNum(extracted.newtotbudget) ? 'high' : extracted.newtotbudget ? 'medium' : 'low',
    effimp:       isNum(extracted.effimp) ? 'high' : extracted.effimp ? 'medium' : 'low',
    resources:    hasRows(extracted.resources) ? 'high' : 'low',
  };
}

// ─── END EXTRACTORS ───────────────────────────────────────────────────────────

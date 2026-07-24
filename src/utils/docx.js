import { fmt, calcCRSowHours, calcCRCrHours, calcCRTotalHours, calcResourceHours, DEFAULT_CR_PURPOSE, alnum } from "./dates.js";

function fmtUSD(val) {
  if (val == null || val === '') return val;
  const n = parseFloat(String(val).replace(/[$,\s]/g, ''));
  if (isNaN(n)) return val;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function buildCRReplacements(data) {
  const d = (v) => v ? fmt(v) : '';
  return {
    custname:        data.custname,
    subcon:          data.subcon,
    reqname:         data.req,
    reqpoc:          alnum(data.reqpoc),
    orgsow:          data.orgsow,
    projname:        data.projname,
    prevcrs:         data.prevcrs || 'None',
    crno:            data.crno,
    acquiaprojid:    alnum(data.acquiaprojid),
    psprogmgr:       alnum(data.psprogmgr),
    ogstdate:        d(data.ogstdate),
    enddate:         d(data.enddate),
    lenddate:        d(data.lenddate),
    workdays:        data.workdays,
    effimp:          data.effimp,
    inchours:        data.inchours,
    neffimp:         data.neffimp,
    purpose:         data.purpose || DEFAULT_CR_PURPOSE,
    detailsofchange: data.detailsofchange || '',
    prevtotbud:      fmtUSD(data.prevtotbud),
    newbud:          fmtUSD(data.newbud),
    newtotbudget:    fmtUSD(data.newtotbudget),
    exstdate:        d(data.exstdate),
    resplaceholder:  '__CR_RESOURCES_TABLE__',
    _rawCRResources: data.resources,
  };
}

export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function loadJSZip() {
  const JSZipModule = await import("jszip");
  return JSZipModule.default;
}

export function esc(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  return String(str || "").replace(/[&<>"]/g, c => map[c]);
}

const _unescMap = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ' };
export function unesc(str) {
  return (str || '').replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);/g, m => _unescMap[m] ?? m);
}

// Build a single table cell with the same styling as the CR template row
function crCell(text, bold = false) {
  const fontDecl = `<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/>`;
  const boldDecl = bold ? `<w:b w:val="1"/><w:bCs w:val="1"/>` : ``;
  const szDecl = `<w:sz w:val="20"/><w:szCs w:val="20"/>`;
  const rpr = `<w:rPr>${fontDecl}${boldDecl}${szDecl}<w:rtl w:val="0"/></w:rPr>`;
  const pprRpr = `<w:rPr>${fontDecl}${szDecl}</w:rPr>`;
  return `<w:tc><w:tcPr><w:shd w:fill="auto" w:val="clear"/><w:tcMar><w:top w:w="100.0" w:type="dxa"/><w:left w:w="100.0" w:type="dxa"/><w:bottom w:w="100.0" w:type="dxa"/><w:right w:w="100.0" w:type="dxa"/></w:tcMar><w:vAlign w:val="top"/></w:tcPr><w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w14:paraId="00000099"><w:pPr><w:widowControl w:val="0"/><w:spacing w:line="240" w:lineRule="auto"/>${pprRpr}</w:pPr><w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000">${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p></w:tc>`;
}

// Build a full CR resource row from resource data
export function buildCRRow(r, idx) {
  const sowHrs = calcCRSowHours(r);
  const crHrs = calcCRCrHours(r);
  const totHrs = sowHrs + crHrs;
  const sowStr = sowHrs > 0 ? Number(sowHrs).toFixed(1) : "0";
  const crStr = crHrs > 0 ? Number(crHrs).toFixed(1) : "0";
  const totStr = totHrs > 0 ? Number(totHrs).toFixed(1) : "0";
  const total = r.rate
    ? (totHrs * Number(r.rate)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : r.totalBudget || "0";
  return `<w:tr w:rsidR="00000000" w:rsidDel="00000000" w:rsidRPr="00000000" w:rsidTr="00000000" w14:paraId="${String(idx + 200).padStart(8, "0")}"><w:trPr><w:cantSplit w:val="0"/><w:tblHeader w:val="0"/></w:trPr>${crCell(r.resource || "")}${crCell(r.name || "")}${crCell(sowStr)}${crCell(crStr)}${crCell(totStr, true)}${crCell(r.rate ? `$${r.rate}` : "")}${crCell('$' + total, true)}</w:tr>`;
}

// Build SOW resources table replacing the {{Resources}} paragraph
export function buildSOWResourcesTable(resources) {
  const filled = resources.filter(r => r.name || r.role);
  if (!filled.length) return "";
  const AF = `<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/>`;
  const hCell = text => `<w:tc><w:tcPr><w:shd w:fill="4A80C0" w:val="clear"/></w:tcPr><w:p><w:pPr><w:rPr>${AF}<w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:pPr><w:r><w:rPr>${AF}<w:b/><w:color w:val="FFFFFF"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t>${esc(text)}</w:t></w:r></w:p></w:tc>`;
  const dCell = (text, bold = false) => {
    const rpr = bold ? `${AF}<w:b/><w:sz w:val="18"/><w:szCs w:val="18"/>` : `${AF}<w:sz w:val="18"/><w:szCs w:val="18"/>`;
    return `<w:tc><w:tcPr><w:shd w:fill="auto" w:val="clear"/></w:tcPr><w:p><w:pPr><w:rPr>${AF}<w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:pPr><w:r><w:rPr>${rpr}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p></w:tc>`;
  };
  const headerRow = `<w:tr><w:trPr><w:tblHeader/></w:trPr>${hCell("Role")}${hCell("Name")}${hCell("Hours")}${hCell("Rate (USD/hr)")}${hCell("Total")}</w:tr>`;
  const dataRows = filled.map((r, i) => {
    const hours = calcResourceHours(r);
    const hoursStr = hours > 0 ? Number(hours).toFixed(1) : "";
    const rowTotal = hours && r.rate
      ? (hours * Number(r.rate)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "";
    return `<w:tr w14:paraId="${String(i + 500).padStart(8, "0")}">${dCell(r.role || "")}${dCell(r.name || "")}${dCell(hoursStr)}${dCell(r.rate ? `$${r.rate}` : "")}${dCell(rowTotal ? "$" + rowTotal : "", true)}</w:tr>`;
  }).join("");
  return `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="9360" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/><w:left w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/><w:right w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="AAAAAA"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="2200"/><w:gridCol w:w="2200"/><w:gridCol w:w="1200"/><w:gridCol w:w="1800"/><w:gridCol w:w="1960"/></w:tblGrid>${headerRow}${dataRows}</w:tbl>`;
}

export function injectBoldRun(xml, placeholder, text) {
  const ph = `{{${placeholder}}}`;
  const phIdx = xml.indexOf(ph);
  if (phIdx < 0) return xml;
  let rStart = phIdx;
  while (rStart > 0) {
    rStart--;
    if (xml[rStart] === '<' && xml.slice(rStart, rStart + 4) === '<w:r' && (xml[rStart + 4] === ' ' || xml[rStart + 4] === '>')) break;
  }
  const rEnd = xml.indexOf('</w:r>', phIdx) + 6;
  const runXml = xml.slice(rStart, rEnd);
  const rPrMatch = runXml.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/);
  const innerRPr = rPrMatch ? rPrMatch[1].replace(/<w:b[^/]*\/>/g, '') : '';
  const boldRPr = `<w:rPr>${innerRPr}<w:b/></w:rPr>`;
  const plainRPr = rPrMatch ? `<w:rPr>${innerRPr}</w:rPr>` : '';
  const tMatch = runXml.match(/<w:t([^>]*)>([\s\S]*?)<\/w:t>/);
  if (!tMatch) return xml;
  const tAttrs = tMatch[1];
  const tContent = tMatch[2];
  const splitAt = tContent.indexOf(ph);
  const pre = tContent.slice(0, splitAt);
  const suf = tContent.slice(splitAt + ph.length);
  let repl = '';
  if (pre) repl += `<w:r>${plainRPr}<w:t${tAttrs}>${pre}</w:t></w:r>`;
  repl += `<w:r>${boldRPr}<w:t>${esc(text)}</w:t></w:r>`;
  if (suf) repl += `<w:r>${plainRPr}<w:t xml:space="preserve">${suf}</w:t></w:r>`;
  return xml.slice(0, rStart) + repl + xml.slice(rEnd);
}

// ─── Rich text (TipTap HTML) → OOXML ──────────────────────────────────────────
// Converts the Details-of-Change editor HTML into Word paragraphs/runs.
// Supports: p, h1-h6, ul/ol/li (nested), strong/b, em/i, u, s/strike/del, a, br, span, code.
// ponytail: lists use literal bullet/number prefixes + hanging indent instead of a Word
//   numbering.xml part — renders identically for static CR content and avoids numbering hazards.
const DOC_FONT = '<w:rFonts w:ascii="Proxima Nova" w:cs="Proxima Nova" w:eastAsia="Proxima Nova" w:hAnsi="Proxima Nova"/>';
const VOID_TAGS = new Set(['br', 'img', 'hr', 'col', 'input']);

function parseHtmlNodes(html) {
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*?)\/?>|([^<]+)/g;
  const root = { name: 'root', children: [] };
  const stack = [root];
  let m;
  while ((m = re.exec(html)) !== null) {
    const top = stack[stack.length - 1];
    if (m[4] !== undefined) {
      const text = unesc(m[4]);
      if (text) top.children.push({ name: '#text', text });
      continue;
    }
    const name = m[2].toLowerCase();
    if (m[1] === '/') {
      for (let i = stack.length - 1; i > 0; i--) { if (stack[i].name === name) { stack.length = i; break; } }
    } else if (VOID_TAGS.has(name) || /\/>$/.test(m[0])) {
      top.children.push({ name, attrs: m[3] || '', children: [] });
    } else {
      const node = { name, attrs: m[3] || '', children: [] };
      top.children.push(node);
      stack.push(node);
    }
  }
  return root;
}

function rtRun(text, marks) {
  if (!text) return '';
  const props = [DOC_FONT];
  if (marks.bold) props.push('<w:b/><w:bCs/>');
  if (marks.italic) props.push('<w:i/><w:iCs/>');
  if (marks.underline || marks.link) props.push('<w:u w:val="single"/>');
  if (marks.strike) props.push('<w:strike/>');
  props.push(`<w:color w:val="${marks.link ? '0563C1' : '141a1f'}"/>`);
  const sz = marks.sz || '20';
  props.push(`<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>`);
  return `<w:r><w:rPr>${props.join('')}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function rtPara(runs, ind) {
  const i = ind || { left: -720, right: -720 };
  const hang = i.hanging ? ` w:hanging="${i.hanging}"` : '';
  return `<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto"/><w:ind w:left="${i.left || 0}" w:right="${i.right || 0}"${hang} w:firstLine="0"/></w:pPr>${runs || rtRun('', {})}</w:p>`;
}

function rtInline(nodes, rels, marks) {
  let xml = '';
  for (const n of nodes) {
    if (n.name === '#text') xml += rtRun(n.text, marks);
    else if (n.name === 'br') xml += '<w:r><w:br/></w:r>';
    else if (n.name === 'strong' || n.name === 'b') xml += rtInline(n.children, rels, { ...marks, bold: true });
    else if (n.name === 'em' || n.name === 'i') xml += rtInline(n.children, rels, { ...marks, italic: true });
    else if (n.name === 'u') xml += rtInline(n.children, rels, { ...marks, underline: true });
    else if (n.name === 's' || n.name === 'strike' || n.name === 'del') xml += rtInline(n.children, rels, { ...marks, strike: true });
    else if (n.name === 'a') {
      const href = (n.attrs.match(/href="([^"]*)"/) || [])[1] || '';
      const inner = rtInline(n.children, rels, { ...marks, link: true });
      if (href && rels) {
        const id = 'rIdDoC' + (rels.length + 1);
        rels.push({ id, url: href });
        xml += `<w:hyperlink r:id="${id}">${inner}</w:hyperlink>`;
      } else xml += inner;
    } else xml += rtInline(n.children || [], rels, marks); // span, code, unknown inline
  }
  return xml;
}

function rtListItemInline(li, rels) {
  let xml = '';
  for (const c of li.children) {
    if (c.name === 'ul' || c.name === 'ol') continue;
    xml += c.name === 'p' ? rtInline(c.children, rels, {}) : rtInline([c], rels, {});
  }
  return xml;
}

function rtList(node, out, rels, level) {
  const ordered = node.name === 'ol';
  let idx = 1;
  for (const li of node.children) {
    if (li.name !== 'li') continue;
    const prefix = ordered ? `${idx}.\t` : '•\t';
    out.push(rtPara(rtRun(prefix, {}) + rtListItemInline(li, rels), { left: -720 + (level + 1) * 360, right: -720, hanging: 360 }));
    idx++;
    for (const c of li.children) if (c.name === 'ul' || c.name === 'ol') rtList(c, out, rels, level + 1);
  }
}

function rtBlocks(nodes, out, rels) {
  for (const n of nodes) {
    if (n.name === 'ul' || n.name === 'ol') rtList(n, out, rels, 0);
    else if (/^h[1-6]$/.test(n.name)) {
      const lvl = +n.name[1];
      out.push(rtPara(rtInline(n.children, rels, { bold: true, sz: lvl <= 1 ? '32' : lvl === 2 ? '28' : lvl === 3 ? '26' : '24' })));
    } else if (n.name === 'p') out.push(rtPara(rtInline(n.children, rels, {})));
    else if (n.name === '#text') { const r = rtRun(n.text, {}); if (r) out.push(rtPara(r)); }
    else if (n.children && n.children.length) {
      if (/^(blockquote|div)$/.test(n.name)) rtBlocks(n.children, out, rels);
      else { const inline = rtInline([n], rels, {}); if (inline.trim()) out.push(rtPara(inline)); }
    }
  }
}

// html → { xml, rels }. rels = [{id,url}] for external hyperlinks.
export function htmlToOOXML(html) {
  const rels = [];
  const out = [];
  rtBlocks(parseHtmlNodes(html || '').children, out, rels);
  return { xml: out.join(''), rels };
}

// True when the editor HTML carries no visible content (e.g. "<p></p>").
export function richTextIsEmpty(html) {
  return !(html || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export async function generateDocx(templateB64, replacements, resourcesXMLHook) {
  const JSZip = await loadJSZip();
  const buf = base64ToArrayBuffer(templateB64);
  const zip = await JSZip.loadAsync(buf);
  let docXml = await zip.file("word/document.xml").async("string");

  // 0. CR template fixes (idempotent, safe to run on any template)
  {
    // Remove "Subcontractor Company Name" row (paraId 00000061 = label cell)
    const anchor = 'w14:paraId="00000061"';
    const ai = docXml.indexOf(anchor);
    if (ai >= 0) {
      const trA = docXml.lastIndexOf('<w:tr>', ai);
      const trB = docXml.lastIndexOf('<w:tr ', ai);
      const trStart = Math.max(trA, trB);
      const trEnd = docXml.indexOf('</w:tr>', ai) + '</w:tr>'.length;
      // ponytail: only delete when the matched row is really the CR "Subcontractor Company Name"
      // row. paraId 00000061 also exists in the SOW template on a free body paragraph between two
      // tables, where this <w:tr>..</w:tr> span would swallow §5.2–§11 and fuse the two tables.
      if (trStart >= 0 && trEnd > trStart && docXml.slice(trStart, trEnd).includes('Subcontractor Company Name')) {
        docXml = docXml.slice(0, trStart) + docXml.slice(trEnd);
      }
    }
    // Fix double period: remove standalone '.' run that follows {{newtotbudget}}. in budget sentence
    docXml = docXml.replace(
      /(<w:t[^>]*>{{newtotbudget}}\.<\/w:t><\/w:r>)<w:r[^>]*><w:rPr>(?:(?!<w:b[ />]).)*?<\/w:rPr><w:t[^>]*>\.<\/w:t><\/w:r>/,
      '$1'
    );
    // Move $ into adjacent bold run so it gets bold formatting (Section 13 fees paragraph)
    docXml = docXml
      .replace('not to exceed $</w:t>', 'not to exceed </w:t>')
      .replace(/<w:t xml:space="preserve">{{newtotbudget}}(\.?)<\/w:t>/,
        (_, dot) => `<w:t xml:space="preserve">\${{newtotbudget}}${dot}</w:t>`);
  }

  // 1. Handle SOW {{Resources}} → replace whole <w:p> with a real Word table
  if (replacements.Resources !== undefined) {
    const tableXml = buildSOWResourcesTable(replacements._rawResources || []);
    const phIdx = docXml.indexOf('{{Resources}}');
    if (phIdx >= 0) {
      const pStart = docXml.lastIndexOf('<w:p ', phIdx);
      const pEnd = docXml.indexOf('</w:p>', phIdx) + '</w:p>'.length;
      docXml = docXml.slice(0, pStart) + tableXml + docXml.slice(pEnd);
    }
    delete replacements.Resources;
    delete replacements._rawResources;
  }

  // 2. Handle CR {{resplaceholder}} → replace entire <w:tr> with N real rows
  if (replacements.resplaceholder !== undefined) {
    const crResources = replacements._rawCRResources || [];
    const phIdx = docXml.indexOf('{{resplaceholder}}');
    if (phIdx >= 0) {
      let trStart = phIdx;
      while (trStart > 0) {
        trStart--;
        if (docXml[trStart] === '<' && docXml.slice(trStart, trStart + 5) === '<w:tr' && (docXml[trStart + 5] === ' ' || docXml[trStart + 5] === '>')) break;
      }
      const trEnd = docXml.indexOf('</w:tr>', phIdx) + '</w:tr>'.length;
      const filled = crResources.filter(r => r.resource || r.name);
      const newRows = filled.length > 0
        ? filled.map((r, i) => buildCRRow(r, i)).join("")
        : buildCRRow({ resource: "", name: "", currentHours: "", crHours: "", totalHours: "", rate: "", totalBudget: "" }, 0);
      docXml = docXml.slice(0, trStart) + newRows + docXml.slice(trEnd);
    }
    delete replacements.resplaceholder;
    delete replacements._rawCRResources;
  }

  // 2b. Handle CR {{detailsofchange}} → replace whole <w:p> with rich-text OOXML (or remove if empty)
  if (replacements.detailsofchange !== undefined) {
    const html = replacements.detailsofchange;
    const phIdx = docXml.indexOf('{{detailsofchange}}');
    if (phIdx >= 0) {
      const pStart = docXml.lastIndexOf('<w:p ', phIdx);
      const pEnd = docXml.indexOf('</w:p>', phIdx) + '</w:p>'.length;
      let generated = '';
      if (!richTextIsEmpty(html)) {
        const { xml: rtXml, rels } = htmlToOOXML(html);
        generated = rtXml;
        if (rels.length) {
          const relsPath = 'word/_rels/document.xml.rels';
          let relsXml = await zip.file(relsPath).async('string');
          const add = rels.map(r => `<Relationship Id="${r.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${r.url}" TargetMode="External"/>`).join('');
          zip.file(relsPath, relsXml.replace('</Relationships>', add + '</Relationships>'));
        }
      }
      docXml = docXml.slice(0, pStart) + generated + docXml.slice(pEnd);
    }
    delete replacements.detailsofchange;
  }

  // 3. Bold the $ run that immediately precedes {{newtotbudget}} in the template XML
  (function () {
    const mi = docXml.indexOf("{{newtotbudget}}");
    if (mi < 0) return;
    const before = docXml.slice(0, mi);
    const dollarRun = before.lastIndexOf("<w:r");
    if (dollarRun < 0) return;
    const runSnip = before.slice(dollarRun);
    if (!runSnip.includes(">$<")) return;
    let boldRun;
    if (runSnip.includes("<w:rPr>")) {
      boldRun = runSnip.replace("<w:rPr>", "<w:rPr><w:b/>");
    } else {
      boldRun = runSnip.replace(/^(<w:r[^>]*>)/, "$1<w:rPr><w:b/></w:rPr>");
    }
    docXml = before.slice(0, dollarRun) + boldRun + docXml.slice(mi);
  })();

  // 4. Inject bold date runs by splitting the enclosing <w:r> at the placeholder
  docXml = injectBoldRun(docXml, 'Effecdate', replacements.Effecdate);
  delete replacements.Effecdate;
  docXml = injectBoldRun(docXml, 'MSA_Date', replacements.MSA_Date);
  delete replacements.MSA_Date;

  // Force left-align on the period-of-performance paragraph
  const strtIdx = docXml.indexOf('{{Strtdate}}');
  if (strtIdx >= 0) {
    const pprEnd = docXml.lastIndexOf('</w:pPr>', strtIdx);
    if (pprEnd >= 0) docXml = docXml.slice(0, pprEnd) + '<w:jc w:val="left"/>' + docXml.slice(pprEnd);
  }

  // 5. Replace all remaining simple {{placeholders}} with escaped text
  for (const [key, val] of Object.entries(replacements)) {
    docXml = docXml.split(`{{${key}}}`).join(esc(val ?? ''));
  }

  zip.file("word/document.xml", docXml);
  return await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

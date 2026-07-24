import { SUBCON_DATA, SUBCON_ALIASES_DEFAULT, setSubconAliases } from '../data/subconData.js';

const KEY = 'acquia_contractors';

function initFromDefaults() {
  var obj = {};
  Object.keys(SUBCON_DATA).forEach(function(full) {
    var a = SUBCON_ALIASES_DEFAULT.find(function(x) { return x.full === full; });
    obj[full] = Object.assign({}, SUBCON_DATA[full], {
      alias: a ? a.match : full.toLowerCase().split(/[\s,]/)[0]
    });
  });
  return obj;
}

export function loadContractors() {
  try { var s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch(e) {}
  return initFromDefaults();
}

export function saveContractors(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
  setSubconAliases(contractorAliases(obj));
}

export function contractorAliases(data) {
  return Object.keys(data).map(function(full) {
    return { match: (data[full].alias || full.toLowerCase().split(/[\s,]/)[0]), full: full };
  });
}

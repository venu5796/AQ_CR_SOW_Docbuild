var GDRIVE_API_KEY = 'AIzaSyDCJOIRsL4e4Fmakj1ViPkIBVECMcIQQf0';
var GDRIVE_CLIENT_ID = '297249856145-ibt0m36br4vrmo8q81lonu7gb83rog1r.apps.googleusercontent.com';

export var GDRIVE_CONFIG = (function(){
  if (GDRIVE_API_KEY && GDRIVE_CLIENT_ID) {
    return { apiKey: GDRIVE_API_KEY, clientId: GDRIVE_CLIENT_ID };
  }
  try {
    var s = localStorage.getItem('docbuilder_gdrive_config');
    return s ? JSON.parse(s) : { apiKey:'', clientId:'' };
  } catch(e){ return { apiKey:'', clientId:'' }; }
})();

export function saveGDriveConfig(cfg){
  Object.assign(GDRIVE_CONFIG, cfg);
  try { localStorage.setItem('docbuilder_gdrive_config', JSON.stringify(cfg)); } catch(e){}
}

function loadScript(url, isReady) {
  return new Promise(function(resolve, reject) {
    if (isReady()) { resolve(); return; }
    var s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = function(){ reject(new Error('Failed to load ' + url)); };
    document.head.appendChild(s);
  });
}

var _gisReady = null;
export function ensureGIS() {
  if (_gisReady) return _gisReady;
  if (window.google && window.google.accounts) { _gisReady = Promise.resolve(); return _gisReady; }
  _gisReady = loadScript('https://accounts.google.com/gsi/client', function(){ return window.google && window.google.accounts; });
  _gisReady.catch(function(){ _gisReady = null; });
  return _gisReady;
}

var _uploadTokenClient = null;
var _uploadToken = null;
var _uploadTokenExpiry = 0;

function withUploadToken(cb, onError) {
  if (_uploadToken && Date.now() < _uploadTokenExpiry) { cb(_uploadToken); return; }
  _uploadToken = null;
  ensureGIS().then(function() {
    if (!_uploadTokenClient) {
      _uploadTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GDRIVE_CONFIG.clientId.trim(),
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: function(resp) {
          if (resp.error) { onError('Auth error: ' + resp.error); return; }
          _uploadToken = resp.access_token;
          _uploadTokenExpiry = Date.now() + ((resp.expires_in || 3600) - 60) * 1000;
          cb(_uploadToken);
        }
      });
    }
    _uploadTokenClient.requestAccessToken({ prompt: '' });
  }).catch(function(e) { onError(e.message); });
}

export function uploadAsGoogleDoc(blob, filename, onSuccess, onError) {
  if (!GDRIVE_CONFIG.clientId.trim()) {
    onError('Please configure your Google Client ID in Settings first.');
    return;
  }
  withUploadToken(function(token) {
    var name = filename.replace(/\.docx$/i, '');
    var metadata = { name: name, mimeType: 'application/vnd.google-apps.document' };
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id%2CwebViewLink', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: form
    })
    .then(function(res) {
      if (!res.ok) return res.text().then(function(t) { throw new Error('Upload failed (' + res.status + '): ' + t); });
      return res.json();
    })
    .then(function(file) {
      onSuccess(file.webViewLink || ('https://docs.google.com/document/d/' + file.id + '/edit'), name);
    })
    .catch(function(e) { onError(e.message); });
  }, onError);
}

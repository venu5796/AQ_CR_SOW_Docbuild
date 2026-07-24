import { ensureGIS } from './gdrive.js';
const ALLOWED_DOMAIN = 'acquia.com';
const ALLOWED_EMAILS = ['venutvs5796@gmail.com'];
const SESSION_KEY = 'docbuilder_auth';

export function getStoredAuth() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}

function setStoredAuth(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearAuth() {
  sessionStorage.removeItem(SESSION_KEY);
  if (window.google && window.google.accounts && window.google.accounts.id) {
    google.accounts.id.disableAutoSelect();
  }
}

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch (e) { return null; }
}

export function initSignIn(clientId, onReady, onSuccess, onError) {
  function setup() {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: function(response) {
        const payload = decodeJWT(response.credential);
        if (!payload || !payload.email) { onError('Could not read account info.'); return; }
        if (!payload.email.toLowerCase().endsWith('@' + ALLOWED_DOMAIN) && !ALLOWED_EMAILS.includes(payload.email.toLowerCase())) {
          onError('Access denied — only @' + ALLOWED_DOMAIN + ' accounts can use this app.');
          return;
        }
        setStoredAuth({ email: payload.email, name: payload.name || payload.email });
        onSuccess({ email: payload.email, name: payload.name || payload.email });
      }
    });
    onReady();
  }

  ensureGIS().then(setup).catch(function() { onError('Failed to load Google Sign-In.'); });
}

export function renderSignInButton(el) {
  google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width: 280 });
}

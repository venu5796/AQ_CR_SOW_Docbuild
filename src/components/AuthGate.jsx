import React, { useState, useEffect, useRef } from 'react';
import { getStoredAuth, initSignIn, renderSignInButton, clearAuth } from '../utils/auth.js';
import { GDRIVE_CONFIG } from '../utils/gdrive.js';

export function AuthGate({ children }) {
  const [user, setUser] = useState(() => getStoredAuth());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (user) return;
    initSignIn(
      GDRIVE_CONFIG.clientId,
      () => setReady(true),
      (u) => setUser(u),
      (err) => setError(err)
    );
  }, []);

  useEffect(() => {
    if (ready && btnRef.current && !user) {
      renderSignInButton(btnRef.current);
    }
  }, [ready, user]);

  if (user) {
    return (
      <>
        {children}
        <div style={{ position: 'fixed', bottom: 12, right: 16, fontSize: 11, color: 'var(--text3)', zIndex: 999 }}>
          {user.email}
          {' · '}
          <button
            style={{ all: 'unset', cursor: 'pointer', color: 'var(--text2)', textDecoration: 'underline' }}
            onClick={() => { clearAuth(); setUser(null); setReady(false); setError(null); }}
          >
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 20, padding: 24, textAlign: 'center' }}>
      <img src="favicon.svg" width={52} height={52} alt="" />
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Acquia SOW / CR Generator</h2>
      <p style={{ color: 'var(--text2)', margin: 0, fontSize: 14 }}>
        Sign in with your <strong>@acquia.com</strong> Google account to continue.
      </p>
      {error ? (
        <div style={{ color: 'var(--danger)', fontSize: 13, maxWidth: 340 }}>
          <div style={{ marginBottom: 12 }}>{error}</div>
          <button className="btn btn-secondary" onClick={() => {
            setError(null);
            initSignIn(GDRIVE_CONFIG.clientId, () => setReady(true), (u) => setUser(u), (err) => setError(err));
          }}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div ref={btnRef} style={{ minHeight: 44 }} />
          {!ready && <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Loading…</p>}
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { uploadAsGoogleDoc } from '../utils/gdrive.js';

export function useGDriveUpload(setGenMsg) {
  const [driveUrl, setDriveUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (blobPromise, filename) => {
    setUploading(true);
    setGenMsg('Uploading to Google Docs...');
    let blob;
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Generation timed out')), 30000));
      blob = await Promise.race([blobPromise, timeout]);
    } catch (e) {
      setGenMsg('⚠️ Generation failed: ' + e.message);
      setUploading(false);
      return;
    }
    uploadAsGoogleDoc(blob, filename,
      (url) => { setDriveUrl(url); setGenMsg('✓ Saved to Google Docs!'); setUploading(false); },
      (err) => { setGenMsg('⚠️ Upload failed: ' + err); setUploading(false); }
    );
  };

  return { driveUrl, uploading, upload };
}

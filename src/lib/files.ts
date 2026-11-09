import fs from 'node:fs';
import path from 'node:path';

/** Build-time check for optional, candidate-supplied files in public/. */
export function publicFileExists(name: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', name));
  } catch {
    return false;
  }
}

export const CV_PDF = 'Gajendra-Agrawal-CV.pdf';
export const PROFILE_PHOTO = 'profile.jpg';

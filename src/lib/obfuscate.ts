/**
 * Build-time (server) half of the contact obfuscation. See decode.ts for the browser half.
 * Light obfuscation so raw contact details never appear in static HTML, JSON-LD, sitemap or PDF.
 * This stops scrapers that grep for "@" or digits; it is not encryption.
 */
export function encodeContact(s: string): string {
  return Buffer.from([...s].reverse().join(''), 'utf8').toString('base64');
}

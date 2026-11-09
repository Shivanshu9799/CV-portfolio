/** Browser half of the contact obfuscation (tiny, no Buffer). Inverse of encodeContact. */
export function decodeContact(e: string): string {
  return [...atob(e)].reverse().join('');
}

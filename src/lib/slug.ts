/** Project ids in content.json are the URL slugs. */
export function isValidSlug(s: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
}

export function findDuplicateSlugs(slugs: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const s of slugs) (seen.has(s) ? dup : seen).add(s);
  return [...dup];
}

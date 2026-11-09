import type { Employment } from './schema';
import { formatCr } from './chart';

/** Display copy may fix capitalisation and end punctuation only. Wording stays as in the source. */
export function tidyDuty(s: string): string {
  const t = s.trim();
  if (!t) return t;
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?)]$/.test(cap) ? cap : `${cap}.`;
}

/** Roles with per-project titles (Punj Lloyd 2001) show the distinct titles, not the "(Project a)" label. */
export function roleTitle(e: Employment): string {
  const overrides = e.projects.map((p) => p.title).filter((t): t is string => !!t);
  if (overrides.length === 0) return e.title;
  return [...new Set(overrides)].join(' / ');
}

export function roleValueText(e: Employment): string | null {
  if (e.stated_value_cr_combined !== undefined) {
    return `INR ${formatCr(e.stated_value_cr_combined)} Cr combined (three packages)`;
  }
  if (e.stated_value_cr !== undefined) return `INR ${formatCr(e.stated_value_cr)} Cr`;
  return null;
}

export function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`;
}

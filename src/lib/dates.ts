/** All maths in UTC. Months are inclusive calendar months, start month to end month. */

export function parseIso(s: string): Date {
  return new Date(`${s}T00:00:00Z`);
}

export function tenureMonths(start: string, end: string | null, now: Date = new Date()): number {
  const s = parseIso(start);
  const e = end ? parseIso(end) : now;
  return (e.getUTCFullYear() - s.getUTCFullYear()) * 12 + (e.getUTCMonth() - s.getUTCMonth()) + 1;
}

/** "3 yr 2 mo", "4 yr 0 mo", "7 mo" */
export function tenure(start: string, end: string | null, now: Date = new Date()): string {
  const m = tenureMonths(start, end, now);
  const yr = Math.floor(m / 12);
  const mo = m % 12;
  return yr > 0 ? `${yr} yr ${mo} mo` : `${mo} mo`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonthYear(iso: string): string {
  const d = parseIso(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatPeriod(start: string, end: string | null, isCurrent = false): string {
  return `${formatMonthYear(start)} – ${end && !isCurrent ? formatMonthYear(end) : 'Present'}`;
}

/** Whole completed years since career start; render with a trailing "+". */
export function careerYears(careerStart: string, now: Date = new Date()): number {
  const s = parseIso(careerStart);
  let years = now.getUTCFullYear() - s.getUTCFullYear();
  const beforeAnniversary =
    now.getUTCMonth() < s.getUTCMonth() ||
    (now.getUTCMonth() === s.getUTCMonth() && now.getUTCDate() < s.getUTCDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

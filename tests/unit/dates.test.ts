import { describe, expect, it } from 'vitest';
import { careerYears, formatPeriod, tenure } from '@/lib/dates';

describe('tenure (inclusive calendar months, UTC)', () => {
  const cases: [string, string, string, string][] = [
    ['Punj Lloyd 2001', '2001-01-01', '2004-02-28', '3 yr 2 mo'],
    ['BCC Developers', '2004-03-01', '2004-09-30', '7 mo'],
    ['NPCIL', '2004-10-01', '2006-01-31', '1 yr 4 mo'],
    ['Punj Lloyd 2006', '2006-02-01', '2009-03-31', '3 yr 2 mo'],
    ['Raj Vilash BRTS', '2009-04-02', '2013-03-31', '4 yr 0 mo'],
    ['Raj Vilash Bhopal-Sanchi', '2013-04-01', '2017-06-30', '4 yr 3 mo'],
    ['Tomar Builders', '2017-07-01', '2023-07-31', '6 yr 1 mo'],
    ['I-9 Freeways', '2023-08-01', '2025-11-10', '2 yr 4 mo'],
  ];
  it.each(cases)('%s', (_n, start, end, expected) => {
    expect(tenure(start, end)).toBe(expected);
  });

  it('uses "now" for an open-ended role', () => {
    expect(tenure('2025-11-11', null, new Date('2026-11-09T00:00:00Z'))).toBe('1 yr 1 mo');
  });
});

describe('careerYears', () => {
  it('is 25 in Nov 2026 and 24 just before the anniversary', () => {
    expect(careerYears('2001-01-01', new Date('2026-11-09T00:00:00Z'))).toBe(25);
    expect(careerYears('2001-01-01', new Date('2025-12-31T00:00:00Z'))).toBe(24);
  });
});

describe('formatPeriod', () => {
  it('formats closed and current periods', () => {
    expect(formatPeriod('2023-08-01', '2025-11-10')).toBe('Aug 2023 – Nov 2025');
    expect(formatPeriod('2025-11-11', null, true)).toBe('Nov 2025 – Present');
  });
});

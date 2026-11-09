import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { contentSchema, caseStudySchema } from '@/lib/schema';
import {
  getAllProjects,
  getContent,
  getEmployment,
  getScaleSeries,
  getStats,
  parseContent,
  sanitizeRaw,
} from '@/lib/content';
import { findDuplicateSlugs } from '@/lib/slug';

const root = process.cwd();
const rawPublic = JSON.parse(fs.readFileSync(path.join(root, 'content', 'content.json'), 'utf8'));
const privateFile = path.join(root, 'content', 'private.local.json');
const fullFile = path.join(root, 'content', 'content.full.local.json');

describe('schema', () => {
  it('accepts the committed content.json', () => {
    expect(() => parseContent(rawPublic)).not.toThrow();
  });

  it('rejects a bad date', () => {
    const bad = structuredClone(rawPublic);
    bad.employment[1].start = '2023-13-45';
    expect(() => parseContent(bad)).toThrow();
  });

  it('rejects end before start', () => {
    const bad = structuredClone(rawPublic);
    bad.employment[1].end = '2020-01-01';
    expect(() => parseContent(bad)).toThrow();
  });

  it('rejects unknown keys (typos fail the build)', () => {
    const bad = structuredClone(rawPublic);
    bad.employment[1].tittle = 'x';
    expect(() => parseContent(bad)).toThrow();
  });

  it('accepts a complete case study fixture (tests only, never production content)', () => {
    const fixture = {
      project_id: 'i9-seoni',
      context: 'c',
      scope_and_contract_mode: 's',
      role: 'r',
      challenges: ['a'],
      actions: ['b'],
      outcomes: [{ metric: 'm', baseline: 'b', result: 'r' }],
      reference_available: false,
    };
    expect(caseStudySchema.parse(fixture)).toBeTruthy();
  });
});

describe('loader', () => {
  it('never exposes private or internal keys', () => {
    const json = JSON.stringify(getContent());
    for (const k of ['private_do_not_publish', 'open_items', 'title_conflicts', 'candidate_evidence', '"contact"', '_meta', 'father_name', 'date_of_birth']) {
      expect(json).not.toContain(k);
    }
  });

  it('sanitizes the full original file (drops private and internal keys)', () => {
    if (!fs.existsSync(fullFile)) return;
    const full = JSON.parse(fs.readFileSync(fullFile, 'utf8'));
    const parsed = parseContent(full);
    const json = JSON.stringify(parsed);
    for (const k of ['Satya Prakash', 'Ganesh Talab', '1982-07-09', '7737733222', 'gmail', 'yahoo']) {
      expect(json).not.toContain(k);
    }
    expect(sanitizeRaw(full)).not.toHaveProperty('private_do_not_publish');
  });

  it('keeps private strings out of content.json', () => {
    if (!fs.existsSync(privateFile)) return;
    const priv = JSON.parse(fs.readFileSync(privateFile, 'utf8'));
    const text = fs.readFileSync(path.join(root, 'content', 'content.json'), 'utf8');
    const needles = [
      priv.private_do_not_publish.father_name,
      priv.private_do_not_publish.date_of_birth,
      priv.private_do_not_publish.address,
      ...priv.contact.emails,
      ...priv.contact.phones.map((p: { number: string }) => p.number),
    ];
    for (const n of needles) expect(text).not.toContain(n);
  });

  it('has unique project slugs', () => {
    const slugs = getAllProjects({ showUnconfirmed: true }).map((p) => p.slug);
    expect(findDuplicateSlugs(slugs)).toEqual([]);
  });

  it('hides unconfirmed entries in production mode and shows them when asked', () => {
    expect(getEmployment({ showUnconfirmed: false }).some((e) => e.id === 'ekam-venture')).toBe(false);
    expect(getEmployment({ showUnconfirmed: true }).some((e) => e.id === 'ekam-venture')).toBe(true);
    expect(getAllProjects({ showUnconfirmed: false }).some((p) => p.employmentId === 'ekam-venture')).toBe(false);
  });

  it('applies the per-project title override for Punj Lloyd 2001', () => {
    const projects = getAllProjects({ showUnconfirmed: false });
    expect(projects.find((p) => p.slug === 'pl-jaipur-bypass')?.role).toBe('Junior Engineer');
    expect(projects.find((p) => p.slug === 'pl-vadodara-halol')?.role).toBe('Site Engineer');
  });

  it('never carries a held title above Project Manager', () => {
    for (const e of getEmployment({ showUnconfirmed: true })) {
      expect(e.title).not.toMatch(/General Manager|Director|Head|VP|Vice President/);
    }
  });
});

describe('scale series', () => {
  const derived = getContent().executive_positioning.derived_numbers_compute_at_build;

  it('confirmed items sum to the cumulative value from the original CV', () => {
    const sum = getScaleSeries({ showUnconfirmed: false }).reduce((s, i) => s + i.valueCr, 0);
    expect(sum).toBe(derived.cumulative_stated_contract_value_cr_original_cv);
    expect(sum).toBe(1597);
  });

  it('shows EKAM as one combined pending bar when unconfirmed items are on', () => {
    const items = getScaleSeries({ showUnconfirmed: true });
    const ekam = items.filter((i) => i.pending);
    expect(ekam).toHaveLength(1);
    expect(ekam[0]?.valueCr).toBe(1300);
  });
});

describe('stats', () => {
  const now = new Date('2026-11-09T00:00:00Z');
  it('excludes unconfirmed items in production counts', () => {
    const s = getStats({ showUnconfirmed: false }, now);
    expect(s.years).toBe(25);
    expect(s.employers).toBe(6);
    expect(s.states.sort()).toEqual(['Gujarat', 'Madhya Pradesh', 'Rajasthan']);
    expect(s.clients).toHaveLength(6);
  });
  it('includes them when shown', () => {
    const s = getStats({ showUnconfirmed: true }, now);
    expect(s.employers).toBe(7);
    expect(s.states).toHaveLength(4);
    expect(s.clients).toHaveLength(8);
  });
});

describe('contentSchema', () => {
  it('is strict', () => {
    expect(contentSchema.safeParse({}).success).toBe(false);
  });
});

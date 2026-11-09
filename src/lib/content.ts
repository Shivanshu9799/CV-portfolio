import fs from 'node:fs';
import path from 'node:path';
import { contactSchema, contentSchema, type Contact, type Content, type Employment } from './schema';
import { buildScaleSeries, type ScaleItem } from './chart';
import { careerYears } from './dates';
import { findDuplicateSlugs, isValidSlug } from './slug';

const CONTENT_FILE = path.join(process.cwd(), 'content', 'content.json');
const PRIVATE_FILE = path.join(process.cwd(), 'content', 'private.local.json');

/** Keys that must never reach a component, whatever file is dropped into content/. */
const DROP_EXACT = new Set([
  '_meta', 'private_do_not_publish', 'contact', 'photo', 'scale_chart', 'title_conflicts',
  'open_items', 'candidate_evidence_needed_internal_only', 'headline_rule', 'executive_summary_fact_check',
  'series_source', 'objective_verbatim_original', 'objective_verbatim_later',
  'experience_statement_original', 'note', 'rule', 'purpose',
]);
const dropKey = (k: string) => DROP_EXACT.has(k) || /_note$/.test(k) || /_rule$/.test(k);

export function sanitizeRaw(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sanitizeRaw);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) if (!dropKey(k)) out[k] = sanitizeRaw(val);
    return out;
  }
  return v;
}

export function parseContent(raw: unknown): Content {
  const data = contentSchema.parse({ version: 2, ...(sanitizeRaw(raw) as object) });
  const slugs = data.employment.flatMap((e) => e.projects.map((p) => p.id));
  const dup = findDuplicateSlugs(slugs);
  if (dup.length) throw new Error(`Duplicate project slugs: ${dup.join(', ')}`);
  const bad = slugs.filter((s) => !isValidSlug(s));
  if (bad.length) throw new Error(`Invalid project slugs: ${bad.join(', ')}`);
  return data;
}

let cache: Content | undefined;
export function getContent(): Content {
  cache ??= parseContent(JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')));
  return cache;
}

export type Visibility = { showUnconfirmed?: boolean };

/** Preview/dev builds show unconfirmed items (with a badge). Production hides them unless the flag is set. */
export function isPreviewBuild(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.CONTEXT === 'deploy-preview' ||
    process.env.NEXT_PUBLIC_PREVIEW === 'true'
  );
}
export function defaultShowUnconfirmed(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_UNCONFIRMED === 'true' || isPreviewBuild();
}
const show = (o?: Visibility) => o?.showUnconfirmed ?? defaultShowUnconfirmed();

export function getEmployment(opts?: Visibility, content: Content = getContent()): Employment[] {
  return content.employment
    .filter((e) => e.confirmed_in_original_cv || show(opts))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export type FlatProject = {
  slug: string;
  name: string;
  label?: string;
  employmentId: string;
  employer: string;
  role: string;
  start: string;
  end: string | null;
  isCurrent: boolean;
  state?: string;
  district?: string;
  client?: string;
  concessionaire?: string;
  epcContractor?: string;
  authorityDivision?: string;
  contractMode?: string;
  lengthKm?: number;
  chainage?: string[];
  roadIds?: string[];
  structureTypes?: string[];
  statedValueCr?: number;
  /** project: this project's own value; shared: value covers every project in the role; combined: unmapped programme total */
  valueScope?: 'project' | 'shared' | 'combined';
  unconfirmed: boolean;
  responsibilities: string[];
};

export function getAllProjects(opts?: Visibility, content: Content = getContent()): FlatProject[] {
  return getEmployment(opts, content).flatMap((e) =>
    e.projects.map((p): FlatProject => {
      let statedValueCr: number | undefined;
      let valueScope: FlatProject['valueScope'];
      if (p.stated_value_cr !== undefined) [statedValueCr, valueScope] = [p.stated_value_cr, 'project'];
      else if (e.stated_value_cr !== undefined) [statedValueCr, valueScope] = [e.stated_value_cr, 'shared'];
      else if (e.stated_value_cr_combined !== undefined)
        [statedValueCr, valueScope] = [e.stated_value_cr_combined, 'combined'];
      return {
        slug: p.id,
        name: p.name,
        label: p.label,
        employmentId: e.id,
        employer: e.employer,
        role: p.title ?? e.title,
        start: e.start,
        end: e.end,
        isCurrent: e.is_current,
        state: p.state,
        district: p.district,
        client: p.client ?? e.client,
        concessionaire: e.concessionaire,
        epcContractor: e.epc_contractor,
        authorityDivision: p.authority_division,
        contractMode: p.contract_mode,
        lengthKm: p.length_km,
        chainage: p.chainage,
        roadIds: p.road_ids,
        structureTypes: p.structure_types,
        statedValueCr,
        valueScope,
        unconfirmed: !e.confirmed_in_original_cv,
        responsibilities: e.responsibilities_verbatim,
      };
    }),
  );
}

export function getProjectBySlug(slug: string, opts?: Visibility): FlatProject | undefined {
  return getAllProjects(opts).find((p) => p.slug === slug);
}

export function getScaleSeries(opts?: Visibility, content: Content = getContent()): ScaleItem[] {
  return buildScaleSeries(getEmployment(opts, content));
}

export function getStats(opts?: Visibility, now: Date = new Date(), content: Content = getContent()) {
  const projects = getAllProjects(opts, content);
  const d = content.executive_positioning.derived_numbers_compute_at_build;
  const includeUnconfirmed = show(opts);
  const states = new Set(projects.map((p) => p.state).filter((s): s is string => !!s));
  const clients = d.clients.filter((c) => includeUnconfirmed || !d.clients_unconfirmed.includes(c));
  return {
    years: careerYears(content.identity.career_start, now),
    employers: new Set(getEmployment(opts, content).map((e) => e.employer)).size,
    states: [...states],
    clients,
  };
}

/** Contact data never lives in the repo: CONTACT_JSON env (CI secret) or a gitignored local file. */
export function getContact(): Contact | null {
  try {
    let raw: unknown;
    if (process.env.CONTACT_JSON) raw = JSON.parse(process.env.CONTACT_JSON);
    else if (fs.existsSync(PRIVATE_FILE)) raw = (JSON.parse(fs.readFileSync(PRIVATE_FILE, 'utf8')) as { contact?: unknown }).contact;
    if (!raw) return null;
    const c = contactSchema.parse(raw);
    // second phone is shown only if it was in the original CV (or the candidate confirms it there)
    return { ...c, phones: c.phones.filter((p) => p.in_original_cv) };
  } catch {
    return null;
  }
}

import type { Employment } from './schema';

export type ScaleItem = {
  id: string;
  label: string;
  valueCr: number;
  /** Unconfirmed item: drawn with a hatched fill and a "pending confirmation" note. */
  pending: boolean;
};

/**
 * Short on-chart labels, keyed by the ids in content.json. Wording only describes the
 * project; no numbers or claims are introduced here.
 */
const SHORT_LABELS: Record<string, string> = {
  'ekam-venture': 'EKAM Venture programme (three packages)',
  'i9-freeways': 'Seoni and Katni roads (I-9 Freeways)',
  'tomar-builders': 'NH-26A Sagar–Bina',
  'raj-vilash-bhopal-sanchi': 'NH-86 Extn Bhopal–Sanchi (BOT Annuity)',
  'raj-vilash-brts': 'Bhopal BRTS supervision',
  'punj-lloyd-2006': 'SH-19 Baran–Jhalawar',
  npcil: 'RAPP 5&6 Reactor Building',
  'bcc-developers': '400 KV Switch Yard',
  'pl-jaipur-bypass': 'Jaipur Bypass-II (NHAI)',
  'pl-vadodara-halol': 'Vadodara–Halol SH-87 (BOT)',
};

export function shortLabel(id: string, fallback: string): string {
  return SHORT_LABELS[id] ?? fallback;
}

/** One bar per stated contract value, newest first. EKAM is always ONE combined bar. */
export function buildScaleSeries(employment: Employment[]): ScaleItem[] {
  const sorted = [...employment].sort((a, b) => b.start.localeCompare(a.start));
  const out: ScaleItem[] = [];
  for (const e of sorted) {
    const pending = !e.confirmed_in_original_cv;
    if (e.stated_value_cr_combined !== undefined) {
      out.push({
        id: e.id,
        label: SHORT_LABELS[e.id] ?? e.employer,
        valueCr: e.stated_value_cr_combined,
        pending,
      });
    } else if (e.stated_value_cr !== undefined) {
      out.push({ id: e.id, label: SHORT_LABELS[e.id] ?? e.employer, valueCr: e.stated_value_cr, pending });
    } else {
      for (const p of e.projects) {
        if (p.stated_value_cr !== undefined) {
          out.push({
            id: p.id,
            label: SHORT_LABELS[p.id] ?? p.name,
            valueCr: p.stated_value_cr,
            pending,
          });
        }
      }
    }
  }
  return out;
}

export function formatCr(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

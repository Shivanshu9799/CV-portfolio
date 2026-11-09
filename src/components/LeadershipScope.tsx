import type { Slots } from '@/lib/schema';
import { Section } from './Section';

const LABELS: [keyof Slots['leadership_scope'], string][] = [
  ['peak_team_size', 'Peak team size'],
  ['direct_reports', 'Direct reports'],
  ['subcontractors_managed', 'Subcontractors managed'],
  ['monthly_billing_cr', 'Monthly billing (INR Cr)'],
  ['sites_handled_concurrently', 'Sites handled concurrently'],
];

/** Renders only the fields that hold verified numbers; nothing at all if none do. */
export function LeadershipScope({ scope }: { scope: Slots['leadership_scope'] }) {
  const rows = LABELS.filter(([k]) => scope[k] !== null);
  if (rows.length === 0) return null;
  return (
    <Section id="scope" title="Scope of responsibility">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {rows.map(([k, label]) => (
          <div key={k} className="card">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="mt-1 font-serif text-2xl font-semibold">{scope[k]}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

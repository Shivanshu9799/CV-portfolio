import type { Slots } from '@/lib/schema';
import { Section } from './Section';

type Result = Slots['quantified_results'][number];

/** Verified outcomes only: each carries baseline, result and who can confirm it. */
export function ResultsBlock({ results }: { results: Result[] }) {
  if (results.length === 0) return null;
  return (
    <Section id="results" title="Verified results">
      <ul className="grid gap-4 sm:grid-cols-2">
        {results.map((r) => (
          <li key={`${r.project_id}-${r.metric}`} className="card">
            <p className="font-semibold">{r.metric}</p>
            <p className="mt-1 text-sm text-muted">
              Baseline: {r.baseline}. Result: {r.result}.
            </p>
            <p className="mt-1 text-xs text-muted">Confirmed by: {r.confirmer}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

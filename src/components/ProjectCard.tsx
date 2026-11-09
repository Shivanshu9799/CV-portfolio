import Link from 'next/link';
import type { FlatProject } from '@/lib/content';
import { formatCr } from '@/lib/chart';
import { formatPeriod } from '@/lib/dates';
import { PendingBadge } from './Badge';

export function valueNote(scope: FlatProject['valueScope']): string {
  if (scope === 'shared') return 'one stated value for all projects in this role';
  if (scope === 'combined') return 'combined value of three packages';
  return '';
}

export function ProjectCard({ p }: { p: FlatProject }) {
  const note = valueNote(p.valueScope);
  return (
    <article className="card flex h-full flex-col">
      <h3 className="line-clamp-3 text-base font-semibold leading-snug">
        <Link href={`/projects/${p.slug}/`} className="text-text no-underline hover:underline">
          {p.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted">
        {p.role}, {p.employer}
      </p>
      <p className="chainage mt-1">{formatPeriod(p.start, p.end, p.isCurrent)} (employer tenure)</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        {p.client ? (
          <>
            <dt className="text-muted">Client</dt>
            <dd>{p.client}</dd>
          </>
        ) : null}
        {p.state ? (
          <>
            <dt className="text-muted">State</dt>
            <dd>{p.state}</dd>
          </>
        ) : null}
        {p.lengthKm !== undefined ? (
          <>
            <dt className="text-muted">Length</dt>
            <dd className="font-mono">{p.lengthKm} km</dd>
          </>
        ) : null}
        {p.contractMode ? (
          <>
            <dt className="text-muted">Mode</dt>
            <dd>{p.contractMode}</dd>
          </>
        ) : null}
        {p.statedValueCr !== undefined ? (
          <>
            <dt className="text-muted">Stated contract value</dt>
            <dd>
              <span className="font-mono font-semibold">INR {formatCr(p.statedValueCr)} Cr</span>
              {note ? <span className="block text-xs text-muted">({note})</span> : null}
            </dd>
          </>
        ) : null}
      </dl>
      {p.unconfirmed ? (
        <p className="mt-3">
          <PendingBadge />
        </p>
      ) : null}
    </article>
  );
}

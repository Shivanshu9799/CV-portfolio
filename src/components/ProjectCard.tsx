import Link from 'next/link';
import type { FlatProject } from '@/lib/content';
import { formatCr } from '@/lib/chart';
import { PendingBadge } from './Badge';
import { RouteArt } from './RouteArt';

export function valueNote(scope: FlatProject['valueScope']): string {
  if (scope === 'shared') return 'one stated value for all projects in this role';
  if (scope === 'combined') return 'combined value of three packages';
  return '';
}

export function ProjectCard({ p }: { p: FlatProject }) {
  const note = valueNote(p.valueScope);
  const facts: [string, React.ReactNode][] = [];
  if (p.client) facts.push(['Client', p.client]);
  if (p.lengthKm !== undefined) facts.push(['Length', <span key="l" className="font-mono">{p.lengthKm} km</span>]);
  if (p.statedValueCr !== undefined)
    facts.push([
      'Stated contract value',
      <span key="v">
        <span className="font-mono font-semibold">INR {formatCr(p.statedValueCr)} Cr</span>
        {note ? <span className="block text-xs text-muted">({note})</span> : null}
      </span>,
    ]);
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface transition-shadow hover:shadow-md">
      <div className="relative">
        <RouteArt seed={p.slug} className="h-28 w-full" />
        {p.roadIds?.length ? (
          <ul className="absolute left-3 top-3 flex list-none flex-wrap gap-1.5 p-0">
            {p.roadIds.map((r) => (
              <li key={r} className="rounded-sm bg-accent px-2 py-0.5 font-mono text-xs font-bold text-[#0B1D3A]">
                {r}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-3 text-base font-semibold leading-snug">
          <Link href={`/projects/${p.slug}/`} className="text-text no-underline after:absolute after:inset-0 hover:underline">
            {p.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">
          {p.role}, {p.employer}
        </p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-t border-line pt-3 text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {p.unconfirmed ? (
          <p className="mt-3">
            <PendingBadge />
          </p>
        ) : null}
      </div>
    </article>
  );
}

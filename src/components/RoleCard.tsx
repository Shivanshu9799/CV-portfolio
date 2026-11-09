'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Badge, PendingBadge } from './Badge';

export type RoleCardProps = {
  id: string;
  employer: string;
  title: string;
  period: string;
  tenure: string;
  location?: string;
  client?: string;
  valueText?: string;
  alsoAt?: string;
  unconfirmed: boolean;
  projects: { slug: string; name: string; valueText?: string; title?: string }[];
  duties: string[];
  defaultOpen: boolean;
};

export function RoleCard(p: RoleCardProps) {
  const [open, setOpen] = useState(p.defaultOpen);
  const panelId = useId();

  // Deep link: /experience/#tomar-builders opens that role.
  useEffect(() => {
    if (window.location.hash === `#${p.id}`) setOpen(true);
  }, [p.id]);

  return (
    <article id={p.id} className="card scroll-mt-4">
      <h3 className="text-lg font-semibold">
        <button
          type="button"
          className="flex min-h-[44px] w-full items-start justify-between gap-3 text-left"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <span>
            <span className="block">{p.title}</span>
            <span className="block text-base font-normal text-muted">{p.employer}</span>
            <span className="chainage mt-1 block">
              {p.period} &middot; {p.tenure}
            </span>
          </span>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`mt-1 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      {p.unconfirmed ? (
        <p className="mt-2">
          <PendingBadge />
        </p>
      ) : null}
      <div id={panelId} role="region" aria-label={`${p.title}, ${p.employer}`} hidden={!open} className="mt-4">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {p.location ? (
            <>
              <dt className="text-muted">Location</dt>
              <dd>{p.location}</dd>
            </>
          ) : null}
          {p.client ? (
            <>
              <dt className="text-muted">Client</dt>
              <dd>{p.client}</dd>
            </>
          ) : null}
          {p.valueText ? (
            <>
              <dt className="text-muted">Stated contract value</dt>
              <dd className="font-mono">{p.valueText}</dd>
            </>
          ) : null}
        </dl>

        <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted">Projects</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {p.projects.map((pr) => (
            <li key={pr.slug}>
              <Link href={`/projects/${pr.slug}/`}>{pr.name}</Link>
              {pr.title ? <span className="text-muted"> ({pr.title})</span> : null}
              {pr.valueText ? <span className="text-muted">, stated contract value {pr.valueText}</span> : null}
            </li>
          ))}
        </ul>

        <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted">Responsibilities</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm marker:text-accent-ink">
          {p.duties.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        {p.alsoAt ? (
          <p className="mt-4 text-sm">
            <Badge>Same employer</Badge> <span className="text-muted">{p.alsoAt}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}

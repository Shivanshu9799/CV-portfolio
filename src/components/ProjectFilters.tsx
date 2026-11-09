'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FlatProject } from '@/lib/content';
import { ProjectCard } from './ProjectCard';

type Filters = { q: string; client: string; state: string; mode: string; structure: string };
const EMPTY: Filters = { q: '', client: '', state: '', mode: '', structure: '' };
const KEYS = Object.keys(EMPTY) as (keyof Filters)[];

function uniq(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b));
}

/**
 * URL-query driven: ?state=Rajasthan&q=bypass. Server HTML lists every project, so without
 * JavaScript the page simply shows all of them.
 */
export function ProjectFilters({ projects }: { projects: FlatProject[] }) {
  const [f, setF] = useState<Filters>(EMPTY);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setF(Object.fromEntries(KEYS.map((k) => [k, sp.get(k) ?? ''])) as Filters);
  }, []);

  function update(next: Filters) {
    setF(next);
    const sp = new URLSearchParams();
    for (const k of KEYS) if (next[k]) sp.set(k, next[k]);
    const qs = sp.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }

  const options = useMemo(
    () => ({
      client: uniq(projects.map((p) => p.client)),
      state: uniq(projects.map((p) => p.state)),
      mode: uniq(projects.map((p) => p.contractMode)),
      structure: uniq(projects.flatMap((p) => p.structureTypes ?? [])),
    }),
    [projects],
  );

  const shown = projects.filter((p) => {
    const hay = `${p.name} ${p.employer} ${p.client ?? ''} ${p.state ?? ''} ${(p.roadIds ?? []).join(' ')}`.toLowerCase();
    return (
      (!f.q || hay.includes(f.q.toLowerCase())) &&
      (!f.client || p.client === f.client) &&
      (!f.state || p.state === f.state) &&
      (!f.mode || p.contractMode === f.mode) &&
      (!f.structure || (p.structureTypes ?? []).includes(f.structure))
    );
  });

  const select = (key: 'client' | 'state' | 'mode' | 'structure', label: string) => (
    <div>
      <label htmlFor={`f-${key}`} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={`f-${key}`}
        value={f[key]}
        onChange={(e) => update({ ...f, [key]: e.target.value })}
        className="mt-1 min-h-[44px] w-full rounded border border-line bg-bg px-2 text-sm"
      >
        <option value="">All</option>
        {options[key].map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      <form role="search" aria-label="Filter projects" onSubmit={(e) => e.preventDefault()} className="card">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label htmlFor="f-q" className="block text-sm font-medium">
              Search
            </label>
            <input
              id="f-q"
              type="search"
              value={f.q}
              onChange={(e) => update({ ...f, q: e.target.value })}
              className="mt-1 min-h-[44px] w-full rounded border border-line bg-bg px-2 text-sm"
            />
          </div>
          {select('client', 'Client')}
          {select('state', 'State')}
          {select('mode', 'Contract mode')}
          {select('structure', 'Structure type')}
        </div>
        <button type="button" className="btn btn-ghost mt-4" onClick={() => update(EMPTY)}>
          Clear filters
        </button>
      </form>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
        Showing {shown.length} of {projects.length} projects
      </p>

      <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.slug}>
            <ProjectCard p={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

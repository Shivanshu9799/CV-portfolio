import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PendingBadge } from '@/components/Badge';
import { CaseStudy } from '@/components/CaseStudy';
import { valueNote } from '@/components/ProjectCard';
import { Section } from '@/components/Section';
import { formatCr, shortLabel } from '@/lib/chart';
import { getAllProjects, getContent, getProjectBySlug } from '@/lib/content';
import { formatPeriod, tenure } from '@/lib/dates';
import { tidyDuty, truncate } from '@/lib/format';
import { pageMeta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return {};
  return pageMeta({
    title: truncate(shortLabel(p.slug, p.name), 50),
    description: truncate(`${p.role}, ${p.employer}.${p.state ? ` ${p.state}.` : ''} ${p.name}`, 155),
    path: `/projects/${p.slug}/`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) notFound();

  const caseStudy = getContent().executive_slots_empty_until_candidate_supplies.case_studies.find(
    (c) => c.project_id === p.slug,
  );
  const note = valueNote(p.valueScope);

  const all = getAllProjects();
  const idx = all.findIndex((x) => x.slug === p.slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  const strip: [string, React.ReactNode][] = [];
  if (p.client) strip.push(['Client', p.client]);
  if (p.contractMode) strip.push(['Contract model', p.contractMode]);
  if (p.lengthKm !== undefined) strip.push(['Length', <span key="l" className="font-mono">{p.lengthKm} km</span>]);
  if (p.statedValueCr !== undefined)
    strip.push([
      'Stated contract value',
      <span key="v">
        <span className="font-mono">INR {formatCr(p.statedValueCr)} Cr</span>
        {note ? <span className="block text-xs font-sans font-normal text-[rgb(var(--on-navy-muted))]">({note})</span> : null}
      </span>,
    ]);
  strip.push(['His title', p.role]);

  const rows: [string, React.ReactNode][] = [];
  if (p.chainage?.length) rows.push(['Chainage', <span key="c" className="chainage">{p.chainage.join('; ')}</span>]);
  if (p.concessionaire) rows.push(['Concessionaire', p.concessionaire]);
  if (p.epcContractor) rows.push(['EPC contractor', p.epcContractor]);
  if (p.authorityDivision) rows.push(['Authority division', p.authorityDivision]);
  if (p.state) rows.push(['State', p.district ? `${p.state} (${p.district})` : p.state]);
  if (p.structureTypes?.length) rows.push(['Structures', p.structureTypes.join(', ')]);
  rows.push(['Employer', p.employer]);
  rows.push([
    'Employer tenure',
    `${formatPeriod(p.start, p.end, p.isCurrent)} (${tenure(p.start, p.end)}). Project dates are not stated.`,
  ]);

  return (
    <>
      <div className="band bleed">
        <div className="wrap py-12 sm:py-16">
          <p className="text-sm">
            <Link href="/projects/" className="inline-flex min-h-[44px] items-center">
              &larr; All projects
            </Link>
          </p>
          {p.roadIds?.length ? (
            <p className="mt-2 flex flex-wrap gap-1.5">
              {p.roadIds.map((r) => (
                <span key={r} className="rounded-sm bg-accent px-2 py-0.5 font-mono text-xs font-bold text-[#0B1D3A]">
                  {r}
                </span>
              ))}
            </p>
          ) : null}
          <h1 className="mt-4 max-w-4xl text-2xl font-semibold leading-snug sm:text-4xl">{p.name}</h1>
          {p.unconfirmed ? (
            <p className="mt-3">
              <PendingBadge />
            </p>
          ) : null}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 lg:grid-cols-5">
            {strip.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase text-accent" style={{ letterSpacing: '0.12em' }}>
                  {k}
                </dt>
                <dd className="mt-1.5 font-serif text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Section id="duties" title="What he handled" intro="Responsibilities in this role, from his CV.">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent-ink">
          {p.responsibilities.map((d) => (
            <li key={d}>{tidyDuty(d)}</li>
          ))}
        </ul>
      </Section>

      {caseStudy ? <CaseStudy data={caseStudy} /> : null}

      <Section id="details" title="More details">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-[14rem_1fr]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <nav aria-label="More projects" className="grid gap-4 border-t border-line py-10 sm:grid-cols-2">
        {prev ? (
          <Link href={`/projects/${prev.slug}/`} className="card block no-underline">
            <span className="eyebrow">Previous project</span>
            <span className="mt-1 line-clamp-2 block font-serif text-base font-semibold text-text">{shortLabel(prev.slug, prev.name)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/projects/${next.slug}/`} className="card block text-right no-underline">
            <span className="eyebrow">Next project</span>
            <span className="mt-1 line-clamp-2 block font-serif text-base font-semibold text-text">{shortLabel(next.slug, next.name)}</span>
          </Link>
        ) : null}
      </nav>
    </>
  );
}

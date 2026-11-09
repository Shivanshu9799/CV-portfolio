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

  const rows: [string, React.ReactNode][] = [];
  if (p.chainage?.length) rows.push(['Chainage', <span key="c" className="chainage">{p.chainage.join('; ')}</span>]);
  if (p.lengthKm !== undefined) rows.push(['Length', <span key="l" className="font-mono">{p.lengthKm} km</span>]);
  if (p.client) rows.push(['Client', p.client]);
  if (p.concessionaire) rows.push(['Concessionaire', p.concessionaire]);
  if (p.epcContractor) rows.push(['EPC contractor', p.epcContractor]);
  if (p.authorityDivision) rows.push(['Authority division', p.authorityDivision]);
  if (p.contractMode) rows.push(['Contract mode', p.contractMode]);
  if (p.state) rows.push(['State', p.district ? `${p.state} (${p.district})` : p.state]);
  if (p.structureTypes?.length) rows.push(['Structures', p.structureTypes.join(', ')]);
  if (p.statedValueCr !== undefined)
    rows.push([
      'Stated contract value',
      <span key="v">
        <span className="font-mono font-semibold">INR {formatCr(p.statedValueCr)} Cr</span>
        {note ? <span className="block text-xs text-muted">({note})</span> : null}
      </span>,
    ]);
  rows.push(['His title', p.role]);
  rows.push(['Employer', p.employer]);
  rows.push([
    'Employer tenure',
    `${formatPeriod(p.start, p.end, p.isCurrent)} (${tenure(p.start, p.end)}). Project dates are not stated.`,
  ]);

  return (
    <>
      <p className="pt-8 text-sm">
        <Link href="/projects/" className="inline-flex min-h-[44px] items-center">
          &larr; All projects
        </Link>
      </p>
      <h1 className="text-3xl font-semibold leading-snug sm:text-4xl">{p.name}</h1>
      {p.unconfirmed ? (
        <p className="mt-3">
          <PendingBadge />
        </p>
      ) : null}

      <Section id="details" title="Project details">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-[14rem_1fr]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="duties" title="Responsibilities in this role">
        <ul className="list-disc space-y-1 pl-5 marker:text-accent-ink">
          {p.responsibilities.map((d) => (
            <li key={d}>{tidyDuty(d)}</li>
          ))}
        </ul>
      </Section>

      {caseStudy ? <CaseStudy data={caseStudy} /> : null}
    </>
  );
}

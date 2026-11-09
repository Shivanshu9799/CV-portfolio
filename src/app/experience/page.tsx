import type { Metadata } from 'next';
import { RoleCard, type RoleCardProps } from '@/components/RoleCard';
import { Section } from '@/components/Section';
import { formatCr } from '@/lib/chart';
import { getEmployment } from '@/lib/content';
import { formatPeriod, tenure } from '@/lib/dates';
import { roleTitle, roleValueText, tidyDuty } from '@/lib/format';
import type { Employment } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Experience',
  description: 'Where he has worked: roles, employers and projects, newest first.',
  path: '/experience/',
});

function toProps(e: Employment, i: number, all: Employment[]): RoleCardProps {
  const others = all.filter((o) => o.employer === e.employer && o.id !== e.id);
  return {
    id: e.id,
    employer: e.employer,
    title: roleTitle(e),
    period: formatPeriod(e.start, e.end, e.is_current),
    tenure: tenure(e.start, e.end),
    location: e.location,
    client: e.client,
    valueText: roleValueText(e) ?? undefined,
    unconfirmed: !e.confirmed_in_original_cv,
    alsoAt: others.length
      ? `Another assignment with ${e.employer}: ${others
          .map((o) => `${roleTitle(o)}, ${formatPeriod(o.start, o.end, o.is_current)}`)
          .join('; ')}.`
      : undefined,
    projects: e.projects.map((p) => ({
      slug: p.id,
      name: p.name,
      title: e.projects.some((x) => x.title) ? p.title : undefined,
      valueText: p.stated_value_cr !== undefined ? `INR ${formatCr(p.stated_value_cr)} Cr` : undefined,
    })),
    duties: e.responsibilities_verbatim.map(tidyDuty),
    defaultOpen: i < 2,
  };
}

export default function ExperiencePage() {
  const all = getEmployment();
  // Adjacent entries from one employer share a bracket (Raj Vilash Enterprises).
  const groups: Employment[][] = [];
  for (const e of all) {
    const last = groups[groups.length - 1];
    if (last && last[0]?.employer === e.employer) last.push(e);
    else groups.push([e]);
  }
  let idx = 0;
  return (
    <>
      <h1 className="pt-10 text-4xl font-semibold">Experience</h1>
      <Section id="timeline" title="Where he has worked" intro="Newest first. Dates are employer tenure.">
        <ol className="m-0 list-none space-y-6 p-0">
          {groups.map((g) => (
            <li key={g[0]?.id}>
              {g.length > 1 ? (
                <div className="border-l-4 border-accent pl-4">
                  <p className="chainage mb-2">{g[0]?.employer}, {g.length} assignments</p>
                  <div className="space-y-4">
                    {g.map((e) => (
                      <RoleCard key={e.id} {...toProps(e, idx++, all)} />
                    ))}
                  </div>
                </div>
              ) : (
                g[0] && <RoleCard {...toProps(g[0], idx++, all)} />
              )}
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

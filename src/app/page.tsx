import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';
import { Awards, Recommendations } from '@/components/AwardsAndRecommendations';
import { CareerLadder } from '@/components/CareerLadder';
import { CompetencyGrid } from '@/components/CompetencyGrid';
import { Credentials } from '@/components/Credentials';
import { Hero } from '@/components/Hero';
import { LeadershipScope } from '@/components/LeadershipScope';
import { OpenTo } from '@/components/OpenTo';
import { ProjectCard } from '@/components/ProjectCard';
import { QuickFacts } from '@/components/QuickFacts';
import { ResultsBlock } from '@/components/ResultsBlock';
import { ScaleChart } from '@/components/ScaleChart';
import { Section } from '@/components/Section';
import { defaultShowUnconfirmed, getAllProjects, getContent, getScaleSeries, getStats } from '@/lib/content';
import { SHOW_CUMULATIVE_LINE } from '@/lib/env';
import { FEATURED_PROJECT_IDS } from '@/lib/featured';
import { personJsonLd } from '@/lib/jsonld';

export const metadata: Metadata = { alternates: { canonical: absoluteUrl('/') } };

export default function Home() {
  const c = getContent();
  const stats = getStats();
  const showUnconfirmed = defaultShowUnconfirmed();
  const steps = c.title_progression.steps.filter((s) => s.confirmed !== false || showUnconfirmed);
  const all = getAllProjects();
  const featured = FEATURED_PROJECT_IDS.map((id) => all.find((p) => p.slug === id)).filter(
    (p): p is NonNullable<typeof p> => !!p,
  );
  const slots = c.executive_slots_empty_until_candidate_supplies;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(c)) }} />
      <Hero
        name={c.identity.full_name}
        headline={c.identity.headline_default}
        summary={c.executive_positioning.executive_summary_draft}
      />
      <QuickFacts years={stats.years} employers={stats.employers} states={stats.states} clients={stats.clients.length} />
      <OpenTo items={c.executive_positioning.open_to} />
      <CareerLadder steps={steps} />
      <Section
        id="scale"
        title="Project scale"
        intro="Stated contract value of each project he has worked on, newest first."
      >
        <ScaleChart items={getScaleSeries()} showCumulative={SHOW_CUMULATIVE_LINE} />
      </Section>
      <Section id="competencies" title="Core competencies">
        <CompetencyGrid groups={c.executive_positioning.core_competencies_grouped} />
      </Section>
      <Section id="projects" title="Selected projects" intro="Projects he has worked on.">
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.slug}>
              <ProjectCard p={p} />
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/projects/" className="inline-flex min-h-[44px] items-center">
            See all projects
          </Link>
        </p>
      </Section>
      <LeadershipScope scope={slots.leadership_scope} />
      <ResultsBlock results={slots.quantified_results} />
      <Awards awards={slots.awards} />
      <Recommendations items={slots.recommendations} />
      <Section id="credentials" title="Credentials">
        <Credentials education={c.education} certifications={c.certifications} />
      </Section>
      <Section id="contact-cta" title="Get in touch">
        <p className="max-w-prose text-muted">For roles on highway and infrastructure projects.</p>
        <p className="mt-4">
          <Link href="/contact/" className="btn btn-primary">
            Contact
          </Link>
        </p>
      </Section>
    </>
  );
}

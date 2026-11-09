import type { Metadata } from 'next';
import { ProjectFilters } from '@/components/ProjectFilters';
import { Section } from '@/components/Section';
import { getAllProjects } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Projects',
  description: 'Projects he has worked on, with client, state, contract mode and stated contract value.',
  path: '/projects/',
});

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <>
      <h1 className="pt-10 text-4xl font-semibold">Projects</h1>
      <Section id="all-projects" title="Projects he has worked on">
        <ProjectFilters projects={projects} />
      </Section>
    </>
  );
}

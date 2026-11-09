import type { Metadata } from 'next';
import { Credentials } from '@/components/Credentials';
import { Section } from '@/components/Section';
import { getContent } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Credentials',
  description: 'Education and certification.',
  path: '/credentials/',
});

export default function CredentialsPage() {
  const c = getContent();
  const extra = c.executive_slots_empty_until_candidate_supplies.additional_certifications;
  return (
    <>
      <h1 className="pt-10 text-4xl font-semibold">Credentials</h1>
      <Section id="education" title="Education and certification">
        <Credentials education={c.education} certifications={[...c.certifications, ...extra.map((x, i) => ({ id: `extra-${i}`, title: x.title, issuer: x.issuer, year: x.year, certificate_number: null }))]} />
      </Section>
    </>
  );
}

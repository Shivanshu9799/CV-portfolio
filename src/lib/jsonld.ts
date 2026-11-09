import type { Content } from './schema';
import { absoluteUrl } from './seo';

/**
 * schema.org Person. Deliberately has NO telephone, email, birthDate or street address:
 * only locality, region and country. tests/unit/jsonld.test.ts enforces this.
 */
export function personJsonLd(c: Content) {
  const [locality, region] = c.identity.base_location.split(',').map((s) => s.trim());
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.identity.full_name,
    jobTitle: c.identity.headline_default,
    ...(url ? { url } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressRegion: region,
      addressCountry: 'IN',
    },
    alumniOf: c.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
    knowsAbout: Object.values(c.executive_positioning.core_competencies_grouped).flat(),
    hasCredential: c.certifications.map((x) => ({
      '@type': 'EducationalOccupationalCredential',
      name: x.title,
      recognizedBy: { '@type': 'Organization', name: x.issuer },
    })),
  };
}

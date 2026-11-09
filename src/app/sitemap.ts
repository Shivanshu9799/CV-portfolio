import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/content';
import { ALLOW_INDEXING, SITE_URL } from '@/lib/env';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING || !SITE_URL) return [];
  const paths = ['/', '/experience/', '/projects/', '/credentials/', '/contact/', '/cv/', '/privacy/'];
  const slugs = getAllProjects().map((p) => `/projects/${p.slug}/`);
  return [...paths, ...slugs].map((p) => ({ url: `${SITE_URL}${p}` }));
}

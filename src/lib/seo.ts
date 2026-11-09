import type { Metadata } from 'next';
import { ALLOW_INDEXING, SITE_URL } from './env';

/** Absolute URL for a site path such as "/experience/". SITE_URL already includes any sub-path. */
export function absoluteUrl(pathname: string): string | undefined {
  return SITE_URL ? `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}` : undefined;
}

/** Title under 60 characters, description under 160, canonical + Open Graph + Twitter card. */
export function ogImages() {
  const url = absoluteUrl('/og.png');
  return url ? [{ url, width: 1200, height: 630, alt: 'Gajendra Agrawal, Highway & Infrastructure Project Manager' }] : undefined;
}

export function pageMeta(opts: { title: string; description: string; path: string }): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description.slice(0, 159),
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description.slice(0, 159),
      url,
      locale: 'en_IN',
      type: 'website',
      images: ogImages(),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description.slice(0, 159),
      images: ogImages()?.map((i) => i.url),
    },
    robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  };
}

import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import '@/styles/globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SkipLink } from '@/components/SkipLink';
import { getContent } from '@/lib/content';
import { ALLOW_INDEXING, SITE_URL } from '@/lib/env';
import { ogImages } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

const { identity } = getContent();

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: { default: `${identity.full_name} | ${identity.headline_default}`.slice(0, 60), template: `%s | ${identity.full_name}` },
  description: `${identity.headline_default}. Career history, projects and credentials.`,
  robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: 'profile', locale: 'en_IN', siteName: identity.full_name, images: ogImages() },
  twitter: { card: 'summary_large_image', images: ogImages()?.map((i) => i.url) },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
};

// Restores a saved theme choice before first paint. Storage may be blocked, so it is wrapped.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SkipLink />
        <Header name={identity.full_name} />
        <main id="main" tabIndex={-1} className="wrap">
          {children}
        </main>
        <Footer name={identity.full_name} />
      </body>
    </html>
  );
}

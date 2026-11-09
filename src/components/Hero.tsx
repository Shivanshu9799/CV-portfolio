import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { withBase } from '@/lib/env';
import { CV_PDF, PROFILE_PHOTO, publicFileExists } from '@/lib/files';

type Stat = { value: string; label: string };
type Props = { name: string; headline: string; stats: Stat[]; clients: string[] };

export function Hero({ name, headline, stats, clients }: Props) {
  const hasPdf = publicFileExists(CV_PDF);
  const hasPhoto = publicFileExists(PROFILE_PHOTO);
  return (
    <section aria-labelledby="hero-title" className="band bleed">
      <div className="wrap py-14 sm:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Highways &amp; infrastructure</p>
            <h1 id="hero-title" className="mt-3 text-4xl font-semibold sm:text-6xl">
              {name}
            </h1>
            <hr className="lane mt-6 w-20" aria-hidden="true" />
            <p className="mt-6 font-serif text-xl text-[rgb(var(--on-navy-muted))] sm:text-2xl">{headline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {hasPdf ? (
                <a className="btn btn-primary" href={withBase(`/${CV_PDF}`)} download>
                  <Download size={18} aria-hidden="true" />
                  Download CV
                </a>
              ) : (
                <Link className="btn btn-primary" href="/cv/">
                  View CV
                </Link>
              )}
              <Link className="btn btn-ghost" href="/contact/">
                Contact
              </Link>
            </div>
          </div>
          {hasPhoto ? (
            <Image
              src={withBase(`/${PROFILE_PHOTO}`)}
              alt={`Portrait of ${name}`}
              width={288}
              height={360}
              className="h-72 w-56 shrink-0 rounded border-2 border-accent object-cover sm:h-80 sm:w-64"
              priority
            />
          ) : null}
        </div>
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-serif text-4xl font-semibold text-accent sm:text-5xl">{s.value}</dd>
              <dt className="mt-1 text-sm text-[rgb(var(--on-navy-muted))]">{s.label}</dt>
            </div>
          ))}
        </dl>
        {clients.length > 0 ? (
          <p className="mt-8 text-sm text-[rgb(var(--on-navy-muted))]">
            <span className="eyebrow mr-3">Clients</span>
            {clients.join(' · ')}
          </p>
        ) : null}
      </div>
    </section>
  );
}

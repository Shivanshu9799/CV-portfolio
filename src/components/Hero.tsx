import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { withBase } from '@/lib/env';
import { CV_PDF, PROFILE_PHOTO, publicFileExists } from '@/lib/files';

type Props = { name: string; headline: string; summary: string };

/** The brief asks for the first sentence of the executive summary only. */
function firstSentence(s: string): string {
  const m = s.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : s;
}

export function Hero({ name, headline, summary }: Props) {
  const hasPdf = publicFileExists(CV_PDF);
  const hasPhoto = publicFileExists(PROFILE_PHOTO);
  return (
    <section aria-labelledby="hero-title" className="py-12 sm:py-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h1 id="hero-title" className="text-4xl font-semibold sm:text-5xl">
            {name}
          </h1>
          <p className="mt-3 text-xl text-steel sm:text-2xl">{headline}</p>
          <p className="mt-5 text-lg text-muted">{firstSentence(summary)}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {hasPdf ? (
              <a className="btn btn-primary" href={withBase(`/${CV_PDF}`)} download>
                <Download size={18} aria-hidden="true" />
                Download executive CV
              </a>
            ) : (
              <Link className="btn btn-primary" href="/cv/">
                View executive CV
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
            width={192}
            height={192}
            className="h-40 w-40 shrink-0 rounded-md border border-line object-cover sm:h-48 sm:w-48"
            priority
          />
        ) : null}
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';

type Props = {
  id?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  /** heading level; the page h1 is rendered by the page itself */
  as?: 'h2' | 'h3';
};

export function Section({ id, title, intro, children, as: H = 'h2' }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className="py-14 sm:py-20">
      <hr className="lane mb-5 w-14" aria-hidden="true" />
      <H id={headingId} className="text-3xl font-semibold sm:text-4xl">
        {title}
      </H>
      {intro ? <p className="mt-3 max-w-prose text-lg text-muted">{intro}</p> : null}
      <div className="mt-10">{children}</div>
    </section>
  );
}

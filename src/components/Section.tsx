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
    <section id={id} aria-labelledby={headingId} className="py-10 sm:py-12">
      <hr className="lane mb-6 w-24" aria-hidden="true" />
      <H id={headingId} className="text-2xl font-semibold sm:text-3xl">
        {title}
      </H>
      {intro ? <p className="mt-2 max-w-prose text-muted">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

import { Section } from './Section';

type Step = { title: string; period: string; employers: string[] };

const dash = (p: string) => p.replace(/\s-\s/g, ' – ');

/** Timeline: vertical on mobile, horizontal from md up. Steps come straight from title_progression. */
export function CareerLadder({ steps }: { steps: Step[] }) {
  return (
    <Section id="ladder" title="Career progression" intro="Titles held, in order.">
      <ol className="relative grid list-none gap-8 p-0 md:grid-flow-col md:auto-cols-fr md:gap-6">
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-px bg-accent/60 md:bottom-auto md:left-2 md:right-2 md:top-[7px] md:h-px md:w-auto"
        />
        {steps.map((s) => (
          <li key={s.title} className="relative pl-8 md:pl-0 md:pt-8">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg md:top-0"
            />
            <p className="text-sm font-semibold text-accent-ink">{dash(s.period)}</p>
            <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted">{s.employers.join(', ')}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

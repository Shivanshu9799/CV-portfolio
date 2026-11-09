import { Section } from './Section';

type Step = { title: string; period: string; employers: string[] };

const dash = (p: string) => p.replace(/\s-\s/g, ' – ');

/** Vertical on mobile, horizontal from md up. Steps come straight from title_progression. */
export function CareerLadder({ steps }: { steps: Step[] }) {
  return (
    <Section id="ladder" title="Career progression" intro="Titles held, in order.">
      <ol className="grid gap-4 md:grid-flow-col md:auto-cols-fr">
        {steps.map((s, i) => (
          <li key={s.title} className="card relative">
            <p className="chainage">Step {i + 1}</p>
            <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm font-medium text-steel">{dash(s.period)}</p>
            <p className="mt-2 text-sm text-muted">{s.employers.join(', ')}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

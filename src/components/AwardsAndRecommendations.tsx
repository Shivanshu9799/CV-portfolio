import type { Slots } from '@/lib/schema';
import { Section } from './Section';

export function Awards({ awards }: { awards: Slots['awards'] }) {
  if (awards.length === 0) return null;
  return (
    <Section id="awards" title="Awards and recognition">
      <ul className="space-y-2">
        {awards.map((a) => (
          <li key={a.title}>
            <span className="font-semibold">{a.title}</span>
            {a.issuer ? `, ${a.issuer}` : ''}
            {a.year ? ` (${a.year})` : ''}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Recommendations({ items }: { items: Slots['recommendations'] }) {
  if (items.length === 0) return null;
  return (
    <Section id="recommendations" title="Recommendations">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((r) => (
          <figure key={r.name} className="card m-0">
            <blockquote className="m-0 text-base">{r.quote}</blockquote>
            <figcaption className="mt-3 text-sm text-muted">
              {r.name}, {r.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

import { formatCr, type ScaleItem } from '@/lib/chart';
import { PendingBadge } from './Badge';

type Props = { items: ScaleItem[]; showCumulative?: boolean };

export const SCALE_CAPTION = 'Stated contract value (INR Cr). Contract size, not personal budget.';

/**
 * Hand-written bar chart. Each row is a labelled inline SVG bar (viewBox-scaled), so labels stay
 * readable on phones. The visual is aria-hidden behind one role="img" summary; the same numbers
 * are in a toggleable data table.
 */
export function ScaleChart({ items, showCumulative = false }: Props) {
  if (items.length === 0) return null;
  const max = Math.max(...items.map((i) => i.valueCr));
  const confirmed = items.filter((i) => !i.pending);
  const cumulative = confirmed.reduce((s, i) => s + i.valueCr, 0);
  const summary = `Bar chart of stated contract value in INR crore for ${items.length} entries, newest first. ${SCALE_CAPTION}`;

  return (
    <figure className="m-0">
      <div role="img" aria-label={summary}>
        <ul className="m-0 grid list-none gap-4 p-0" aria-hidden="true">
          {items.map((i) => {
            const pct = Math.max(1.5, (i.valueCr / max) * 100);
            const pid = `hatch-${i.id}`;
            return (
              <li key={i.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    {i.label}
                    {i.pending ? (
                      <span className="ml-2 align-middle">
                        <PendingBadge />
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-mono font-semibold">{formatCr(i.valueCr)}</span>
                </div>
                <svg
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="mt-1 block h-3 w-full"
                  focusable="false"
                >
                  {i.pending ? (
                    <defs>
                      <pattern id={pid} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="1.2" height="3" fill="rgb(var(--steel))" />
                      </pattern>
                    </defs>
                  ) : null}
                  <rect width="100" height="10" fill="rgb(var(--line))" rx="1" />
                  <rect
                    width={pct}
                    height="10"
                    rx="1"
                    fill={i.pending ? `url(#${pid})` : 'rgb(var(--steel))'}
                    stroke={i.pending ? 'rgb(var(--steel))' : 'none'}
                    strokeWidth="0.4"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-4 text-sm text-muted">
        {SCALE_CAPTION}
        {showCumulative && confirmed.length > 0 ? (
          <span className="mt-1 block">
            Cumulative value of contracts worked on across career: INR {formatCr(cumulative)} Cr (
            {confirmed.length} projects, original CV)
          </span>
        ) : null}
      </figcaption>
      <details className="mt-3 text-sm">
        <summary className="inline-flex min-h-[44px] cursor-pointer items-center text-steel underline">
          View chart data as a table
        </summary>
        <table className="mt-2 w-full border-collapse text-left">
          <caption className="sr-only">{SCALE_CAPTION}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4 font-semibold">
                Project
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Stated contract value (INR Cr)
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-line">
                <th scope="row" className="py-2 pr-4 font-normal">
                  {i.label}
                  {i.pending ? ' (pending confirmation)' : ''}
                </th>
                <td className="py-2 text-right font-mono">{formatCr(i.valueCr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

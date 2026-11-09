import type { Metadata } from 'next';
import { formatCr } from '@/lib/chart';
import { defaultShowUnconfirmed, getContent, getEmployment, getScaleSeries } from '@/lib/content';
import { formatPeriod, tenure } from '@/lib/dates';
import { roleTitle, roleValueText, tidyDuty } from '@/lib/format';
import { SCALE_CAPTION } from '@/components/ScaleChart';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Executive CV',
  description: 'Printable executive CV: summary, experience, scale of projects and credentials.',
  path: '/cv/',
});

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-1 mt-4 border-b border-line pb-0.5 text-[11pt] font-semibold uppercase tracking-wide print:border-black">
    {children}
  </h2>
);

/** Single column, A4, black-and-white safe. The PDF script prints this page. */
export default function CvPage() {
  const c = getContent();
  const roles = getEmployment();
  const scale = getScaleSeries();
  const steps = c.title_progression.steps.filter((s) => s.confirmed !== false || defaultShowUnconfirmed());
  const groups = c.executive_positioning.core_competencies_grouped;

  return (
    <article className="mx-auto max-w-[190mm] py-6 text-[9.5pt] leading-snug">
      <header>
        <h1 className="text-[22pt] font-semibold">{c.identity.full_name}</h1>
        <p className="text-[12pt]">{c.identity.headline_default}</p>
        <p className="text-muted print:text-black">{c.identity.base_location.replace(/,\s*India$/, '')}</p>
      </header>

      <H>Summary</H>
      <p>{c.executive_positioning.executive_summary_draft}</p>

      <H>Core competencies</H>
      <ul className="m-0 list-none space-y-0.5 p-0">
        {Object.entries(groups).map(([name, items]) => (
          <li key={name}>
            <span className="font-semibold">{name}: </span>
            {items.join('; ')}
          </li>
        ))}
      </ul>

      <H>Career progression</H>
      <ul className="m-0 list-none space-y-0.5 p-0">
        {steps.map((s) => (
          <li key={s.title}>
            <span className="font-semibold">{s.title}</span>, {s.period.replace(/\s-\s/g, ' – ')} ({s.employers.join(', ')})
          </li>
        ))}
      </ul>

      <H>Experience</H>
      <ol className="m-0 list-none space-y-2.5 p-0">
        {roles.map((e) => {
          const value = roleValueText(e);
          return (
            <li key={e.id} className="break-inside-avoid">
              <p className="font-semibold">
                {roleTitle(e)}, {e.employer}
              </p>
              <p className="text-muted print:text-black">
                {formatPeriod(e.start, e.end, e.is_current)} ({tenure(e.start, e.end)})
                {e.location ? ` · ${e.location}` : ''}
                {e.client ? ` · Client: ${e.client}` : ''}
                {value ? ` · Stated contract value: ${value}` : ''}
              </p>
              <ul className="m-0 mt-0.5 list-disc pl-4">
                {e.responsibilities_verbatim.map((d) => (
                  <li key={d}>{tidyDuty(d)}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      <H>Project scale</H>
      <table className="w-full border-collapse text-left">
        <caption className="mb-1 text-left text-muted print:text-black">{SCALE_CAPTION}</caption>
        <thead>
          <tr className="border-b border-line print:border-black">
            <th scope="col" className="py-0.5 pr-3 font-semibold">Project</th>
            <th scope="col" className="py-0.5 text-right font-semibold">INR Cr</th>
          </tr>
        </thead>
        <tbody>
          {scale.map((i) => (
            <tr key={i.id} className="border-b border-line print:border-black/30">
              <td className="py-0.5 pr-3">{i.label}{i.pending ? ' (pending confirmation)' : ''}</td>
              <td className="py-0.5 text-right font-mono">{formatCr(i.valueCr)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <H>Education and certification</H>
      <ul className="m-0 list-none space-y-0.5 p-0">
        {c.education.map((e) => (
          <li key={e.id}>
            <span className="font-semibold">{e.qualification}</span>, {e.institution}
            {e.year ? `, ${e.year}` : ''}
            {e.mode_of_study ? ` (${e.mode_of_study})` : ''}
          </li>
        ))}
        {c.certifications.map((x) => (
          <li key={x.id}>
            <span className="font-semibold">{x.title}</span>, {x.issuer}
            {x.year ? `, ${x.year}` : ''}
          </li>
        ))}
      </ul>
    </article>
  );
}

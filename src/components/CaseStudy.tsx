import { caseStudySchema, type CaseStudy as CaseStudyData } from '@/lib/schema';
import { Section } from './Section';

/** Renders only when every required field is filled (the schema decides). */
export function CaseStudy({ data }: { data: unknown }) {
  const parsed = caseStudySchema.safeParse(data);
  if (!parsed.success) return null;
  const c: CaseStudyData = parsed.data;
  return (
    <Section id="case-study" title="Case study" as="h2">
      <div className="space-y-4">
        <p>{c.context}</p>
        <p>
          <span className="font-semibold">Scope and contract mode: </span>
          {c.scope_and_contract_mode}
        </p>
        <p>
          <span className="font-semibold">Role: </span>
          {c.role}
        </p>
        <div>
          <h3 className="text-lg font-semibold">Challenges</h3>
          <ul className="mt-1 list-disc pl-5">
            {c.challenges.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Actions</h3>
          <ul className="mt-1 list-disc pl-5">
            {c.actions.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Verified outcomes</h3>
          <ul className="mt-1 space-y-1">
            {c.outcomes.map((o) => (
              <li key={o.metric}>
                {o.metric}: baseline {o.baseline}, result {o.result}
              </li>
            ))}
          </ul>
        </div>
        {c.reference_available ? <p className="text-sm text-muted">A reference is available on request.</p> : null}
      </div>
    </Section>
  );
}

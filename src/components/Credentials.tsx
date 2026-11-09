import type { Content } from '@/lib/schema';

type Props = Pick<Content, 'education' | 'certifications'>;

/** Missing fields are omitted, never shown as "N/A". */
export function Credentials({ education, certifications }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-lg font-semibold">Education</h3>
        <ul className="mt-3 space-y-4">
          {education.map((e) => (
            <li key={e.id} className="card">
              <p className="font-semibold">{e.qualification}</p>
              <p className="text-sm text-muted">
                {e.institution}
                {e.year ? `, ${e.year}` : ''}
              </p>
              {e.mode_of_study ? <p className="text-sm text-muted">Mode of study: {e.mode_of_study}</p> : null}
            </li>
          ))}
        </ul>
      </div>
      {certifications.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold">Certification</h3>
          <ul className="mt-3 space-y-4">
            {certifications.map((c) => (
              <li key={c.id} className="card">
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-muted">
                  {c.issuer}
                  {c.year ? `, ${c.year}` : ''}
                </p>
                {c.certificate_number ? (
                  <p className="chainage mt-1">Certificate no. {c.certificate_number}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

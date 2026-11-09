type Props = { years: number; employers: number; states: string[]; clients: number };

export function QuickFacts({ years, employers, states, clients }: Props) {
  const items = [
    { label: 'Years of experience', value: `${years}+` },
    { label: 'Employers', value: String(employers) },
    { label: 'States worked in', value: String(states.length), detail: states.join(', ') },
    { label: 'Clients', value: String(clients) },
  ];
  return (
    <section aria-label="Quick facts" className="border-y border-line py-6">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.label}>
            <dt className="text-sm text-muted">{i.label}</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold">{i.value}</dd>
            {i.detail ? <dd className="mt-1 text-xs text-muted">{i.detail}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}

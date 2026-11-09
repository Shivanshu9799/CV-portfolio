export function CompetencyGrid({ groups }: { groups: Record<string, string[]> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(groups).map(([name, items]) => (
        <section key={name} className="card" aria-label={name}>
          <h3 className="text-lg font-semibold">{name}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted marker:text-accent-ink">
            {items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Statement of intent, clearly labelled. Renders nothing when the list is empty. */
export function OpenTo({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="open-to-title" className="py-8">
      <h2 id="open-to-title" className="text-xl font-semibold">
        Open to
      </h2>
      <p className="mt-1 text-sm text-muted">Career intent, not a record of past titles.</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i} className="rounded border border-line bg-surface px-3 py-1.5 text-sm">
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}

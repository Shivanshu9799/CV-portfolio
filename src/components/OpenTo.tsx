/** Statement of intent, clearly labelled. Renders nothing when the list is empty. */
export function OpenTo({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="open-to-title" className="py-14 sm:py-20">
      <h2 id="open-to-title" className="text-3xl font-semibold sm:text-4xl">
        Open to
      </h2>
      <p className="mt-1 text-sm text-muted">Career intent, not a record of past titles.</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i} className="rounded-full border border-accent bg-surface px-4 py-1.5 text-sm">
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}

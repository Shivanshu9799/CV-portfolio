import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'pending' }) {
  const cls =
    tone === 'pending'
      ? 'border-dashed border-accent-ink text-accent-ink'
      : 'border-line text-muted';
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

/** Shown only when an unconfirmed item is rendered (preview/dev builds or the explicit flag). */
export function PendingBadge() {
  return <Badge tone="pending">Pending confirmation</Badge>;
}

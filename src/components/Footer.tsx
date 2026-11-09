import Link from 'next/link';

export function Footer({ name }: { name: string }) {
  return (
    <footer className="mt-16 border-t border-line no-print">
      <div className="wrap flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {name}. Stated contract values are contract sizes, not personal budgets.
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/cv/" className="inline-flex min-h-[44px] items-center">
              Executive CV
            </Link>
          </li>
          <li>
            <Link href="/privacy/" className="inline-flex min-h-[44px] items-center">
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

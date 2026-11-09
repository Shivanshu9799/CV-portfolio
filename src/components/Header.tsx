import Link from 'next/link';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

export function Header({ name }: { name: string }) {
  return (
    <header className="border-b border-line no-print">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <Link href="/" className="font-serif text-lg font-semibold text-text no-underline">
          {name}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
          <NavLinks />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

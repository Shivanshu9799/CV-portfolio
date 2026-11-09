import Link from 'next/link';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

export function Header({ name }: { name: string }) {
  return (
    <header className="band sticky top-0 z-40 border-b border-white/10 no-print">
      <div className="wrap flex items-center justify-between gap-3 py-1.5">
        <Link href="/" className="shrink-0 font-serif text-lg font-semibold no-underline">
          {name}
        </Link>
        <nav aria-label="Primary" className="flex min-w-0 items-center gap-1">
          <NavLinks />
          <Link href="/contact/" className="btn btn-primary ml-1 shrink-0 px-4">
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
      <nav aria-label="Sections" className="wrap md:hidden">
        <NavLinks mobile />
      </nav>
    </header>
  );
}

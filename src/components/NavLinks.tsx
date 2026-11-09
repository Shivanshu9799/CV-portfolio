'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/experience/', label: 'Experience' },
  { href: '/projects/', label: 'Projects' },
  { href: '/credentials/', label: 'Credentials' },
  { href: '/contact/', label: 'Contact' },
];

export function NavLinks() {
  const pathname = usePathname() ?? '/';
  return (
    <ul className="flex flex-wrap items-center gap-x-1 gap-y-0 text-sm">
      {LINKS.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-[44px] items-center px-2 no-underline ${
                active ? 'font-semibold text-text underline decoration-accent decoration-2 underline-offset-8' : 'text-muted hover:text-text'
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

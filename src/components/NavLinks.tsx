'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/experience/', label: 'Experience' },
  { href: '/projects/', label: 'Projects' },
  { href: '/credentials/', label: 'Credentials' },
];

export function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname() ?? '/';
  return (
    <ul
      className={
        mobile ? 'flex items-center gap-x-1 overflow-x-auto text-sm md:hidden' : 'hidden items-center gap-x-1 text-sm md:flex'
      }
    >
      {LINKS.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-[44px] items-center px-2 no-underline ${
                active ? 'font-semibold underline decoration-accent decoration-2 underline-offset-8' : 'text-[rgb(var(--on-navy-muted))] hover:text-[rgb(var(--on-navy))]'
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

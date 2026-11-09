'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return 'light'; // navy and ivory is the designed default; dark is opt-in
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    setTheme(attr === 'dark' || attr === 'light' ? attr : systemTheme());
  }, []);

  function toggle() {
    const next: Theme = (theme ?? systemTheme()) === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    setTheme(next);
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost min-w-[44px] px-2"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}

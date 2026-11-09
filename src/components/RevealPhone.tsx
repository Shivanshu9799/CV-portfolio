'use client';

import { Phone } from 'lucide-react';
import { useRef, useState } from 'react';
import { decodeContact } from '@/lib/decode';

/** Phone number stays encoded until the visitor presses the button. Works with keyboard. */
export function RevealPhone({ encoded }: { encoded: string }) {
  const [number, setNumber] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  function reveal() {
    try {
      setNumber(decodeContact(encoded));
      // move focus to the revealed link after it renders
      setTimeout(() => linkRef.current?.focus(), 0);
    } catch {
      setNumber(null);
    }
  }

  if (number) {
    return (
      <a ref={linkRef} href={`tel:${number}`} className="inline-flex min-h-[44px] items-center gap-2 font-mono">
        <Phone size={18} aria-hidden="true" />
        {number}
      </a>
    );
  }
  return (
    <button type="button" className="btn btn-ghost" onClick={reveal}>
      <Phone size={18} aria-hidden="true" />
      Reveal number
    </button>
  );
}

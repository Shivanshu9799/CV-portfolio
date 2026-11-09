'use client';

import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { decodeContact } from '@/lib/decode';

/** Renders a mailto link after the browser decodes the build-time encoded address. */
export function ObfuscatedEmail({ encoded }: { encoded: string }) {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    try {
      setEmail(decodeContact(encoded));
    } catch {
      setEmail(null);
    }
  }, [encoded]);

  if (!email) {
    return (
      <span className="inline-flex min-h-[44px] items-center gap-2 text-muted">
        <Mail size={18} aria-hidden="true" /> Email (needs JavaScript)
      </span>
    );
  }
  return (
    <a href={`mailto:${email}`} className="inline-flex min-h-[44px] items-center gap-2">
      <Mail size={18} aria-hidden="true" />
      {email}
    </a>
  );
}

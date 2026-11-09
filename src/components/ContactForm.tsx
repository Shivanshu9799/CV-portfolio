'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Formspree-style form. Rendered only when NEXT_PUBLIC_FORM_ENDPOINT is set. */
export function ContactForm({ endpoint }: { endpoint: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('company')) return; // honeypot: real visitors never fill this
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next: Record<string, string> = {};
    if (!name) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (message.length < 10) next.message = 'Write at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) form.reset();
    } catch {
      setStatus('error');
    }
  }

  const field = 'mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm min-h-[44px]';
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4" aria-label="Contact form">
      <div>
        <label htmlFor="cf-name" className="block text-sm font-medium">
          Name
        </label>
        <input id="cf-name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
        {errors.name ? <p id="cf-name-err" className="mt-1 text-sm text-accent-ink">{errors.name}</p> : null}
      </div>
      <div>
        <label htmlFor="cf-email" className="block text-sm font-medium">
          Email
        </label>
        <input id="cf-email" name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} />
        {errors.email ? <p id="cf-email-err" className="mt-1 text-sm text-accent-ink">{errors.email}</p> : null}
      </div>
      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium">
          Message
        </label>
        <textarea id="cf-message" name="message" rows={5} className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} />
        {errors.message ? <p id="cf-message-err" className="mt-1 text-sm text-accent-ink">{errors.message}</p> : null}
      </div>
      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending' : 'Send message'}
      </button>
      <p role="status" aria-live="polite" className="text-sm">
        {status === 'sent' ? 'Message sent.' : ''}
        {status === 'error' ? 'Sending failed. Please use the email address above.' : ''}
      </p>
    </form>
  );
}

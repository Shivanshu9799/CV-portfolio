import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getContent } from '@/lib/content';
import { personJsonLd } from '@/lib/jsonld';
import { encodeContact } from '@/lib/obfuscate';
import { decodeContact } from '@/lib/decode';

describe('Person JSON-LD', () => {
  const ld = personJsonLd(getContent());
  const text = JSON.stringify(ld);

  it('has the expected public fields', () => {
    expect(ld.name).toBe('Gajendra Agrawal');
    expect(ld.jobTitle).toBe('Highway & Infrastructure Project Manager');
    expect(ld.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Kota',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    });
  });

  it('never carries telephone, email, birthDate or street address', () => {
    for (const k of ['telephone', 'email', 'birthDate', 'streetAddress', 'postalCode', 'mailto', '@gmail', '@yahoo']) {
      expect(text).not.toContain(k);
    }
  });

  it('does not contain private values', () => {
    const f = path.join(process.cwd(), 'content', 'private.local.json');
    if (!fs.existsSync(f)) return;
    const priv = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const v of [priv.private_do_not_publish.father_name, priv.private_do_not_publish.date_of_birth, priv.private_do_not_publish.address]) {
      expect(text).not.toContain(v);
    }
  });
});

describe('contact obfuscation', () => {
  it('round-trips and hides the raw value', () => {
    const email = 'someone@example.com';
    const enc = encodeContact(email);
    expect(enc).not.toContain('@');
    expect(enc).not.toContain('example');
    expect(decodeContact(enc)).toBe(email);
    const phone = '+910000000000';
    expect(decodeContact(encodeContact(phone))).toBe(phone);
  });
});

import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { ObfuscatedEmail } from '@/components/ObfuscatedEmail';
import { RevealPhone } from '@/components/RevealPhone';
import { Section } from '@/components/Section';
import { getContact, getContent } from '@/lib/content';
import { FORM_ENDPOINT } from '@/lib/env';
import { encodeContact } from '@/lib/obfuscate';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Contact',
  description: 'Contact details and location.',
  path: '/contact/',
});

export default function ContactPage() {
  const c = getContent();
  const contact = getContact();
  const location = c.identity.base_location.replace(/,\s*India$/, '');
  const av = c.executive_slots_empty_until_candidate_supplies.availability;
  const availability: [string, string][] = [];
  if (av.notice_period) availability.push(['Notice period', av.notice_period]);
  if (av.relocation) availability.push(['Relocation', av.relocation]);
  if (av.open_to_international !== null)
    availability.push(['Open to international roles', av.open_to_international ? 'Yes' : 'No']);

  return (
    <>
      <h1 className="pt-10 text-4xl font-semibold">Contact</h1>
      <Section id="details" title="Get in touch">
        <ul className="m-0 list-none space-y-2 p-0">
          {/* index keys on purpose: React keys end up in the page payload, so they must not be raw contact data */}
          {contact?.emails.map((e, i) => (
            <li key={`email-${i}`}>
              <ObfuscatedEmail encoded={encodeContact(e)} />
            </li>
          ))}
          {contact?.phones.map((p, i) => (
            <li key={`phone-${i}`}>
              <RevealPhone encoded={encodeContact(p.number)} />
            </li>
          ))}
          <li className="min-h-[44px] py-2 text-muted">Based in {location}</li>
        </ul>
      </Section>

      {availability.length > 0 ? (
        <Section id="availability" title="Availability">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {availability.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {FORM_ENDPOINT ? (
        <Section id="form" title="Send a message">
          <ContactForm endpoint={FORM_ENDPOINT} />
        </Section>
      ) : null}
    </>
  );
}

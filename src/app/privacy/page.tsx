import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Privacy',
  description: 'What this site does and does not collect.',
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <>
      <h1 className="pt-10 text-4xl font-semibold">Privacy</h1>
      <Section id="privacy" title="What this site collects">
        <ul className="list-disc space-y-2 pl-5">
          <li>No analytics, no advertising trackers and no cookies.</li>
          <li>No third-party fonts, embeds or scripts. Fonts are served from this site.</li>
          <li>
            Your browser may store one setting on your own device: the light or dark theme you chose. It is never sent
            anywhere.
          </li>
          <li>
            Email and phone details are not written in plain text in the page source. They are decoded in your browser,
            and the phone number appears only after you press the reveal button.
          </li>
          <li>
            If a contact form is shown, what you type is sent to the form service configured for this site, only when
            you press send.
          </li>
          <li>The hosting provider may keep standard server logs, as any web host does.</li>
        </ul>
      </Section>
    </>
  );
}

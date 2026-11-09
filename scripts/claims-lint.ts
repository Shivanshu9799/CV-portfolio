/**
 * Build gate: scans the visible copy of every built page (and the CV PDF) and fails on claims the
 * source data does not support.
 *  - held-title words (General Manager, Director, Head of, VP, Vice President) outside the "Open to" strings
 *  - strong verbs: led, leading, spearheaded, drove, directed, owned, saved, savings, reduced, increased, awarded
 *  - any "%" and "crore saved/reduced"
 *  - any number of 41 or more that does not appear in content.json (small numbers are counts, months, years)
 * Reviewed exceptions go in scripts/claims-allowlist.txt (one literal word or number per line).
 */
import fs from 'node:fs';
import path from 'node:path';
import { OUT, pdfText, readAllowlist, ROOT, walk } from './lib';

const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'content.json'), 'utf8')) as {
  executive_positioning: { open_to: string[] };
};
const contentText = JSON.stringify(content);
const allowed = readAllowlist(path.join(ROOT, 'scripts', 'claims-allowlist.txt'));
const knownNumbers = new Set([...contentText.matchAll(/\d+/g)].map((m) => m[0]));

const TITLE_RE = /\b(General Manager|Director|Head of|VP|Vice President)\b/g;
const VERB_RE = /\b(led|leading|spearheaded|drove|directed|owned|saved|savings|reduced|increased|awarded)\b/gi;

function visibleText(html: string): string {
  const head = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => m[1] ?? '');
  const metas = [...html.matchAll(/<meta[^>]+(?:name|property)="(?:description|og:[a-z:]+|twitter:[a-z:]+)"[^>]+content="([^"]*)"/g)].map((m) => m[1] ?? '');
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return [...head, ...metas, body]
    .join(' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&[a-z]+;|&#\d+;/g, ' ')
    .replace(/\s+/g, ' ');
}

function stripOpenTo(text: string): string {
  let t = text;
  for (const s of content.executive_positioning.open_to) t = t.split(s).join(' ');
  return t;
}

function check(name: string, raw: string, hits: string[]) {
  const text = stripOpenTo(raw);
  for (const m of text.matchAll(TITLE_RE)) if (!allowed.has(m[0])) hits.push(`${name}: title word "${m[0]}"`);
  for (const m of text.matchAll(VERB_RE)) if (!allowed.has(m[0].toLowerCase())) hits.push(`${name}: strong verb "${m[0]}"`);
  if (text.includes('%')) hits.push(`${name}: contains "%"`);
  if (/crore\s+(saved|reduced)/i.test(text)) hits.push(`${name}: "crore saved/reduced"`);
  // numbers: join thousands separators (1,300 -> 1300), ignore decimals' parts by tokenising on digit runs
  const numeric = text.replace(/(\d),(\d{3})/g, '$1$2');
  for (const m of numeric.matchAll(/\d+/g)) {
    const n = m[0];
    if (n.length >= 3 || Number(n) > 40) {
      if (!knownNumbers.has(n) && !allowed.has(n)) hits.push(`${name}: number ${n} is not in content.json`);
    }
  }
}

async function main() {
  const hits: string[] = [];
  const pages = walk(OUT, ['.html']);
  if (pages.length === 0) throw new Error('Nothing to scan: run `pnpm build` first.');
  for (const f of pages) check(path.relative(ROOT, f), visibleText(fs.readFileSync(f, 'utf8')), hits);
  const pdf = await pdfText(path.join(ROOT, 'public', 'Gajendra-Agrawal-CV.pdf'));
  if (pdf) check('Gajendra-Agrawal-CV.pdf', pdf.text.replace(/\s+/g, ' '), hits);

  console.log(`claims-lint: scanned ${pages.length} pages${pdf ? ' + CV PDF' : ''}.`);
  const uniq = [...new Set(hits)];
  if (uniq.length) {
    console.error(uniq.join('\n'));
    console.error(`\nFAILED: ${uniq.length} unsupported claim(s).`);
    process.exit(1);
  }
  console.log('OK: no unsupported claims.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

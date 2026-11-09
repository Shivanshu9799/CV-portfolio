/**
 * Build gate: fails if private or contact data appears anywhere in out/ or the CV PDF.
 *  1. Exact strings from content/private.local.json (or PRIVATE_JSON / CONTACT_JSON env) when available.
 *  2. Generic patterns that need no secret: any email address, any Indian mobile number.
 * Reviewed exceptions go in scripts/private-allowlist.txt (one literal per line).
 */
import fs from 'node:fs';
import path from 'node:path';
import { OUT, pdfText, readAllowlist, ROOT, walk } from './lib';

type PrivateFile = {
  private_do_not_publish?: { father_name?: string; date_of_birth?: string; address?: string; marital_status?: string };
  contact?: { phones?: { number: string }[]; emails?: string[] };
};

function loadPrivate(): PrivateFile | null {
  try {
    if (process.env.PRIVATE_JSON) return JSON.parse(process.env.PRIVATE_JSON) as PrivateFile;
    const f = path.join(ROOT, 'content', 'private.local.json');
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8')) as PrivateFile;
    if (process.env.CONTACT_JSON) return { contact: JSON.parse(process.env.CONTACT_JSON) as PrivateFile['contact'] };
  } catch {
    /* fall through to generic checks */
  }
  return null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function dobVariants(iso: string): string[] {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return [iso];
  const [, y, mo, d] = m as unknown as [string, string, string, string];
  const dn = String(Number(d));
  const mn = String(Number(mo));
  const name = MONTHS[Number(mo) - 1] ?? '';
  const seps = ['/', '-', '.', ' '];
  const out = new Set<string>([iso, `${dn} ${name} ${y}`, `${d} ${name} ${y}`, `${name} ${dn}, ${y}`, `${name.slice(0, 3)} ${dn}, ${y}`, `${dn} ${name.slice(0, 3)} ${y}`]);
  for (const s of seps) {
    out.add(`${d}${s}${mo}${s}${y}`);
    out.add(`${dn}${s}${mn}${s}${y}`);
    out.add(`${y}${s}${mo}${s}${d}`);
  }
  return [...out];
}

function phoneVariants(n: string): string[] {
  const digits = n.replace(/\D/g, '');
  const ten = digits.slice(-10);
  return [n, digits, ten, `+91 ${ten}`, `+91-${ten}`, `+91${ten}`, `${ten.slice(0, 5)} ${ten.slice(5)}`, `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`];
}

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;
const PHONE_RE = /(?<![\d.])(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?![\d.])/g;

async function main() {
  const allow = readAllowlist(path.join(ROOT, 'scripts', 'private-allowlist.txt'));
  const priv = loadPrivate();
  const needles = new Set<string>();
  const pd = priv?.private_do_not_publish;
  if (pd?.father_name) needles.add(pd.father_name.replace(/^Shri\s+/i, ''));
  if (pd?.address) {
    needles.add(pd.address);
    for (const part of pd.address.split(/,\s*/)) if (part.length >= 6) needles.add(part);
  }
  if (pd?.date_of_birth) dobVariants(pd.date_of_birth).forEach((v) => needles.add(v));
  priv?.contact?.emails?.forEach((e) => needles.add(e));
  priv?.contact?.phones?.forEach((p) => phoneVariants(p.number).forEach((v) => needles.add(v)));

  const files = walk(OUT, ['.html', '.js', '.json', '.txt', '.xml', '.css', '.svg', '.map']);
  const sources: { name: string; text: string }[] = files.map((f) => ({
    name: path.relative(ROOT, f),
    text: fs.readFileSync(f, 'utf8'),
  }));
  for (const pdf of [path.join(ROOT, 'public', 'Gajendra-Agrawal-CV.pdf'), path.join(OUT, 'Gajendra-Agrawal-CV.pdf')]) {
    const t = await pdfText(pdf);
    if (t) sources.push({ name: `${path.relative(ROOT, pdf)} (text)`, text: t.text });
  }
  if (sources.length === 0) throw new Error('Nothing to scan: run `pnpm build` first.');

  const hits: string[] = [];
  for (const s of sources) {
    const flat = s.text.replace(/\s+/g, ' ');
    for (const n of needles) {
      if (n && !allow.has(n) && (s.text.includes(n) || flat.includes(n))) hits.push(`${s.name}: contains a private value (${n.length} chars)`);
    }
    for (const m of s.text.matchAll(EMAIL_RE)) {
      if (!allow.has(m[0]) && !/\.(png|jpe?g|svg|woff2?|css|js|map)$/i.test(m[0])) hits.push(`${s.name}: email-like string "${m[0]}"`);
    }
    for (const m of flat.matchAll(PHONE_RE)) {
      if (!allow.has(m[0])) hits.push(`${s.name}: phone-like number "${m[0]}"`);
    }
  }

  console.log(`private-strings: scanned ${sources.length} files, ${needles.size} exact needles${priv ? '' : ' (no private source: generic checks only)'}.`);
  if (hits.length) {
    console.error([...new Set(hits)].join('\n'));
    console.error(`\nFAILED: ${new Set(hits).size} private-data hit(s).`);
    process.exit(1);
  }
  console.log('OK: no private data found.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

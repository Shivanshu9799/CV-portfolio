/**
 * Generates public/Gajendra-Agrawal-CV.pdf from the /cv page of an already built site (`out/`).
 * Usage: pnpm build && pnpm cv:pdf && pnpm build   (second build lets the Hero link to the PDF)
 * Set NEXT_PUBLIC_BASE_PATH the same way as for the build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { OUT, pdfText, ROOT, serveOut } from './lib';

async function main() {
  if (!fs.existsSync(path.join(OUT, 'cv', 'index.html'))) throw new Error('Run `pnpm build` first (out/cv/ missing).');
  const server = await serveOut(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${server.url}/cv/`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    const target = path.join(ROOT, 'public', 'Gajendra-Agrawal-CV.pdf');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    await page.pdf({
      path: target,
      format: 'A4',
      printBackground: false,
      margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
      displayHeaderFooter: false,
    });
    const info = await pdfText(target);
    console.log(`Wrote ${path.relative(ROOT, target)} (${info?.pages ?? '?'} pages)`);
    if (info && info.pages > 2) throw new Error(`CV is ${info.pages} pages; the limit is 2. Tighten /cv.`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

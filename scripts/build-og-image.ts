/** Renders public/og.png (1200x630) from inline HTML. Run once, or after the name/headline changes. */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { ROOT } from './lib';

const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'content.json'), 'utf8')) as {
  identity: { full_name: string; headline_default: string };
};

async function main() {
  const { full_name, headline_default } = content.identity;
  const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;width:1200px;height:630px;background:#0B1220;color:#E9EEF5;font-family:Georgia,serif;display:flex;flex-direction:column;justify-content:center;padding:0 80px;box-sizing:border-box">
  <div style="width:120px;height:8px;background:#F2B33D;margin-bottom:40px"></div>
  <div style="font-size:84px;font-weight:700">${full_name}</div>
  <div style="font-size:40px;margin-top:20px;color:#80ACDA;font-family:Arial,sans-serif">${headline_default.replace(/&/g, '&amp;')}</div>
  </body>`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.setContent(html);
    const target = path.join(ROOT, 'public', 'og.png');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    await page.screenshot({ path: target });
    console.log('Wrote public/og.png');
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

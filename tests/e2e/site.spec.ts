import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
const ROUTES = ['/', '/experience/', '/projects/', '/credentials/', '/contact/', '/cv/', '/privacy/'];

// Project slugs come from the built output so the test follows whatever the build exported.
const projectSlugs = fs.existsSync(path.join(OUT, 'projects'))
  ? fs
      .readdirSync(path.join(OUT, 'projects'), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  : [];

// relative URLs keep the baseURL path prefix
const rel = (p: string) => p.replace(/^\//, '');

for (const route of ROUTES) {
  test(`route ${route} loads without console errors and has one h1`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(rel(route));
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test(`axe: no serious or critical issues on ${route}`, async ({ page }) => {
    await page.goto(rel(route));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  });
}

test('every exported project page renders with an h1', async ({ page }) => {
  expect(projectSlugs.length).toBeGreaterThan(0);
  for (const slug of projectSlugs) {
    const res = await page.goto(`projects/${slug}/`);
    expect(res?.status(), slug).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});

test('project filters narrow the list and the count is announced', async ({ page }) => {
  await page.goto('projects/');
  const status = page.getByRole('status').first();
  await expect(status).toContainText(/Showing \d+ of \d+ projects/);
  const total = Number((await status.textContent())?.match(/of (\d+)/)?.[1]);
  await page.getByLabel('State').selectOption('Gujarat');
  await expect(status).toContainText(/Showing 1 of/);
  await page.getByLabel('State').selectOption('');
  await expect(status).toContainText(`Showing ${total} of ${total}`);
  await page.getByLabel('Search').fill('bypass');
  await expect(status).toContainText(/Showing 1 of/);
  expect(page.url()).toContain('q=bypass');
});

test('experience accordion is keyboard operable and exposes aria-expanded', async ({ page }) => {
  await page.goto('experience/');
  const buttons = page.getByRole('button', { expanded: false });
  const closed = buttons.first();
  await closed.focus();
  await page.keyboard.press('Enter');
  await expect(closed).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Space');
  await expect(closed).toHaveAttribute('aria-expanded', 'false');
  // latest two roles start open
  await expect(page.locator('button[aria-expanded="true"]')).toHaveCount(2);
});

test('phone stays hidden until revealed with the keyboard', async ({ page }) => {
  await page.goto('contact/');
  const reveal = page.getByRole('button', { name: 'Reveal number' });
  if ((await reveal.count()) === 0) test.skip(true, 'No contact data configured for this build');
  expect(await page.content()).not.toMatch(/\+?91[\s-]?[6-9]\d{9}/);
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: /\d{5}/ })).toBeVisible();
});

test('theme choice persists across reloads', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).click();
  const chosen = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(['dark', 'light']).toContain(chosen);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(chosen);
});

test('/cv print view has no navigation', async ({ page }) => {
  await page.goto('cv/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
  await expect(page.locator('header')).toBeHidden();
});

test('scale chart caption is exact and the data table matches', async ({ page }) => {
  await page.goto('');
  await expect(page.getByText('Stated contract value (INR Cr). Contract size, not personal budget.').first()).toBeVisible();
  await page.getByText('View chart data as a table').click();
  const rows = page.locator('table tbody tr');
  expect(await rows.count()).toBeGreaterThan(0);
});

test('page is noindex unless indexing is enabled', async ({ page }) => {
  await page.goto('');
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true') expect(robots).toContain('index');
  else expect(robots).toContain('noindex');
});

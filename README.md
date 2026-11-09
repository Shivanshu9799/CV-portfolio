# Gajendra Agrawal: portfolio site

Static Next.js site (`output: 'export'`). `content/content.json` is the single source of truth.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # static site in out/
pnpm gates          # private-data scan + unsupported-claims scan (needs a build first)
pnpm test           # unit tests
pnpm e2e            # browser tests (pnpm exec playwright install chromium once)
```

Node 20 or newer, pnpm 9.

## Publish on GitHub Pages

1. Push this repo to `Shivanshu9799/CV-portfolio` (branch `main`).
2. Repo Settings > Pages > Source: **GitHub Actions**.
3. Repo Settings > Secrets and variables > Actions > **New repository secret** named `CONTACT_JSON`:
   ```json
   {"phones":[{"number":"+91XXXXXXXXXX","in_original_cv":true}],"emails":["name@example.com"]}
   ```
   Contact details are deliberately not in the repo (it is public). Without this secret the Contact page shows no email or phone.
4. Optional repo **variables**: `ALLOW_INDEXING=true` (let search engines index), `SHOW_UNCONFIRMED=true` (show EKAM Venture), `FORM_ENDPOINT` (Formspree-style URL).
5. Every push to `main` runs lint, typecheck, tests, build, the two gates, then deploys to
   `https://shivanshu9799.github.io/CV-portfolio/`.

Other hosts (Vercel, Netlify, Cloudflare Pages): build command `pnpm build`, output directory `out`. Set `NEXT_PUBLIC_BASE_PATH` empty and `NEXT_PUBLIC_SITE_URL` to the site URL.

## Editing content

Edit `content/content.json`. The build fails if the data does not match `src/lib/schema.ts`.
Blocks for leadership scope, verified results, case studies, awards, recommendations, availability and tools render **only** when filled in `executive_slots_empty_until_candidate_supplies`.

Never put these in the repo: date of birth, father's name, address, phone numbers, email addresses. Keep them in `content/private.local.json` (gitignored) or the `CONTACT_JSON` secret.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path, `/CV-portfolio` on GitHub Pages |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` removes `noindex` (default: noindex, nofollow) |
| `NEXT_PUBLIC_SHOW_UNCONFIRMED` | `true` shows unconfirmed items (EKAM Venture). Preview/dev builds always show them with a badge |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Enables the contact form (empty = hidden) |
| `NEXT_PUBLIC_SHOW_CUMULATIVE` | `true` adds the cumulative-value line under the scale chart |
| `CONTACT_JSON` | Contact details (build time only) |

## CV PDF and share image

```bash
pnpm exec playwright install chromium   # once
pnpm build && pnpm cv:pdf && pnpm build # writes public/Gajendra-Agrawal-CV.pdf (max 2 pages)
pnpm exec tsx scripts/build-og-image.ts # writes public/og.png
```

Commit the generated files in `public/`. The home page shows "Download executive CV" only when the PDF exists.

## Photo

Put a portrait at `public/profile.jpg`; the Hero shows it automatically. Without the file nothing is shown.

## Items still to confirm with the candidate

I-9 Freeways end date (10 Nov 2025) and title (Project Manager per original CV); EKAM Venture employment; client spelling "RIDCORE"; second phone number; mode of study for the 2014 B.E.; year of the Road Safety Audit course; photo; consent to publish employer names and project values.

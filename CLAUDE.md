# CLAUDE.md: Gajendra Agrawal portfolio

Static Next.js site (`output: 'export'`), published on GitHub Pages at `/CV-portfolio`. `content/content.json` is the single source of truth.

## 1. Scale up the framing, never the facts
- Titles and dates come from the original CV (`content.json`). Held titles: Junior Engineer, Site Engineer, Sr. Engineer, Project Manager, Project Coordinator. **Never** show General Manager, Director, Head, VP as a held title. Target roles appear only in the labelled "Open to" statement (`executive_positioning.open_to`).
- No invented metrics, awards, quotes, team sizes, savings, percentages. No "led / spearheaded / drove / owned / delivered ahead of schedule". Display copy may fix grammar and capitalisation only.
- Project value is always labelled "Stated contract value" (contract size, not personal budget).
- Experience counter is computed from `identity.career_start`: whole years + "+".
- Executive slots (leadership scope, results, case studies, awards, recommendations, availability, tools) render only with verified data; otherwise render nothing, no placeholder text.
- Unconfirmed items (`confirmed_in_original_cv: false`, e.g. EKAM Venture): hidden in production unless `NEXT_PUBLIC_SHOW_UNCONFIRMED=true`; badge "Pending confirmation" in preview/dev builds.
- Claims linter (`scripts/claims-lint.ts`) is a build gate.

## 2. Privacy (the GitHub repo is public)
- Never commit: DOB, father's name, marital status, nationality, home address, phone numbers, email addresses. They live in gitignored `content/private.local.json` / `content/*.local.json` or the `CONTACT_JSON` secret.
- Never render `private_do_not_publish`. Loader strips internal keys. Do not extract the CV photo; use `public/profile.jpg` only if present.
- Email via build-time obfuscated mailto; phone behind a "Reveal number" button; no raw contact data in HTML, JSON-LD, sitemap or PDF.
- `robots` = noindex unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. No trackers, no CDN fonts, no third-party embeds.

## 10. SEO, accessibility, performance
- Per-page metadata (title < 60, description < 160), canonical, OG, `en-IN`. JSON-LD `Person` with locality/region/country only.
- WCAG 2.2 AA: landmarks, single h1, skip link, visible focus, 44px targets, 4.5:1 contrast in both themes, axe clean.
- Lighthouse mobile >= 95; client JS only for theme toggle, accordions, filters, reveal buttons, email decoder.

## 12. Working method
- Milestones M1..M7, one commit each. After each: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Missing data: render nothing. No lorem ipsum, TBD or sample metrics on public pages.
- Record non-obvious decisions in `docs/DECISIONS.md`.

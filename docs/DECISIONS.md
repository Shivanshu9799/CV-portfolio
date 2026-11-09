# Decisions

1. **Next.js kept over Astro.** Brief default; the site needs a few interactive islands only, and static export covers GitHub Pages.
2. **Public repo means private data stays out.** `content/content.json` is the public subset. Date of birth, father's name, address, phones and emails are in gitignored `content/private.local.json`. CI receives contact details via the `CONTACT_JSON` secret. The loader (`sanitizeRaw`) also strips internal keys if the full original file is dropped in.
3. **Internal notes removed from the committed file.** Title conflicts, open items, candidate-evidence notes and `*_note` / `*_rule` keys are not committed (they describe weak spots in the CV). The full original is kept locally as `content/content.full.local.json` (gitignored).
4. **GitHub Pages sub-path.** `NEXT_PUBLIC_BASE_PATH=/CV-portfolio` is set in the deploy workflow; `trailingSlash: true`; plain anchors and `public/` assets go through `withBase()`.
5. **Unconfirmed items.** `states_unconfirmed` / `clients_unconfirmed` were added to `derived_numbers_compute_at_build` so counts exclude EKAM-only values (Maharashtra, PWD Maharashtra, MMRDA) in production. With EKAM hidden: 6 employers, 3 states, 6 clients.
6. **EKAM values.** One combined bar (1,300). Never mapped to packages.
7. **Node.** Brief asks for Node 20; the machine has Node 26 (winget LTS). Code targets `>=20`; CI pins Node 20.
8. **Windows long paths.** The original scratch folder path exceeded 260 characters and broke esbuild's postinstall. Project lives in a short path.
9. **Tests live in `tests/unit`; Playwright specs go in `tests/e2e`.**

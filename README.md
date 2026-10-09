# Colliers V&A — Digital Capability Statement

A static Astro site that replaces the *Valuation & Advisory Services Capability Statement* PDF. It has one overview page (`/`), one data-driven template for every sector (`/sectors/<slug>/`), a contact directory, and a print stylesheet that turns any page into an A4 document.

See `PLAN.md` for architecture decisions and **`CONTENT_GAPS.md` for everything that must be confirmed before sending to clients.**

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321  (styleguide at /styleguide/, dev only)
npm run build      # brand/contrast gate → static site in dist/
npm run pdf        # after build: dist/pdf/<slug>.pdf for / and every live sector
```

Requires Node ≥ 22.12. The scripts in `scripts/*.ts` run directly with Node's built-in type stripping.

| Script | What it does |
|---|---|
| `npm run build` | Runs `scripts/contrast-check.ts` first. It fails on any unapproved colour pair, a colour literal outside `tokens.css`, or a third font family. Then it builds. |
| `npm run pdf` | Renders A4 PDFs with Playwright and `print.css`. `FOR="Client Name" npm run pdf` personalises the cover. |
| `npm run screenshots` | Full-page PNGs of every live page at 1440 and 390 px → `screenshots/`. |
| `node scripts/qa.ts` | Runs axe (WCAG 2.2 AA) on every page at both widths, checks console errors, overflow and H1 count, and tests the mega menu, filter, dialog and `?for=`. |
| `npm run preview:lite` | Builds `dist-preview/`, a light, relative-path copy (one WebP per image, no client router) for sharing as a single preview link. |
| `node scripts/og.ts` | Regenerates `public/og.png`. |
| `npm run check` / `lint` / `format` | Run `astro check`, ESLint and Prettier. |

## Editing content

| What | Where |
|---|---|
| Sector copy, services, asset types, stat, lead, team, hero image | `src/content/sectors/<slug>.md`. Front-matter is validated by `src/content.config.ts`. The Markdown body is the intro, and its first paragraph is set as the Merriweather lead. |
| Experts (title, phone, email, bio, photo) | `src/data/experts.ts`. Each title is a single field. Adding a `bio`, `email` or `phone` makes the card open a profile dialog. |
| Track record | `src/data/projects.ts`. Use ` ` (the `NB` constant) between number and unit. |
| Key numbers (with `asOf` and source) | `src/data/stats.ts`. `homeStats` picks the 3–5 shown on the overview. |
| Core services | `src/data/services.ts` |
| QA steps and certifications | `src/data/quality.ts` |
| Site name, disclaimer, noindex, primary contact | `src/data/site.ts` |

Empty modules show a dashed **“Content pending”** marker in `npm run dev` and are hidden in production builds.

### Add a sector

1. Copy an existing file in `src/content/sectors/`, rename it to the new slug (e.g. `marinas.md`) and set `order`.
2. Put a hero image in `src/assets/images/sectors/` and point `heroImage` at it.
3. Add the slug to the `SectorSlug` type in `src/data/projects.ts` and to `src/data/sector-labels.ts`.
4. Keep `draft: true` until it's ready. Drafts are built but left out of the nav, the grids, prev/next and the sitemap, and they are `noindex`.

### Swap images

Replace the file in `src/assets/images/<area>/` under the same name, or point the data at a new one. Astro outputs AVIF and WebP at responsive widths. Sector images get a CSS duotone (luminosity over Medium Blue), so neutral photography works. Art direction for every slot is in `CONTENT_GAPS.md §5`.

## Client personalisation

Append `?for=Client%20Name` to any URL. The hero and print cover then show “Prepared for Client Name” (sanitised, max 60 characters, written as text only). The parameter is carried on internal links. Nothing is stored.

## Brand system

- Tokens live in `src/styles/tokens.css`, which is the only place colour literals are allowed.
- Text colours come only from surfaces: `data-surface="white|pale|deep|dark|medium"` in `src/styles/base.css`. Each surface pair is checked at build time.
- There are two typefaces: Open Sans (UI and body) and Merriweather (editorial accents only). Both are self-hosted via Fontsource.
- The motion is CSS-first. JS only toggles `.is-in`. `prefers-reduced-motion` disables all transforms and count-ups.

## Deploy

The output is plain static files in `dist/`, served with `trailingSlash: 'always'` and directory `index.html` files.

```bash
SITE_URL=https://capability.colliers.example BASE_PATH=/ PUBLIC_NOINDEX=true npm run build
```

- `SITE_URL` sets canonical, OG and sitemap URLs. **Set this for production.**
- `BASE_PATH` is for hosting in a sub-folder (e.g. `/va/`). All internal links go through `src/lib/url.ts`.
- `PUBLIC_NOINDEX=false` allows search indexing. It defaults to `noindex`.
- **Azure Static Web Apps / Netlify / S3**: upload `dist/` and set `404.html` as the not-found page.
- **IIS share**: copy `dist/`. Default document is `index.html`, and `.avif`, `.webp` and `.woff2` need MIME types if not already registered.

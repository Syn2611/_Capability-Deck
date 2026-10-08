# PLAN — Colliers V&A Digital Capability Statement

A static Astro site that replaces the _Valuation & Advisory Services Capability Statement 2025_ PDF.
It has one overview page, one data-driven sector template and a print stylesheet that turns any page into an A4 document.

## Reference read-through (what was taken from `_reference/`)

| File                                                                  | Findings                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Valuation_Advisory_Services_Capability_Statement_2025.pdf` (9pp, A4) | All common copy, the 22 track-record entries, 12 expert bios and contacts. It also supplied **real photography**: Sydney, Melbourne and Perth skylines, every track-record photo and every expert headshot (circular crops, 338–450px). Extracted with `pdfimages` and reused. Two figures have typos (George Place "54,262,.2 m²", "Charterhall") and are logged.                                                                                      |
| `Example_Slide.pdf` (24 slides, 16:9)                                 | It came as a PDF, not a PPTX, so slides were rendered with `pdftoppm` and images taken with `pdfimages`. The design language used: a Medium Blue cover field, light display type, a thin circle/arc line, Pale-Blue-Grey rounded cards with a circular line icon top-right, huge light numerals, "Index 01…" pills, a 01–08 contents grid, headshots on light cards with a white name chip, and a Statement of Intent panel over dark particle imagery. |
| `Visual_Identity_Cheat_Sheet.jpg`                                     | Palette, text/background pairs, block combinations and keyline/gradient rules, all encoded in `tokens.css` and `scripts/contrast-check.ts`.                                                                                                                                                                                                                                                                                                             |
| `Colliers_logo.svg`                                                   | Used as supplied (`src/assets/brand/colliers-logo.svg`) through `<img>`, never redrawn.                                                                                                                                                                                                                                                                                                                                                                 |
| `inspiration.md`                                                      | **Not supplied.** Direction taken from §4 of the brief (lostleblanc.com restraint and Apple product pages).                                                                                                                                                                                                                                                                                                                                             |

## Sitemap

```
/                         Overview (12 sections, §5.2)
/sectors/                 Sector index (numbered tiles + full coverage list)
/sectors/<slug>/          12 live sectors + 2 drafts (plant-machinery, extractive-waste)
/contact/                 Contact page (decision below)
/404.html
/styleguide/              DEV ONLY, injected by an inline integration when `astro dev` runs
/sitemap-index.xml, /robots.txt
```

**Contact decision:** a dedicated `/contact/` page rather than a modal. It is shareable, printable, works without JS and lists the Managing Director plus every sector lead with `tel:`/`mailto:`. There is no form: the site is static with no backend, and a form would need a privacy and processing decision from Colliers (logged as an open question).

## Architecture

- **Astro 7 (static) + TypeScript**, `trailingSlash: 'always'` and `build.format: 'directory'`. Every internal URL goes through `src/lib/url.ts`, which prefixes `import.meta.env.BASE_URL`, so the site can be hosted in a sub-folder.
- **Content Collection** `sectors` (`src/content/sectors/*.md`, Zod schema in `src/content.config.ts`). Front-matter holds structured data and the Markdown body is the intro.
- **Shared data** lives in `src/data/`: `experts.ts`, `services.ts`, `projects.ts`, `stats.ts`, `site.ts` (config: noindex, site name, contacts).
- **Styles** are `tokens.css` → `base.css` (reset, type, surfaces, grid, utilities) → `motion.css` → `print.css`, plus component-scoped `<style>`. No colour literal exists outside `tokens.css`, and the contrast script enforces this.
- **Surfaces**: `[data-surface="white|pale|deep|dark|medium"]` sets `--bg`, `--fg`, `--fg-muted`, `--accent` and `--keyline`, so components never pick text colours ad hoc. Every surface pair is validated by `scripts/contrast-check.ts`, which runs before every build.
- **JS** (all vanilla, about 6 KB of our own plus ClientRouter): header state, mega menu, mobile menu (`<dialog>`), section index, reveals, count-up, project filter, expert dialog, `?for=` personalisation, print helpers. Each binds on `astro:page-load` so it survives View-Transition navigation.

## Components (`src/components/`)

Header · MegaMenu · MobileMenu · SectionIndex · Hero · SectorHero · Statement · Eyebrow · StatRow · ServiceList · SectorGrid · SectorTile · ProjectCard · ProjectFilter · ExpertCard · ExpertDialog · ExpertGrid · QualityStepper · CertBadges · QualityStrip · PullQuote · CtaBand · PrevNextSector · Footer · Picture · Icon · ArcLine · Pending · Section · Breadcrumb · PreparedFor · Seo

## Tokens

Colour (primary, secondary and tertiary exactly as the brief) · fluid type scale (`--fs-*`) · 8pt space scale `--space-1…12` · `--section-pad` · grid (`--content-max 1320px`, `--gutter`, `--page-margin`) · radii (`--r-card 20`, `--r-img 16`, `--r-pill 999`) · one shadow `--shadow` · motion (`--ease-out`, `--ease-io`, `--dur-*`) · header heights (88 → 64).

## Motion

The motion is CSS-first. JavaScript only toggles state classes.

- **Reveals**: an IntersectionObserver (15% threshold, once) adds `.is-in`, and a CSS transition does the work. Pure `animation-timeline: view()` is scrubbed, so it would un-reveal on scroll-up, which conflicts with "triggered once". Scroll-driven timelines are therefore used where scrubbing _is_ the intent: QA stepper connectors (`stroke-dashoffset` tied to `view()`) and hero image parallax. Both sit behind `@supports`, and the stepper falls back to the IO class.
- **View Transitions**: Astro `<ClientRouter />` cross-fades at 300 ms. Each sector tile image shares `transition:name="sector-<slug>"` with the sector hero image, which is the signature morph.
- **Reduced motion**: every transform and count-up is disabled, and ClientRouter falls back to an instant swap.

## Open questions (also in CONTENT_GAPS.md)

1. Production domain for canonical URLs and sitemap. It is set via the `SITE_URL` env var and defaults to a placeholder.
2. Should `/contact/` carry a form? If so: endpoint, privacy notice and CRM.
3. Certification artwork for RICS, SAI Global and 5 Ticks StandardsMark. Text placeholders are used until it is supplied.
4. Hotels & Living has no source web page. Its services are taken from the core list and marked for review.
5. Expert title conflicts between the PDF and the website. The PDF titles are used and the title is a single editable field.

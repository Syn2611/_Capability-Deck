// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

const SITE_URL = process.env.SITE_URL ?? 'https://va-capability.example.com';
const BASE = process.env.BASE_PATH ?? '/';

/** Slugs of sectors flagged `draft: true` — built, but kept out of the sitemap. */
const draftSlugs = readdirSync(new URL('./src/content/sectors/', import.meta.url))
  .filter((f) => f.endsWith('.md'))
  .filter((f) =>
    /^draft:\s*true\s*$/m.test(readFileSync(new URL(`./src/content/sectors/${f}`, import.meta.url), 'utf8')),
  )
  .map((f) => f.replace(/\.md$/, ''));

/** Dev-only routes (the styleguide) are injected only under `astro dev`. */
/** @type {import('astro').AstroIntegration} */
const devRoutes = {
  name: 'dev-routes',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') {
        injectRoute({ pattern: '/styleguide', entrypoint: './src/dev/styleguide.astro' });
      }
    },
  },
};

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  integrations: [
    devRoutes,
    sitemap({
      filter: (page) =>
        !draftSlugs.some((slug) => page.includes(`/sectors/${slug}/`)) && !page.includes('/styleguide/'),
    }),
  ],
});

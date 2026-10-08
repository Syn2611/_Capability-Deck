/**
 * Renders `/` and every live sector to A4 PDFs → dist/pdf/<slug>.pdf, using print.css.
 * Run after `npm run build`:  npm run pdf   (optional: FOR="Client Name" npm run pdf)
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { startPreview, liveRoutes } from './serve.ts';

const client = process.env.FOR;
const { url, stop } = await startPreview(4330);
try {
  const routes = (await liveRoutes(url)).filter((r) => r === '/' || /^\/sectors\/[^/]+\/$/.test(r));
  mkdirSync('dist/pdf', { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  for (const route of routes) {
    const u = new URL(route.replace(/^\//, ''), url);
    if (client) u.searchParams.set('for', client);
    await page.goto(u.href, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      document
        .querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
        .forEach((i) => (i.loading = 'eager'));
      document.querySelectorAll('details').forEach((d) => ((d as HTMLDetailsElement).open = true));
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((i) =>
          i.complete ? null : new Promise((r) => i.addEventListener('load', r, { once: true })),
        ),
      );
    });
    const slug = route === '/' ? 'capability-statement' : route.split('/').filter(Boolean).pop();
    await page.pdf({
      path: `dist/pdf/${slug}.pdf`,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`✔ dist/pdf/${slug}.pdf`);
  }
  await browser.close();
} finally {
  stop();
}

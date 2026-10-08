/**
 * Full-page screenshots of every live page at 1440px and 390px → screenshots/<width>/<slug>.png
 * Run after `npm run build`:  npm run screenshots
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { startPreview, liveRoutes } from './serve.ts';

const WIDTHS = (process.env.WIDTHS ?? '1440,390').split(',').map(Number);
const ONLY = process.env.ONLY;

const { url, stop } = await startPreview();
try {
  const routes = (await liveRoutes(url)).filter((r) => !ONLY || r.includes(ONLY));
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    mkdirSync(`screenshots/${width}`, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width, height: width > 800 ? 900 : 844 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    for (const route of routes) {
      await page.goto(new URL(route.replace(/^\//, ''), url).href, { waitUntil: 'networkidle' });
      // Trigger all reveals & lazy images by scrolling through the page once.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(900);
      const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '__');
      await page.screenshot({ path: `screenshots/${width}/${name}.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`${width}px  ${route}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ''}`);
    }
    await ctx.close();
  }
  await browser.close();
} finally {
  stop();
}

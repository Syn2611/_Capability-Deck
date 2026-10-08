/**
 * QA pass over the built site: axe-core (WCAG 2.2 AA) on every live page, console errors,
 * horizontal overflow, one H1 per page, and screenshots of interactive states.
 * Run after `npm run build`:  node scripts/qa.ts
 */
import { chromium, type Page } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { startPreview, liveRoutes } from './serve.ts';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
mkdirSync('screenshots/states', { recursive: true });

const { url, stop } = await startPreview(4331);
let failures = 0;
const at = (r: string) => new URL(r.replace(/^\//, ''), url).href;

async function audit(page: Page, route: string, width: number) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(at(route), { waitUntil: 'networkidle' });
  await page.evaluate(() =>
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')),
  );
  await page.addScriptTag({ content: axeSource });
  type V = { id: string; impact: string; help: string; targets: string[] };
  const res: V[] = await page.evaluate(async () => {
    // @ts-expect-error injected
    const r = await window.axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'],
    });
    return r.violations.map(
      (v: { id: string; impact: string; nodes: { target: string[] }[]; help: string }) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        targets: v.nodes.slice(0, 4).map((n) => n.target.join(' ')),
      }),
    );
  });
  const h1 = await page.locator('h1').count();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const issues = [
    ...res.map((v) => `axe ${v.impact} ${v.id}: ${v.help} → ${v.targets.join(' | ')}`),
    ...(h1 !== 1 ? [`${h1} <h1> elements`] : []),
    ...(overflow > 0 ? [`horizontal overflow ${overflow}px`] : []),
    ...errors.map((e) => `console: ${e}`),
  ];
  failures += issues.length;
  console.log(
    `${issues.length ? '✖' : '✔'} ${width}px ${route}${issues.map((i) => `\n    - ${i}`).join('')}`,
  );
}

try {
  const browser = await chromium.launch();
  const routes = [...(await liveRoutes(url)), '/404.html'];
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    for (const r of routes) await audit(await ctx.newPage(), r, width);
    await ctx.close();
  }

  // ---- Interactive states ----
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(at('/?for=AEW%20Capital%20%3Cscript%3E'), { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/states/hero-prepared-for.png' });
  await page.click('[data-mega-toggle]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/states/mega-menu.png' });
  await page.keyboard.press('Escape');
  const focused = await page.evaluate(() => document.activeElement?.hasAttribute('data-mega-toggle'));
  console.log(`${focused ? '✔' : '✖'} mega menu: Escape returns focus to trigger`);
  if (!focused) failures++;

  await page.locator('#services summary').first().click();
  await page.waitForTimeout(500);
  await page.locator('#services').screenshot({ path: 'screenshots/states/services-open.png' });

  await page.click('[data-filter="hotels-living"]');
  await page.waitForTimeout(800);
  const status = await page.textContent('[data-filter-status]');
  const visible = await page.locator('[data-group]:not([hidden])').count();
  console.log(`${visible === 3 ? '✔' : '✖'} filter Hotels & Living → ${visible} cards; status "${status}"`);
  if (visible !== 3) failures++;
  await page.locator('#track-record').screenshot({ path: 'screenshots/states/filter-hotels.png' });

  await page.click('[data-dialog-open="expert-phil-western"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/states/expert-dialog.png' });
  await page.keyboard.press('Escape');

  // Internal links carry ?for=
  const carried = await page.getAttribute('a[href*="/sectors/office/"]', 'href');
  console.log(`${carried?.includes('for=') ? '✔' : '✖'} ?for= carried on internal links (${carried})`);
  const prepared = await page.textContent('[data-prepared-for-name]');
  console.log(`${prepared === 'AEW Capital script' ? '✔' : '✖'} ?for= sanitised → "${prepared}"`);

  const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await m.newPage();
  await mp.goto(at('/'), { waitUntil: 'networkidle' });
  await mp.click('[data-menu-open]');
  await mp.waitForTimeout(900);
  await mp.screenshot({ path: 'screenshots/states/mobile-menu.png' });
  await mp.keyboard.press('Escape');
  await mp.goto(at('/sectors/office/'), { waitUntil: 'networkidle' });
  await mp.screenshot({ path: 'screenshots/states/mobile-sector-hero.png' });

  // JS budget
  const js = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((e) => (e as PerformanceResourceTiming).initiatorType === 'script' || e.name.endsWith('.js'))
      .reduce((s, e) => s + (e as PerformanceResourceTiming).encodedBodySize, 0),
  );
  console.log(`ℹ JS transferred on home: ${(js / 1024).toFixed(1)} KB (encoded)`);

  await browser.close();
} finally {
  stop();
}
console.log(failures ? `\n✖ ${failures} issue(s)` : '\n✔ QA clean');
process.exit(failures ? 1 : 0);

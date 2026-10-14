// Tests the CloudPages kit against preview_server.py (start it first):
//   python3 salesforce-cloudpages/preview_server.py & node salesforce-cloudpages/test.mjs
import { chromium } from 'playwright';

const B = `http://127.0.0.1:${process.env.PORT || 4340}/`;
const out = process.argv[2] || 'screenshots';
const sectors = ['office', 'industrial-logistics', 'retail', 'hotels-living', 'agribusiness',
  'healthcare-retirement-living', 'government-legal', 'mortgage', 'data-centres', 'self-storage',
  'childcare-education', 'service-stations'];
const pages = ['valuations', 'valuations-sectors', 'valuations-contact', ...sectors.map((s) => 'valuations-' + s)];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
let bad = 0;
for (const name of pages) {
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('requestfailed', (r) => !/fonts\.g/.test(r.url()) && errs.push('failed ' + r.url()));
  await p.goto(B + name, { waitUntil: 'networkidle' });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(40);
  }
  await p.waitForLoadState('networkidle');
  const r = await p.evaluate((B) => {
    // Images in closed profile dialogs load only when a dialog opens
    const broken = [...document.images].filter((i) => !i.closest('dialog') && (!i.complete || !i.naturalWidth));
    const links = [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(B));
    return { broken: broken.length, n: document.images.length, links: [...new Set(links.map((h) => h.slice(B.length).split(/[#?]/)[0]))] };
  }, B);
  const unknown = r.links.filter((l) => l && !pages.includes(l));
  const ok = !errs.length && !r.broken && !unknown.length;
  if (!ok) bad++;
  console.log(ok ? 'OK ' : 'BAD', name.padEnd(40), 'images', r.n, 'broken', r.broken, unknown.join(' '), errs.slice(0, 3).join(' | '));
  await p.close();
}

// Home: hero animation, then interactions
const hero = async (p) => p.evaluate(() => {
  const h = document.querySelector('.hero');
  return { animating: h.classList.contains('is-scrubbing') && h.classList.contains('is-ready'), poster: !!h.querySelector('.hero__poster')?.naturalWidth };
});
const p = await ctx.newPage();
await p.goto(B + 'valuations', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
console.log('hero with frames', JSON.stringify(await hero(p)));
await p.locator('a[href="#experts"]').first().click();
await p.waitForTimeout(800);
console.log('section link → #experts top', await p.evaluate(() => Math.round(document.querySelector('#experts').getBoundingClientRect().top)));
await p.locator('#experts .expert__card').first().click();
await p.waitForTimeout(600);
console.log('profile open', await p.locator('dialog[open]').count(), 'photo', await p.locator('dialog[open] img').evaluate((i) => i.complete && i.naturalWidth > 0));
await p.keyboard.press('Escape');
await p.locator('#sectors .tile').first().click();
await p.waitForLoadState('networkidle');
console.log('sector tile →', p.url().slice(B.length));

const blocked = await b.newContext({ viewport: { width: 1440, height: 900 } });
await blocked.route(/hero-frames/, (r) => r.abort());
const q = await blocked.newPage();
await q.goto(B + 'valuations', { waitUntil: 'networkidle' });
await q.waitForTimeout(800);
console.log('hero with frames blocked', JSON.stringify(await hero(q)));
await q.screenshot({ path: `${out}/cloudpages-hero-fallback.png` });
console.log('pages with problems:', bad);
await b.close();
process.exit(bad ? 1 : 0);

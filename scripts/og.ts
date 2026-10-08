/** Generates public/og.png (1200×630) from brand tokens + logo. Run: node scripts/og.ts */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const logo = readFileSync(new URL('../src/assets/brand/colliers-logo.svg', import.meta.url), 'utf8');
const fontCss = (f: string) =>
  readFileSync(new URL(`../node_modules/${f}`, import.meta.url)).toString('base64');
const os = fontCss('@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2');
const mw = fontCss('@fontsource/merriweather/files/merriweather-latin-300-normal.woff2');
const html = `<html><head><style>
@font-face{font-family:OS;src:url(data:font/woff2;base64,${os});font-weight:300 800}
@font-face{font-family:MW;src:url(data:font/woff2;base64,${mw});font-weight:300}
body{margin:0;width:1200px;height:630px;background:#1C54F4;color:#fff;font-family:OS;position:relative;overflow:hidden}
.logo{position:absolute;top:64px;left:80px;width:150px}.logo svg{width:150px;height:auto}
.arc{position:absolute;right:-260px;top:-120px;width:860px;height:860px;border:1px solid rgba(255,255,255,.5);border-radius:50%}
.e{position:absolute;left:80px;bottom:236px;font-weight:700;font-size:16px;letter-spacing:.16em}
h1{position:absolute;left:80px;bottom:110px;margin:0;font-weight:300;font-size:84px;line-height:1;letter-spacing:-.025em}
p{position:absolute;left:80px;bottom:56px;margin:0;font-family:MW;font-weight:300;font-size:24px}
</style></head><body><div class="arc"></div><div class="logo">${logo}</div>
<div class="e">CAPABILITY STATEMENT · AUSTRALIA</div><h1>Valuation &amp; Advisory Services</h1>
<p>Specialist property investment advice, research and analysis.</p></body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: 'public/og.png' });
await b.close();
console.log('✔ public/og.png');

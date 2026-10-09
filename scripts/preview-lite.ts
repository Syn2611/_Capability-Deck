/**
 * Post-processes `dist-preview/` (built with PREVIEW_LITE=1) into a self-contained, relative-path
 * copy of the site that can be hosted from any sub-path, e.g. as a shareable preview link.
 *   - absolute "/x" URLs → relative, directory links → explicit index.html
 *   - the home page drops its own <html>/<head>/<body> wrapper (the preview host supplies one)
 * Usage: PREVIEW_LITE=1 npx astro build --outDir dist-preview && node scripts/preview-lite.ts
 */
import { readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('../dist-preview/', import.meta.url).pathname;

function walk(dir: string, out: string[] = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const toRel = (fromFile: string, abs: string) => {
  const [pathAndQuery, hash] = abs.split('#');
  const [path, query] = pathAndQuery.split('?');
  let target = path;
  if (target.endsWith('/')) target += 'index.html';
  const depth = relative(ROOT, fromFile).split(sep).length - 1;
  const prefix = depth ? '../'.repeat(depth) : './';
  return prefix + target.replace(/^\//, '') + (query ? `?${query}` : '') + (hash ? `#${hash}` : '');
};

for (const f of files) {
  if (f.endsWith('.html')) {
    let s = readFileSync(f, 'utf8');
    s = s.replace(/(href|src|content)="(\/(?!\/)[^"]*)"/g, (m, attr, url) =>
      attr === 'content' && !/\.(png|svg|jpg)$/.test(url) ? m : `${attr}="${toRel(f, url)}"`,
    );
    s = s.replace(/srcset="([^"]+)"/g, (_m, set: string) =>
      `srcset="${set.replace(/(^|,\s*)(\/(?!\/)[^\s,]+)/g, (_x, pre, u) => pre + toRel(f, u))}"`,
    );
    s = s.replace(/url\((['"]?)(\/_astro\/[^)'"]+)\1\)/g, (_m, q, u) => `url(${q}${toRel(f, u)}${q})`);
    if (relative(ROOT, f) === 'index.html') {
      s = s.replace(/<!doctype html>/i, '').replace(/<\/?(html|head|body)\b[^>]*>/gi, '');
    }
    writeFileSync(f, s);
  } else if (f.endsWith('.css')) {
    const s = readFileSync(f, 'utf8').replace(/url\((['"]?)\/_astro\/([^)'"]+)\1\)/g, 'url($1./$2$1)');
    writeFileSync(f, s);
  } else if (f.endsWith('.js')) {
    const s = readFileSync(f, 'utf8');
    if (/["'`]\/_astro\//.test(s)) console.warn(`⚠ absolute /_astro/ path inside ${relative(ROOT, f)}`);
  }
}
// Preview hosts may reserve names beginning with "_": rename the asset folder.
renameSync(join(ROOT, '_astro'), join(ROOT, 'assets'));
for (const f of walk(ROOT).filter((x) => /\.(html|css|js)$/.test(x))) {
  writeFileSync(f, readFileSync(f, 'utf8').replaceAll('_astro/', 'assets/'));
}
// Drop build outputs nothing references (e.g. original-format copies of optimised images).
const used = walk(ROOT)
  .filter((x) => /\.(html|css|js)$/.test(x))
  .map((x) => readFileSync(x, 'utf8'))
  .join('\n');
for (const f of walk(join(ROOT, 'assets'))) {
  if (!used.includes(relative(join(ROOT, 'assets'), f))) unlinkSync(f);
}

const count = walk(ROOT).filter((f) => !f.endsWith('.pdf'));
const bytes = count.reduce((n, f) => n + statSync(f).size, 0);
console.log(`✔ dist-preview: ${count.length} files, ${(bytes / 1048576).toFixed(1)} MB`);

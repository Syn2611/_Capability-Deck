/**
 * Brand guard — runs before every build (`npm run build`) and fails it on:
 *   1. an unapproved text/background token pair, or an approved pair below WCAG 2.2 AA;
 *   2. any colour literal (hex / rgb() / hsl()) outside src/styles/tokens.css;
 *   3. any font-family other than the two brand families.
 *
 * Pairs are discovered from the code itself: any CSS rule that sets both a background
 * (`background`, `background-color`, `--bg`, `--card-bg`, `--btn-bg`, `--btn-bg-hover`) and a
 * foreground (`color`, `--fg`, `--fg-muted`, `--fg-soft`, `--accent`, `--card-fg`, `--btn-fg`)
 * to a `var(--c-*)` token is checked.
 *
 * Usage: node scripts/contrast-check.ts
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const TOKENS = join(ROOT, 'src/styles/tokens.css');

/** Approved foreground → backgrounds (Visual Identity Cheat Sheet + brief §3.1). */
const APPROVED: Record<string, string[]> = {
  white: ['deep-blue', 'dark-blue', 'medium-blue', 'field-blue', 'deep-blue-grey', 'dark-blue-grey'],
  'deep-blue': ['white', 'pale-blue', 'pale-blue-grey', 'light-blue-grey'],
  'deep-blue-grey': ['white', 'pale-blue', 'pale-blue-grey', 'light-blue-grey'],
  'dark-blue': ['white', 'pale-blue', 'pale-blue-grey'],
  'dark-blue-grey': ['white', 'pale-blue-grey'],
  'medium-blue': ['white', 'pale-blue-grey'],
};
const MIN_RATIO = 4.5;

/** Literal colours allowed outside tokens.css (file → substring of the line). */
const LITERAL_ALLOW: Array<[string, string]> = [['src/layouts/BaseLayout.astro', 'theme-color']];

const BG_KEYS = ['background', 'background-color', '--bg', '--card-bg', '--btn-bg', '--btn-bg-hover'];
const FG_KEYS = ['color', '--fg', '--fg-muted', '--fg-soft', '--accent', '--card-fg', '--btn-fg'];
const PAIRS: Array<[string, string]> = [
  ['--card-fg', '--card-bg'],
  ['--btn-fg', '--btn-bg'],
  ['--btn-fg', '--btn-bg-hover'],
];

// ---------- colour maths ----------
const lum = (hex: string) => {
  const v = [0, 2, 4]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// ---------- tokens ----------
const tokenCss = readFileSync(TOKENS, 'utf8');
const palette = new Map<string, string>();
for (const m of tokenCss.matchAll(/--c-([a-z-]+):\s*#([0-9a-f]{6})/gi)) palette.set(m[1], m[2].toLowerCase());

const errors: string[] = [];
const warn = (file: string, msg: string) => errors.push(`${relative(ROOT, file)}: ${msg}`);

// 1a. every approved pair must meet AA
for (const [fg, bgs] of Object.entries(APPROVED)) {
  for (const bg of bgs) {
    const r = ratio(palette.get(fg)!, palette.get(bg)!);
    if (r < MIN_RATIO) errors.push(`approved pair ${fg} on ${bg} is only ${r.toFixed(2)}:1`);
  }
}

// ---------- collect sources ----------
function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(css|astro)$/.test(name)) out.push(p);
  }
  return out;
}
const files = walk(join(ROOT, 'src'));

const tokenOf = (value: string | undefined) => value?.match(/^var\(--c-([a-z-]+)\)$/)?.[1];

const checkPair = (file: string, sel: string, fgKey: string, fg: string, bgKey: string, bg: string) => {
  if (fg === bg) return;
  if (!APPROVED[fg]?.includes(bg)) {
    warn(file, `unapproved pair in "${sel.trim()}": ${fgKey} ${fg} on ${bgKey} ${bg}`);
  }
};

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const isTokens = file === TOKENS;

  // 2. colour literals
  if (!isTokens) {
    raw.split('\n').forEach((line, i) => {
      if (LITERAL_ALLOW.some(([f, s]) => file.endsWith(f) && line.includes(s))) return;
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      const lit = line.match(/#[0-9a-f]{3,8}\b(?![-\w])|\b(rgba?|hsla?)\(/i);
      // ignore href="#id" and anchors in markup
      if (lit && !/(href|id|aria-\w+|for)=["'{`]?#/.test(line) && !/['"`]#[a-z][\w-]*['"`]/i.test(line)) {
        warn(file, `line ${i + 1}: colour literal "${lit[0]}" — use a token from tokens.css`);
      }
    });
  }

  // CSS only (Astro <style> blocks or .css)
  const css = file.endsWith('.astro')
    ? [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')
    : raw;

  // 3. font families
  for (const m of css.matchAll(/font-family:\s*([^;]+);/g)) {
    if (isTokens) continue;
    if (!/^(var\(--font-(sans|serif)\)|inherit)$/.test(m[1].trim())) {
      warn(file, `font-family "${m[1].trim()}" — only var(--font-sans) / var(--font-serif) are allowed`);
    }
  }

  // 1b. pairs within each rule block
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, sel, body] = m;
    const decl = new Map<string, string>();
    for (const d of body.matchAll(/(--?[a-z-]+|[a-z-]+)\s*:\s*([^;]+);?/g))
      decl.set(d[1].trim(), d[2].trim());

    for (const [fgKey, bgKey] of PAIRS) {
      const fg = tokenOf(decl.get(fgKey));
      const bg = tokenOf(decl.get(bgKey));
      if (fg && bg) checkPair(file, sel, fgKey, fg, bgKey, bg);
    }
    const bgEntry = BG_KEYS.filter((k) => !k.startsWith('--card') && !k.startsWith('--btn'))
      .map((k) => [k, tokenOf(decl.get(k))] as const)
      .find(([, v]) => v);
    if (!bgEntry) continue;
    for (const fgKey of FG_KEYS.filter((k) => !k.startsWith('--card') && !k.startsWith('--btn'))) {
      const fg = tokenOf(decl.get(fgKey));
      if (fg) checkPair(file, sel, fgKey, fg, bgEntry[0], bgEntry[1]!);
    }
  }
}

if (errors.length) {
  console.error(`\n✖ Brand/contrast check failed (${errors.length}):\n  - ${errors.join('\n  - ')}\n`);
  process.exit(1);
}
const pairs = Object.values(APPROVED).flat().length;
console.log(
  `✔ Brand/contrast check passed — ${pairs} approved pairs ≥ ${MIN_RATIO}:1, ${files.length} files scanned.`,
);

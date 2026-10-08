/**
 * Minimal static server for `dist/` (shared by screenshots, qa and pdf scripts).
 * Mirrors a static host: directory URLs resolve to index.html, unknown paths serve 404.html.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

export async function startPreview(port = 4329): Promise<{ url: string; stop: () => void }> {
  const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    if (!path.startsWith(base)) path = base;
    path = normalize(path.slice(base.length - 1)).replace(/^(\.\.[/\\])+/, '');
    let file = join(DIST, path);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(await readFile(join(DIST, '404.html')).catch(() => 'Not found'));
    }
  });
  await new Promise<void>((r) => server.listen(port, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${port}${base}`, stop: () => server.close() };
}

/** Live (non-draft) routes, read from the built sitemap so the scripts never drift from content. */
export async function liveRoutes(url: string): Promise<string[]> {
  const xml = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
  const base = (process.env.BASE_PATH ?? '/').replace(/\/$/, '');
  void url;
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname.replace(base, '') || '/',
  );
}

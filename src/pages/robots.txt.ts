import type { APIRoute } from 'astro';

/**
 * Crawling stays allowed even when `site.noindex` is on — crawlers must be able to fetch
 * pages to see their `noindex` meta tag.
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemap = new URL(`${base}/sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

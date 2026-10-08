/**
 * `?for=<Client Name>` → a quiet "Prepared for <Client Name>" line in the hero and on the print cover.
 * Nothing is stored: the value is read from the URL and carried on internal links only.
 */
const MAX = 60;

export function sanitiseClient(raw: string | null): string {
  if (!raw) return '';
  return raw
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N} &'’.,()\-/]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX)
    .trim();
}

export function initPersonalise() {
  const params = new URLSearchParams(location.search);
  const client = sanitiseClient(params.get('for'));
  if (!client) return;

  document.querySelectorAll<HTMLElement>('[data-prepared-for]').forEach((el) => {
    const out = el.querySelector<HTMLElement>('[data-prepared-for-name]');
    if (out) out.textContent = client; // textContent only — never HTML
    el.hidden = false;
  });

  // Carry the parameter to internal page links so the whole document stays personalised.
  const base = location.origin;
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    if (/^(mailto:|tel:|#)/.test(href)) return;
    const u = new URL(href, location.href);
    if (u.origin !== base || u.pathname === location.pathname) return;
    u.searchParams.set('for', client);
    a.href = u.pathname + u.search + u.hash;
  });
}

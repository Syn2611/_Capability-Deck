/** Prefix an internal path with the configured base so the build works from any sub-folder. */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const [p, hash] = path.split('#');
  let clean = p.startsWith('/') ? p : `/${p}`;
  if (!/\.[a-z0-9]+$/i.test(clean) && !clean.endsWith('/')) clean += '/';
  return `${base}${clean}${hash ? `#${hash}` : ''}`;
}

/** Strip a phone number to tel: format. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Two-digit index, e.g. 1 → "01". */
export const pad = (n: number) => String(n).padStart(2, '0');

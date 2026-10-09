/**
 * Image output settings. `PREVIEW_LITE=1` (used by `npm run preview:lite`) emits one WebP per image
 * so the whole site fits in a single shareable preview; production builds emit AVIF + WebP at
 * responsive widths.
 */
import type { ImageOutputFormat } from 'astro';

const lite = process.env.PREVIEW_LITE === '1';

export function imageOpts(
  widths: number[],
  srcWidth: number,
): { formats: ImageOutputFormat[]; fallbackFormat?: ImageOutputFormat; widths: number[] } {
  const usable = widths.filter((w) => w <= srcWidth);
  const list = usable.length ? usable : [srcWidth];
  if (lite) {
    const one = list.filter((w) => w <= 1600).pop() ?? list[0];
    return { formats: ['webp'], fallbackFormat: 'webp', widths: [one] };
  }
  return { formats: ['avif', 'webp'], widths: list };
}

/** True for the single-file-per-image preview build. */
export const previewLite = lite;

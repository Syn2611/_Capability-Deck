import { $$, pageSignal } from './util';

/**
 * Touch screens have no hover, so leadership cards and sector tiles crossing the middle of the
 * viewport take their hover state as the visitor scrolls (`.is-current`): the card colour shift and
 * the tile's full-colour photo. A single tap still opens the profile or the sector.
 */
export function initPortraitCards() {
  if (!window.matchMedia('(hover: none)').matches) return;
  const cards = $$('[data-portrait-card], [data-colour-reveal]');
  if (!cards.length) return;
  const signal = pageSignal();

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.target.classList.toggle('is-current', e.isIntersecting);
    },
    { rootMargin: '-42% 0px -42% 0px' },
  );
  cards.forEach((c) => io.observe(c));
  signal.addEventListener('abort', () => io.disconnect());
}

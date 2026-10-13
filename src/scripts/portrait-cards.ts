import { $$, pageSignal } from './util';

/**
 * Touch screens have no hover, so the leadership cards crossing the middle of the viewport take
 * the hover colour as the visitor scrolls (`.is-current`). A single tap still opens the profile.
 */
export function initPortraitCards() {
  if (!window.matchMedia('(hover: none)').matches) return;
  const cards = $$('[data-portrait-card]');
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

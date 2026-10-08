import { $$, pageSignal, reducedMotion } from './util';

export function initReveal() {
  const items = $$('[data-reveal]:not(.is-in)');
  if (!items.length) return;
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  // Stagger children of a group automatically.
  $$('[data-reveal-group]').forEach((group) => {
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--i', String(i % 8)));
  });

  // A fully clipped element (clip-path: inset(0 0 100% 0)) never "intersects" in Chromium,
  // so clip reveals are observed through their parent.
  const targets = new Map<Element, HTMLElement[]>();
  for (const el of items) {
    const key = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
    targets.set(key, [...(targets.get(key) ?? []), el]);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        targets.get(e.target)?.forEach((el) => el.classList.add('is-in'));
        io.unobserve(e.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
  );
  targets.forEach((_, key) => io.observe(key));
  pageSignal().addEventListener('abort', () => io.disconnect());
}

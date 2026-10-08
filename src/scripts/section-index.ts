import { pageSignal } from './util';

export function initSectionIndex() {
  const nav = document.querySelector<HTMLElement>('[data-section-index]');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href*="#"]'));
  const targets = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!targets.length) return;
  const scroller = nav.querySelector<HTMLElement>('[data-index-scroller]');
  const signal = pageSignal();

  const setActive = (id: string | null) => {
    if (!id && scroller) scroller.scrollTo({ left: 0, behavior: 'smooth' });
    for (const a of links) {
      const on = a.hash === `#${id}`;
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
      if (on && scroller) {
        const left = a.offsetLeft - scroller.clientWidth / 2 + a.clientWidth / 2;
        scroller.scrollTo({ left, behavior: 'smooth' });
      }
    }
  };

  // A section is "active" when it crosses a line ~35% down the viewport.
  const visible = new Map<string, boolean>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting);
      const current = targets.find((t) => visible.get(t.id));
      setActive(current ? current.id : null);
    },
    { rootMargin: '-35% 0px -64% 0px', threshold: 0 },
  );
  targets.forEach((t) => io.observe(t));
  signal.addEventListener('abort', () => io.disconnect());
}

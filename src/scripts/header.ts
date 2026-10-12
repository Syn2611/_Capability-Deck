import { pageSignal } from './util';

const THRESHOLD = 40;
let bound = false;

function update() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  header.toggleAttribute('data-scrolled', window.scrollY > THRESHOLD);
}

export function initHeader() {
  update();
  if (bound) return;
  bound = true;
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
}

/**
 * On the overview page the header acts as a scrollspy: the underline moves to Sectors, Quality,
 * Track Record or Experts while that section is in view, and back to Overview elsewhere.
 */
export function initNavSpy() {
  const links = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-target]'));
  const ids = ['sectors', 'quality', 'track-record', 'experts'];
  const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
  if (!links.length || sections.length !== ids.length) return;
  const signal = pageSignal();

  const setActive = (target: string) => {
    for (const l of links) {
      const on = l.dataset.navTarget === target;
      if (on) l.setAttribute('aria-current', l.tagName === 'A' && target === 'overview' ? 'page' : 'true');
      else l.removeAttribute('aria-current');
    }
  };

  const visible = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      }
      setActive(ids.find((id) => visible.has(id)) ?? 'overview');
    },
    // A section counts as current when it crosses the middle of the viewport.
    { rootMargin: '-45% 0px -54% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  // Clicking a link moves the underline immediately; the observer then keeps it in sync.
  for (const l of links) {
    if (l.tagName === 'A') {
      l.addEventListener('click', () => setActive(l.dataset.navTarget ?? 'overview'), { signal });
    }
  }
  signal.addEventListener('abort', () => io.disconnect());
}

import { $$, pageSignal, reducedMotion } from './util';

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Splits "$7.8bn+" into prefix "$", number 7.8, suffix "bn+". */
function parse(value: string) {
  const m = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const raw = m[2].replace(/,/g, '');
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return { prefix: m[1], target: parseFloat(raw), suffix: m[3], decimals, grouped: m[2].includes(',') };
}

export function initCountUp() {
  const els = $$('[data-count]:not([data-counted])');
  if (!els.length || reducedMotion() || !('IntersectionObserver' in window)) return;

  const run = (el: HTMLElement) => {
    el.setAttribute('data-counted', '');
    const out = el.querySelector<HTMLElement>('[data-count-out]');
    const p = parse(el.dataset.count ?? '');
    if (!out || !p) return;
    const fmt = (n: number) => {
      const s = n.toFixed(p.decimals);
      return (
        p.prefix +
        (p.grouped ? Number(s).toLocaleString('en-AU', { minimumFractionDigits: p.decimals }) : s) +
        p.suffix
      );
    };
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      out.textContent = fmt(p.target * easeOut(t));
      if (t < 1) requestAnimationFrame(tick);
      else out.textContent = el.dataset.count ?? '';
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          io.unobserve(el);
          run(el);
        }
      }
    },
    { threshold: 0.4 },
  );

  for (const el of els) {
    // Only zero-out figures that are still below the fold, so nothing visible ever flickers.
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight) {
      const out = el.querySelector<HTMLElement>('[data-count-out]');
      const p = parse(el.dataset.count ?? '');
      if (out && p) out.textContent = p.prefix + (0).toFixed(p.decimals) + p.suffix;
      io.observe(el);
    } else {
      el.setAttribute('data-counted', '');
    }
  }
  pageSignal().addEventListener('abort', () => io.disconnect());
}

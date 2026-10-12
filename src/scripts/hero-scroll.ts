import { pageSignal, reducedMotion } from './util';

/**
 * Home hero: scroll scrubs a dusk → night time-lapse drawn on a canvas, while the copy is told
 * in three beats. Progress is written to the section as `--p` (0–1); each beat gets
 * `--bN` (opacity 0–1) and `--yN` (lift in px) so CSS can hand one message over to the next.
 *
 * Frames: /hero-frames/v1/{lg,sm}/f001.webp … — `sm` on narrow screens or Save-Data.
 * Adjacent frames are cross-faded, so 60 frames read as continuous motion.
 */
export function initHeroScroll() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = hero?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!hero || !canvas || reducedMotion()) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  const signal = pageSignal();

  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const set = window.innerWidth < 900 || conn?.saveData ? 'sm' : 'lg';
  const count = Number(hero.dataset[set === 'lg' ? 'framesLg' : 'framesSm']) || 0;
  const base = hero.dataset.framesBase ?? '/hero-frames/v1/';
  if (!count) return;

  const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
  const src = (i: number) => `${base}${set}/f${String(i + 1).padStart(3, '0')}.webp`;

  const load = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        frames[i] = img;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src(i);
    });

  // ---- Sizing ----
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let cw = 0;
  let ch = 0;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    cw = Math.round(r.width * dpr);
    ch = Math.round(r.height * dpr);
    canvas.width = cw;
    canvas.height = ch;
    lastKey = '';
  };

  // Draw an image with object-fit: cover, focal point slightly right of centre (CBD + bridge).
  const cover = (img: HTMLImageElement, alpha: number) => {
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) * 0.58, (ch - h) * 0.5, w, h);
  };

  const nearestLoaded = (i: number) => {
    for (let d = 0; d < count; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  };

  // ---- Copy beats: [fade-in start, fully in, fade-out start, fully out] as scroll progress ----
  const BEATS: [number, number, number, number][] = [
    [0, 0, 0.16, 0.24], // title — visible on load
    [0.28, 0.36, 0.52, 0.6], // lead sentence
    [0.64, 0.72, 2, 2], // actions — stay until the hero hands over
    // Gaps between beats are deliberate: each message clears before the next one arrives.
  ];
  const RISE = 16;
  const beatEls = Array.from(hero.querySelectorAll<HTMLElement>('.hero__beat'));
  const ramp = (x: number, a: number, b: number) => (b <= a ? (x >= a ? 1 : 0) : Math.min(1, Math.max(0, (x - a) / (b - a))));
  const applyBeats = () => {
    BEATS.forEach(([a, b, c, d], i) => {
      const fadeIn = a === 0 && b === 0 ? 1 : ramp(progress, a, b);
      const fadeOut = 1 - ramp(progress, c, d);
      const v = Math.min(fadeIn, fadeOut);
      // Enter from below, leave upwards.
      const y = fadeIn < 1 ? (1 - fadeIn) * RISE : -(1 - fadeOut) * RISE;
      hero.style.setProperty(`--b${i}`, v.toFixed(3));
      hero.style.setProperty(`--y${i}`, `${y.toFixed(1)}px`);
      beatEls[i]?.classList.toggle('is-active', v > 0.5);
    });
  };

  // ---- State ----
  let progress = 0;
  let lastKey = '';
  let raf = 0;
  let inView = true;

  const readProgress = () => {
    const r = hero.getBoundingClientRect();
    const runway = hero.offsetHeight - (hero.firstElementChild as HTMLElement).offsetHeight;
    progress = runway > 0 ? Math.min(1, Math.max(0, -r.top / runway)) : 0;
  };

  const render = () => {
    raf = 0;
    hero.style.setProperty('--p', progress.toFixed(4));
    applyBeats();

    const f = progress * (count - 1);
    const i = Math.floor(f);
    const t = f - i;
    const key = `${f.toFixed(3)}|${cw}x${ch}`;
    if (key !== lastKey && cw && ch) {
      const a = nearestLoaded(i);
      if (a >= 0) {
        lastKey = key;
        cover(frames[a]!, 1);
        const b = i + 1;
        if (a === i && t > 0.001 && frames[b]) cover(frames[b]!, t);
        ctx.globalAlpha = 1;
      }
    }
  };

  const schedule = () => {
    if (!raf && inView) raf = requestAnimationFrame(render);
  };

  // ---- Boot: first frame immediately, the rest progressively ----
  hero.classList.add('is-scrubbing');
  resize();
  readProgress();

  load(0).then(() => {
    schedule();
    hero.classList.add('is-ready');
    const rest = Array.from({ length: count - 1 }, (_, k) => k + 1);
    // Coarse pass first (every 6th frame) so scrubbing works early, then fill the gaps.
    const order = [...rest.filter((k) => k % 6 === 0), ...rest.filter((k) => k % 6 !== 0)];
    const start = () => {
      let next = 0;
      const worker = async () => {
        while (next < order.length && !signal.aborted) {
          const k = order[next++];
          await load(k);
          if (Math.abs(k - progress * (count - 1)) < 2) {
            lastKey = '';
            schedule();
          }
        }
      };
      for (let w = 0; w < 4; w++) worker();
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true, signal });
  });

  // ---- Listeners ----
  window.addEventListener(
    'scroll',
    () => {
      readProgress();
      schedule();
    },
    { passive: true, signal },
  );
  window.addEventListener(
    'resize',
    () => {
      resize();
      readProgress();
      schedule();
    },
    { passive: true, signal },
  );


  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) schedule();
  });
  io.observe(hero);
  signal.addEventListener('abort', () => {
    io.disconnect();
    if (raf) cancelAnimationFrame(raf);
  });
}

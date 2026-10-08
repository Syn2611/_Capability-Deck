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

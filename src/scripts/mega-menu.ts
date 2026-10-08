import { pageSignal } from './util';

export function initMegaMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-mega-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mega]');
  if (!toggle || !panel) return;
  const signal = pageSignal();

  const open = () => {
    panel.hidden = false;
    requestAnimationFrame(() => panel.setAttribute('data-open', ''));
    toggle.setAttribute('aria-expanded', 'true');
  };

  const close = (returnFocus = false) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.removeAttribute('data-open');
    const done = () => {
      if (!panel.hasAttribute('data-open')) panel.hidden = true;
    };
    panel.addEventListener('transitionend', done, { once: true });
    setTimeout(done, 300);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener(
    'click',
    () => (toggle.getAttribute('aria-expanded') === 'true' ? close() : open()),
    { signal },
  );

  toggle.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open();
        requestAnimationFrame(() => panel.querySelector<HTMLElement>('a')?.focus());
      }
    },
    { signal },
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') close(panel.contains(document.activeElement));
    },
    { signal },
  );

  document.addEventListener(
    'click',
    (e) => {
      const t = e.target as Node;
      if (!panel.contains(t) && !toggle.contains(t)) close();
    },
    { signal },
  );

  // Close when focus leaves both the trigger and the panel.
  panel.addEventListener(
    'focusout',
    (e) => {
      const next = e.relatedTarget as Node | null;
      if (next && !panel.contains(next) && next !== toggle) close();
    },
    { signal },
  );

  panel.addEventListener(
    'click',
    (e) => {
      if ((e.target as HTMLElement).closest('a')) close();
    },
    { signal },
  );
}

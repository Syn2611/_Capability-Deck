import { pageSignal } from './util';

export function initMobileMenu() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-menu]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn) return;
  const signal = pageSignal();

  openBtn.addEventListener('click', () => dialog.showModal(), { signal });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener(
    'click',
    (e) => {
      if ((e.target as HTMLElement).closest('[data-menu-link]')) dialog.close();
    },
    { signal },
  );
  // Close if the viewport grows past the mobile breakpoint.
  window.matchMedia('(min-width: 1024px)').addEventListener(
    'change',
    (e) => {
      if (e.matches && dialog.open) dialog.close();
    },
    { signal },
  );
}

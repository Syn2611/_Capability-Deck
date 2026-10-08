import { $$, pageSignal } from './util';

let bound = false;
let reopened: HTMLDetailsElement[] = [];

export function initPrint() {
  $$('[data-print]').forEach((b) =>
    b.addEventListener('click', () => window.print(), { signal: pageSignal() }),
  );

  if (bound) return;
  bound = true;
  // Expand every accordion for print, then restore.
  window.addEventListener('beforeprint', () => {
    reopened = $$<HTMLDetailsElement>('details:not([open])');
    reopened.forEach((d) => (d.open = true));
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    $$('[data-group][hidden]').forEach((el) => {
      el.hidden = false;
      el.dataset.printShown = '';
    });
  });
  window.addEventListener('afterprint', () => {
    reopened.forEach((d) => (d.open = false));
    reopened = [];
    $$('[data-print-shown]').forEach((el) => {
      el.hidden = true;
      delete el.dataset.printShown;
    });
  });
}

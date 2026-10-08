import { $$, pageSignal } from './util';

/** Native <dialog> for expert bios: opened by [data-dialog-open="<id>"]. */
export function initDialogs() {
  const signal = pageSignal();
  let opener: HTMLElement | null = null;

  $$('[data-dialog-open]').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const d = document.getElementById(btn.dataset.dialogOpen ?? '') as HTMLDialogElement | null;
        if (!d) return;
        opener = btn;
        d.showModal();
      },
      { signal },
    );
  });

  $$<HTMLDialogElement>('dialog[data-expert-dialog]').forEach((d) => {
    d.querySelectorAll('[data-dialog-close]').forEach((b) =>
      b.addEventListener('click', () => d.close(), { signal }),
    );
    // Light dismiss: click on the backdrop (the dialog element itself, outside its panel).
    d.addEventListener(
      'click',
      (e) => {
        if (e.target === d) d.close();
      },
      { signal },
    );
    d.addEventListener('close', () => opener?.focus(), { signal });
  });
}

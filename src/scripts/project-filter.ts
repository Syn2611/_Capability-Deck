import { $$, pageSignal, reducedMotion } from './util';

type VTDocument = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

export function initProjectFilter() {
  const root = document.querySelector<HTMLElement>('[data-project-filter]');
  if (!root) return;
  const buttons = $$<HTMLButtonElement>('[data-filter]', root);
  const cards = $$('[data-group]', root);
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const signal = pageSignal();
  const total = cards.length;

  const apply = (group: string) => {
    let shown = 0;
    for (const c of cards) {
      const match = group === 'all' || c.dataset.group === group;
      c.hidden = !match;
      if (match) shown++;
    }
    if (status) {
      status.textContent =
        group === 'all' ? `Showing all ${total} engagements` : `Showing ${shown} of ${total} engagements`;
    }
  };

  const select = (btn: HTMLButtonElement) => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const group = btn.dataset.filter ?? 'all';
    const doc = document as VTDocument;

    if (!reducedMotion() && doc.startViewTransition) {
      // Name each card only for the duration of this transition so it cross-fades & glides.
      cards.forEach((c, i) => (c.style.viewTransitionName = `project-${i}`));
      const vt = doc.startViewTransition(() => apply(group));
      vt.finished.finally(() => cards.forEach((c) => (c.style.viewTransitionName = '')));
      return;
    }

    if (reducedMotion()) {
      apply(group);
      return;
    }

    // Fallback: fade out, swap, fade in.
    const grid = root.querySelector<HTMLElement>('[data-filter-grid]');
    grid?.classList.add('is-fading');
    window.setTimeout(() => {
      apply(group);
      requestAnimationFrame(() => grid?.classList.remove('is-fading'));
    }, 250);
  };

  buttons.forEach((b) => b.addEventListener('click', () => select(b), { signal }));
}

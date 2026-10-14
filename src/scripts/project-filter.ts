import { $$, pageSignal, reducedMotion } from './util';

type VTDocument = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

export function initProjectFilter() {
  const root = document.querySelector<HTMLElement>('[data-project-filter]');
  if (!root) return;
  const buttons = $$<HTMLButtonElement>('[data-filter]', root);
  const cards = $$('[data-group]', root);
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const more = root.querySelector<HTMLButtonElement>('[data-filter-more]');
  const signal = pageSignal();
  const total = cards.length;
  // Phones show a preview under "All" (CSS hides .project--extra until expanded)
  const phone = window.matchMedia('screen and (max-width: 599px)');
  let group = 'all';

  const updateStatus = (shown: number) => {
    if (!status) return;
    const preview = group === 'all' && phone.matches && more && !root.classList.contains('is-expanded');
    const visible = preview ? cards.filter((c) => !c.classList.contains('project--extra')).length : shown;
    status.textContent =
      visible === total ? `Showing all ${total} engagements` : `Showing ${visible} of ${total} engagements`;
  };

  const apply = (next: string) => {
    group = next;
    root.classList.toggle('is-filtered', group !== 'all');
    let shown = 0;
    for (const c of cards) {
      const match = group === 'all' || c.dataset.group === group;
      c.hidden = !match;
      if (match) shown++;
    }
    updateStatus(shown);
  };

  more?.addEventListener(
    'click',
    () => {
      const first = cards.find((c) => c.classList.contains('project--extra'));
      root.classList.add('is-expanded');
      updateStatus(total);
      // Keep keyboard and screen-reader users at the first newly shown project
      first?.querySelector<HTMLElement>('h3')?.setAttribute('tabindex', '-1');
      first?.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
    },
    { signal },
  );
  phone.addEventListener('change', () => updateStatus(cards.filter((c) => !c.hidden).length), { signal });
  updateStatus(total);

  const select = (btn: HTMLButtonElement) => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const next = btn.dataset.filter ?? 'all';
    const doc = document as VTDocument;

    if (!reducedMotion() && doc.startViewTransition) {
      // Name each card only for the duration of this transition so it cross-fades & glides.
      cards.forEach((c, i) => (c.style.viewTransitionName = `project-${i}`));
      const vt = doc.startViewTransition(() => apply(next));
      vt.finished.finally(() => cards.forEach((c) => (c.style.viewTransitionName = '')));
      return;
    }

    if (reducedMotion()) {
      apply(next);
      return;
    }

    // Fallback: fade out, swap, fade in.
    const grid = root.querySelector<HTMLElement>('[data-filter-grid]');
    grid?.classList.add('is-fading');
    window.setTimeout(() => {
      apply(next);
      requestAnimationFrame(() => grid?.classList.remove('is-fading'));
    }, 250);
  };

  buttons.forEach((b) => b.addEventListener('click', () => select(b), { signal }));
}

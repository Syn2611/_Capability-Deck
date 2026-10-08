export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Abort controller reset on every navigation so per-page listeners never leak. */
let pageController = new AbortController();
document.addEventListener('astro:before-swap', () => {
  pageController.abort();
  pageController = new AbortController();
});
export const pageSignal = () => pageController.signal;

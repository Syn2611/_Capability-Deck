/**
 * Single client entry. Every module re-initialises on `astro:page-load`, which fires on the first
 * load and after every View-Transition navigation (Astro ClientRouter).
 */
import { initHeader } from './header';
import { initMegaMenu } from './mega-menu';
import { initMobileMenu } from './mobile-menu';
import { initSectionIndex } from './section-index';
import { initReveal } from './reveal';
import { initCountUp } from './count-up';
import { initProjectFilter } from './project-filter';
import { initDialogs } from './dialogs';
import { initPersonalise } from './personalise';
import { initPrint } from './print';

const inits = [
  initHeader,
  initMegaMenu,
  initMobileMenu,
  initSectionIndex,
  initReveal,
  initCountUp,
  initProjectFilter,
  initDialogs,
  initPersonalise,
  initPrint,
];

document.addEventListener('astro:page-load', () => {
  for (const init of inits) {
    try {
      init();
    } catch (err) {
      console.error(err);
    }
  }
});

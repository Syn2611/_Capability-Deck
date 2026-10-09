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

const run = () => {
  for (const init of inits) {
    try {
      init();
    } catch (err) {
      console.error(err);
    }
  }
};

document.addEventListener('astro:page-load', run);
// Without the client router (preview build), `astro:page-load` never fires: run once on load.
if (!document.querySelector('meta[name="astro-view-transitions-enabled"]')) run();

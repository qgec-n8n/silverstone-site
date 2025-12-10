/*
 * app.js
 *
 * Entry point for the Silverstone site’s client-side behaviour. This
 * file imports the individual modules and initializes them on DOM
 * ready. It also handles page-specific initializations, such as
 * premium gallery and marquee decisions based on body classes.
 */

import { initHeaderNav } from './header-nav.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initStatsCounters } from './stats.js';
import { initParallax } from './parallax.js';
import { initHeroShader } from './hero-shader.js';
import { initMagneticButtons } from './magnetic-buttons.js';
import { initMarquees } from './marquee.js';
import { initPremiumGallery } from './gallery.js';

/**
 * Initialize all modules when the document is ready. Modules are only
 * invoked if their corresponding elements exist on the page.
 */
function init() {
  initHeaderNav();
  initScrollReveal();
  initStatsCounters();
  initParallax();
  initHeroShader();
  initMagneticButtons();
  initMarquees();
  // Only initialize premium gallery on the services page.
  if (document.body.classList.contains('page-services')) {
    initPremiumGallery();
  }
  // TODO: Add initCookieConsent() and initContactForm() when refactoring inline scripts.
}

// Run initialization after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
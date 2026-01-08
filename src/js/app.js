(function () {
  'use strict';

  function ensureStylesheet(href) {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${href}`;
    document.head.appendChild(link);
  }

  function loadBaseStyles() {
    ensureStylesheet('assets/css/custom.css');
    ensureStylesheet('assets/css/mobile.css');
  }

  function ensureWhatsAppStickyButton() {
    if (document.querySelector('.whatsapp-sticky-button')) return;
    const link = document.createElement('a');
    // SPEC: WHATSAPP_STICKY_BUTTON_INJECT_ALL_PAGES_2026_01_08
    link.className = 'whatsapp-sticky-button';
    link.href = 'https://wa.me/447418329232';
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Chat on WhatsApp');
    link.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(link);
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.Silverstone = window.Silverstone || {};
    const api = window.Silverstone;

    loadBaseStyles();
    ensureWhatsAppStickyButton();

    if (api.initHeaderNav) api.initHeaderNav();
    if (api.initScrollReveal) api.initScrollReveal();
    if (api.initStats) api.initStats();
    if (api.initParallax) api.initParallax();
  });
})();

(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initScrollReveal() {
    if (initialized) return;
    initialized = true;

    const animatedEls = document.querySelectorAll('.animate');
    animatedEls.forEach((el) => {
      el.classList.add('visible');
      el.classList.remove('animate');
    });

    document.querySelectorAll('.gallery-grid .neon-card').forEach((el) =>
      el.classList.add('visible'),
    );
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();

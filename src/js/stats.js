(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initStats() {
    if (initialized) return;
    initialized = true;

    const statsSections = Array.from(document.querySelectorAll('.stats')).filter(
      (section) => section.dataset.counter !== 'off',
    );
    if (!statsSections.length) return;

    const setSectionValues = (section) => {
      const numbers = section.querySelectorAll('.number');
      numbers.forEach((number) => {
        const target = parseInt(number.dataset.target, 10) || 0;
        const plus = number.getAttribute('data-plus') || '';
        number.textContent = target.toLocaleString() + plus;
      });
    };

    statsSections.forEach(setSectionValues);
  }

  window.Silverstone.initStats = initStats;
})();

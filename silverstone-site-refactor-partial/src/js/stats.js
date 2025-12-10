/*
 * stats.js
 *
 * Animates number counters in `.stats` sections. Each `.number`
 * element should have a data-target attribute specifying the final
 * value to count to. Observes when the stats section enters view
 * and counts up with requestAnimationFrame.
 */

export function initStatsCounters() {
  /*
   * Initialise animated number counters for statistic sections.
   *
   * Each `.stats` container holds several `.number` elements with a
   * `data-target` attribute indicating the final numeric value to
   * display.  An optional `data-plus="+"` attribute appends a plus
   * sign after counting completes.  Counters do not run when the
   * section’s `data-counter` is set to "off".
   *
   * The animation respects the user’s reduced motion preferences: if
   * `prefers-reduced-motion` is enabled, the numbers jump directly to
   * their target values without animating.  Otherwise, numbers count
   * up smoothly over a fixed duration when the section enters the
   * viewport.
   */
  // Find all stats sections that are not explicitly disabled
  const statsSections = Array.from(document.querySelectorAll('.stats')).filter(
    (section) => section.dataset.counter !== 'off',
  );
  if (!statsSections.length) return;

  // Determine if we should skip animations entirely for accessibility
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  /**
   * Animate the numbers inside a single stats section.
   * @param {HTMLElement} section The stats container
   */
  function animateSection(section) {
    const numbers = section.querySelectorAll('.number');
    numbers.forEach((number) => {
      const target = parseInt(number.dataset.target, 10) || 0;
      const plus = number.getAttribute('data-plus') || '';
      // If reduced motion is requested, jump straight to the target
      if (prefersReducedMotion) {
        number.textContent = target.toLocaleString() + plus;
        return;
      }
      const duration = 1500; // total animation time in ms
      const startTime = performance.now();
      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        number.textContent = current.toLocaleString() + (progress === 1 ? plus : '');
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // Use an IntersectionObserver to trigger animations when sections are visible
  statsSections.forEach((section) => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateSection(section);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(section);
  });
}
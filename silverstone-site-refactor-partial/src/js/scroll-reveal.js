/*
 * scroll-reveal.js
 *
 * IntersectionObserver-based reveal animations for elements marked
 * `.animate`. When elements become visible, the `.visible` class
 * is added to animate them into view.
 */

export function initScrollReveal() {
  /*
   * Reveal elements with the `.animate` class as they enter the viewport.
   * This implementation mirrors the behaviour in the original script:
   *  - If the user prefers reduced motion or the viewport is mobile
   *    sized (<=768px) then all `.animate` elements are revealed
   *    immediately.
   *  - Otherwise an IntersectionObserver is used to add the `.visible`
   *    class when the element scrolls into view.  A threshold of 0.15
   *    roughly corresponds to 15% of the element being visible before
   *    the animation triggers.
   *  - Additionally, any `.neon-card` children within a `.gallery-grid`
   *    are immediately revealed so that the premium gallery retains
   *    its neon glow on load.
   */
  const MOBILE_BREAKPOINT = 768;
  const animatedEls = document.querySelectorAll('.animate');
  if (!animatedEls.length) return;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const mobileViewport = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT}px)`,
  ).matches;
  if (prefersReducedMotion || mobileViewport) {
    animatedEls.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 },
    );
    animatedEls.forEach((el) => observer.observe(el));
  }
  // Reveal neon cards in the gallery grid on initial load
  document
    .querySelectorAll('.gallery-grid .neon-card')
    .forEach((el) => el.classList.add('visible'));
}
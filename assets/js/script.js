/*
  Customised Silverstone JavaScript (v24)

  This version provides a refined parallax and auto‑scroll experience across
  all pages. The hero background moves more slowly relative to the scroll,
  scales up further and dims more dramatically, and the following section
  fades in and slides up as the user scrolls. A custom smooth scroll
  animation prevents the user from interrupting the transition when moving
  between sections and accounts for the header height when aligning
  sections. All animations are disabled when the user prefers reduced
  motion.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Respect user motion preferences; exit early if reduced motion is requested
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const nextSection = hero ? hero.nextElementSibling : null;
  const header = document.querySelector('header');
  // Guard against missing elements
  if (!hero || !nextSection || !header) return;

  // Prepare the next section for the fade/slide transition. It starts
  // invisible and translated down slightly; CSS transitions ensure it
  // animates smoothly when properties change.
  nextSection.style.opacity = '0';
  nextSection.style.transform = 'translateY(50px)';
  nextSection.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

  // Easing function for the custom smooth scroll (easeInOutQuad)
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let autoScrolling = false;
  /**
   * Smoothly scrolls the window to targetY over the given duration (ms).
   * Uses the easeInOutQuad function for a gentle start and end.
   * Sets and clears the autoScrolling flag to block user scroll input.
   */
  function animateScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime;
    autoScrolling = true;
    function step(ts) {
      if (startTime === undefined) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        autoScrolling = false;
      }
    }
    requestAnimationFrame(step);
  }

  // Parallax and cross‑fade on scroll
  window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const progress = Math.min(offset / heroHeight, 1);
    // Slow parallax: background moves at 10% of scroll rate
    hero.style.backgroundPositionY = -(offset * 0.1) + 'px';
    // Exaggerated scale and brightness adjustments
    hero.style.transform = 'scale(' + (1 + progress * 0.10).toFixed(3) + ')';
    hero.style.filter = 'brightness(' + (1 - progress * 0.50).toFixed(3) + ')';
    // Fade in and slide up the next section
    nextSection.style.opacity = progress.toFixed(3);
    const translateY = (1 - progress) * 50;
    nextSection.style.transform = 'translateY(' + translateY.toFixed(1) + 'px)';
  }, { passive: true });

  // Trigger auto‑scroll on wheel events
  window.addEventListener('wheel', (evt) => {
    // Block user scroll input during auto scroll to maintain the effect
    if (autoScrolling) {
      evt.preventDefault();
      return;
    }
    const direction = evt.deltaY;
    const heroHeight = hero.offsetHeight;
    const headerHeight = header.offsetHeight;
    const scrollY = window.pageYOffset;
    const nextTop = nextSection.offsetTop;
    const threshold = heroHeight * 0.10;
    if (direction > 0 && scrollY < heroHeight - threshold) {
      evt.preventDefault();
      animateScrollTo(nextTop - headerHeight, 2500);
    } else if (direction < 0 && scrollY >= nextTop && scrollY < nextTop + nextSection.offsetHeight) {
      evt.preventDefault();
      animateScrollTo(0, 2500);
    }
  }, { passive: false });
});
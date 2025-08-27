/*
  Customised Silverstone JavaScript (v24 with CTA fix)

  This script enhances the hero parallax scroll effect introduced in v24
  while restoring the fade‑in animations used throughout the site.  The
  parallax effect causes the hero background to move more slowly than
  the scroll, scales and darkens as you scroll, and automatically
  transitions to the next section.  At the same time, we reinstate the
  Intersection Observer used in earlier versions of the site to reveal
  elements marked with the `.animate` class.  Without this observer
  the call‑to‑action sections at the bottom of each page remained
  hidden.  By running the observer separately from the parallax logic
  the CTAs and other animated elements become visible again.
*/

// Parallax and auto‑scroll logic
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
  window.addEventListener(
    'scroll',
    () => {
      const offset = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(offset / heroHeight, 1);
      /*
       * Make the parallax effect far more pronounced. The background moves
       * at 20% of the scroll rate instead of 10%, the hero scales up by
       * up to 20% and darkens significantly.  We also update a CSS
       * custom property (--overlay-opacity) used by the ::after pseudo
       * element to create a tinted overlay (defined in custom.css).
       * Finally, the following section slides up a greater distance for
       * a more cinematic reveal.
       */
      hero.style.backgroundPositionY = -(offset * 0.2) + 'px';
      hero.style.transform =
        'scale(' + (1 + progress * 0.2).toFixed(3) + ')';
      hero.style.filter =
        'brightness(' + (1 - progress * 0.6).toFixed(3) + ')';
      hero.style.setProperty('--overlay-opacity', (progress * 0.6).toFixed(3));
      // Fade in and slide up the next section
      nextSection.style.opacity = progress.toFixed(3);
      const translateY = (1 - progress) * 100;
      nextSection.style.transform = 'translateY(' + translateY.toFixed(1) + 'px)';
    },
    { passive: true }
  );

  // Trigger auto‑scroll on wheel events
  window.addEventListener(
    'wheel',
    (evt) => {
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
      // Use a larger threshold (50% of the hero height) to delay auto‑scroll
      // until the visitor has experienced more of the parallax animation.
      const threshold = heroHeight * 0.5;
      if (direction > 0 && scrollY < heroHeight - threshold) {
        evt.preventDefault();
        animateScrollTo(nextTop - headerHeight, 2500);
      } else if (
        direction < 0 &&
        scrollY >= nextTop &&
        scrollY < nextTop + nextSection.offsetHeight
      ) {
        evt.preventDefault();
        animateScrollTo(0, 2500);
      }
    },
    { passive: false }
  );
});

// Fade‑in animations for elements marked with `.animate`
// The parallax code above no longer manages these elements, so without
// restoring the observer the CTAs at the bottom of pages remain hidden.
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate');
  if (animatedElements.length > 0) {
    const observerOptions = { root: null, threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    animatedElements.forEach((el) => observer.observe(el));
  }
});

// Ensure Innovation Gallery cards are visible immediately (v17 patch)
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.gallery-grid .neon-card')
    .forEach((el) => el.classList.add('visible'));
});
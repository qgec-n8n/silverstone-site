/*
  Customised Silverstone JavaScript (v25)

  This version of the parallax script addresses two key issues reported with the existing code:
  1. The parallax animation had a small “dead zone” where scrolling would not trigger
     the transition between the hero section and the next section.
  2. When it did fire the effect was subtle and short, giving the site a cheap feel.

  The updated implementation removes any threshold for triggering the effect so it
  begins as soon as the user starts to scroll down or up.  The scroll animation
  itself has been extended to 2.5 seconds to create a longer, cinematic transition.
  During the animation the hero scales up and darkens more dramatically, and the next
  section fades in from a greater offset.  Auto scrolling is blocked while the
  animation runs, and reduced‑motion and privacy policy pages are respected.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Honour user motion preferences; skip the effect entirely when reduced motion is requested
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Avoid running the parallax on the privacy policy page
  const pathname = window.location.pathname;
  if (pathname.includes('privacy')) return;

  const hero = document.querySelector('.hero');
  const nextSection = hero ? hero.nextElementSibling : null;
  const header = document.querySelector('header');
  // If any of these elements are missing bail early
  if (!hero || !nextSection || !header) return;

  // Prepare the next section: start hidden and offset further down for a bigger slide
  nextSection.style.opacity = '0';
  nextSection.style.transform = 'translateY(80px)';
  nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';

  // Quadratic easing for a smooth start and end to the auto-scroll animation
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let autoScrolling = false;

  /**
   * Smoothly scroll the window to a given Y coordinate over the specified duration.
   * A custom easing function creates a polished feel.  While the animation runs
   * autoScrolling is true to block user wheel input.
   */
  function animateScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime;
    autoScrolling = true;
    function step(timestamp) {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
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

  // Update visual properties on every scroll to achieve the parallax effect
  window.addEventListener(
    'scroll',
    () => {
      const offset = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(offset / heroHeight, 1);

      // Background moves more slowly than the scroll position to create depth
      hero.style.backgroundPositionY = -(offset * 0.25) + 'px';
      // Scale up the hero slightly as the user scrolls further down
      hero.style.transform = 'scale(' + (1 + progress * 0.25).toFixed(3) + ')';
      // Darken the hero for a dramatic look by adjusting the brightness filter
      hero.style.filter = 'brightness(' + (1 - progress * 0.7).toFixed(3) + ')';
      // Update the CSS custom property controlling the overlay opacity
      hero.style.setProperty('--overlay-opacity', (progress * 0.7).toFixed(3));
      // Fade in and slide up the next section from a greater distance
      nextSection.style.opacity = progress.toFixed(3);
      const translateY = (1 - progress) * 120;
      nextSection.style.transform = 'translateY(' + translateY.toFixed(1) + 'px)';
    },
    { passive: true }
  );

  // Intercept wheel events to trigger the long scroll animation when exiting or re-entering the hero
  window.addEventListener(
    'wheel',
    (evt) => {
      // Block additional scroll input while auto scrolling is active
      if (autoScrolling) {
        evt.preventDefault();
        return;
      }
      const direction = evt.deltaY;
      const headerHeight = header.offsetHeight;
      const scrollY = window.pageYOffset;
      const nextTop = nextSection.offsetTop;

      // Downward scroll: trigger immediately when leaving the top of the page
      const downThreshold = 0;
      if (direction > 0 && scrollY <= downThreshold) {
        evt.preventDefault();
        // Scroll down over 2.5 seconds to just above the next section (accounting for header height)
        animateScrollTo(nextTop - headerHeight, 2500);
      } else if (direction < 0) {
        // Upward scroll: only trigger when the user is between the next section and the hero
        const upThreshold = 0;
        if (scrollY > nextTop - headerHeight && scrollY <= nextTop + upThreshold) {
          evt.preventDefault();
          animateScrollTo(0, 2500);
        }
      }
    },
    { passive: false }
  );
});

// Secondary DOMContentLoaded listener to handle fade‑in animations on other elements
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
  // Immediately reveal innovation gallery cards to avoid a delay on load
  document
    .querySelectorAll('.gallery-grid .neon-card')
    .forEach((el) => el.classList.add('visible'));
});
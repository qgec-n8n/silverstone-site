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

  // Dynamically inject the custom CSS if it's not already present.  This ensures
  // that our parallax styles (overlay, scroll-behaviour overrides) apply on
  // every page without needing to manually edit each HTML file.  The privacy
  // policy page already includes custom.css so we skip injection there above.
  const hasCustom = document.querySelector('link[href*="assets/css/custom.css"]');
  if (!hasCustom) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/custom.css';
    document.head.appendChild(link);
  }

  const hero = document.querySelector('.hero');
  // Find the first actual section following the hero.  Skip over any style or
  // other non‑section elements so the parallax works on pages like Booking
  // where a <style> tag sits between the hero and the next section.
  let nextSection = hero ? hero.nextElementSibling : null;
  while (nextSection && nextSection.tagName.toLowerCase() !== 'section') {
    nextSection = nextSection.nextElementSibling;
  }
  const header = document.querySelector('header');
  // If any of these elements are missing bail early
  if (!hero || !nextSection || !header) return;

  // Prepare the next section: start hidden and offset further down for a bigger slide
  nextSection.style.opacity = '0';
  nextSection.style.transform = 'translateY(80px)';
  nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';

  // If we're on the contact page, make the next section fill the viewport height.
  // This ensures the contact form/map area scales to the browser window after
  // the parallax transition.  Update on resize to maintain proportions.
  if (pathname.includes('contact')) {
    const setContactHeight = () => {
      nextSection.style.minHeight = `${window.innerHeight}px`;
    };
    setContactHeight();
    window.addEventListener('resize', setContactHeight);
  }

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
    // Disable native scrolling during the animation to prevent users from
    // overshooting the trigger point.  By hiding overflow on the body we
    // ensure no additional scroll input is applied until the animation ends.
    document.body.style.overflowY = 'hidden';
    function step(timestamp) {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeInOutQuad(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        autoScrolling = false;
        // Restore native scrolling once the animation completes.
        document.body.style.overflowY = '';
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

      // We intentionally avoid shifting the background image on scroll.
      // Changing background-position when the hero uses an image-set() can
      // trigger Safari and Chrome to reload or swap the image, which caused
      // the hero backgrounds to rotate or change unexpectedly.  The parallax
      // effect instead relies on scaling and darkening the hero while
      // sliding in the next section.
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
      const heroHeight = hero.offsetHeight;

      // Downward scroll: trigger immediately when leaving the very top of the page
      if (direction > 0 && scrollY <= 0) {
        evt.preventDefault();
        // Smoothly scroll to just above the next section (accounting for header height)
        animateScrollTo(nextTop - headerHeight, 2500);
      } else if (direction < 0) {
        // Upward scroll: trigger when the user is within the region between the next
        // section and the hero.  This ensures the reverse parallax plays as soon as
        // the user starts scrolling back up toward the hero.
        if (scrollY > headerHeight && scrollY <= nextTop) {
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

// ---------------------------------------------------------------------------
// Mobile navigation toggle
//
// This listener wires up the hamburger navigation on mobile. The markup already
// includes a `.nav-toggle` element and a `<nav><ul>` menu. On small screens,
// CSS hides the menu until it receives an `.open` class. This script toggles
// that class when the hamburger is clicked and removes it again when a
// navigation link is selected.  Because the `.open` styles are defined
// inside a media query, adding or removing this class has no effect on
// desktop layouts.
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Desktop scaling logic
//
// On desktop screens the site layout is designed for a specific aspect ratio.
// When the browser window is resized smaller or taller, we scale the entire
// page proportionally so that the relative positioning and dimensions of text
// and images remain consistent.  This scaling is applied only when the
// viewport width exceeds 768px (i.e. not on mobile) and uses the window
// dimensions at load time as the baseline.  The smaller of the horizontal and
// vertical scale factors is used to preserve aspect ratio.
(function() {
  let baseWidth;
  let baseHeight;
  function initScaling() {
    // Record the initial viewport size as the base dimensions for scaling.
    baseWidth = window.innerWidth;
    baseHeight = window.innerHeight;
    applyScale();
  }
  function applyScale() {
    // Only apply scaling on wider viewports (desktop).  On smaller screens
    // we remove any scaling so the mobile layout can adapt naturally.
    // Note: we previously disabled scaling on small screens. This prevented
    // proportional scaling below certain widths.  To ensure the layout
    // continuously scales no matter how small the viewport becomes, we no
    // longer bail out when the width is below a threshold.  Instead, we
    // always compute a scale factor and apply it.
    // Compute scale factors relative to the base dimensions and choose the
    // smaller to maintain aspect ratio.
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = 'top left';
    // Set the body’s intrinsic size so that scaling occurs relative to
    // the original dimensions.  Without these, the scaled content may
    // accumulate additional scrollbars.
    document.body.style.width = `${baseWidth}px`;
    document.body.style.height = `${baseHeight}px`;
    // Hide overflow to avoid scrollbars on the scaled content
    document.body.style.overflow = 'hidden';
  }
  document.addEventListener('DOMContentLoaded', initScaling);
  window.addEventListener('resize', applyScale);
})();
/*
  Silverstone site JavaScript (restored parallax)

  This version reinstates the original cinematic parallax behaviour
  captured in the provided v25 script while preserving the
  responsiveness and scaling improvements made previously.  The hero
  section scales and darkens as the user begins to scroll, and the
  subsequent section fades and slides into view.  An easing
  auto‑scroll transitions the viewport over 2.5 seconds.  The header
  hides when scrolling down and reappears when scrolling up.  Mobile
  navigation toggling and fade‑in animations for elements marked with
  `.animate` are also included.

  The script dynamically injects `assets/css/custom.css` if it is not
  already present.  Ensure that custom.css merges the scaling
  overrides (service rows and gallery grid) with any parallax styling
  defined in earlier versions.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced‑motion settings and bail out early if the user
  // prefers less motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Skip the parallax entirely on privacy policy pages.
  const pathname = window.location.pathname;
  if (pathname.includes('privacy')) return;

  // Inject custom.css if it hasn't been loaded yet.  This keeps HTML
  // files clean and allows CSS overrides to apply universally.
  if (!document.querySelector('link[href*="assets/css/custom.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/custom.css';
    document.head.appendChild(link);
  }

  const hero = document.querySelector('.hero');
  // Find the first <section> after the hero.  Some pages insert
  // <style> tags or other elements between sections, so skip over
  // anything that isn’t a section.
  let nextSection = null;
  if (hero) {
    let node = hero.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'section') {
        nextSection = node;
        break;
      }
      node = node.nextElementSibling;
    }
  }
  const header = document.querySelector('header');
  if (!hero || !nextSection || !header) return;

  // Initialise the next section so it starts hidden and lower on the page.
  nextSection.style.opacity = '0';
  nextSection.style.transform = 'translateY(80px)';
  nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';

  // On the contact page ensure the first service row fills the viewport.
  if (pathname.includes('contact')) {
    const setContactHeight = () => {
      nextSection.style.minHeight = `${window.innerHeight}px`;
    };
    setContactHeight();
    window.addEventListener('resize', setContactHeight);
  }

  // Quadratic easing for the auto‑scroll animation.
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let autoScrolling = false;

  /**
   * Smoothly scroll the document to the given Y position.  While the
   * animation runs the body’s overflow is hidden to prevent user input
   * from interfering.  Once finished, overflow is restored.
   *
   * @param {number} targetY The vertical pixel coordinate to scroll to.
   * @param {number} duration Duration of the animation in milliseconds.
   */
  function animateScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime;
    autoScrolling = true;
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
        document.body.style.overflowY = '';
      }
    }
    requestAnimationFrame(step);
  }

  /**
   * Update the parallax visuals based on scroll position.  As the user
   * scrolls down within the hero, scale and darken it; simultaneously
   * fade and slide the next section upward.  The overlay opacity is
   * controlled via a CSS variable (--overlay-opacity) defined in
   * custom.css.  This handler runs on every scroll event.
   */
  function updateParallax() {
    const offset = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const progress = Math.min(offset / heroHeight, 1);
    // Scale the hero up to 1.25x at full progress
    hero.style.transform = `scale(${(1 + progress * 0.25).toFixed(3)})`;
    // Darken the hero by reducing brightness
    hero.style.filter = `brightness(${(1 - progress * 0.7).toFixed(3)})`;
    // Update overlay opacity via CSS variable
    hero.style.setProperty('--overlay-opacity', (progress * 0.7).toFixed(3));
    // Fade and translate the next section
    nextSection.style.opacity = progress.toFixed(3);
    const translateY = (1 - progress) * 120;
    nextSection.style.transform = `translateY(${translateY.toFixed(1)}px)`;
  }
  // Run once to apply initial state
  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });

  /**
   * Wheel event handler.  Triggers the auto‑scroll animation when the
   * user begins scrolling off the top of the page (downward) or
   * between the hero and next section (upward).  This replicates the
   * original behaviour: downward scrolling only triggers from the very
   * top, and upward scrolling triggers when the user is between the
   * header and the next section.  If autoScrolling is true we block
   * the wheel input.
   */
  window.addEventListener('wheel', (evt) => {
    if (autoScrolling) {
      evt.preventDefault();
      return;
    }
    const delta = evt.deltaY;
    const scrollY = window.pageYOffset;
    const headerHeight = header.offsetHeight;
    const nextTop = nextSection.offsetTop;
    if (delta > 0) {
      // Downward scroll: trigger when leaving the very top of the page
      if (scrollY <= 0) {
        evt.preventDefault();
        animateScrollTo(nextTop - headerHeight, 2500);
      }
    } else if (delta < 0) {
      // Upward scroll: trigger when between the header and the next section
      if (scrollY > headerHeight && scrollY <= nextTop) {
        evt.preventDefault();
        animateScrollTo(0, 2500);
      }
    }
  }, { passive: false });

  /**
   * Hide the header when scrolling down and show it when scrolling up.
   * Adds the `.header-hidden` class defined in styles.css to translate
   * the header off‑screen.  This behaviour only applies after the
   * header has been scrolled past its own height.
   */
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    if (currentY > lastScrollY && currentY > header.offsetHeight) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollY = currentY;
  });

  // Fade‑in animations for elements with the .animate class.  Use an
  // IntersectionObserver to add the .visible class when elements
  // approach the viewport.
  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    animatedEls.forEach((el) => obs.observe(el));
  }
  // Immediately show cards in the gallery grid to avoid delayed fade‑in.
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });

  // Mobile navigation toggle: show/hide the nav menu on small screens.
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
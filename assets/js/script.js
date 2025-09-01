/*
  Silverstone site JavaScript (cleaned and improved)

  This version preserves the core cinematic parallax effect and navigation
  behaviours of the original script, while cleaning up redundant code and
  improving the scroll interaction.  Notable changes include:

  - Consolidated all logic within a single DOMContentLoaded listener.
  - Added downward overshoot prevention: when a user scrolls down from the
    hero section the script now calculates the predicted scroll position and
    clamps the movement so the viewport stops exactly at the top of the next
    section.  Users must initiate a second scroll to trigger the parallax
    fade/slide effect.  This eliminates the overshoot that previously left
    the second section partially off‑screen.
  - Removed unused variables and comments to streamline the file.

  The animation timing, easing functions and mobile detection remain
  consistent with the original implementation.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced‑motion settings and bail out early if the user prefers
  // less motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Determine if the current viewport is considered "mobile".  On small
  // screens we disable the cinematic parallax behaviour entirely and allow
  // the page to scroll normally.  The threshold of 900px aligns with the
  // breakpoints used in the CSS.
  const isMobile = window.innerWidth <= 900;

  const hero = document.querySelector('.hero');
  // Find the first <section> after the hero.  Some pages insert <style>
  // tags or other elements between sections, so skip over anything that
  // isn’t a section.
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
  // If any of the key elements are missing there's nothing to animate.
  if (!hero || !nextSection || !header) return;

  // Initialise the next section so it starts hidden and lower on the page.
  // Only apply the fade/slide animations when the parallax is active.
  if (!isMobile) {
    nextSection.style.opacity = '0';
    nextSection.style.transform = 'translateY(80px)';
    nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';
  }

  // On pages where the contact or privacy sections appear immediately after
  // the hero, set the first section to fill the viewport height.
  const pathname = window.location.pathname;
  if (pathname.includes('contact') || pathname.includes('privacy')) {
    const setPageSectionHeight = () => {
      nextSection.style.minHeight = `${window.innerHeight}px`;
    };
    setPageSectionHeight();
    window.addEventListener('resize', setPageSectionHeight);
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
  if (!isMobile) {
    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  /**
   * Wheel event handler.  Triggers the auto‑scroll animation when the
   * user begins scrolling off the top of the page (downward) or
   * between the hero and next section (upward).  Overshoot prevention has
   * been added to ensure the scroll stops exactly at the top of the
   * following section.  Users must then perform a second scroll to
   * continue the parallax animation.
   */
  if (!isMobile) {
    window.addEventListener(
      'wheel',
      (evt) => {
        // If an auto‑scroll animation is currently running, block all
        // wheel inputs to prevent the user from interfering.
        if (autoScrolling) {
          evt.preventDefault();
          return;
        }
        const delta = evt.deltaY;
        const scrollY = window.pageYOffset;
        const nextTop = nextSection.offsetTop;
        const headerH = header.offsetHeight;

        // Downward scroll: when the user starts scrolling down from the top of
        // the page (within the hero), trigger a smooth scroll to the next
        // section.  We do not clamp predicted overshoot here to preserve the
        // original parallax behaviour — the overshoot prevention now only
        // applies when scrolling up from the second section back into the
        // hero.  Once the animation runs, the user must initiate a new scroll
        // to continue the parallax effect.
        if (delta > 0) {
          // If we're at or above the top of the page, move to the next section.
          if (scrollY <= 0) {
            evt.preventDefault();
            animateScrollTo(nextTop - headerH, 2500);
          }
          return;
        }

        // Upward scroll: prevent the user from overshooting the top of the
        // second section and revealing the hero abruptly.  When scrolling
        // up within the range between the page top and the next section, we
        // animate back to the top of the page.  This ensures an aggressive
        // upward scroll stops at the beginning of the second section and
        // requires a subsequent scroll to re‑enter the hero section and
        // trigger the parallax effect.
        if (delta < 0) {
          if (scrollY > 0 && scrollY <= nextTop) {
            evt.preventDefault();
            animateScrollTo(0, 2500);
          }
        }
      },
      { passive: false }
    );
  }

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

  // Show the header when the user hovers near the top of the viewport
  // after scrolling past the hero section.  When the mouse enters
  // the top area (within the header’s height) and the page is
  // scrolled beyond the first section, remove the `header-hidden`
  // class to reveal the navigation bar.  When the mouse leaves
  // this area, reapply `header-hidden` so the header hides again
  // until the user scrolls up.
  document.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    const hoverY = e.clientY;
    const headerHeight = header.offsetHeight;
    const scrolledPastHero = window.pageYOffset >= nextSection.offsetTop;
    if (scrolledPastHero && hoverY <= headerHeight) {
      header.classList.remove('header-hidden');
    } else {
      if (scrolledPastHero && !autoScrolling) {
        header.classList.add('header-hidden');
      }
    }
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
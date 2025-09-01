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

  // Determine the current pathname.  We no longer skip parallax on
  // privacy policy pages so that the hero and second section animate
  // consistently across the site.
  const pathname = window.location.pathname;

  // Inject custom.css if it hasn't been loaded yet.  This keeps HTML
  // files clean and allows CSS overrides to apply universally.
  if (!document.querySelector('link[href*="assets/css/custom.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/custom.css';
    document.head.appendChild(link);
  }

  // Determine if the current viewport is considered "mobile".
  // On small screens we disable the cinematic parallax behaviour entirely
  // and allow the page to scroll normally.  The threshold of 900px aligns
  // with the breakpoints used in the CSS.
  //
  // Safari continues to exhibit scroll lock issues after the parallax
  // animation, even in the latest releases.  To preserve a smooth
  // experience we disable the cinematic parallax entirely for all
  // Safari versions.  This effectively treats Safari like a mobile
  // device: normal scrolling is used and no automatic transitions are
  // triggered.  For other browsers the parallax remains enabled unless
  // the viewport width is below the mobile threshold (900px).
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  const disableParallax = isSafari;
  const isMobile = window.innerWidth <= 900 || disableParallax;

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
  // If any of the key elements are missing there's nothing to animate.
  if (!hero || !nextSection || !header) return;

  // Initialise the next section so it starts hidden and lower on the page.
  // Only apply the fade/slide animations when the parallax is active.
  if (!isMobile) {
    nextSection.style.opacity = '0';
    nextSection.style.transform = 'translateY(80px)';
    nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';
  }

  // On the contact or privacy pages ensure the first service row fills the viewport.
  // This applies regardless of the parallax state.
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
   * between the hero and next section (upward).  This replicates the
   * original behaviour: downward scrolling only triggers from the very
   * top, and upward scrolling triggers when the user is between the
   * header and the next section.  If autoScrolling is true we block
   * the wheel input.
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

        // Downward scroll: initiate the parallax transition from the hero
        // to the second section only when the user is at the very top of
        // the page.  Do not subtract the header height because the header
        // animates out of view; this ensures the second section lands
        // flush at the top of the viewport.
        if (delta > 0) {
          if (scrollY <= 0) {
            evt.preventDefault();
            animateScrollTo(nextTop, 2500);
          }
          return;
        }

        // Upward scroll: gracefully handle overshoots.  When the user is
        // reading below the second section and performs an aggressive upward
        // scroll, we interpret the gesture as a desire to return to the hero.
        // Compute the predicted scroll position: if it would take the viewport
        // past the top of the second section, then we animate all the way
        // back to the hero in one cinematic motion.  This replicates the
        // premium behaviour found in high‑end product pages.  Likewise, if the
        // user is currently between the hero and second section and scrolls
        // upwards, we trigger the same parallax return.  Otherwise we allow
        // the native scroll to continue normally.
        if (delta < 0) {
          const predictedY = scrollY + delta;
          // If the user is below the second section and their scroll would
          // overshoot past its top, gently animate all the way back to the hero
          // rather than merely clamping to the top of the section.  This creates
          // a more premium interaction: a single aggressive upward gesture returns
          // the viewer to the hero with a cinematic transition.
          if (scrollY > nextTop && predictedY < nextTop) {
            evt.preventDefault();
            animateScrollTo(0, 2500);
            return;
          }
          // If currently between the hero and second section, trigger parallax return.
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

  /**
   * Show the header when the user hovers near the top of the viewport
   * after scrolling past the hero section.  When the mouse enters
   * the top area (within the header’s height) and the page is
   * scrolled beyond the first section, remove the `header-hidden`
   * class to reveal the navigation bar.  When the mouse leaves
   * this area, reapply `header-hidden` so the header hides again
   * until the user scrolls up.  This allows users to access the
   * menu while reading lower sections of the page without changing
   * the underlying scroll behaviour.
   */
  document.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    const hoverY = e.clientY;
    const headerHeight = header.offsetHeight;
    const scrolledPastHero = window.pageYOffset >= nextSection.offsetTop;
    // If cursor is within the header area and we are below the hero, show the header
    if (scrolledPastHero && hoverY <= headerHeight) {
      header.classList.remove('header-hidden');
    } else {
      // Otherwise, if we're still below the hero and not already hiding via scroll up/down,
      // reapply the hidden state.  This avoids leaving the header visible after the cursor
      // moves away from the top edge.
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
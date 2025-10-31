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
  // Respect reduced‑motion settings. Rather than exiting the script
  // entirely, treat the page like a mobile layout so core interactions
  // (navigation toggles, cookie banner, etc.) continue to work while the
  // cinematic parallax behaviour remains disabled.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Determine the current pathname.  We no longer skip parallax on
  // privacy policy pages so that the hero and second section animate
  // consistently across the site.
  const pathname = window.location.pathname;

  // Inject custom.css if it hasn't been loaded yet.  This keeps HTML
  // files clean and allows CSS overrides to apply universally.  After
  // injecting custom.css we also load mobile-fixes.css to override any
  // rules that conflict on small screens.  Both stylesheets are only
  // added once per page.
  if (!document.querySelector('link[href*="assets/css/custom.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Use a relative path anchored at the current location to ensure the file
    // resolves correctly regardless of which page is open (e.g. about.html, services.html).
    // Prefixing with "./" makes the path relative to the site root when pages live at the root.
    link.href = './assets/css/custom.css';
    document.head.appendChild(link);
  }
  // Always append the mobile fixes stylesheet after custom.css so its
  // rules override earlier declarations.  Only inject if not already
  // present to avoid duplicate links.
  if (!document.querySelector('link[href*="assets/css/mobile-fixes.css"]')) {
    const fixesLink = document.createElement('link');
    fixesLink.rel = 'stylesheet';
    // Use a relative path anchored at the current location to ensure the file
    // resolves correctly on all pages.  Prefixing with "./" avoids resolving
    // inside nested directories (if any) and consistently points to the root assets folder.
    fixesLink.href = './assets/css/mobile-fixes.css';
    document.head.appendChild(fixesLink);
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
  const disableParallax = isSafari || prefersReducedMotion;
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
  const heroContent = hero ? hero.querySelector('.content') : null;
  const hasHeroStructure = Boolean(hero && nextSection && header);

  if (hasHeroStructure) {
    let cinematicGate = null;
    let gateBeam = null;

    // Initialise the next section so it starts hidden and lower on the page.
    // Only apply the fade/slide animations when the parallax is active.
    if (!isMobile) {
      hero.classList.add('cinematic-hero');
      nextSection.classList.add('cinematic-body');
      hero.style.clipPath = 'inset(0% 0% 0% 0% round 0px)';
      hero.style.transform = 'perspective(1600px) translate3d(0, 0, 0) scale(1)';
      hero.style.filter = 'brightness(1) contrast(1) saturate(1) hue-rotate(0deg)';
      hero.style.setProperty('--hero-glint', '0');
      hero.style.setProperty('--hero-iris', '0');
      if (heroContent) {
        heroContent.style.transform = 'translate3d(0, 0, 0)';
        heroContent.style.opacity = '1';
        heroContent.style.filter = 'none';
      }

      cinematicGate = document.createElement('div');
      cinematicGate.className = 'cinematic-gate';
      const gateHalo = document.createElement('div');
      gateHalo.className = 'cinematic-gate__halo';
      gateBeam = document.createElement('div');
      gateBeam.className = 'cinematic-gate__beam';
      const gateRays = document.createElement('div');
      gateRays.className = 'cinematic-gate__rays';
      const gateVeil = document.createElement('div');
      gateVeil.className = 'cinematic-gate__veil';
      const gateParticles = document.createElement('div');
      gateParticles.className = 'cinematic-gate__particles';
      cinematicGate.appendChild(gateHalo);
      cinematicGate.appendChild(gateBeam);
      cinematicGate.appendChild(gateRays);
      cinematicGate.appendChild(gateVeil);
      cinematicGate.appendChild(gateParticles);
      cinematicGate.style.setProperty('--gate-flare', '0');
      cinematicGate.style.setProperty('--gate-veil', '0');
      cinematicGate.style.setProperty('--gate-tilt', '0deg');
      hero.parentNode.insertBefore(cinematicGate, nextSection);

      nextSection.style.opacity = '0';
      nextSection.style.transform = 'translate3d(0, 80px, 0)';
      nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';
      nextSection.style.setProperty('--cinematic-veil', '0');
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
      document.body.classList.add('cinematic-auto');
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
          document.body.classList.remove('cinematic-auto');
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
      const heroHeight = hero.offsetHeight || 1;
      const progress = Math.min(offset / heroHeight, 1);
      const eased = Math.pow(progress, 0.82);
      const overlay = Math.min(0.88, 0.2 + eased * 0.65);
      const heroScale = 1 + eased * 0.32;
      const heroLift = eased * -90;
      const heroDepth = eased * -160;
      const heroTilt = eased * 9;
      hero.style.transform = `perspective(1600px) translate3d(0, ${heroLift.toFixed(1)}px, ${heroDepth.toFixed(1)}px) scale(${heroScale.toFixed(3)}) rotateX(${heroTilt.toFixed(2)}deg)`;
      const heroBrightness = 1 - eased * 0.45;
      const heroContrast = 1 + eased * 0.3;
      const heroSaturation = 1 - eased * 0.15;
      const heroBlur = eased * 6;
      const heroHue = progress * -18;
      hero.style.filter = `brightness(${heroBrightness.toFixed(3)}) contrast(${heroContrast.toFixed(3)}) saturate(${heroSaturation.toFixed(3)}) hue-rotate(${heroHue.toFixed(2)}deg) blur(${heroBlur.toFixed(2)}px)`;
      const heroGlint = Math.min(1, Math.pow(progress, 0.62));
      const heroIris = Math.min(1, Math.pow(progress, 0.88));
      hero.style.setProperty('--hero-glint', heroGlint.toFixed(3));
      hero.style.setProperty('--hero-iris', heroIris.toFixed(3));
      hero.style.setProperty('--overlay-opacity', overlay.toFixed(3));
      const topInset = eased * 18;
      const bottomInset = eased * 6;
      const sideInset = eased * 3.5;
      const borderRadius = eased * 48;
      hero.style.clipPath = `inset(${topInset.toFixed(2)}% ${sideInset.toFixed(2)}% ${bottomInset.toFixed(2)}% round ${borderRadius.toFixed(1)}px)`;
      if (heroContent) {
        const contentOpacity = 1 - Math.pow(progress, 1.15) * 0.9;
        const contentLift = eased * -60;
        heroContent.style.opacity = contentOpacity.toFixed(3);
        heroContent.style.transform = `translate3d(0, ${contentLift.toFixed(1)}px, 0) scale(${(1 - eased * 0.08).toFixed(3)})`;
        heroContent.style.filter = `blur(${(eased * 4).toFixed(2)}px)`;
      }

      const bodyProgress = Math.pow(progress, 0.74);
      const bodyLift = (1 - bodyProgress) * 140;
      const bodyDepth = bodyProgress * -120;
      const bodyTilt = (1 - bodyProgress) * 6;
      nextSection.style.opacity = bodyProgress.toFixed(3);
      nextSection.style.transform = `perspective(1600px) translate3d(0, ${bodyLift.toFixed(1)}px, ${bodyDepth.toFixed(1)}px) rotateX(${bodyTilt.toFixed(2)}deg)`;
      const bodyBrightness = 0.6 + bodyProgress * 0.55;
      const bodySaturation = 0.65 + bodyProgress * 0.55;
      const bodyHue = bodyProgress * 12;
      nextSection.style.filter = `brightness(${bodyBrightness.toFixed(3)}) saturate(${bodySaturation.toFixed(3)}) hue-rotate(${bodyHue.toFixed(2)}deg)`;
      nextSection.style.setProperty('--cinematic-spotlight', (bodyProgress * 0.85).toFixed(3));
      const bodyVeil = Math.min(1, Math.pow(progress, 0.74) * 1.1);
      nextSection.style.setProperty('--cinematic-veil', bodyVeil.toFixed(3));

      if (cinematicGate && gateBeam) {
        const gateOpacity = Math.min(1, progress * 1.4);
        cinematicGate.style.opacity = gateOpacity.toFixed(3);
        cinematicGate.style.transform = `translate3d(0, ${(-progress * 26).toFixed(1)}px, 0)`;
        cinematicGate.style.setProperty('--gate-haze', Math.min(1, progress * 1.5).toFixed(3));
        cinematicGate.style.setProperty('--gate-line-scale', (0.65 + progress * 0.5).toFixed(3));
        const beamScaleX = 0.65 + progress * 0.55;
        const beamScaleY = 0.38 + progress * 0.82;
        gateBeam.style.transform = `translate3d(-50%, 0, 0) scale3d(${beamScaleX.toFixed(3)}, ${beamScaleY.toFixed(3)}, 1)`;
        gateBeam.style.setProperty('--beam-blur', `${(28 - progress * 12).toFixed(1)}px`);
        gateBeam.style.setProperty('--beam-opacity', Math.min(1, 0.4 + progress * 0.6).toFixed(3));
        const gateFlare = Math.min(1, Math.pow(progress, 0.72) * 1.15);
        const gateVeilProgress = Math.min(1, Math.pow(progress, 0.82) * 1.2);
        const gateTilt = -6 + progress * 14;
        cinematicGate.style.setProperty('--gate-flare', gateFlare.toFixed(3));
        cinematicGate.style.setProperty('--gate-veil', gateVeilProgress.toFixed(3));
        cinematicGate.style.setProperty('--gate-tilt', `${gateTilt.toFixed(2)}deg`);
      }
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
  }

  // Fade‑in animations for elements with the .animate class.  Use an
  // IntersectionObserver to add the .visible class when elements
  // approach the viewport.
  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (isMobile) {
      animatedEls.forEach((el) => el.classList.add('visible'));
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });
      animatedEls.forEach((el) => obs.observe(el));
    }
  }
  // Immediately show cards in the gallery grid to avoid delayed fade‑in.
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });

  // Mobile navigation toggle: show/hide the nav menu on small screens.
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
    };
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
    window.addEventListener(
      'scroll',
      () => {
        if (navMenu.classList.contains('open')) {
          closeMenu();
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});
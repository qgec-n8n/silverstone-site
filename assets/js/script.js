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
  const hasHeroStructure = Boolean(hero && nextSection && header);

  const heroContent = hero ? hero.querySelector('.content') : null;
  let cinematicOverlay = null;
  let cinematicVignette = null;
  if (hero) {
    hero.classList.add('cinematic-hero');
    if (heroContent) {
      heroContent.classList.add('cinematic-hero-content');
    }
    cinematicOverlay = hero.querySelector('.cinematic-gradient-layer');
    if (!cinematicOverlay) {
      cinematicOverlay = document.createElement('div');
      cinematicOverlay.className = 'cinematic-gradient-layer';
      hero.appendChild(cinematicOverlay);
    }
    cinematicVignette = hero.querySelector('.cinematic-vignette');
    if (!cinematicVignette) {
      cinematicVignette = document.createElement('div');
      cinematicVignette.className = 'cinematic-vignette';
      hero.appendChild(cinematicVignette);
    }
  }
  if (nextSection) {
    nextSection.classList.add('cinematic-section');
  }

  if (hasHeroStructure) {
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
      if (!hero || hero.classList.contains('cinematic-active')) {
        return;
      }
      const offset = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(offset / heroHeight, 1);
      hero.style.setProperty('--parallax-progress', progress.toFixed(3));
      nextSection.style.setProperty('--parallax-progress', progress.toFixed(3));
      if (heroContent) {
        heroContent.style.setProperty('--parallax-progress', progress.toFixed(3));
      }
      // Scale the hero with a subtle lift and cinematic grading
      const heroScale = 1 + progress * 0.18;
      const heroLift = -progress * 9;
      hero.style.transform = `translate3d(0, ${heroLift.toFixed(2)}vh, 0) scale(${heroScale.toFixed(4)})`;
      hero.style.filter = `brightness(${(1 - progress * 0.55).toFixed(3)}) contrast(${(1 + progress * 0.25).toFixed(3)}) saturate(${(1 + progress * 0.35).toFixed(3)})`;
      // Update overlay opacity via CSS variable
      hero.style.setProperty('--overlay-opacity', (progress * 0.75).toFixed(3));
      if (heroContent) {
        const contentLift = progress * -120;
        heroContent.style.transform = `translate3d(0, ${contentLift.toFixed(1)}px, 0) scale(${(1 + progress * 0.04).toFixed(4)})`;
        heroContent.style.opacity = (1 - progress * 0.1).toFixed(3);
      }
      if (cinematicOverlay && !cinematicOverlay.classList.contains('cinematic-active')) {
        cinematicOverlay.style.opacity = (0.12 + progress * 0.55).toFixed(3);
        cinematicOverlay.style.filter = `blur(${(progress * 14).toFixed(1)}px)`;
        cinematicOverlay.style.transform = `translate3d(0, ${(-progress * 28).toFixed(1)}px, 0) scale(${(1.08 + progress * 0.12).toFixed(4)})`;
      }
      if (cinematicVignette && !cinematicVignette.classList.contains('cinematic-active')) {
        cinematicVignette.style.opacity = (0.18 + progress * 0.45).toFixed(3);
      }
      // Fade and translate the next section with atmospheric depth
      const easedProgress = Math.min(progress ** 0.85, 1);
      nextSection.style.opacity = Math.min(easedProgress * 1.15, 1).toFixed(3);
      const translateY = (1 - easedProgress) * 130;
      nextSection.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      nextSection.style.filter = `blur(${(10 * (1 - easedProgress)).toFixed(1)}px)`;
    }
    // Run once to apply initial state
    if (!isMobile) {
      updateParallax();
      window.addEventListener('scroll', updateParallax, { passive: true });
    }

    let cinematicPlaying = false;

    function triggerCinematic(direction) {
      if (cinematicPlaying) {
        return;
      }
      cinematicPlaying = true;
      const directionClass = direction === 'forward' ? 'cinematic-forward' : 'cinematic-reverse';
      const participants = [hero, nextSection, cinematicOverlay, cinematicVignette, heroContent]
        .filter(Boolean)
        .map((el) => {
          el.classList.remove('cinematic-forward', 'cinematic-reverse', 'cinematic-active');
          // Force a reflow so the animation can restart when the class is re-applied
          void el.offsetWidth; // eslint-disable-line no-unused-expressions
          el.classList.add('cinematic-active', directionClass);
          return el;
        });

      const trackers = participants.map((element) => {
        let resolved = false;
        let handleEnd = null;
        let resolvePromise;
        const promise = new Promise((resolve) => {
          resolvePromise = resolve;
          handleEnd = (event) => {
            if (event.target === element) {
              element.removeEventListener('animationend', handleEnd);
              if (!resolved) {
                resolved = true;
                resolve();
              }
            }
          };
          element.addEventListener('animationend', handleEnd);
        });
        return {
          element,
          promise,
          resolveFn: () => {
            if (!resolved) {
              resolved = true;
              if (handleEnd) {
                element.removeEventListener('animationend', handleEnd);
              }
              resolvePromise();
            }
          },
        };
      });

      const failSafe = setTimeout(() => {
        trackers.forEach((tracker) => tracker.resolveFn());
      }, 2800);

      Promise.all(trackers.map((tracker) => tracker.promise))
        .catch(() => {})
        .finally(() => {
          clearTimeout(failSafe);
          participants.forEach((el) => {
            el.classList.remove('cinematic-active', 'cinematic-forward', 'cinematic-reverse');
          });
          cinematicPlaying = false;
          updateParallax();
        });
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
              triggerCinematic('forward');
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
              triggerCinematic('reverse');
              animateScrollTo(0, 2500);
              return;
            }
            // If currently between the hero and second section, trigger parallax return.
            if (scrollY > 0 && scrollY <= nextTop) {
              evt.preventDefault();
              triggerCinematic('reverse');
              animateScrollTo(0, 2500);
            }
          }
        },
        { passive: false }
      );
      const forwardKeys = new Set(['PageDown', 'ArrowDown']);
      const reverseKeys = new Set(['PageUp', 'ArrowUp']);
      window.addEventListener(
        'keydown',
        (evt) => {
          if (autoScrolling) {
            evt.preventDefault();
            return;
          }
          const key = evt.key;
          const scrollY = window.pageYOffset;
          const nextTop = nextSection.offsetTop;
          const isSpace = key === ' ';
          const isForwardKey = forwardKeys.has(key) || (isSpace && !evt.shiftKey);
          const isReverseKey = reverseKeys.has(key) || (isSpace && evt.shiftKey);
          if (isForwardKey && scrollY <= 0) {
            evt.preventDefault();
            triggerCinematic('forward');
            animateScrollTo(nextTop, 2500);
          } else if (isReverseKey) {
            if (scrollY > nextTop) {
              evt.preventDefault();
              triggerCinematic('reverse');
              animateScrollTo(0, 2500);
            } else if (scrollY > 0 && scrollY <= nextTop) {
              evt.preventDefault();
              triggerCinematic('reverse');
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
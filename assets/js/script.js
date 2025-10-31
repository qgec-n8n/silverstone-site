/*
      Silverstone site JavaScript (premium cinematic parallax)

      This version provides a refined cinematic parallax experience with
      slower, smoother transitions optimized for performance and premium
      feel. The hero section scales and darkens as the user begins to
      scroll, and the subsequent section fades and slides into view. An
      easing auto-scroll transitions the viewport over 2.8 seconds with
      subtle visual effects. The header hides when scrolling down and
      reappears when scrolling up. Mobile navigation toggling and fade-in
      animations for elements marked with `.animate` are also included.

      The script dynamically injects `assets/css/custom.css` if it is not
      already present. Performance optimizations include reduced layer
      count and elimination of dynamic particle generation for better
      rendering efficiency.
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

  if (hasHeroStructure) {
    const body = document.body;

    // Initialise the next section so it starts hidden and lower on the page.
    // Only apply the fade/slide animations when the parallax is active.
    if (!isMobile) {
      nextSection.classList.add('cinematic-section');
      nextSection.style.opacity = '0';
      nextSection.style.transform = 'translateY(80px)';
      nextSection.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
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

    function easeOutCubic(t) {
      const inv = 1 - t;
      return 1 - inv * inv * inv;
    }

    let autoScrolling = false;

    /**
     * Smoothly scroll the document to the given Y position.  While the
     * animation runs the body’s overflow is hidden to prevent user input
     * from interfering.  Once finished, overflow is restored.
     *
     * @param {number} targetY The vertical pixel coordinate to scroll to.
     * @param {number} duration Duration of the animation in milliseconds.
     * @returns {Promise<void>} Resolves when the scroll animation completes.
     */
    function animateScrollTo(targetY, duration) {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      if (Math.abs(distance) < 1) {
        window.scrollTo(0, targetY);
        return Promise.resolve();
      }
      autoScrolling = true;
      document.body.style.overflowY = 'hidden';
      return new Promise((resolve) => {
        let startTime;
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
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }

    if (!isMobile) {
      const ensureCinematicOverlay = () => {
        let overlayEl = document.querySelector('.cinematic-transition');
        if (overlayEl) return overlayEl;
        overlayEl = document.createElement('div');
        overlayEl.className = 'cinematic-transition';
        overlayEl.innerHTML = `
          <div class="cinematic-transition__vignette"></div>
          <div class="cinematic-transition__veil"></div>
          <div class="cinematic-transition__beam"></div>
          <div class="cinematic-transition__bloom"></div>
        `;
        body.appendChild(overlayEl);
        return overlayEl;
      };

      const overlay = ensureCinematicOverlay();
      let overlayTimer = null;

      const baseHeroState = {
        extraScale: 1,
        extraBrightness: 1,
        saturate: 1,
        tilt: 0,
        overlayBoost: 0,
      };
      const heroVisualState = { ...baseHeroState };

      const baseSectionState = {
        extraScale: 1,
        extraLift: 0,
        opacityMultiplier: 1,
        glow: 0,
      };
      const sectionVisualState = { ...baseSectionState };

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      const renderParallax = () => {
        const heroHeight = hero.offsetHeight || 1;
        const offset = window.pageYOffset;
        const progress = clamp(offset / heroHeight, 0, 1);

        // Enhanced hero transformation with dramatic perspective
        const baseScale = 1 + progress * 0.3;
        const heroScale = baseScale * heroVisualState.extraScale;
        const heroTilt = heroVisualState.tilt;
        const heroRotateY = progress * heroVisualState.tilt * 0.3;
        hero.style.transform = `perspective(2000px) translateZ(0) scale(${heroScale.toFixed(
          3
        )}) rotateX(${heroTilt.toFixed(2)}deg) rotateY(${heroRotateY.toFixed(2)}deg)`;

        // Premium brightness and saturation with color grading
        const baseBrightness = 1 - progress * 0.75;
        const heroBrightness = clamp(
          baseBrightness * heroVisualState.extraBrightness,
          0.2,
          1.15
        );
        const contrast = 1 + progress * 0.15;
        hero.style.filter = `brightness(${heroBrightness.toFixed(3)}) saturate(${heroVisualState.saturate.toFixed(
          3
        )}) contrast(${contrast.toFixed(3)})`;

        // Enhanced overlay with smoother transition
        const overlayValue = clamp(progress * 0.75 + heroVisualState.overlayBoost, 0, 1);
        hero.style.setProperty('--overlay-opacity', overlayValue.toFixed(3));

        // Premium section transformation with depth
        const baseTranslate = (1 - progress) * 140;
        const sectionTranslate = baseTranslate + sectionVisualState.extraLift;
        const sectionRotateX = (1 - progress) * -3;
        nextSection.style.transform = `translateY(${sectionTranslate.toFixed(1)}px) scale(${sectionVisualState.extraScale.toFixed(
          3
        )}) rotateX(${sectionRotateX.toFixed(2)}deg) translateZ(${((1 - progress) * 50).toFixed(1)}px)`;

        // Smoother opacity curve
        const sectionOpacity = clamp(progress * sectionVisualState.opacityMultiplier, 0, 1);
        nextSection.style.opacity = sectionOpacity.toFixed(3);

        // Enhanced glow effect
        const sectionGlow = clamp(progress * 0.8 + sectionVisualState.glow, 0, 1.2);
        nextSection.style.setProperty('--section-glow', sectionGlow.toFixed(3));
      };

      const createStateAnimator = (state) => {
        let frameId = null;
        let pendingResolve = null;
        return (target, duration, easing = easeInOutQuad) =>
          new Promise((resolve) => {
            if (frameId !== null) {
              cancelAnimationFrame(frameId);
              frameId = null;
            }
            if (pendingResolve) {
              pendingResolve();
              pendingResolve = null;
            }
            const keys = Object.keys(target);
            const startValues = {};
            keys.forEach((key) => {
              startValues[key] = state[key];
            });
            if (duration <= 0) {
              keys.forEach((key) => {
                state[key] = target[key];
              });
              renderParallax();
              resolve();
              return;
            }
            let startTime;
            pendingResolve = resolve;
            function step(timestamp) {
              if (startTime === undefined) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const eased = easing(progress);
              keys.forEach((key) => {
                const from = startValues[key];
                const to = target[key];
                state[key] = from + (to - from) * eased;
              });
              renderParallax();
              if (progress < 1) {
                frameId = requestAnimationFrame(step);
              } else {
                frameId = null;
                pendingResolve = null;
                resolve();
              }
            }
            frameId = requestAnimationFrame(step);
          });
      };

      const animateHeroState = createStateAnimator(heroVisualState);
      const animateSectionState = createStateAnimator(sectionVisualState);

      // Refined premium cinematic states with subtle depth
      const heroDownState = {
        extraScale: 1.08,
        extraBrightness: 0.75,
        saturate: 1.25,
        tilt: 5,
        overlayBoost: 0.20,
      };
      const heroUpState = {
        extraScale: 1.05,
        extraBrightness: 0.82,
        saturate: 1.20,
        tilt: -4,
        overlayBoost: 0.15,
      };
      const sectionDownState = {
        extraScale: 1.04,
        extraLift: -60,
        opacityMultiplier: 1.35,
        glow: 0.70,
      };
      const sectionUpState = {
        extraScale: 0.96,
        extraLift: 50,
        opacityMultiplier: 0.55,
        glow: 0.45,
      };

      renderParallax();
      window.addEventListener('scroll', renderParallax, { passive: true });
      window.addEventListener('resize', renderParallax);

      let transitionInProgress = false;
      let lastGuardScrollY = window.pageYOffset;
      let scrollVelocity = 0;
      let lastScrollTime = Date.now();

      // Enhanced scroll velocity tracker for overshooting prevention
      const trackScrollVelocity = () => {
        const currentY = window.pageYOffset;
        const currentTime = Date.now();
        const timeDelta = currentTime - lastScrollTime;
        const scrollDelta = currentY - lastGuardScrollY;

        if (timeDelta > 0) {
          scrollVelocity = scrollDelta / timeDelta;
        }

        lastScrollTime = currentTime;
        lastGuardScrollY = currentY;
      };

      window.addEventListener('scroll', trackScrollVelocity, { passive: true });

      function triggerCinematic(direction) {
        if (transitionInProgress) return;
        transitionInProgress = true;

        // Aggressive scroll lock to prevent overshooting
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.position = 'relative';

        const dirClass = direction === 'down' ? 'cinematic-down' : 'cinematic-up';
        body.classList.add('cinematic-transitioning', dirClass);
        overlay.classList.remove('dir-down', 'dir-up');
        overlay.classList.add('is-active', direction === 'down' ? 'dir-down' : 'dir-up');

        if (overlayTimer) {
          clearTimeout(overlayTimer);
        }

        // Premium slow and smooth timing - 2.8s animation duration
        overlayTimer = window.setTimeout(() => {
          overlay.classList.remove('is-active', 'dir-down', 'dir-up');
        }, 3200);

        const heroTarget = direction === 'down' ? heroDownState : heroUpState;
        const sectionTarget = direction === 'down' ? sectionDownState : sectionUpState;

        // Slower, more cinematic timing with smoother easing
        const heroAnim = animateHeroState(heroTarget, 1600, easeOutCubic);
        const sectionAnim = animateSectionState(sectionTarget, 1600, easeOutCubic);
        const targetY = direction === 'down' ? nextSection.offsetTop : 0;
        const scrollDuration = direction === 'down' ? 2800 : 2700;
        const scrollPromise = animateScrollTo(targetY, scrollDuration);

        const settleStates = () =>
          Promise.all([
            animateHeroState(baseHeroState, 1200, easeInOutQuad),
            animateSectionState(baseSectionState, 1200, easeInOutQuad),
          ]);

        Promise.all([heroAnim, sectionAnim, scrollPromise])
          .then(() => new Promise((resolve) => setTimeout(resolve, 200)))
          .then(settleStates)
          .finally(() => {
            if (overlayTimer) {
              clearTimeout(overlayTimer);
            }
            overlayTimer = window.setTimeout(() => {
              overlay.classList.remove('is-active', 'dir-down', 'dir-up');
            }, 500);

            // Restore scroll capabilities
            body.classList.remove('cinematic-transitioning', dirClass);
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.body.style.overflowY = '';

            // Reset velocity tracking
            scrollVelocity = 0;
            lastGuardScrollY = window.pageYOffset;

            transitionInProgress = false;
          });
      }

      // Enhanced guard scroll with velocity-based boundary protection
      const guardScroll = () => {
        if (autoScrolling || transitionInProgress) return;

        const currentY = window.pageYOffset;
        const nextTop = nextSection.offsetTop;

        // Only trigger if actually in the narrow transition zone
        // This prevents triggering when user is scrolling normally in hero or body

        // Prevent overshooting from top
        if (currentY > 0 && currentY < 30) {
          const direction = currentY > lastGuardScrollY ? 'down' : 'up';
          if (direction === 'down' && Math.abs(scrollVelocity) > 0.3) {
            triggerCinematic('down');
          }
        }

        // Prevent overshooting from bottom
        if (currentY >= nextTop - 50 && currentY < nextTop + 10) {
          const direction = currentY > lastGuardScrollY ? 'down' : 'up';
          if (direction === 'up' && Math.abs(scrollVelocity) > 0.3) {
            triggerCinematic('up');
          }
        }
      };

      window.addEventListener('scroll', guardScroll, { passive: true });

      // Enhanced wheel handler with aggressive boundary protection
      window.addEventListener(
        'wheel',
        (evt) => {
          if (autoScrolling || transitionInProgress) {
            evt.preventDefault();
            evt.stopPropagation();
            return;
          }

          const delta = evt.deltaY;
          const scrollY = window.pageYOffset;
          const nextTop = nextSection.offsetTop;
          const heroHeight = hero.offsetHeight;

          // Scrolling down
          if (delta > 0) {
            // At top of hero - trigger cinematic
            if (scrollY <= 5) {
              evt.preventDefault();
              evt.stopPropagation();
              triggerCinematic('down');
              return;
            }

            // In transition zone - prevent natural scroll
            if (scrollY > 0 && scrollY < nextTop - 50) {
              evt.preventDefault();
              evt.stopPropagation();
              if (scrollY < 100) {
                triggerCinematic('down');
              }
            }
          }

          // Scrolling up
          if (delta < 0) {
            const predictedY = scrollY + delta;

            // Approaching transition zone from below
            if (scrollY >= nextTop && predictedY < nextTop) {
              evt.preventDefault();
              evt.stopPropagation();
              triggerCinematic('up');
              return;
            }

            // Already in transition zone
            if (scrollY > 5 && scrollY < nextTop) {
              evt.preventDefault();
              evt.stopPropagation();
              triggerCinematic('up');
              return;
            }

            // Near top of section boundary
            if (scrollY >= nextTop - 100 && scrollY < nextTop + 50) {
              evt.preventDefault();
              evt.stopPropagation();
              triggerCinematic('up');
            }
          }
        },
        { passive: false }
      );

      const downKeys = new Set(['ArrowDown', 'PageDown', 'Space', ' ']);
      const upKeys = new Set(['ArrowUp', 'PageUp', 'Home']);
      window.addEventListener('keydown', (evt) => {
        if (evt.defaultPrevented) return;

        const key = evt.key;
        const code = evt.code;
        const scrollY = window.pageYOffset;
        const nextTop = nextSection.offsetTop;
        const isDownKey = downKeys.has(code) || downKeys.has(key);
        const isUpKey = upKeys.has(code) || upKeys.has(key);

        if (isDownKey) {
          if (autoScrolling || transitionInProgress) {
            evt.preventDefault();
            evt.stopPropagation();
            return;
          }

          // At top of hero
          if (scrollY <= 5) {
            evt.preventDefault();
            evt.stopPropagation();
            triggerCinematic('down');
            return;
          }

          // In transition zone
          if (scrollY > 0 && scrollY < nextTop - 50) {
            evt.preventDefault();
            evt.stopPropagation();
            if (scrollY < 100) {
              triggerCinematic('down');
            }
          }
        } else if (isUpKey) {
          if (autoScrolling || transitionInProgress) {
            evt.preventDefault();
            evt.stopPropagation();
            return;
          }

          // At or near top of body section
          if (scrollY >= nextTop - 10) {
            evt.preventDefault();
            evt.stopPropagation();
            triggerCinematic('up');
            return;
          }

          // In transition zone
          if (scrollY > 5 && scrollY < nextTop) {
            evt.preventDefault();
            evt.stopPropagation();
            triggerCinematic('up');
          }
        }
      });
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
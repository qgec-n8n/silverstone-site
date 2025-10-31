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
      return new Promise((resolve) => {
        function step(timestamp) {
          if (startTime === undefined) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = easeInOutQuad(progress);
          window.scrollTo(0, startY + distance * eased);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }

    const SCROLL_DURATION = 2200;
    const CINEMATIC_DURATION = 1400;

    let cinematicOverlay = null;
    let cinematicOverlaySheen = null;
    let cinematicOverlayVignette = null;
    if (!isMobile) {
      cinematicOverlay = document.createElement('div');
      cinematicOverlay.className = 'cinematic-overlay';
      cinematicOverlay.setAttribute('aria-hidden', 'true');
      cinematicOverlaySheen = document.createElement('div');
      cinematicOverlaySheen.className = 'cinematic-overlay__sheen';
      cinematicOverlayVignette = document.createElement('div');
      cinematicOverlayVignette.className = 'cinematic-overlay__vignette';
      cinematicOverlay.appendChild(cinematicOverlaySheen);
      cinematicOverlay.appendChild(cinematicOverlayVignette);
      cinematicOverlay.style.visibility = 'hidden';
      document.body.appendChild(cinematicOverlay);
    }

    function runCinematicSequence(direction) {
      if (!cinematicOverlay) return Promise.resolve();
      const isDown = direction === 'down';
      const heroTransformStart = hero.style.transform;
      const heroFilterStart = hero.style.filter;
      const nextTransformStart = nextSection.style.transform;
      const nextOpacityStart = nextSection.style.opacity;
      const nextFilterStart = nextSection.style.filter;
      const nextClipStart = nextSection.style.clipPath;
      const heroContent = hero.querySelector('.content');
      const heroContentTransformStart = heroContent
        ? heroContent.style.transform
        : '';
      const heroContentOpacityStart = heroContent
        ? heroContent.style.opacity
        : '';
      const heroContentLetterStart = heroContent
        ? heroContent.style.letterSpacing
        : '';

      hero.style.willChange = 'transform, filter';
      nextSection.style.willChange = 'transform, filter, opacity, clip-path';
      cinematicOverlay.style.willChange = 'transform, opacity, filter';
      cinematicOverlay.style.visibility = 'visible';
      if (heroContent) {
        heroContent.style.willChange = 'transform, opacity, letter-spacing';
      }

      const animations = [];

      const overlayKeyframes = isDown
        ? [
            {
              opacity: 0,
              transform: 'translateY(12%) scale(1.08)',
              filter: 'blur(22px)',
            },
            {
              opacity: 0.85,
              transform: 'translateY(0%) scale(1)',
              filter: 'blur(0px)',
            },
            {
              opacity: 0,
              transform: 'translateY(-10%) scale(0.95)',
              filter: 'blur(18px)',
            },
          ]
        : [
            {
              opacity: 0,
              transform: 'translateY(-14%) scale(1.05)',
              filter: 'blur(20px)',
            },
            {
              opacity: 0.78,
              transform: 'translateY(0%) scale(1)',
              filter: 'blur(0px)',
            },
            {
              opacity: 0,
              transform: 'translateY(12%) scale(0.94)',
              filter: 'blur(16px)',
            },
          ];
      animations.push(
        cinematicOverlay.animate(overlayKeyframes, {
          duration: CINEMATIC_DURATION,
          easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
          fill: 'forwards',
        })
      );

      if (cinematicOverlaySheen) {
        const sheenKeyframes = isDown
          ? [
              {
                opacity: 0,
                transform: 'translate3d(0,68%,0) skewY(12deg)',
              },
              {
                opacity: 0.85,
                transform: 'translate3d(0,-6%,0) skewY(6deg)',
              },
              {
                opacity: 0,
                transform: 'translate3d(0,-58%,0) skewY(0deg)',
              },
            ]
          : [
              {
                opacity: 0,
                transform: 'translate3d(0,-62%,0) skewY(-10deg)',
              },
              {
                opacity: 0.8,
                transform: 'translate3d(0,4%,0) skewY(-4deg)',
              },
              {
                opacity: 0,
                transform: 'translate3d(0,58%,0) skewY(0deg)',
              },
            ];
        animations.push(
          cinematicOverlaySheen.animate(sheenKeyframes, {
            duration: CINEMATIC_DURATION,
            easing: 'cubic-bezier(0.33, 0.0, 0.15, 1)',
            fill: 'forwards',
          })
        );
      }

      const heroKeyframes = isDown
        ? [
            {
              transform: heroTransformStart || 'scale(1)',
              filter: heroFilterStart || 'brightness(1) saturate(1)',
            },
            {
              transform: 'translateY(-6vh) scale(1.12)',
              filter: 'brightness(0.55) saturate(0.8) blur(4px)',
            },
            {
              transform: 'translateY(-12vh) scale(1.02)',
              filter: 'brightness(0.35) saturate(0.65) blur(9px)',
            },
          ]
        : [
            {
              transform: heroTransformStart || 'scale(1)',
              filter: heroFilterStart || 'brightness(0.6) saturate(0.9)',
            },
            {
              transform: 'translateY(8vh) scale(1.08)',
              filter: 'brightness(0.7) saturate(0.95) blur(6px)',
            },
            {
              transform: 'translateY(0vh) scale(1)',
              filter: 'brightness(1) saturate(1) blur(0px)',
            },
          ];
      animations.push(
        hero.animate(heroKeyframes, {
          duration: CINEMATIC_DURATION,
          easing: 'cubic-bezier(0.66, 0, 0.34, 1)',
          fill: 'forwards',
        })
      );

      if (heroContent) {
        const heroContentKeyframes = isDown
          ? [
              {
                transform: heroContentTransformStart || 'translateY(0) scale(1)',
                opacity:
                  heroContentOpacityStart === ''
                    ? 1
                    : parseFloat(heroContentOpacityStart) || 1,
                letterSpacing: heroContentLetterStart || '0em',
              },
              {
                transform: 'translateY(-4vh) scale(0.96)',
                opacity: 0,
                letterSpacing: '0.14em',
              },
            ]
          : [
              {
                transform: 'translateY(6vh) scale(0.94)',
                opacity: 0,
                letterSpacing: '0.12em',
              },
              {
                transform: 'translateY(0) scale(1)',
                opacity: 1,
                letterSpacing: '0em',
              },
            ];
        animations.push(
          heroContent.animate(heroContentKeyframes, {
            duration: CINEMATIC_DURATION,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            fill: 'forwards',
          })
        );
      }

      const nextKeyframes = isDown
        ? [
            {
              transform: nextTransformStart || 'translateY(12vh) scale(0.92)',
              opacity:
                nextOpacityStart === ''
                  ? 0
                  : parseFloat(nextOpacityStart) || 0,
              filter:
                nextFilterStart && nextFilterStart !== 'none'
                  ? nextFilterStart
                  : 'blur(22px) saturate(0.65)',
              clipPath: 'inset(16% 14% 24% 14% round 38px)',
            },
            {
              transform: 'translateY(0) scale(1)',
              opacity: 1,
              filter: 'blur(0px) saturate(1.1)',
              clipPath: 'inset(0 0 0 0 round 0)',
            },
          ]
        : [
            {
              transform: nextTransformStart || 'translateY(0) scale(1)',
              opacity:
                nextOpacityStart === ''
                  ? 1
                  : parseFloat(nextOpacityStart) || 1,
              filter:
                nextFilterStart && nextFilterStart !== 'none'
                  ? nextFilterStart
                  : 'blur(0px) saturate(1)',
              clipPath: 'inset(0 0 0 0 round 0)',
            },
            {
              transform: 'translateY(-12vh) scale(0.94)',
              opacity: 0,
              filter: 'blur(28px) saturate(0.55)',
              clipPath: 'inset(18% 12% 32% 12% round 40px)',
            },
          ];
      animations.push(
        nextSection.animate(nextKeyframes, {
          duration: CINEMATIC_DURATION,
          easing: 'cubic-bezier(0.19, 0.64, 0.21, 1)',
          fill: 'forwards',
        })
      );

      return Promise.all(
        animations.map((animation) => animation.finished.catch(() => {}))
      ).finally(() => {
        animations.forEach((animation) => {
          try {
            animation.cancel();
          } catch (err) {
            /* noop */
          }
        });
        hero.style.willChange = '';
        hero.style.transform = heroTransformStart;
        hero.style.filter = heroFilterStart;
        if (heroContent) {
          heroContent.style.willChange = '';
          heroContent.style.transform = heroContentTransformStart;
          heroContent.style.opacity = heroContentOpacityStart;
          heroContent.style.letterSpacing = heroContentLetterStart;
        }
        nextSection.style.willChange = '';
        nextSection.style.transform = nextTransformStart;
        nextSection.style.opacity = nextOpacityStart;
        nextSection.style.filter = nextFilterStart;
        nextSection.style.clipPath = nextClipStart;
        cinematicOverlay.style.willChange = '';
        cinematicOverlay.style.visibility = 'hidden';
      });
    }

    function performCinematicScroll(targetY, direction) {
      if (autoScrolling) return;
      autoScrolling = true;
      document.body.style.overflowY = 'hidden';
      const tasks = [
        animateScrollTo(targetY, SCROLL_DURATION),
        runCinematicSequence(direction).catch(() => {}),
      ];
      Promise.all(tasks)
        .catch(() => {})
        .finally(() => {
          document.body.style.overflowY = '';
          autoScrolling = false;
          updateParallax();
        });
    }

    /**
     * Update the parallax visuals based on scroll position.  As the user
     * scrolls down within the hero, scale and darken it; simultaneously
     * fade and slide the next section upward.  The overlay opacity is
     * controlled via a CSS variable (--overlay-opacity) defined in
     * custom.css.  This handler runs on every scroll event.
     */
    function updateParallax() {
      if (autoScrolling) return;
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
              performCinematicScroll(nextTop, 'down');
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
              performCinematicScroll(0, 'up');
              return;
            }
            // If currently between the hero and second section, trigger parallax return.
            if (scrollY > 0 && scrollY <= nextTop) {
              evt.preventDefault();
              performCinematicScroll(0, 'up');
            }
          }
        },
        { passive: false }
      );
    }

    if (!isMobile) {
      const interactiveKeysDown = new Set([
        'ArrowDown',
        'PageDown',
        ' ',
        'Spacebar',
      ]);
      const interactiveKeysUp = new Set([
        'ArrowUp',
        'PageUp',
        'Home',
      ]);
      const shouldIgnoreKey = (target) => {
        if (!target) return false;
        const tagName = target.tagName ? target.tagName.toLowerCase() : '';
        return (
          tagName === 'input' ||
          tagName === 'textarea' ||
          target.isContentEditable
        );
      };
      window.addEventListener(
        'keydown',
        (evt) => {
          if (shouldIgnoreKey(evt.target)) return;
          const key = evt.key;
          const wantsDown = interactiveKeysDown.has(key);
          const wantsUp = interactiveKeysUp.has(key);
          if (!wantsDown && !wantsUp) return;
          if (autoScrolling) {
            evt.preventDefault();
            return;
          }
          const scrollY = window.pageYOffset;
          const nextTop = nextSection.offsetTop;
          if (wantsDown && !evt.shiftKey) {
            if (scrollY <= 0) {
              evt.preventDefault();
              performCinematicScroll(nextTop, 'down');
            }
            return;
          }
          if (wantsUp || (wantsDown && evt.shiftKey)) {
            if (scrollY > nextTop) {
              evt.preventDefault();
              performCinematicScroll(0, 'up');
              return;
            }
            if (scrollY > 0 && scrollY <= nextTop) {
              evt.preventDefault();
              performCinematicScroll(0, 'up');
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
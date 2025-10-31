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

  let cinematic = null;

  if (hasHeroStructure) {
    // On the contact or privacy pages ensure the first service row fills the viewport.
    // This applies regardless of the parallax state.
    if (pathname.includes('contact') || pathname.includes('privacy')) {
      const setPageSectionHeight = () => {
        nextSection.style.minHeight = `${window.innerHeight}px`;
      };
      setPageSectionHeight();
      window.addEventListener('resize', setPageSectionHeight);
    }

    if (!isMobile) {
      nextSection.classList.add('cinematic-anchor');
      hero.style.willChange = 'transform, filter';
      nextSection.style.willChange = 'transform, opacity, filter';

      const overlay = document.createElement('div');
      overlay.className = 'cinematic-overlay';
      overlay.innerHTML = `
        <div class="cinematic-bar cinematic-bar--top"><span class="cinematic-bar__glow"></span></div>
        <div class="cinematic-lens"></div>
        <div class="cinematic-bar cinematic-bar--bottom"><span class="cinematic-bar__glow"></span></div>
      `;
      document.body.appendChild(overlay);

      const topBar = overlay.querySelector('.cinematic-bar--top');
      const bottomBar = overlay.querySelector('.cinematic-bar--bottom');
      const topGlow = topBar.querySelector('.cinematic-bar__glow');
      const bottomGlow = bottomBar.querySelector('.cinematic-bar__glow');
      const lens = overlay.querySelector('.cinematic-lens');

      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      let heroHeight = hero.offsetHeight;
      let nextTop = nextSection.getBoundingClientRect().top + window.pageYOffset;
      const scrollClamp = 2;

      const setPhaseClass = (phase) => {
        document.body.classList.remove('phase-hero', 'phase-body');
        document.body.classList.add(phase === 'body' ? 'phase-body' : 'phase-hero');
      };

      const state = {
        phase: window.pageYOffset >= nextTop - scrollClamp ? 'body' : 'hero',
        isTransitioning: false,
      };

      setPhaseClass(state.phase);

      function applyHeroSectionFrame(progress) {
        const heroScale = 1 + progress * 0.28;
        const translateVH = -progress * 14;
        hero.style.transform = `translateY(${translateVH.toFixed(2)}vh) scale(${heroScale.toFixed(3)})`;
        hero.style.filter = `brightness(${(1 - progress * 0.52).toFixed(3)}) blur(${(progress * 6).toFixed(2)}px) saturate(${(1 - progress * 0.2).toFixed(3)})`;
        hero.style.setProperty('--overlay-opacity', (0.08 + progress * 0.6).toFixed(3));

        const revealProgress = progress <= 0.2 ? 0 : clamp((progress - 0.2) / 0.8, 0, 1);
        nextSection.style.opacity = revealProgress.toFixed(3);
        const translateY = (1 - revealProgress) * 220;
        const sectionScale = 0.9 + revealProgress * 0.1;
        nextSection.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${sectionScale.toFixed(3)})`;
        const blur = (1 - revealProgress) * 8;
        nextSection.style.filter = `blur(${blur.toFixed(2)}px) saturate(${(0.85 + revealProgress * 0.25).toFixed(3)})`;
      }

      function applyOverlayFrame(progress) {
        const closingThreshold = 0.45;
        let topTranslate;
        let bottomTranslate;
        if (progress <= closingThreshold) {
          const local = progress / closingThreshold;
          topTranslate = -120 + local * 120;
          bottomTranslate = 120 - local * 120;
        } else {
          const local = (progress - closingThreshold) / (1 - closingThreshold);
          topTranslate = 0 - local * 140;
          bottomTranslate = 0 + local * 140;
        }
        topBar.style.transform = `translateY(${topTranslate.toFixed(2)}%)`;
        bottomBar.style.transform = `translateY(${bottomTranslate.toFixed(2)}%)`;
        const glow = Math.sin(clamp(progress, 0, 1) * Math.PI);
        const glowOpacity = (glow * 0.85).toFixed(3);
        topGlow.style.opacity = glowOpacity;
        bottomGlow.style.opacity = glowOpacity;
        lens.style.opacity = (0.22 + glow * 0.55).toFixed(3);
        lens.style.transform = `translate(-50%, -50%) scale(${(1.18 - glow * 0.28).toFixed(3)})`;
        lens.style.filter = `blur(${(6 - glow * 5).toFixed(2)}px)`;
      }

      applyHeroSectionFrame(state.phase === 'body' ? 1 : 0);
      if (state.phase === 'body' && window.pageYOffset < nextTop - scrollClamp) {
        window.scrollTo(0, nextTop);
      }

      const resetOverlay = () => {
        overlay.classList.remove('active', 'reverse');
        topBar.style.transform = '';
        bottomBar.style.transform = '';
        topGlow.style.opacity = '';
        bottomGlow.style.opacity = '';
        lens.style.opacity = '';
        lens.style.transform = '';
        lens.style.filter = '';
      };

      const enforceBounds = () => {
        if (state.isTransitioning) return;
        const y = window.pageYOffset;
        if (state.phase === 'hero' && y > scrollClamp) {
          runTransition('forward');
        } else if (state.phase === 'body' && y < nextTop - scrollClamp) {
          runTransition('reverse');
        }
      };

      cinematic = {
        get phase() {
          return state.phase;
        },
        set phase(value) {
          state.phase = value;
          setPhaseClass(value);
        },
        get isTransitioning() {
          return state.isTransitioning;
        },
        set isTransitioning(value) {
          state.isTransitioning = value;
        },
        enforceBounds,
        get nextTop() {
          return nextTop;
        },
      };

      const finalizeTransition = (direction) => {
        const finalProgress = direction === 'forward' ? 1 : 0;
        applyHeroSectionFrame(finalProgress);
        document.body.classList.remove('transitioning', 'transitioning-forward', 'transitioning-reverse');
        resetOverlay();
        cinematic.isTransitioning = false;
        const phase = direction === 'forward' ? 'body' : 'hero';
        cinematic.phase = phase;
        if (phase === 'body') {
          window.scrollTo(0, nextTop);
        } else {
          window.scrollTo(0, 0);
        }
      };

      const runTransition = (direction) => {
        if (state.isTransitioning) return;
        cinematic.isTransitioning = true;
        document.body.classList.add('transitioning');
        document.body.classList.toggle('transitioning-forward', direction === 'forward');
        document.body.classList.toggle('transitioning-reverse', direction !== 'forward');
        overlay.classList.add('active');
        overlay.classList.toggle('reverse', direction !== 'forward');
        const startY = window.pageYOffset;
        const targetY = direction === 'forward' ? nextTop : 0;
        const distance = targetY - startY;
        const duration = 1800;
        const startTime = performance.now();

        const step = (now) => {
          const elapsed = now - startTime;
          const progress = clamp(elapsed / duration, 0, 1);
          const eased = easeInOutCubic(progress);
          window.scrollTo(0, startY + distance * eased);
          const heroProgress = direction === 'forward' ? eased : 1 - eased;
          applyHeroSectionFrame(heroProgress);
          applyOverlayFrame(heroProgress);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            finalizeTransition(direction);
          }
        };

        requestAnimationFrame(step);
      };

      window.addEventListener('resize', () => {
        heroHeight = hero.offsetHeight;
        nextTop = nextSection.getBoundingClientRect().top + window.pageYOffset;
        if (!cinematic.isTransitioning) {
          applyHeroSectionFrame(cinematic.phase === 'body' ? 1 : 0);
          if (cinematic.phase === 'body' && window.pageYOffset < nextTop - scrollClamp) {
            window.scrollTo(0, nextTop);
          }
        }
      });

      window.addEventListener(
        'wheel',
        (evt) => {
          if (cinematic.isTransitioning) {
            evt.preventDefault();
            return;
          }
          const delta = evt.deltaY;
          const scrollY = window.pageYOffset;
          if (delta > 0 && cinematic.phase === 'hero') {
            if (scrollY <= scrollClamp) {
              evt.preventDefault();
              runTransition('forward');
            } else if (scrollY < heroHeight) {
              evt.preventDefault();
              window.scrollTo(0, 0);
            }
            return;
          }
          if (delta < 0 && cinematic.phase === 'body') {
            const predicted = scrollY + delta;
            if (scrollY <= nextTop + scrollClamp) {
              evt.preventDefault();
              runTransition('reverse');
              return;
            }
            if (scrollY > nextTop && predicted < nextTop - scrollClamp) {
              evt.preventDefault();
              runTransition('reverse');
            }
          }
        },
        { passive: false }
      );

      const downwardKeys = new Set(['PageDown', 'ArrowDown', 'Space', ' ']);
      const upwardKeys = new Set(['PageUp', 'ArrowUp', 'Home']);
      document.addEventListener('keydown', (evt) => {
        if (cinematic.isTransitioning) {
          evt.preventDefault();
          return;
        }
        if (downwardKeys.has(evt.key) && cinematic.phase === 'hero') {
          evt.preventDefault();
          runTransition('forward');
        } else if (upwardKeys.has(evt.key) && cinematic.phase === 'body') {
          evt.preventDefault();
          runTransition('reverse');
        }
      });
    }
  }

    /**
     * Hide the header when scrolling down and show it when scrolling up.
     * Adds the `.header-hidden` class defined in styles.css to translate
     * the header off‑screen.  This behaviour only applies after the
     * header has been scrolled past its own height.
     */
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      if (!isMobile && cinematic && typeof cinematic.enforceBounds === 'function') {
        cinematic.enforceBounds();
      }
      const currentY = window.pageYOffset;
      if (currentY > lastScrollY && currentY > header.offsetHeight) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = currentY;
    }, { passive: false });

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
      const transitionAnchor = cinematic ? cinematic.nextTop : nextSection.offsetTop;
      const scrolledPastHero = window.pageYOffset >= transitionAnchor;
      // If cursor is within the header area and we are below the hero, show the header
      if (scrolledPastHero && hoverY <= headerHeight) {
        header.classList.remove('header-hidden');
      } else {
        // Otherwise, if we're still below the hero and not already hiding via scroll up/down,
        // reapply the hidden state.  This avoids leaving the header visible after the cursor
        // moves away from the top edge.
        if (scrolledPastHero && !(cinematic && cinematic.isTransitioning)) {
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
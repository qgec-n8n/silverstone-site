/*
  Lightweight cinematic scroll controller
  ---------------------------------------
  Replaces the previous multi‑layer transition system with a GPU‑friendly
  implementation that animates only transforms and opacity.  The script
  locks the viewport on the hero/body boundary and plays a cinematic
  transition whenever the user moves between the sections using scroll,
  wheel, keyboard, or touchpad gestures.

  This version has been modified to disable the cinematic/parallax
  functionality entirely by forcing the feature flag to `false`.  All
  associated event handlers and animations are bypassed, restoring
  standard scroll behaviour while preserving header hiding and
  intersection observer animations.
*/

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${href}`;
    document.head.appendChild(link);
  };

  ensureStylesheet('assets/css/custom.css');
  ensureStylesheet('assets/css/mobile-fixes.css');

  const hero = document.querySelector('.hero');
  const findNextSection = () => {
    if (!hero) return null;
    let node = hero.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'section') {
        return node;
      }
      node = node.nextElementSibling;
    }
    return null;
  };
  const nextSection = findNextSection();
  const header = document.querySelector('header');

  const pathname = window.location.pathname;
  if (hero && nextSection && (pathname.includes('contact') || pathname.includes('privacy'))) {
    const setPageSectionHeight = () => {
      nextSection.style.minHeight = `${window.innerHeight}px`;
    };
    setPageSectionHeight();
    window.addEventListener('resize', setPageSectionHeight);
  }

  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  /*
   * Disable the cinematic/parallax scroll effect entirely.  The original
   * feature required hero and nextSection elements, no reduced motion,
   * non‑Safari browser and a minimum viewport width.  By setting this
   * flag to false unconditionally, the overlay and event interceptors
   * never initialise, allowing the page to scroll normally.
   */
  const cinematicEnabled = false;

  if (cinematicEnabled) {
    // The cinematic code block is intentionally retained for reference but
    // will never execute due to the false flag above.  It included
    // logic for overlay creation, state interpolation, wheel/key
    // handlers, and scroll guards.
    const heroStates = {
      hero: { translateY: 0, scale: 1, opacity: 1 },
      body: { translateY: -90, scale: 0.9, opacity: 0.88 },
    };
    const sectionStates = {
      hero: { translateY: 120, opacity: 0 },
      body: { translateY: 0, opacity: 1 },
    };
    const overlayStates = {
      hero: 0,
      body: 0.55,
    };
    let scene = 'hero';
    let animating = false;
    let lastScrollY = window.scrollY;
    const getHeaderOffset = () => {
      if (!header) return 0;
      const styles = window.getComputedStyle(header);
      const isFixed = styles.position === 'fixed';
      const isHidden = header.classList.contains('header-hidden');
      if (!isFixed || isHidden) {
        return 0;
      }
      return header.getBoundingClientRect().height;
    };
    const computeBoundary = () => {
      const currentTransform = nextSection.style.transform;
      nextSection.style.transform = 'none';
      const rect = nextSection.getBoundingClientRect();
      nextSection.style.transform = currentTransform;
      const adjusted = rect.top + window.scrollY - getHeaderOffset();
      return Math.max(0, adjusted);
    };
    let boundary = computeBoundary();
    const lerp = (from, to, t) => from + (to - from) * t;
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const applySceneInstant = (target) => {
      const heroState = heroStates[target];
      hero.style.transform = `translate3d(0, ${heroState.translateY.toFixed(2)}px, 0) scale(${heroState.scale.toFixed(3)})`;
      hero.style.opacity = heroState.opacity.toFixed(3);
      const sectionState = sectionStates[target];
      nextSection.style.transform = `translate3d(0, ${sectionState.translateY.toFixed(2)}px, 0)`;
      nextSection.style.opacity = sectionState.opacity.toFixed(3);
      overlay.style.opacity = overlayStates[target].toFixed(3);
      if (target === 'hero') {
        nextSection.style.pointerEvents = 'none';
        body.classList.add('scene-hero');
        body.classList.remove('scene-body');
      } else {
        nextSection.style.pointerEvents = '';
        body.classList.add('scene-body');
        body.classList.remove('scene-hero');
      }
    };
    const overlay = document.createElement('div');
    overlay.className = 'scene-overlay';
    body.appendChild(overlay);
    applySceneInstant(scene);
    window.scrollTo(0, 0);
    const animateScene = (target) => {
      if (target === scene || animating) return;
      animating = true;
      body.classList.add('scene-transition');
      const startScene = scene;
      const startScroll = window.scrollY;
      boundary = computeBoundary();
      const endScroll = target === 'body' ? boundary : 0;
      const duration = 900;
      const heroStart = heroStates[startScene];
      const heroEnd = heroStates[target];
      const sectionStart = sectionStates[startScene];
      const sectionEnd = sectionStates[target];
      const overlayStart = overlayStates[startScene];
      const overlayEnd = overlayStates[target];
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        const heroY = lerp(heroStart.translateY, heroEnd.translateY, eased);
        const heroScale = lerp(heroStart.scale, heroEnd.scale, eased);
        const heroOpacity = lerp(heroStart.opacity, heroEnd.opacity, eased);
        hero.style.transform = `translate3d(0, ${heroY.toFixed(2)}px, 0) scale(${heroScale.toFixed(3)})`;
        hero.style.opacity = heroOpacity.toFixed(3);
        const sectionY = lerp(sectionStart.translateY, sectionEnd.translateY, eased);
        const sectionOpacity = lerp(sectionStart.opacity, sectionEnd.opacity, eased);
        nextSection.style.transform = `translate3d(0, ${sectionY.toFixed(2)}px, 0)`;
        nextSection.style.opacity = sectionOpacity.toFixed(3);
        const overlayOpacity = lerp(overlayStart, overlayEnd, eased);
        overlay.style.opacity = overlayOpacity.toFixed(3);
        const scrollY = lerp(startScroll, endScroll, eased);
        window.scrollTo(0, scrollY);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          scene = target;
          lastScrollY = window.scrollY;
          applySceneInstant(scene);
          body.classList.remove('scene-transition');
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          if (scene === 'hero') {
            window.scrollTo(0, 0);
          } else {
            boundary = computeBoundary();
            window.scrollTo(0, boundary);
          }
          animating = false;
        }
      };
      requestAnimationFrame(step);
    };
    const wheelHandler = (event) => {
      if (animating) {
        event.preventDefault();
        return;
      }
      const delta = event.deltaY;
      if (delta > 0 && scene === 'hero') {
        event.preventDefault();
        animateScene('body');
      } else if (delta < 0 && scene === 'body') {
        boundary = computeBoundary();
        if (window.scrollY <= boundary + 2) {
          event.preventDefault();
          animateScene('hero');
        }
      }
    };
    const keyHandler = (event) => {
      if (animating) {
        event.preventDefault();
        return;
      }
      const key = event.key;
      const wantsDown =
        key === 'ArrowDown' ||
        key === 'PageDown' ||
        (key === 'Space' && !event.shiftKey);
      const wantsUp =
        key === 'ArrowUp' ||
        key === 'PageUp' ||
        key === 'Home' ||
        (key === 'Space' && event.shiftKey);
      if (scene === 'hero' && wantsDown) {
        event.preventDefault();
        animateScene('body');
      } else if (scene === 'body' && wantsUp) {
        boundary = computeBoundary();
        if (window.scrollY <= boundary + 2) {
          event.preventDefault();
          animateScene('hero');
        }
      }
    };
    const scrollGuard = () => {
      if (animating) {
        lastScrollY = window.scrollY;
        return;
      }
      const current = window.scrollY;
      if (scene === 'hero') {
        if (current > 2 && current >= lastScrollY) {
          animateScene('body');
        } else if (current > 0 && current < 2) {
          window.scrollTo(0, 0);
        }
      } else {
        boundary = computeBoundary();
        if (current < boundary - 2 && current <= lastScrollY) {
          animateScene('hero');
        } else if (current < boundary - 1) {
          window.scrollTo(0, boundary);
        }
      }
      lastScrollY = current;
    };
    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler, { passive: false });
    window.addEventListener('scroll', scrollGuard, { passive: true });
    window.addEventListener('resize', () => {
      boundary = computeBoundary();
      if (!animating && scene === 'body') {
        window.scrollTo(0, boundary);
      }
    });
  } else {
    body.classList.remove('scene-transition', 'scene-hero', 'scene-body');
  }

  if (header) {
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
  }

  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (prefersReducedMotion) {
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
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });
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
    window.addEventListener('scroll', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});
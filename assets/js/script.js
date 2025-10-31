/*
  Silverstone site JavaScript – streamlined cinematic transition
  --------------------------------------------------------------
  This build focuses on a smooth, GPU-friendly scroll hand-off between the
  hero band and the first body section. Only transforms and opacity are
  animated so the experience remains responsive even on modest hardware.
  Users scroll the hero normally; when they approach the boundary an
  assisted transition carries them into (or back out of) the body content.
  Reduced-motion, Safari, and small viewports fall back to native scroll.
*/

document.addEventListener('DOMContentLoaded', () => {
  const ensureStylesheet = (href) => {
    if (!document.querySelector(`link[href*="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  };

  ensureStylesheet('./assets/css/custom.css');
  ensureStylesheet('./assets/css/mobile-fixes.css');

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);

  const hero = document.querySelector('.hero');
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
  const pathname = window.location.pathname;

  if (
    nextSection &&
    (pathname.includes('contact') || pathname.includes('privacy'))
  ) {
    const resizeBodySection = () => {
      nextSection.style.minHeight = `${window.innerHeight}px`;
    };
    resizeBodySection();
    window.addEventListener('resize', resizeBodySection);
  }

  const enableCinematic =
    hero &&
    nextSection &&
    window.innerWidth > 900 &&
    !prefersReducedMotion &&
    !isSafari;

  if (enableCinematic) {
    initCinematicTransition(hero, nextSection);
  }

  if (header) {
    let lastY = window.pageYOffset;
    window.addEventListener(
      'scroll',
      () => {
        const currentY = window.pageYOffset;
        if (currentY > lastY && currentY > header.offsetHeight) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
        lastY = currentY;
      },
      { passive: true }
    );
  }

  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (prefersReducedMotion || window.innerWidth <= 900) {
      animatedEls.forEach((el) => el.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.15 }
      );
      animatedEls.forEach((el) => observer.observe(el));
    }
  }

  document
    .querySelectorAll('.gallery-grid .neon-card')
    .forEach((el) => el.classList.add('visible'));

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
      link.addEventListener('click', closeMenu);
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

function initCinematicTransition(hero, nextSection) {
  const body = document.body;
  body.classList.add('has-cinematic', 'cinematic-direction-down');
  hero.classList.add('cinematic-hero');
  nextSection.classList.add('cinematic-target');

  let overlay = document.querySelector('.cinematic-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cinematic-overlay';
    body.appendChild(overlay);
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  let heroHeight = hero.offsetHeight || window.innerHeight || 1;
  let sectionTop = nextSection.offsetTop;
  let isAnimating = false;
  let lastKnownScroll = window.pageYOffset;

  const applyProgress = (progressValue) => {
    const clamped = clamp(progressValue, 0, 1);
    body.style.setProperty('--cinematic-progress', clamped.toFixed(4));
  };

  const syncProgress = () => {
    if (isAnimating) return;
    const y = window.pageYOffset;
    const progress = y >= sectionTop ? 1 : clamp(y / heroHeight, 0, 1);
    applyProgress(progress);
  };

  const refreshMetrics = () => {
    heroHeight = hero.offsetHeight || window.innerHeight || 1;
    sectionTop = nextSection.offsetTop;
  };

  applyProgress(
    window.pageYOffset >= sectionTop
      ? 1
      : clamp(window.pageYOffset / heroHeight, 0, 1)
  );

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const runTransition = (direction) => {
    if (isAnimating) return;
    isAnimating = true;

    body.classList.remove('cinematic-direction-down', 'cinematic-direction-up');
    body.classList.add(
      direction === 'down' ? 'cinematic-direction-down' : 'cinematic-direction-up'
    );
    body.classList.add('cinematic-active');

    const startScroll = window.pageYOffset;
    const startProgress = clamp(startScroll / heroHeight, 0, 1);
    const endProgress = direction === 'down' ? 1 : 0;
    const targetScroll = direction === 'down' ? sectionTop : 0;
    const duration = 1100;
    let startTime = null;

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeInOutCubic(elapsed);
      const progress = startProgress + (endProgress - startProgress) * eased;
      applyProgress(progress);
      const scrollPosition = startScroll + (targetScroll - startScroll) * eased;
      window.scrollTo(0, scrollPosition);

      if (elapsed < 1) {
        requestAnimationFrame(step);
      } else {
        applyProgress(endProgress);
        window.scrollTo(0, targetScroll);
        body.classList.remove('cinematic-active');
        lastKnownScroll = targetScroll;
        isAnimating = false;
      }
    };

    requestAnimationFrame(step);
  };

  window.addEventListener('resize', () => {
    refreshMetrics();
    syncProgress();
  });

  window.addEventListener(
    'scroll',
    () => {
      if (isAnimating) {
        lastKnownScroll = window.pageYOffset;
        return;
      }

      const current = window.pageYOffset;
      const previous = lastKnownScroll;
      lastKnownScroll = current;

      if (current >= heroHeight && previous < heroHeight) {
        window.scrollTo(0, heroHeight);
        lastKnownScroll = heroHeight;
        runTransition('down');
        return;
      }

      if (current < heroHeight && previous >= heroHeight && current <= heroHeight - 1) {
        window.scrollTo(0, heroHeight);
        lastKnownScroll = heroHeight;
        runTransition('up');
        return;
      }

      syncProgress();
    },
    { passive: true }
  );

  window.addEventListener(
    'wheel',
    (event) => {
      if (isAnimating) {
        event.preventDefault();
        return;
      }

      const y = window.pageYOffset;
      if (event.deltaY > 0 && y >= heroHeight * 0.75 && y < heroHeight) {
        event.preventDefault();
        runTransition('down');
      } else if (
        event.deltaY < 0 &&
        y <= sectionTop + 2 &&
        y >= Math.max(sectionTop - heroHeight * 0.25, 0)
      ) {
        event.preventDefault();
        runTransition('up');
      }
    },
    { passive: false }
  );

  const downKeys = new Set(['ArrowDown', 'PageDown', 'End', ' ']);
  const upKeys = new Set(['ArrowUp', 'PageUp', 'Home']);
  const isInteractive = (el) => {
    if (!el) return false;
    const tag = el.tagName;
    return (
      (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') ||
      el.isContentEditable
    );
  };

  window.addEventListener('keydown', (event) => {
    if (isInteractive(event.target)) return;

    if (isAnimating && (downKeys.has(event.key) || upKeys.has(event.key))) {
      event.preventDefault();
      return;
    }

    const y = window.pageYOffset;
    if (
      downKeys.has(event.key) &&
      !(event.key === ' ' && event.shiftKey) &&
      y < heroHeight
    ) {
      event.preventDefault();
      runTransition('down');
    } else if (
      upKeys.has(event.key) ||
      (event.key === ' ' && event.shiftKey)
    ) {
      if (y <= sectionTop + 2) {
        event.preventDefault();
        runTransition('up');
      }
    }
  });
}

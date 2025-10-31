/*
  Silverstone Site cinematic scroll controller
  -------------------------------------------
  Lightweight scroll choreography that keeps the hero-to-body transition
  smooth while remaining GPU-friendly.  The effect only animates opacity
  and transforms so it stays silky on modern hardware.
*/

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);

  const injectStylesheet = (href) => {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  injectStylesheet('./assets/css/custom.css');
  injectStylesheet('./assets/css/mobile-fixes.css');

  const hero = document.querySelector('.hero');
  const header = document.querySelector('header');
  const nextSection = findNextSection(hero);

  const disableCinematic =
    prefersReducedMotion ||
    isSafari ||
    window.innerWidth <= 900;

  if (hero && nextSection && !disableCinematic) {
    setupCinematicScroll(hero, nextSection);
  }

  if (header) {
    setupHeaderVisibility(header);
    setupHeaderHoverReveal(header, nextSection);
  }

  setupNavToggle();
  setupFadeIn(prefersReducedMotion || window.innerWidth <= 900);
});

function findNextSection(hero) {
  if (!hero) return null;
  let node = hero.nextElementSibling;
  while (node) {
    if (node.tagName && node.tagName.toLowerCase() === 'section') {
      return node;
    }
    node = node.nextElementSibling;
  }
  return null;
}

function setupCinematicScroll(hero, nextSection) {
  const body = document.body;
  body.classList.add('cinematic-ready');
  nextSection.classList.add('cinematic-target');

  if (!document.querySelector('.scroll-cinematic')) {
    const overlay = document.createElement('div');
    overlay.className = 'scroll-cinematic';
    body.appendChild(overlay);
  }

  const state = {
    scene: 'hero',
    isTransitioning: false,
    isAutoScrolling: false,
    touchStartY: null,
  };

  let sectionTop = 0;

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const updateMetrics = () => {
    const rect = nextSection.getBoundingClientRect();
    sectionTop = rect.top + window.pageYOffset;
  };

  const setScene = (scene) => {
    state.scene = scene;
    body.setAttribute('data-scene', scene);
  };

  const animateScroll = (targetY, duration = 900) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, targetY);
      return Promise.resolve();
    }
    state.isAutoScrolling = true;
    return new Promise((resolve) => {
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          state.isAutoScrolling = false;
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  };

  const beginTransition = async (direction) => {
    if (state.isTransitioning) return;
    const targetScene = direction === 'down' ? 'body' : 'hero';
    if (state.scene === targetScene) return;

    state.isTransitioning = true;
    body.classList.add('cinematic-transitioning');
    body.setAttribute('data-transition-direction', direction);

    updateMetrics();

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        setScene(targetScene);
        resolve();
      });
    });

    const destination = targetScene === 'body' ? sectionTop : 0;
    await animateScroll(destination, 900);
    window.scrollTo(0, destination);

    body.classList.remove('cinematic-transitioning');
    body.removeAttribute('data-transition-direction');
    state.isTransitioning = false;
  };

  const guardScroll = () => {
    if (state.isTransitioning || state.isAutoScrolling) return;
    const y = window.pageYOffset;
    if (state.scene === 'hero' && y > 2) {
      beginTransition('down');
    } else if (state.scene === 'body' && y < sectionTop - 4) {
      beginTransition('up');
    }
  };

  const handleWheel = (event) => {
    if (state.isTransitioning) {
      event.preventDefault();
      return;
    }
    const delta = event.deltaY;
    const y = window.pageYOffset;
    if (state.scene === 'hero' && delta > 0 && y <= 4) {
      event.preventDefault();
      beginTransition('down');
    } else if (
      state.scene === 'body' &&
      delta < 0 &&
      y <= sectionTop + 16
    ) {
      event.preventDefault();
      beginTransition('up');
    }
  };

  const handleKeydown = (event) => {
    const key = event.key;
    const wantsDown =
      key === 'ArrowDown' ||
      key === 'PageDown' ||
      key === 'End' ||
      (key === ' ' && !event.shiftKey);
    const wantsUp =
      key === 'ArrowUp' ||
      key === 'PageUp' ||
      key === 'Home' ||
      (key === ' ' && event.shiftKey);

    if (state.isTransitioning) {
      event.preventDefault();
      return;
    }

    if (state.scene === 'hero' && wantsDown) {
      event.preventDefault();
      beginTransition('down');
    } else if (
      state.scene === 'body' &&
      wantsUp &&
      window.pageYOffset <= sectionTop + 16
    ) {
      event.preventDefault();
      beginTransition('up');
    }
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      state.touchStartY = event.touches[0].clientY;
    }
  };

  const handleTouchMove = (event) => {
    if (state.touchStartY == null) return;
    if (state.isTransitioning) {
      event.preventDefault();
      return;
    }
    const currentY = event.touches[0].clientY;
    const delta = state.touchStartY - currentY;
    if (state.scene === 'hero' && delta > 12) {
      event.preventDefault();
      beginTransition('down');
    } else if (
      state.scene === 'body' &&
      window.pageYOffset <= sectionTop + 16 &&
      delta < -12
    ) {
      event.preventDefault();
      beginTransition('up');
    }
  };

  const handleTouchEnd = () => {
    state.touchStartY = null;
  };

  window.addEventListener('scroll', guardScroll, { passive: true });
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeydown, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });

  window.addEventListener('resize', () => {
    const previousTop = sectionTop;
    updateMetrics();
    if (state.scene === 'body' && !state.isTransitioning) {
      const delta = Math.abs(sectionTop - previousTop);
      if (delta > 1) {
        window.scrollTo(0, sectionTop);
      }
    }
  });

  updateMetrics();
  const initialScene = window.pageYOffset >= sectionTop - 8 ? 'body' : 'hero';
  setScene(initialScene);
  if (initialScene === 'body') {
    state.isAutoScrolling = true;
    window.scrollTo(0, sectionTop);
    state.isAutoScrolling = false;
  } else {
    state.isAutoScrolling = true;
    window.scrollTo(0, 0);
    state.isAutoScrolling = false;
  }
}

function setupHeaderVisibility(header) {
  let lastScrollY = window.pageYOffset;
  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    if (currentY > header.offsetHeight && currentY > lastScrollY) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollY = currentY;
  });
}

function setupHeaderHoverReveal(header, nextSection) {
  if (!nextSection) return;
  document.addEventListener('mousemove', (event) => {
    if (window.innerWidth <= 900) return;
    const boundary = nextSection.getBoundingClientRect().top + window.pageYOffset;
    const scrolledPastHero = window.pageYOffset >= boundary;
    if (!scrolledPastHero) return;

    if (event.clientY <= header.offsetHeight) {
      header.classList.remove('header-hidden');
    } else {
      header.classList.add('header-hidden');
    }
  });
}

function setupNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  if (!navToggle || !navMenu) return;

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

function setupFadeIn(disableAnimations) {
  const animatedEls = document.querySelectorAll('.animate');
  if (!animatedEls.length) {
    document
      .querySelectorAll('.gallery-grid .neon-card')
      .forEach((el) => el.classList.add('visible'));
    return;
  }

  const galleryCards = document.querySelectorAll('.gallery-grid .neon-card');

  if (disableAnimations) {
    animatedEls.forEach((el) => el.classList.add('visible'));
    galleryCards.forEach((el) => el.classList.add('visible'));
    return;
  }

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

  galleryCards.forEach((el) => el.classList.add('visible'));
}


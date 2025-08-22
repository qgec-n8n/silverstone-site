/*
  Silverstone website JavaScript

  Handles interactive behaviour including mobile navigation toggle
  and simple scroll animations. Keeping the JavaScript lean and
  focused on progressive enhancement helps ensure good
  performance across devices. Only core functionality is provided
  here; additional libraries can be added by site owners if
  necessary.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Close menu when clicking link (mobile)
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  });

  // Simple form submission handler
  // Forms with the class `js-form` will show a confirmation message
  // instead of performing a network request. This provides a
  // user‑friendly acknowledgement on static hosting. Site owners can
  // replace this behaviour with their preferred form handling service.
  document.querySelectorAll('form.js-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = form.querySelector('.form-confirmation');
      if (message) {
        message.style.display = 'block';
      }
      form.reset();
    });
  });

  // Header show/hide on scroll
  const header = document.querySelector('header');
  let lastScrollY = window.pageYOffset;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    // Only apply behaviour on larger screens to avoid jitter on mobile
    if (window.innerWidth > 768) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        header.classList.add('header-hidden');
      } else {
        // Scrolling up
        header.classList.remove('header-hidden');
      }
    }
    lastScrollY = currentScrollY;
  });

  // Adjust scroll padding and top spacing to prevent overlap with the fixed header.
  // Adds extra breathing room for page titles by adding 20px to the computed
  // header height. Also updates a CSS custom property (--headerH) so the
  // header height can be referenced in CSS.
  const adjustHeaderSpacing = () => {
    const headerHeight = header.offsetHeight;
    // Update CSS custom property to reflect actual header height
    document.documentElement.style.setProperty('--headerH', `${headerHeight}px`);
    // Apply top scroll padding so anchors aren't hidden behind the header
    document.documentElement.style.scrollPaddingTop = `${headerHeight}px`;
    // Apply equivalent padding (plus extra breathing room) to elements marked with
    // the title-band class. Use an extra 24px to match the CSS rule.
    document.querySelectorAll('.title-band').forEach(el => {
  if (!el.classList.contains('hero')) {
    el.style.paddingTop = `${headerHeight + 24}px`;
  }
});
  };
  // Run on load
  adjustHeaderSpacing();
  // Recalculate on window resize
  window.addEventListener('resize', adjustHeaderSpacing);

  // Intersection observer for fade‑in animations
  const animatedElements = document.querySelectorAll('.animate');
  if (animatedElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.15
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    animatedElements.forEach(el => observer.observe(el));
  }
});

// v17 patch: ensure Innovation Gallery tiles are visible immediately
document.addEventListener('DOMContentLoaded', function forceVisibleGallery() {
  document.querySelectorAll('.gallery-grid .neon-card').forEach(el => el.classList.add('visible'));
});

/* === v21: Services image midline alignment ===
   Ensure each service image vertically centers to match the midline of the paired text box.
   We don't change text box sizes/positions; we only size the image container to the text card's height.
*/
(function() {
  function equalizeServiceRows() {
    // Only run on Services page and on wider screens where items sit side-by-side
    var isServices = document.body && document.body.classList.contains('page-services');
    if (!isServices) return;
    var wide = window.matchMedia('(min-width: 768px)').matches;
    var rows = document.querySelectorAll('.page-services .service-row');
    rows.forEach(function(row){
      var imgWrap = row.querySelector('.service-image');
      var content = row.querySelector('.service-content.neon-card');
      if (!imgWrap || !content) return;
      // Reset any previous sizing
      imgWrap.style.minHeight = '';
      imgWrap.style.display = '';
      imgWrap.style.alignItems = '';
      imgWrap.style.justifyContent = '';
      var img = imgWrap.querySelector('img');
      if (img) {
        img.style.maxHeight = '';
      }
      if (wide) {
        // Match the text card height exactly
        var h = content.getBoundingClientRect().height;
        if (h > 0) {
          imgWrap.style.minHeight = h + 'px';
          imgWrap.style.display = 'flex';
          imgWrap.style.alignItems = 'center';
          imgWrap.style.justifyContent = 'center';
          if (img) {
            img.style.maxHeight = '100%';
          }
        }
      }
    });
  }
  document.addEventListener('DOMContentLoaded', equalizeServiceRows);
  window.addEventListener('resize', function(){ 
    // debounce-lite
    clearTimeout(window.__svc_eqt);
    window.__svc_eqt = setTimeout(equalizeServiceRows, 120);
  });
})();


/* === Mobile hero dynamic height fallback (v6.1, 2025-08-22) === */
(function() {
  const isMobile = () => window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  const supportsDVH = () => (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('height', '100dvh'));

  function setHeroHeights() {
    if (!isMobile()) return;
    const heroes = document.querySelectorAll('.hero.title-band');
    if (!heroes.length) return;

    const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    heroes.forEach(el => {
      // Only set inline height when dvh is not supported
      if (!supportsDVH()) {
        el.style.height = vh + 'px';
      } else {
        // Ensure we don't clamp modern browsers; let CSS handle dvh
        el.style.removeProperty('height');
      }
      // Always keep at least small viewport height as minimum
      el.style.minHeight = '100svh';
    });
  }

  // Initial set (after DOM ready)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setHeroHeights);
  } else {
    setHeroHeights();
  }

  // Update on viewport changes (address bar hide/show, orientation, resize, scroll)
  ['resize', 'orientationchange', 'scroll'].forEach(evt => {
    window.addEventListener(evt, setHeroHeights, { passive: true });
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setHeroHeights);
  }
})();
/* === End mobile hero dynamic height fallback === */
// === Parallax Scroll between First and Second Section (re-entrant, both directions, all pages) ===
document.addEventListener('DOMContentLoaded', function () {
  try {
    const hero = document.querySelector('section.hero.title-band');
    if (!hero) return;

    // Find immediate next <section> sibling
    let second = hero.nextElementSibling;
    while (second && second.tagName && second.tagName.toLowerCase() !== 'section') {
      second = second.nextElementSibling;
    }
    if (!second) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Prepare once
    hero.classList.add('parallax-hero');
    second.classList.add('parallax-second');

    const getY = () => window.pageYOffset || document.documentElement.scrollTop || 0;
    const secondTopAbs = () => second.getBoundingClientRect().top + getY();

    let isAnimating = false;
    let lastDirection = null; // 'down' | 'up'
    let lastEndTime = 0;
    const COOLDOWN_MS = 500; // prevent immediate reverse trigger

    function now() { return Date.now(); }

    function inCooldown(opposite) {
      return lastDirection === opposite && (now() - lastEndTime) < COOLDOWN_MS;
    }

    function lock() {
      document.body.classList.add('parallax-active');
      document.documentElement.style.overflow = 'hidden';
    }
    function unlock() {
      document.body.classList.remove('parallax-active');
      document.documentElement.style.overflow = '';
    }

    function animateDown() {
      if (isAnimating) return;
      if (inCooldown('up')) return;
      isAnimating = true;
      lock();

      // Reflow
      void hero.offsetWidth; void second.offsetWidth;

      // Downward parallax: hero slower up, second faster up
      hero.style.transform = 'translateY(-30%)';
      second.style.transform = 'translateY(-100%)';

      setTimeout(() => {
        hero.style.transform = '';
        second.style.transform = '';
        window.scrollTo({ top: secondTopAbs(), behavior: 'auto' });
        unlock();
        isAnimating = false;
        lastDirection = 'down';
        lastEndTime = now();
      }, 900);
    }

    function animateUp() {
      if (isAnimating) return;
      if (inCooldown('down')) return;
      isAnimating = true;
      lock();

      // Reflow
      void hero.offsetWidth; void second.offsetWidth;

      // Upward parallax: hero slower down, second faster down (reverse of down)
      hero.style.transform = 'translateY(30%)';
      second.style.transform = 'translateY(100%)';

      setTimeout(() => {
        hero.style.transform = '';
        second.style.transform = '';
        window.scrollTo({ top: 0, behavior: 'auto' });
        unlock();
        isAnimating = false;
        lastDirection = 'up';
        lastEndTime = now();
      }, 900);
    }

    function canTriggerDown() {
      return getY() < (hero.offsetHeight * 0.5);
    }
    function canTriggerUp() {
      const top = secondTopAbs();
      const y = getY();
      return y >= top && y <= top + 30;
    }

    // INPUT HANDLERS
    function wheelHandler(e) {
      if (isAnimating) return;
      const dy = e.deltaY;
      if (dy > 10 && canTriggerDown()) {
        e.preventDefault();
        animateDown();
      } else if (dy < -10 && canTriggerUp()) {
        e.preventDefault();
        animateUp();
      }
    }

    function keyHandler(e) {
      if (isAnimating) return;
      if (['PageDown','ArrowDown',' '].includes(e.key) && canTriggerDown()) {
        e.preventDefault();
        animateDown();
      } else if (['PageUp','ArrowUp'].includes(e.key) && canTriggerUp()) {
        e.preventDefault();
        animateUp();
      }
    }

    let touchStartY = null;
    function touchStart(e) {
      if (isAnimating) return;
      touchStartY = e.touches && e.touches.length ? e.touches[0].clientY : null;
    }
    function touchMove(e) {
      if (isAnimating || touchStartY === null) return;
      const y = e.touches && e.touches.length ? e.touches[0].clientY : null;
      if (y === null) return;
      const delta = touchStartY - y;
      if (delta > 20 && canTriggerDown()) {
        e.preventDefault();
        animateDown();
      } else if (delta < -20 && canTriggerUp()) {
        e.preventDefault();
        animateUp();
      }
    }

    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler, { passive: false });
    window.addEventListener('touchstart', touchStart, { passive: false });
    window.addEventListener('touchmove', touchMove, { passive: false });

  } catch (err) {
    console.error('Parallax init error:', err);
  }
});


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

// === One-time Parallax Scroll from Hero to Second Section ===
document.addEventListener('DOMContentLoaded', function () {
  try {
    const hero = document.querySelector('.hero.title-band');
    const second = document.querySelector('.section.bg-lines');
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hero || !second || prefersReduced) return;

    let parallaxDone = false;
    let isAnimating = false;
    let touchStartY = null;

    function atTop() {
      return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop) <= 10;
    }

    function doParallax() {
      if (parallaxDone || isAnimating) return;
      isAnimating = true;

      // Lock scroll
      document.body.classList.add('parallax-active');

      // Prepare elements for transform
      hero.classList.add('parallax-hero');
      second.classList.add('parallax-second');

      // Force a reflow so transitions apply after setting transforms
      void hero.offsetWidth; void second.offsetWidth;

      // Layered motion: hero slower, second faster
      hero.style.transform = 'translateY(-30%)';
      second.style.transform = 'translateY(-100%)';

      // After animation, reset and jump to second section
      setTimeout(() => {
        hero.style.transform = '';
        second.style.transform = '';
        document.body.classList.remove('parallax-active');

        // Mark as done and clean up
        parallaxDone = true;
        removeListeners();

        // Ensure we land exactly at the second section
        const y = second.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y, behavior: 'auto' });

        isAnimating = false;
      }, 950);
    }

    function wheelHandler(e) {
      if (parallaxDone || isAnimating) return;
      if (e.deltaY > 0 && atTop()) {
        e.preventDefault();
        doParallax();
      }
    }

    function keyHandler(e) {
      if (parallaxDone || isAnimating) return;
      const keys = ['PageDown','ArrowDown',' '];
      if (keys.includes(e.key) && atTop()) {
        e.preventDefault();
        doParallax();
      }
    }

    function touchStart(e) {
      if (parallaxDone || isAnimating) return;
      if (!atTop()) return;
      touchStartY = e.touches && e.touches.length ? e.touches[0].clientY : null;
    }

    function touchMove(e) {
      if (parallaxDone || isAnimating || touchStartY === null) return;
      const currentY = e.touches && e.touches.length ? e.touches[0].clientY : null;
      if (currentY === null) return;
      const delta = touchStartY - currentY; // positive if user swipes up (scroll down)
      if (delta > 25 && atTop()) {
        e.preventDefault();
        doParallax();
      }
    }

    function removeListeners() {
      window.removeEventListener('wheel', wheelHandler, { passive: false });
      window.removeEventListener('keydown', keyHandler, { passive: false });
      window.removeEventListener('touchstart', touchStart, { passive: false });
      window.removeEventListener('touchmove', touchMove, { passive: false });
    }

    // Attach listeners as non-passive so we can preventDefault
    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler, { passive: false });
    window.addEventListener('touchstart', touchStart, { passive: false });
    window.addEventListener('touchmove', touchMove, { passive: false });
  } catch (err) {
    console.error('Parallax init error:', err);
  }
});

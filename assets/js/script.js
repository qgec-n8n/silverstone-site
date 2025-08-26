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

/* === Parallax + Snap between first and second section (ever.ru‑style) === */
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isNarrow = () => window.innerWidth < 768;
  const header = document.querySelector('header');
  const firstHero = document.querySelector('section.hero');
  if (!firstHero) return;

  // Find the first section *after* the hero
  let secondSection = firstHero.nextElementSibling;
  while (secondSection && secondSection.tagName !== 'SECTION') {
    secondSection = secondSection.nextElementSibling;
  }
  if (!secondSection) return;

  // Inject CSS variables + stronger parallax visuals
  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --parallax-p: 0;
      --parallax-hero-ty: 0px;
      --parallax-hero-scale: 1;
      --parallax-second-ty: 0px;
      --parallax-content-ty: 0px;
      --parallax-content-opacity: 1;
    }
    /* Stronger parallax on the first hero's background/content */
    section.hero {
      will-change: transform;
      transform: translate3d(0, var(--parallax-hero-ty), 0) scale(var(--parallax-hero-scale));
      transform-origin: center top;
    }
    section.hero .container, section.hero .content, section.hero .title, section.hero h1, section.hero p {
      transform: translate3d(0, calc(var(--parallax-content-ty) * 0.6), 0);
      opacity: var(--parallax-content-opacity);
      transition: opacity 0.2s linear;
    }
    /* Opposing motion on the second section for depth */
    section:not(.hero) {
      will-change: transform;
      transform: translate3d(0, var(--parallax-second-ty), 0);
    }
    /* Ensure no layout shift once snapped */
    .parallax-snapping body { scroll-behavior: auto !important; }
  `;
  document.head.appendChild(style);

  let snapping = false;
  let rafId = null;

  function lerp(a,b,t){ return a + (b-a)*t; }
  function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

  function getHeaderBottom() {
    const rect = header ? header.getBoundingClientRect() : {bottom:0};
    return rect.bottom;
  }

  function computeEndY() {
    // Target is the *visual* top of secondSection aligned to the window top (under header)
    const secRect = secondSection.getBoundingClientRect();
    const currentY = window.scrollY;
    const targetScreenTop = secRect.top + currentY;
    // After snap, header may be hidden (header-hidden) when scrolling down; correct at the end.
    // We use current header height for initial target and then do a precise correction at completion.
    const headerH = header ? header.offsetHeight : 0;
    return Math.max(0, targetScreenTop - headerH);
  }

  function applyParallax(progress) {
    // progress 0..1 while traveling from firstHero bottom to secondSection top
    const p = clamp(progress, 0, 1);
    // Stronger effect per request
    const heroTy = lerp(0, -window.innerHeight * 0.25, p);   // -25vh
    const heroScale = lerp(1, 1.08, p);                       // up to 8% scale
    const secondTy = lerp(window.innerHeight * 0.20, 0, p);   // 20vh down -> 0
    const contentTy = lerp(0, -window.innerHeight * 0.10, p); // content floats up to -10vh
    const contentOpacity = lerp(1, 0.85, p);

    document.documentElement.style.setProperty('--parallax-hero-ty', `${heroTy}px`);
    document.documentElement.style.setProperty('--parallax-hero-scale', `${heroScale}`);
    document.documentElement.style.setProperty('--parallax-second-ty', `${secondTy}px`);
    document.documentElement.style.setProperty('--parallax-content-ty', `${contentTy}px`);
    document.documentElement.style.setProperty('--parallax-content-opacity', `${contentOpacity}`);
  }

  function measureProgress() {
    const startY = firstHero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    const endY = secondSection.getBoundingClientRect().top + window.scrollY;
    const y = window.scrollY;
    const span = Math.max(1, endY - startY);
    return clamp((y - startY) / span, 0, 1);
  }

  function monitorParallax() {
    applyParallax(measureProgress());
    rafId = requestAnimationFrame(monitorParallax);
  }

  function preciseSnapCorrection() {
    // Align second section *exactly* so its top is at the viewport top (under the header)
    const secTop = secondSection.getBoundingClientRect().top;
    const headBottom = getHeaderBottom();
    const delta = Math.round(secTop - headBottom);
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
    }
  }

  function startSnap() {
    if (snapping || prefersReduced || isNarrow()) return;
    snapping = true;
    document.documentElement.classList.add('parallax-snapping');

    const endY = computeEndY();

    // Start RAF parallax monitor
    if (!rafId) rafId = requestAnimationFrame(monitorParallax);

    // Smooth scroll to approximate target
    try {
      window.scrollTo({ top: endY, behavior: 'smooth' });
    } catch(e) {
      window.scrollTo(0, endY);
    }

    // Watch until we're near the target, then do a precise correction to handle header hide/show
    const startTime = performance.now();
    function check() {
      const near = Math.abs(window.scrollY - endY) < 4;
      if (near || performance.now() - startTime > 1500) {
        preciseSnapCorrection();
        // Finish sequence
        setTimeout(() => {
          snapping = false;
          document.documentElement.classList.remove('parallax-snapping');
          // Ensure parallax lands at 1
          applyParallax(1);
        }, 0);
      } else {
        requestAnimationFrame(check);
      }
    }
    requestAnimationFrame(check);
  }

  // Trigger: wheel/touch while inside the first hero
  function inFirstHeroViewport() {
    const rect = firstHero.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > 0; // hero intersects viewport
  }

  function onWheel(e) {
    if (e.deltaY > 0 && inFirstHeroViewport() && !snapping && !prefersReduced && !isNarrow()) {
      e.preventDefault();
      startSnap();
    }
  }

  let touchStartY = null;
  function onTouchStart(e) { touchStartY = e.touches ? e.touches[0].clientY : null; }
  function onTouchMove(e) {
    if (touchStartY == null) return;
    const dy = touchStartY - (e.touches ? e.touches[0].clientY : 0);
    if (dy > 10 && inFirstHeroViewport() && !snapping && !prefersReduced && !isNarrow()) {
      // prevent native over-scroll and start snap
      e.preventDefault();
      startSnap();
    }
  }
  function onTouchEnd(){ touchStartY = null; }

  // Attach listeners (passive: false to allow preventDefault)
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });

  // Also keep parallax in sync with manual scroll between sections
  window.addEventListener('scroll', () => {
    if (!prefersReduced) applyParallax(measureProgress());
  }, { passive: true });

  // Recompute on resize
  window.addEventListener('resize', () => {
    applyParallax(measureProgress());
  });

  // Initialize
  applyParallax(0);
})();
/* === End Parallax + Snap === */

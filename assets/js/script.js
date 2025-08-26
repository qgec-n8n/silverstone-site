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




/* === Slide Scroll Parallax: Hero #1 -> Hero #2 (v1) ===
   Adds a full‑viewport "secondary hero" (the first <section> after the initial .hero)
   and creates a slide-scroll parallax effect between the two sections.
   - Triggers on first user scroll (wheel/touch) while inside the first hero.
   - Smoothly scrolls to the top of the second hero.
   - During the scroll, backgrounds/content of both sections move at different rates (parallax).
   - Applied on all pages that contain a ".hero" followed by another <section>.
   - Degrades gracefully on small screens (disabled < 768px width).
*/
(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn();} else { document.addEventListener('DOMContentLoaded',fn); } }

  function getHeaderHeight(){
    var h = 0, header = document.querySelector('header');
    if(header){ h = header.getBoundingClientRect().height; }
    // Fallback to CSS var if present
    var style = getComputedStyle(document.documentElement);
    var cssVar = style.getPropertyValue('--headerH');
    var v = parseFloat(cssVar);
    if(!isNaN(v) && v > 0){ h = v; }
    return h;
  }

  function findNextSection(el){
    var n = el;
    while(n && n.nextElementSibling){
      n = n.nextElementSibling;
      if(n.tagName && n.tagName.toLowerCase()==='section'){ return n; }
    }
    return null;
  }

  function insertParallaxStyles(){
    if(document.getElementById('hero-parallax-styles')) return;
    var css = `
      /* --- Parallax helpers --- */
      .hero, .hero--secondary { background-position: center calc(50% + var(--bg-shift, 0px)); }
      /* Support pages that draw section background on ::before */
      .section::before { background-position: center calc(50% + var(--bg2-shift, 0px)) !important; }
      .hero .content, .hero--secondary .content { will-change: transform, opacity; }
      /* Ensure our second section behaves like a hero */
      .hero--secondary { min-height: 100vh; height: 100svh; position: relative; overflow: hidden; }
      /* Inherit the band padding so content isn't hidden under the fixed header */
      .hero--secondary.title-band { padding-top: calc(var(--headerH, 64px) + 80px); }
      /* Allow "section" layouts to expand full height when promoted to hero */
      .hero--secondary.section { display: block; }
      /* Avoid jumpiness on mobile where we do nothing special */
      @media (max-width: 767.98px){
        .hero--secondary { min-height: auto; height: auto; }
      }
    `;
    var tag = document.createElement('style');
    tag.id = 'hero-parallax-styles';
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function enableParallax(){
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if(window.innerWidth < 768) return; // keep mobile simple
    var firstHero = document.querySelector('section.hero');
    if(!firstHero) return;
    var second = findNextSection(firstHero);
    if(!second) return;

    // Promote second section to a full-viewport "secondary hero"
    if(!second.classList.contains('hero')){
      second.classList.add('hero', 'hero--secondary', 'title-band'); // title-band creates consistent top padding
    } else {
      second.classList.add('hero--secondary');
    }

    // Make sure natural scroll lands with the section fully visible
    second.style.scrollMarginTop = '0px';

    var snapping = false;
    var headerH = getHeaderHeight();
    var nextTop = Math.round(second.getBoundingClientRect().top + window.pageYOffset);

    // Update "nextTop" after images/fonts load or on resize
    function recalcPositions(){
      headerH = getHeaderHeight();
      nextTop = Math.round(second.getBoundingClientRect().top + window.pageYOffset);
      // Apply one frame of parallax using current scroll
      onScroll();
    }

    var ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        ticking = false;
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;
        var distance = Math.max(1, nextTop); // avoid division by 0
        var p = Math.min(1, Math.max(0, y / distance)); // 0..1 progress from hero-1 to hero-2 top

        // Background parallax (first hero moves faster upward, second moves slower upward)
        // Move first hero background up to -80px; scale subtlely
        firstHero.style.setProperty('--bg-shift', (-80 * p).toFixed(2)+'px');
        firstHero.style.transform = 'translateZ(0) scale(' + (1 + 0.03 * p).toFixed(4) + ')';

        // If second section draws bg on ::before, use --bg2-shift, otherwise use --bg-shift on the section itself.
        second.style.setProperty('--bg2-shift', (40 * (1 - p)).toFixed(2)+'px');
        second.style.setProperty('--bg-shift', (40 * (1 - p)).toFixed(2)+'px');

        // Content parallax / fade
        var h1 = firstHero.querySelector('.content') || firstHero;
        var h2 = second.querySelector('.content') || second;
        if(h1){
          h1.style.transform = 'translateY(' + (-40 * p).toFixed(2) + 'px)';
          h1.style.opacity = (1 - 0.25*p).toFixed(3);
        }
        if(h2){
          h2.style.transform = 'translateY(' + (60 * (1 - p)).toFixed(2) + 'px)';
          h2.style.opacity = (0.05 + 0.95*p).toFixed(3);
        }
      });
    }

    // Scroll-triggered snap from hero-1 to hero-2
    function onIntentToScrollDown(e){
      if(snapping) return;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      // Only if we're still in (roughly) the first hero viewport
      if(y < nextTop - 10){
        // Determine direction for touch events
        var deltaY;
        if(e.type === 'wheel'){
          deltaY = e.deltaY;
        } else if(e.type === 'keydown'){
          // Only react to keys that imply "next"
          var keyNext = (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ');
          if(!keyNext) return;
          deltaY = 100; // pretend it's a positive scroll
        } else if(e.type === 'touchstart'){
          // record touch Y for comparison on touchend
          lastTouchY = e.touches && e.touches.length ? e.touches[0].clientY : null;
          return; // wait until touchend
        } else if(e.type === 'touchend'){
          if(lastTouchY == null) return;
          var endY = (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0].clientY : null;
          if(endY == null) return;
          deltaY = (lastTouchY - endY); // positive if swiping up (scroll down)
        } else {
          return;
        }

        if(deltaY > 8){ // scrolling down
          snapping = true;
          // Let the native scroll animate while we paint parallax onScroll
          window.scrollTo({ top: nextTop, behavior: 'smooth' });
          // Stop snapping once we arrive (or after a timeout safeguard)
          var start = performance.now();
          function checkDone(){
            var yNow = window.pageYOffset || document.documentElement.scrollTop || 0;
            if(Math.abs(yNow - nextTop) < 2 || (performance.now() - start) > 1500){
              snapping = false;
              recalcPositions(); // refresh positions
              return;
            }
            requestAnimationFrame(checkDone);
          }
          requestAnimationFrame(checkDone);
        }
      }
    }
    var lastTouchY = null;

    // Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalcPositions);
    window.addEventListener('orientationchange', recalcPositions);
    window.addEventListener('load', recalcPositions);

    // Initiation triggers to "jump" when user first scrolls down
    window.addEventListener('wheel', onIntentToScrollDown, { passive: true });
    window.addEventListener('keydown', onIntentToScrollDown);
    window.addEventListener('touchstart', onIntentToScrollDown, { passive: true });
    window.addEventListener('touchend', onIntentToScrollDown, { passive: true });

    // First paint
    recalcPositions();
  }

  ready(function(){
    insertParallaxStyles();
    enableParallax();
  });
})();



(function () {
  const mql = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = !!(mql && mql.matches);

  const hero =
    document.querySelector('[data-parallax-hero]') ||
    document.querySelector('section.hero.title-band, .hero.title-band, .hero, .masthead, .banner');

  if (!hero) return;

  // Insert parallax-bg if missing
  let bg = hero.querySelector('.parallax-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'parallax-bg';
    bg.setAttribute('aria-hidden', 'true');
    hero.prepend(bg);
  }

  // Move background image from hero to parallax-bg
  const bgImage = hero.style.backgroundImage || getComputedStyle(hero).backgroundImage;
  if (bgImage && bgImage !== 'none') {
    bg.style.backgroundImage = bgImage;
    hero.style.backgroundImage = 'none';
  }

  // Parallax effect
  if (!reduceMotion) {
    let maxShift = Math.round(window.innerHeight * 0.25);
    let ticking = false;

    function update() {
      const rect = hero.getBoundingClientRect();
      const heroHeight = rect.height || window.innerHeight;
      const seen = Math.min(Math.max(-rect.top, 0), heroHeight);
      const p = seen / heroHeight;
      const shift = Math.round((p * p) * maxShift);
      bg.style.transform = `translateY(${shift}px)`;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      maxShift = Math.round(window.innerHeight * 0.25);
      update();
    });

    update();
  }

  // Auto-scroll to next section
  let next = hero.nextElementSibling;
  while (next && next.tagName.toLowerCase() !== 'section') next = next.nextElementSibling;
  if (!next) return;

  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 0;

  function targetTop(el) {
    const rect = el.getBoundingClientRect();
    const currentY = window.pageYOffset || document.documentElement.scrollTop;
    return Math.max(0, Math.round(currentY + rect.top - 0)); // scroll-padding handles header
  }

  let hasAutoScrolledDown = false;
  let hasAutoScrolledUp = false;

  function within(el) {
    const r = el.getBoundingClientRect();
    return r.top <= window.innerHeight && r.bottom >= 0;
  }

  function onWheel(e) {
    if (!within(hero) || reduceMotion) return;
    if (e.deltaY > 6 && !hasAutoScrolledDown) {
      e.preventDefault();
      hasAutoScrolledDown = true;
      hasAutoScrolledUp = false;
      window.scrollTo({ top: targetTop(next), behavior: 'smooth' });
    } else if (e.deltaY < -6 && !hasAutoScrolledUp && window.scrollY <= targetTop(next)) {
      e.preventDefault();
      hasAutoScrolledUp = true;
      hasAutoScrolledDown = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  let touchY = null;
  function onTouchStart(e){ touchY = e.touches && e.touches[0] ? e.touches[0].clientY : null; }
  function onTouchMove(e){
    if (!within(hero) || reduceMotion || touchY == null) return;
    const dy = touchY - e.touches[0].clientY;
    if (dy > 20 && !hasAutoScrolledDown){
      e.preventDefault();
      hasAutoScrolledDown = true; hasAutoScrolledUp = false;
      window.scrollTo({ top: targetTop(next), behavior:'smooth' });
    } else if (dy < -20 && !hasAutoScrolledUp && window.scrollY <= targetTop(next)){
      e.preventDefault();
      hasAutoScrolledUp = true; hasAutoScrolledDown = false;
      window.scrollTo({ top: 0, behavior:'smooth' });
    }
  }

  function onKey(e){
    if (!within(hero) || reduceMotion) return;
    if (['PageDown',' ','ArrowDown'].includes(e.key)){
      e.preventDefault();
      hasAutoScrolledDown = true; hasAutoScrolledUp = false;
      window.scrollTo({ top: targetTop(next), behavior:'smooth' });
    } else if (['PageUp','ArrowUp','Home'].includes(e.key)){
      e.preventDefault();
      hasAutoScrolledUp = true; hasAutoScrolledDown = false;
      window.scrollTo({ top: 0, behavior:'smooth' });
    }
  }

  hero.addEventListener('wheel', onWheel, { passive: false });
  hero.addEventListener('touchstart', onTouchStart, { passive: true });
  hero.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('scroll', () => {
    if (!within(hero)) { hasAutoScrolledDown = false; hasAutoScrolledUp = false; }
  }, { passive: true });
})();

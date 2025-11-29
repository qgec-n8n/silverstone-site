(function () {
  'use strict';

  let disableDown = false;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  function ensureVeil(next) {
    if (!next) return null;
    if (!next.querySelector('.fx-veil')) {
      if (getComputedStyle(next).position === 'static') {
        next.style.position = 'relative';
      }
      const veil = document.createElement('div');
      veil.className = 'fx-veil';
      veil.setAttribute('aria-hidden', 'true');
      next.insertBefore(veil, next.firstChild);
    }
    return next.querySelector('.fx-veil');
  }

  function initHeroGsap() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const hero = document.getElementById('hero');
    const body = document.getElementById('body');
    const heroTitle = document.getElementById('hero-title');

    if (!hero || !body || !heroTitle) return;

    const nextSection = hero.nextElementSibling;
    const veil = ensureVeil(nextSection);

    if (window.location.hash || sessionStorage.getItem('fromOrb') === 'true') {
      disableDown = true;
      sessionStorage.removeItem('fromOrb');
    }

    gsap.set(heroTitle, { transformOrigin: '50% 50%' });

    if (disableDown) {
      gsap.set(heroTitle, { y: -80, scale: 0.9, opacity: 0.85 });
      if (veil) {
        gsap.set(veil, { opacity: 0, y: 200 });
      }
    }

    const tlDown = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: hero,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    if (veil) {
      tlDown.to(veil, { opacity: 0, y: 200 }, 0);
    }

    tlDown.to(heroTitle, { y: -80, scale: 0.85, opacity: 0.85 }, 0);

    if (disableDown && tlDown.scrollTrigger) {
      tlDown.progress(1);
      tlDown.scrollTrigger.disable();
    }

    const tlUp = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: body,
        start: 'top 90%',
        end: 'top 60%',
        scrub: true,
        onEnterBack() {
          disableDown = false;
          if (tlDown.scrollTrigger) {
            tlDown.scrollTrigger.enable();
            tlDown.play();
          }
        }
      }
    });

    if (veil) {
      tlUp.to(veil, { opacity: 1, y: 0 }, 0);
    }

    tlUp.to(heroTitle, { y: 0, scale: 1, opacity: 1 }, 0);

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroGsap);
  } else {
    initHeroGsap();
  }
})();

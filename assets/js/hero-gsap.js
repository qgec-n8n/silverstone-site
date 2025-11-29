(function () {
  'use strict';

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let disableDown = false;

  function ensureLayers() {
    const hero = document.getElementById('hero') || document.querySelector('.hero.title-band');
    const body = document.getElementById('body');
    let veil = document.querySelector('.fx-veil');

    if (hero) {
      if (!hero.querySelector('.fx-layer')) {
        const layer = document.createElement('div');
        layer.className = 'fx-layer';
        layer.setAttribute('aria-hidden', 'true');
        hero.insertBefore(layer, hero.firstChild);
      }

      if (!hero.querySelector('.fx-bloom')) {
        const bloom = document.createElement('div');
        bloom.className = 'fx-bloom';
        bloom.setAttribute('aria-hidden', 'true');
        hero.appendChild(bloom);
      }

      if (!hero.querySelector('.fx-aurora')) {
        const aurora = document.createElement('div');
        aurora.className = 'fx-aurora';
        aurora.setAttribute('aria-hidden', 'true');
        hero.appendChild(aurora);
      }
    }

    const firstSection = body ? body.querySelector('.section') : null;
    if (firstSection && !veil) {
      if (getComputedStyle(firstSection).position === 'static') {
        firstSection.style.position = 'relative';
      }
      veil = document.createElement('div');
      veil.className = 'fx-veil';
      veil.setAttribute('aria-hidden', 'true');
      firstSection.insertBefore(veil, firstSection.firstChild);
    }

    return { hero, body, veil: veil || document.querySelector('.fx-veil') };
  }

  function refreshAfterImages() {
    const images = Array.from(document.images || []);
    if (!images.length) {
      ScrollTrigger.refresh();
      return;
    }

    let remaining = images.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) {
        ScrollTrigger.refresh();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        done();
      } else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  }

  function initHeroGsap() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const { hero, body, veil } = ensureLayers();
    if (!hero || !body || !veil) return;

    const heroTitle = document.getElementById('hero-title') || hero.querySelector('h1');

    gsap.set([veil, heroTitle], { clearProps: 'all' });
    gsap.set(veil, { opacity: 1, y: 0 });
    gsap.set(heroTitle, { y: 0, scale: 1 });

    if (window.location.hash || sessionStorage.getItem('fromOrb') === 'true') {
      disableDown = true;
      sessionStorage.removeItem('fromOrb');
    }

    const tlDown = gsap.timeline({ paused: true });
    tlDown
      .to(veil, { opacity: 0, y: 200, ease: 'power2.out' }, 0)
      .to(heroTitle, { y: -80, scale: 0.85, ease: 'power2.out' }, 0);

    const downTrigger = ScrollTrigger.create({
      trigger: hero,
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: true,
      animation: tlDown,
    });

    if (disableDown) {
      tlDown.progress(1);
      downTrigger.disable();
    }

    const tlUp = gsap.timeline({
      scrollTrigger: {
        trigger: body,
        start: 'top top+=110',
        end: 'top top',
        scrub: true,
        onEnter: () => {
          disableDown = false;
          downTrigger.enable();
          tlDown.play();
        },
        onEnterBack: () => {
          disableDown = false;
          downTrigger.enable();
          tlDown.play();
        },
      },
    });

    tlUp
      .to(veil, { opacity: 1, y: 0, ease: 'power2.out' }, 0)
      .to(heroTitle, { y: 0, scale: 1, ease: 'power2.out' }, 0);

    refreshAfterImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroGsap);
  } else {
    initHeroGsap();
  }
})();

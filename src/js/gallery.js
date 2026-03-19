/**
 * PREMIUM GALLERY LIGHTBOX BINDER
 *
 * The services gallery markup is rendered directly in HTML so the browser can
 * discover and schedule the images during initial parse. This script only
 * wires up lightbox behavior for those static tiles.
 */

(function () {
  'use strict';

  function ensureLightbox() {
    if (document.getElementById('premium-lightbox')) return;

    const lightbox = document.createElement('div');
    lightbox.id = 'premium-lightbox';
    lightbox.className = 'premium-lightbox';

    const content = document.createElement('div');
    content.className = 'lightbox-content';

    const img = document.createElement('img');
    img.id = 'lightbox-img';
    img.className = 'lightbox-img';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.ariaLabel = 'Close Lightbox';
    closeBtn.addEventListener('click', closeLightbox);

    content.appendChild(img);
    content.appendChild(closeBtn);
    lightbox.appendChild(content);

    document.body.appendChild(lightbox);
  }

  function openLightbox(src) {
    const lightbox = document.getElementById('premium-lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lightbox || !img || !src) return;

    img.src = '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    var preload = new Image();
    preload.onload = function () {
      img.src = src;
    };
    preload.src = src;
  }

  function closeLightbox() {
    const lightbox = document.getElementById('premium-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    var img = document.getElementById('lightbox-img');
    if (img) img.src = '';
  }

  function resolveLightboxSrc(trigger) {
    if (!trigger) return '';

    const explicitSrc = trigger.dataset.lightboxSrc;
    if (explicitSrc) return explicitSrc;

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
  }

  function bindGalleryTiles() {
    const triggers = document.querySelectorAll('.js-gallery-lightbox');
    if (!triggers.length) return;

    ensureLightbox();

    triggers.forEach((trigger) => {
      if (trigger.dataset.ssLightboxBound === '1') return;
      trigger.dataset.ssLightboxBound = '1';

      trigger.addEventListener('click', () => {
        openLightbox(resolveLightboxSrc(trigger));
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openLightbox(resolveLightboxSrc(trigger));
      });
    });
  }

  function initPremiumGallery() {
    bindGalleryTiles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumGallery);
  } else {
    initPremiumGallery();
  }
})();

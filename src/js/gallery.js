/**
 * PREMIUM GALLERY LIGHTBOX BINDER
 *
 * The services gallery markup is rendered directly in HTML so the browser can
 * discover and schedule the images during initial parse. This script only
 * wires up lightbox behavior for those static tiles.
 */

(function () {
  'use strict';

  const lightboxImageCache = new Map();
  let lightboxRequestId = 0;

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

  function preloadLightboxImage(src) {
    if (!src) return Promise.resolve('');

    const cached = lightboxImageCache.get(src);
    if (cached) return cached;

    const preloadPromise = new Promise((resolve, reject) => {
      const preload = new Image();
      preload.decoding = 'async';
      preload.onload = () => resolve(src);
      preload.onerror = reject;
      preload.src = src;
    }).catch(() => {
      lightboxImageCache.delete(src);
      return '';
    });

    lightboxImageCache.set(src, preloadPromise);
    return preloadPromise;
  }

  function setLightboxImage(img, src) {
    if (!img || !src) return;

    const currentAttr = img.getAttribute('src');
    if (currentAttr === src || img.currentSrc === src) return;
    img.src = src;
  }

  function resolveLightboxPreviewSrc(trigger) {
    if (!trigger) return '';

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
  }

  function openLightbox(trigger) {
    const lightbox = document.getElementById('premium-lightbox');
    const img = document.getElementById('lightbox-img');
    const targetSrc = resolveLightboxSrc(trigger);
    const previewSrc = resolveLightboxPreviewSrc(trigger) || targetSrc;
    if (!lightbox || !img || !previewSrc) return;

    const requestId = String(++lightboxRequestId);
    lightbox.dataset.requestId = requestId;
    setLightboxImage(img, previewSrc);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!targetSrc || targetSrc === previewSrc) return;

    preloadLightboxImage(targetSrc).then((loadedSrc) => {
      if (!loadedSrc) return;
      if (!lightbox.classList.contains('active')) return;
      if (lightbox.dataset.requestId !== requestId) return;
      setLightboxImage(img, loadedSrc);
    });
  }

  function closeLightbox() {
    const lightbox = document.getElementById('premium-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.dataset.requestId = '';
    document.body.style.overflow = '';
    var img = document.getElementById('lightbox-img');
    if (img) img.removeAttribute('src');
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

      const warmLightbox = () => {
        const targetSrc = resolveLightboxSrc(trigger);
        const previewSrc = resolveLightboxPreviewSrc(trigger);
        if (!targetSrc || targetSrc === previewSrc) return;
        preloadLightboxImage(targetSrc);
      };

      trigger.addEventListener('pointerenter', warmLightbox, { passive: true });
      trigger.addEventListener('touchstart', warmLightbox, { passive: true });
      trigger.addEventListener('focus', warmLightbox);

      trigger.addEventListener('click', () => {
        openLightbox(trigger);
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openLightbox(trigger);
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

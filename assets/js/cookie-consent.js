/*
 * cookie-consent.js
 *
 * This script displays a cookie consent banner until the user grants
 * permission. Once accepted, a persistent cookie is stored so the banner
 * does not appear again. The banner links to the site's privacy policy.
 */

document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const declineBtn = document.getElementById('cookie-decline-btn');
  if (!banner || !acceptBtn || !declineBtn) return;

  const STORAGE_KEY = 'cookieConsentChoice';
  const COOKIE_NAME = 'cookieConsent';
  const CHOICES = ['accepted', 'declined'];

  function readStoredChoice() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (err) {
      // localStorage may be blocked; fall back to cookies below
    }

    const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function hideBanner() {
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
  }

  function showBanner() {
    banner.classList.add('is-visible');
    banner.setAttribute('aria-hidden', 'false');
  }

  function storeChoice(value) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {
      // If storage is blocked, continue without failing.
    }

    try {
      document.cookie =
        COOKIE_NAME +
        '=' +
        encodeURIComponent(value) +
        '; expires=' +
        expiryDate.toUTCString() +
        '; path=/; SameSite=Lax';
    } catch (err) {
      // Ignore cookie write issues to avoid breaking the page.
    }

    hideBanner();
    banner.setAttribute('data-consent-dismissed', 'true');
  }

  const storedChoice = readStoredChoice();

  if (CHOICES.includes(storedChoice)) {
    hideBanner();
    return;
  }

  showBanner();

  acceptBtn.addEventListener('click', function () {
    storeChoice('accepted');
  });

  declineBtn.addEventListener('click', function () {
    storeChoice('declined');
  });
});

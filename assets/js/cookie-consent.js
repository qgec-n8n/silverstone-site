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
  const COOKIE_KEY = 'cookieConsent';

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getStoredChoice() {
    try {
      const choice = localStorage.getItem(STORAGE_KEY);
      if (choice) return choice;
    } catch (err) {
      // Ignore storage read issues and fall back to cookies.
    }
    return getCookie(COOKIE_KEY);
  }

  function hideBanner() {
    banner.style.display = 'none';
    banner.setAttribute('data-consent-dismissed', 'true');
    banner.setAttribute('aria-hidden', 'true');
  }

  function showBanner() {
    banner.style.display = 'flex';
    banner.removeAttribute('aria-hidden');
    banner.removeAttribute('data-consent-dismissed');
  }

  const storedChoice = getStoredChoice();
  if (storedChoice) {
    hideBanner();
    return;
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
        COOKIE_KEY +
        '=' +
        encodeURIComponent(value) +
        '; expires=' +
        expiryDate.toUTCString() +
        '; path=/; SameSite=Lax';
    } catch (err) {
      // Ignore cookie write issues to avoid breaking the page.
    }

    hideBanner();
  }

  showBanner();

  acceptBtn.addEventListener('click', function () {
    storeChoice('accepted');
  });

  declineBtn.addEventListener('click', function () {
    storeChoice('declined');
  });
});

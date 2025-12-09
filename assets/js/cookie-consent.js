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

  const STORAGE_KEY = 'silverstone_cookie_choice';
  const COOKIE_NAME = 'silverstone_cookie_choice';
  const LEGACY_STORAGE_KEY = 'cookieConsentChoice';
  const LEGACY_COOKIE_NAME = 'cookieConsent';

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  const storedChoice =
    localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  const cookieChoice = getCookie(COOKIE_NAME) || getCookie(LEGACY_COOKIE_NAME);

  if (storedChoice && !localStorage.getItem(STORAGE_KEY)) {
    try {
      localStorage.setItem(STORAGE_KEY, storedChoice);
    } catch (err) {
      // ignore
    }
  }

  if (storedChoice || cookieChoice) {
    storeChoice(storedChoice || cookieChoice);
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
        `${COOKIE_NAME}=` +
        encodeURIComponent(value) +
        '; expires=' +
        expiryDate.toUTCString() +
        '; path=/; SameSite=Lax';
    } catch (err) {
      // Ignore cookie write issues to avoid breaking the page.
    }

    banner.style.display = 'none';
    banner.setAttribute('data-consent-dismissed', 'true');
  }

  banner.style.display = 'flex';
  banner.style.position = banner.style.position || 'fixed';

  acceptBtn.addEventListener('click', function () {
    storeChoice('accepted');
  });

  declineBtn.addEventListener('click', function () {
    storeChoice('declined');
  });
});

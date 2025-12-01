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

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  const storedChoice = localStorage.getItem(STORAGE_KEY);
  const cookieChoice = getCookie('cookieConsent');

  if (storedChoice || cookieChoice) {
    banner.style.display = 'none';
    return;
  }

  function storeChoice(value) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    localStorage.setItem(STORAGE_KEY, value);
    document.cookie =
      'cookieConsent=' +
      encodeURIComponent(value) +
      '; expires=' +
      expiryDate.toUTCString() +
      '; path=/; SameSite=Lax';
    banner.style.display = 'none';
  }

  banner.style.display = 'flex';

  acceptBtn.addEventListener('click', function () {
    storeChoice('accepted');
  });

  declineBtn.addEventListener('click', function () {
    storeChoice('declined');
  });
});

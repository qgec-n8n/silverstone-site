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

  const hideBanner = () => {
    banner.style.display = 'none';
    banner.setAttribute('aria-hidden', 'true');
    banner.classList.remove('is-visible');
  };

  const showBanner = () => {
    banner.style.display = 'flex';
    banner.setAttribute('aria-hidden', 'false');
    banner.classList.add('is-visible');
  };

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  const storedChoice = localStorage.getItem(STORAGE_KEY);
  const cookieChoice = getCookie('cookieConsent');

  if (storedChoice || cookieChoice) {
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
        'cookieConsent=' +
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

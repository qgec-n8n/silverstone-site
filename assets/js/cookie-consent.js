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
  if (!banner || !acceptBtn) return;

  // Helper to read a cookie by name
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // If consent has already been given, hide the banner immediately
  if (getCookie('cookieConsent') === 'true') {
    banner.style.display = 'none';
    return;
  }

  // When the user clicks accept, set a long‑lived cookie and hide the banner
  acceptBtn.addEventListener('click', function () {
    const expiryDate = new Date();
    // Store consent for one year
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie =
      'cookieConsent=true; expires=' +
      expiryDate.toUTCString() +
      '; path=/; SameSite=Lax';
    banner.style.display = 'none';
  });
});

/*
 * cookie-consent.js
 *
 * Displays a cookie consent banner until the user makes a choice.
 * The choice is stored in both localStorage and a cookie so that the
 * banner stays hidden across pages and visits.
 */

document.addEventListener('DOMContentLoaded', function () {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;

  var acceptBtn = document.getElementById('cookie-accept-btn');
  var declineBtn = document.getElementById('cookie-decline-btn');

  var STORAGE_KEY = 'cookieConsentChoice';
  var COOKIE_NAME = 'cookieConsent';

  function safeGetStoredChoice() {
    try {
      if (!('localStorage' in window)) return null;
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function safeSetStoredChoice(value) {
    try {
      if (!('localStorage' in window)) return;
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {
      // Ignore storage issues (e.g. Safari private mode, extensions).
    }
  }

  function getCookie(name) {
    var encodedName = name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1');
    var pattern = new RegExp('(?:^|; )' + encodedName + '=([^;]*)');
    var matches = document.cookie.match(pattern);
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  function setCookie(name, value, days) {
    try {
      var now = new Date();
      now.setTime(now.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = 'expires=' + now.toUTCString();
      document.cookie =
        name +
        '=' +
        encodeURIComponent(value) +
        '; ' +
        expires +
        '; path=/; SameSite=Lax';
    } catch (err) {
      // Ignore cookie write errors.
    }
  }

  function applyChoice(choice) {
    // Keep the attribute for CSS hooks if needed.
    banner.setAttribute('data-consent-dismissed', 'true');
    banner.style.display = 'none';
  }

  function storeChoice(choice) {
    safeSetStoredChoice(choice);
    setCookie(COOKIE_NAME, choice, 180);
    applyChoice(choice);
  }

  var storedChoice = safeGetStoredChoice();
  var cookieChoice = getCookie(COOKIE_NAME);

  if (storedChoice || cookieChoice) {
    applyChoice(storedChoice || cookieChoice);
    return;
  }

  // No choice yet → show banner.
  banner.removeAttribute('data-consent-dismissed');
  banner.style.display = 'flex';

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      storeChoice('accepted');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      storeChoice('declined');
    });
  }
});

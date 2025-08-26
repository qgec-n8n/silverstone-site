// Cookie consent banner script
(function () {
  // Check if consent already given
  const consent = localStorage.getItem('cookieConsent');
  if (consent) {
    // Consent already stored; optionally trigger analytics if accepted
    return;
  }
  // Create banner
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>We use cookies and similar technologies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of non‑essential cookies. See our <a href="/privacy.html" style="color: var(--color-green); text-decoration: underline;">Privacy Policy</a> for details.</p>
    <div class="cookie-buttons">
      <button class="accept">Accept</button>
      <button class="decline">Decline</button>
    </div>
  `;
  // Append banner to body
  document.body.appendChild(banner);
  // Handle Accept click
  banner.querySelector('button.accept').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.remove();
    // Load non-essential scripts here if needed
  });
  // Handle Decline click
  banner.querySelector('button.decline').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    banner.remove();
  });
})();

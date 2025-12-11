(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  function setStatus(msg, ok) {
    if (!status) return;
    status.style.display = 'block';
    status.style.color = ok ? 'var(--color-success, #6ee7b7)' : 'var(--color-warning, #fca5a5)';
    status.textContent = msg;
  }
  function sanitize(str) {
    return String(str || '').replace(/[<>]/g, '');
  }
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = new FormData(form);
    if ((data.get('company') || '').length > 0) {
      return;
    }
    const name = sanitize(data.get('name'));
    const email = sanitize(data.get('email'));
    const message = sanitize(data.get('message'));
    if (!name || !email || !message) {
      setStatus('Please complete all fields.', false);
      return;
    }
    setStatus('Sending…', true);
    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('Thanks! Your message has been sent.', true);
        form.reset();
      } else {
        setStatus(body.error || 'Sorry, something went wrong. Please try again later.', false);
      }
    } catch (err) {
      setStatus('Network error. Please try again.', false);
    }
  });
})();

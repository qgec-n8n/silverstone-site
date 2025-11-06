// netlify/functions/send-email.js
// Serverless function to send contact form emails via Resend
// Uses Node's built-in https to avoid external dependencies.
const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Basic JSON parse and validation
    const body = JSON.parse(event.body || '{}');
    const name = (body.name || '').toString().trim();
    const email = (body.email || '').toString().trim();
    const message = (body.message || '').toString().trim();

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing fields' }),
      };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.CONTACT_TO || 'info@silverstone-ai.com';
    const FROM_EMAIL = process.env.CONTACT_FROM || 'noreply@mail.silverstone-ai.com';

    if (!RESEND_API_KEY) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing RESEND_API_KEY' }),
      };
    }

    const payload = JSON.stringify({
      from: `Silverstone AI <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: 'New contact form message',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      // Provide both forms to be compatible with REST and SDK conventions
      reply_to: email,
      replyTo: email,
      headers: { 'Reply-To': email }
    });

    const requestOptions = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const resBody = await new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data || '{}');
          } else {
            reject(new Error(`Resend API error (${res.statusCode}): ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, data: JSON.parse(resBody || '{}') }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', detail: String(err && err.message || err) }),
    };
  }
};
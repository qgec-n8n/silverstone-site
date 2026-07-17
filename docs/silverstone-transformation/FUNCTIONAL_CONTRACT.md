# Silverstone Functional Contract

**Status:** Required behaviour to preserve through the `/web` rebuild.  
**Last updated:** 2026-06-26.  
**Sources:** `contact.html`, `book.html`, `privacy-policy.html`, `assets/js/app.js`, `netlify/functions/send-email.js`, `web/.env.example`, `web/.env.staging`, `docs/silverstone-transformation/architecture/execution-blueprint-v1/integration-safety-model-v1.md`.

## Production Safety Contract

- No production email sends, bookings, analytics mutations, DNS changes, Netlify changes, environment changes, or deploys are authorized by this contract.
- All `/web` integration work must use mocks, disabled adapters, or authorized non-production services until a separate release prompt approves production testing.

## Contact Form

**Preserve exactly:**

- Public route: `/contact`.
- Business outcome: visitor can send an enquiry to Silverstone AI.
- Visible field intent: name, email, message.
- Hidden honeypot intent: `company`.
- Submission endpoint compatibility: `/.netlify/functions/send-email`.
- Business contact details visible in legacy content: `info@silverstone-ai.com`, `4 Deacon Street, London, SE17 1GE, UK`, and footer phone `+44 7418 329232`.
- Google Maps location purpose with direct address fallback.

**Preserve behaviour but redesign presentation:**

- Pending, success, error, and network-error states.
- Fallback contact path and email link.
- Social links to Instagram and Facebook where still approved.

**Migrate and improve:**

- Server-side validation must include schema, email syntax, length limits, content type, honeypot/abuse controls, origin/rate controls where appropriate, and safe provider-error handling.
- Client status must use an accessible live region.
- Submit button should prevent duplicate submissions during pending state.
- Raw provider/internal details must not be returned to the browser.

**Current legacy implementation evidence:**

- `assets/js/app.js` sanitizes `<` and `>`, blocks client honeypot submissions, posts JSON `{ name, email, message }`, shows "Sending...", "Thanks! Your message has been sent.", provider error text, or "Network error. Please try again."
- `netlify/functions/send-email.js` uses Node `https` to call Resend API `/emails`.
- Required env: `RESEND_API_KEY`.
- Optional env/defaults: `CONTACT_TO` default `info@silverstone-ai.com`; `CONTACT_FROM` default `noreply@mail.silverstone-ai.com`.
- Function GET/non-POST returns 200 text with `X-Robots-Tag: noindex, nofollow`.

## Resend And Email

**Preserve exactly:**

- Production env names may be documented but values must never be committed.
- Sender semantic: `Silverstone AI <CONTACT_FROM>`.
- Recipient semantic: configured recipient or `info@silverstone-ai.com`.
- Reply-to semantic: visitor email.

**Staging/local rule:**

- `RESEND_MODE=mock` or equivalent disabled/sink mode.
- No production recipient, production API key, or production-send path in staging.
- Test messages, if ever authorized, must use unmistakable staging subject/metadata and non-production credentials.

## Calendly Booking

**Preserve exactly:**

- Public route: `/book`.
- Production event URL: `https://calendly.com/silverstone-ai/30min`.
- Contact fallback from booking route to `/contact`.
- Booking proposition: a free 30-minute automation/discovery audit that sets expectations and reduces pressure.

**Current native-booking contract:**

- Four stages: Qualify, Date & time, Your details, Confirmed.
- Qualification preserves service, industry, indicative budget, and urgency through confirmation.
- React DayPicker is exposed through the local shadcn/ui Calendar component.
- The console has a stable breakpoint-defined height; workflow state and availability volume do not resize it.
- The calendar remains stationary and only the dedicated time-slot viewport scrolls.
- The selectable horizon runs from the current local date through the same calendar date three months later, inclusive. Dates beyond that boundary cannot be selected or submitted.
- Each application request covers at most 42 days and shortens at the final horizon boundary. The server splits requests into Calendly's documented maximum seven-day upstream ranges, then merges, deduplicates, and sorts reduced slot data.
- Availability is cached by event type, booking mode, timezone, and date range. Overlapping navigation requests fetch only uncovered ranges, share in-flight work, and cannot let an older response replace newer state.
- Live availability and booking creation use same-origin Netlify Functions; `CALENDLY_API_TOKEN` and optional `CALENDLY_EVENT_TYPE_URI` are server-only.
- The event type resolves from the preserved public event URL and is cached server-side.
- Booking creation rechecks the slot, validates all fields, sends the event type's configured location, limits abuse, and controls duplicate submissions.
- A stale or concurrently claimed slot is invalidated locally, availability is refreshed, the failed time selection is cleared, and the invitee is returned to another verified time.
- The phone layout keeps status, month navigation, six-week date grid, and availability key in dedicated non-overlapping rows inside a viewport-bounded shell. The desktop composition remains outside the phone-only media boundary.
- Clear loading, empty, rate-limit, unavailable-slot, configuration, and upstream fallback states.
- No-pressure copy and practical next-step framing.

**Staging/local rule:**

- `VITE_BOOKING_MODE=mock` (or `disabled`) and deterministic availability/booking fixtures only.
- `CALENDLY_BOOKING_MODE=mock` for any non-production function environment.
- Do not create a real Calendly appointment.
- Never expose a Calendly credential through `VITE_*`, rendered HTML, browser payloads, logs, screenshots, or source maps.

## Analytics And Consent

**Preserve requirements, not current defect:**

- Legacy GA measurement ID observed: `G-7GT6DQKTT5`.
- Legacy cookie banner offers Accept/Decline and stores `cookieConsentChoice` plus `cookieConsent`.
- Privacy policy states non-essential cookies are set only after consent.

**Current defect to fix in rebuild:**

- Legacy pages load GA before consent. `/web` must not reproduce this.

**Staging/local rule:**

- `VITE_ANALYTICS_DISABLED=true` by default.
- Production analytics IDs must not be used in staging without explicit authorization.
- Network tests must prove no non-essential analytics before valid consent.

## Legal Content

**Preserve exactly until legal review:**

- Privacy policy route: `/privacy-policy`.
- Legal wording in `privacy-policy.html` sections 1-7.
- Contact email and address in the legal page.

**Migrate and improve only structurally:**

- Better landmarks, headings, typography, focus, and responsive presentation are allowed.
- Legal wording changes require explicit approval.
- Consent implementation and legal wording must be reconciled before production release.

## SEO, Sitemap, Robots, And Structured Data

**Preserve exactly:**

- Useful canonical URLs and route equity from the 50-route baseline.
- `index, follow` on production-indexable legacy routes unless an approved route decision changes status.
- Canonical tags and sitemap membership for retained canonicals.

**Migrate and improve:**

- Generate metadata, schema, visible breadcrumbs, robots, and sitemap from one route registry.
- Generate meaningful initial HTML for every indexable route.
- Do not expose staging to indexing.

## Conversion Paths

**Preserve behaviour but redesign presentation:**

- Industry/service education to pricing/book/contact.
- Blog/article education to relevant service/industry/booking routes.
- Booking route as high-intent CTA.
- Contact route as fallback and lower-friction path.

**Do not preserve merely because it exists:**

- Unsupported counters, repetitive industry templates, weak proof hierarchy, excessive copy, bottom image carousels, or invented proof.

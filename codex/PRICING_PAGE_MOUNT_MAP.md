<!-- FILE: codex/PRICING_PAGE_MOUNT_MAP.md -->

# Pricing Mount Map (Where and How to Inject)

## Rule: only replace the existing placeholder paragraph
On each target page, locate the pricing section containing:

- `<h2 class="section-title">Pricing</h2>`
- followed by the placeholder paragraph whose text starts with:
  - `Transparent pricing tables will appear here soon.`

Replace ONLY that `<p class="section-subtitle">...</p>` node with the mount element below.

Do not change:
- the `<h2>` line
- the surrounding `.neon-card` container
- any other content or whitespace outside the replaced block

---

## Mount element template (exact)
Use:
- `<div class="ss-pricing-mount" data-ss-pricing-page="<PAGE_KEY>"></div>`

Where `<PAGE_KEY>` MUST match the exact heading key in `PRICING_COPY_MAP.md`.

---

## Page key mapping (must be exact)
1) services.html
- File: `services.html`
- data-ss-pricing-page value: `services.html`

2) Estate Agents
- File: `niches/estate-agents.html`
- data-ss-pricing-page value: `niches/estate-agents.html`

3) Hospitality
- File: `niches/hospitality.html`
- data-ss-pricing-page value: `niches/hospitality.html`

4) Salons & Barbers
- File: `niches/salons-barbers.html`
- data-ss-pricing-page value: `niches/salons-barbers.html`

5) Trades Virtual Office
- File: `niches/trades-virtual-office.html`
- data-ss-pricing-page value: `niches/trades-virtual-office.html`

6) eCommerce
- File: `niches/ecommerce.html`
- data-ss-pricing-page value: `niches/ecommerce.html`

7) Physios & Chiropractors
- File: `niches/physios-chiropractors.html`
- data-ss-pricing-page value: `niches/physios-chiropractors.html`

8) Dentists
- File: `niches/dentists.html`
- data-ss-pricing-page value: `niches/dentists.html`

9) Gyms & Fitness Studios
- File: `niches/gyms-fitness-studios.html`
- data-ss-pricing-page value: `niches/gyms-fitness-studios.html`

10) Fitness Coaches
- File: `niches/fitness-coaches.html`
- data-ss-pricing-page value: `niches/fitness-coaches.html`

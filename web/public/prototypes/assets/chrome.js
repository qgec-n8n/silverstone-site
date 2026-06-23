/*
  Silverstone prototype shared chrome (navigation + footer).

  The home prototype inlines its nav/footer. Every OTHER prototype page is a
  separate static file, so to avoid 20x duplication (and drift) the shared site
  chrome is injected here from one source of truth. This is site navigation, not
  primary content: each page's <main> is always present in the HTML without JS,
  so a script failure never hides the page's actual content or its skip link.

  Load order matters. Include this module BEFORE prototype.js in <head> so the
  nav exists when prototype.js wires sticky compaction, disclosures and the
  mobile toggle. Both are deferred modules and run in document order.

  Markup produced is intentionally identical in shape to the home prototype so
  prototype.js selectors ([data-nav], [data-disclosure], [data-toggle]) work
  unchanged.
*/

const P = "/prototypes";

const SERVICE_LINKS = [
  { href: `${P}/services/web-design-development/index.html`, title: "Web design & development", note: "Conversion-path sites that stay fast" },
  { href: `${P}/services/app-development/index.html`, title: "Custom app development", note: "Product surfaces with real state" },
  { href: `${P}/services/content-creation/index.html`, title: "Content creation", note: "Source-to-channel editorial loom" },
  { href: `${P}/services/ai-voice-agents/index.html`, title: "AI voice agents", note: "Deterministic call flows" },
  { href: `${P}/services/ai-receptionists/index.html`, title: "AI receptionists", note: "Multi-channel front desk" },
  { href: `${P}/services/ai-automation/index.html`, title: "AI automation", note: "Exception-aware workflows" },
];

const INDUSTRY_LINKS = [
  { href: `${P}/industries/estate-agents/index.html`, title: "Estate agents", note: "Property-enquiry switchboard" },
  { href: `${P}/industries/hospitality/index.html`, title: "Hospitality", note: "Guest-journey service bell" },
  { href: `${P}/industries/salons-barbers/index.html`, title: "Salons & barbers", note: "Chair-and-calendar weave" },
  { href: `${P}/industries/trades/index.html`, title: "Trades & home services", note: "Job-intake dispatch board" },
  { href: `${P}/industries/ecommerce/index.html`, title: "eCommerce brands", note: "Order-state conveyor" },
  { href: `${P}/industries/physios-chiropractors/index.html`, title: "Physio & chiropractic", note: "Non-clinical intake boundary" },
  { href: `${P}/industries/dentists/index.html`, title: "Dental practices", note: "Patient-admin recall orbit" },
  { href: `${P}/industries/gyms-fitness-studios/index.html`, title: "Gyms & fitness studios", note: "Trial-to-membership roster" },
  { href: `${P}/industries/fitness-coaches/index.html`, title: "Fitness coaches", note: "DM-to-consultation pathway" },
];

const CARET = `<svg class="ss-disclosure-caret" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5 L7 9 L11 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const ARROW = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8 H12 M9 5 L12 8 L9 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

const BRAND_MARK = `<svg class="ss-brand__mark" viewBox="0 0 28 28" aria-hidden="true"><rect x="2" y="2" width="24" height="24" rx="7" fill="none" stroke="var(--ss-color-action-primary-bg)" stroke-width="1.75" /><circle cx="14" cy="14" r="5.5" fill="none" stroke="var(--ss-color-primitive-electric-cyan)" stroke-width="1.75" /><circle cx="14" cy="14" r="1.8" fill="var(--ss-color-action-primary-bg)" /></svg>`;

function disclosureItems(links) {
  return links
    .map(
      (l) =>
        `<a class="ss-nav__disclosure-item" href="${l.href}" role="menuitem"><strong>${l.title}</strong><span>${l.note}</span></a>`,
    )
    .join("");
}

function current(route, key) {
  return route === key ? ' aria-current="page"' : "";
}

function navInner(route) {
  return `
    <div class="ss-container ss-nav__inner" data-size="max">
      <a class="ss-brand" href="${P}/index.html">${BRAND_MARK} Silverstone</a>

      <nav aria-label="Primary">
        <ul class="ss-nav__links">
          <li class="ss-nav__group" data-disclosure>
            <a class="ss-nav__link ss-nav__link--has-disclosure" href="${P}/services/index.html" aria-expanded="false" aria-haspopup="true" aria-controls="nav-services-panel"${current(route, "services")}>Services ${CARET}</a>
            <div class="ss-nav__disclosure" id="nav-services-panel" data-disclosure-panel data-open="false" role="menu" aria-label="Services">
              <a class="ss-nav__disclosure-item" href="${P}/services/index.html" role="menuitem"><strong>All services</strong><span>Six-capability decision matrix</span></a>
              ${disclosureItems(SERVICE_LINKS)}
            </div>
          </li>
          <li class="ss-nav__group" data-disclosure>
            <a class="ss-nav__link ss-nav__link--has-disclosure" href="${P}/industries/index.html" aria-expanded="false" aria-haspopup="true" aria-controls="nav-industries-panel"${current(route, "industries")}>Industries ${CARET}</a>
            <div class="ss-nav__disclosure" id="nav-industries-panel" data-disclosure-panel data-open="false" role="menu" aria-label="Industries">
              <a class="ss-nav__disclosure-item" href="${P}/industries/index.html" role="menuitem"><strong>All industries</strong><span>Operating-pattern atlas</span></a>
              ${disclosureItems(INDUSTRY_LINKS)}
            </div>
          </li>
          <li><a class="ss-nav__link" href="${P}/how-we-work/index.html"${current(route, "how-we-work")}>How we work</a></li>
          <li><a class="ss-nav__link" href="${P}/pricing/index.html"${current(route, "pricing")}>Pricing</a></li>
          <li><a class="ss-nav__link" href="${P}/about/index.html"${current(route, "about")}>About</a></li>
          <li><a class="ss-nav__link" href="${P}/blog/index.html"${current(route, "blog")}>Insights</a></li>
        </ul>
      </nav>

      <div class="ss-nav__actions">
        <a class="ss-btn ss-btn--primary" href="${P}/book/index.html" style="min-height: 44px; padding-inline: var(--ss-space-5)">Book a discovery call</a>
        <button class="ss-nav__toggle" type="button" data-toggle="mobile-panel" aria-expanded="false" aria-controls="mobile-panel" aria-label="Open menu">
          <svg viewBox="0 0 22 22" width="20" height="20" aria-hidden="true"><path d="M3 6 H19 M3 11 H19 M3 16 H19" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" /></svg>
        </button>
      </div>
    </div>

    <div class="ss-mobile-panel" id="mobile-panel" data-open="false">
      <a href="${P}/services/index.html">Services</a>
      <a href="${P}/industries/index.html">Industries</a>
      <a href="${P}/how-we-work/index.html">How we work</a>
      <a href="${P}/pricing/index.html">Pricing</a>
      <a href="${P}/about/index.html">About</a>
      <a href="${P}/blog/index.html">Insights</a>
      <a href="${P}/book/index.html">Book a discovery call</a>
    </div>`;
}

function footerInner() {
  const col = (heading, links) =>
    `<div><h2>${heading}</h2><ul>${links
      .map((l) => `<li><a href="${l.href}">${l.title}</a></li>`)
      .join("")}</ul></div>`;

  return `
    <div class="ss-container" data-size="max">
      <div class="ss-footer__grid">
        <div>
          <a class="ss-brand" href="${P}/index.html" style="color: var(--ss-color-text-inverse)">
            <svg class="ss-brand__mark" viewBox="0 0 28 28" aria-hidden="true"><rect x="2" y="2" width="24" height="24" rx="7" fill="none" stroke="var(--ss-color-primitive-electric-cyan)" stroke-width="1.75" /><circle cx="14" cy="14" r="5.5" fill="none" stroke="var(--ss-color-primitive-electric-cyan)" stroke-width="1.75" /><circle cx="14" cy="14" r="1.8" fill="var(--ss-color-primitive-electric-cyan)" /></svg>
            Silverstone
          </a>
          <p style="color: var(--ss-color-derived-night-muted); font-size: var(--ss-type-body-sm); margin-top: var(--ss-space-4); max-width: 30ch">
            One calm operating surface — with a human always in control of the signal.
          </p>
        </div>
        ${col("Services", [
          { href: `${P}/services/web-design-development/index.html`, title: "Web & development" },
          { href: `${P}/services/app-development/index.html`, title: "App development" },
          { href: `${P}/services/content-creation/index.html`, title: "Content creation" },
          { href: `${P}/services/ai-voice-agents/index.html`, title: "Voice & receptionists" },
          { href: `${P}/services/ai-automation/index.html`, title: "AI automation" },
        ])}
        ${col("Industries", [
          { href: `${P}/industries/hospitality/index.html`, title: "Hospitality" },
          { href: `${P}/industries/dentists/index.html`, title: "Clinics & care" },
          { href: `${P}/industries/trades/index.html`, title: "Trades & home services" },
          { href: `${P}/industries/estate-agents/index.html`, title: "Estate agents" },
        ])}
        ${col("Company", [
          { href: `${P}/how-we-work/index.html`, title: "How we work" },
          { href: `${P}/book/index.html`, title: "Book a call" },
          { href: `${P}/about/index.html`, title: "About" },
          { href: `${P}/blog/index.html`, title: "Insights" },
        ])}
      </div>
      <div class="ss-footer__meta">
        <span>© Silverstone — visual prototype, not production.</span>
        <span>Precision Luminescence · 70 / 20 / 10</span>
      </div>
    </div>`;
}

function injectChrome() {
  // Mark that JS is active so CSS can safely hide [data-reveal] content for the
  // settle animation. Without JS this attribute is never set and all content
  // stays visible.
  document.documentElement.setAttribute("data-js", "on");

  const route = document.body?.dataset?.route ?? "";

  const navHost = document.querySelector("[data-site-nav]");
  if (navHost) {
    navHost.classList.add("ss-nav");
    navHost.setAttribute("data-nav", "");
    navHost.innerHTML = navInner(route);
  }

  const footerHost = document.querySelector("[data-site-footer]");
  if (footerHost) {
    footerHost.classList.add("ss-footer");
    footerHost.innerHTML = footerInner();
  }
}

injectChrome();

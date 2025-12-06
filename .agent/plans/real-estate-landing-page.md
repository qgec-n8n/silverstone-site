# Build the Estate Agents / Real Estate niche landing page

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` at the repository root.

## Purpose / Big Picture

The goal of this ExecPlan is to design and implement a dedicated Estate Agents / Real Estate niche landing page for independent estate and lettings branches in the UK. The page should:

- Speak directly to estate and lettings agents about missed enquiries, viewings, and instructions.
- Present the “Never Miss a Viewing” automation bundle clearly and persuasively.
- Quantify the cost of slow or missed responses via a proof-in-numbers strip.
- Show outcomes, explain how the system works, address risks and objections, and end with a strong but low-pressure CTA.

From a user’s perspective:

- Estate agents will be able to visit `https://silverstone-ai.com/niches/estate-agents` (served from `niches/estate-agents.html`) and immediately see that the service is built for their world.
- They will understand how automation can prevent missed viewings and instructions, what the “Never Miss a Viewing” Pack includes, and what it might do for their branch.
- They can click a clear CTA to book a free 30-minute automation audit tailored to estate agencies.

Success criteria:

- The page is visually indistinguishable from a first-party Silverstone page: same header, hero shader, parallax backgrounds, card styles, bullet icons, FAQs, and footer.
- All copy marked “FOLLOW ACCURATELY” in the Estate Agents Niche template is rendered faithfully.
- The Proof in Numbers section shows the specified percentages and values **without** running the counter animation.
- Bullet lists adhere strictly to the site’s Font Awesome icon constraints: icons exist in `assets/css/icons.css`, every `<li>` has an icon, and icon choices reinforce the copy.

## Progress

This section must be updated with real timestamps as work proceeds.

- [x] (2025-12-06T00:02Z) Confirm repo structure and existing design patterns (header, hero, parallax, neon cards, stats, FAQs, footer).
- [x] (2025-12-06T00:02Z) Confirm canonical ExecPlan location `.agent/plans/real-estate-landing-page.md` and ensure `.agent/PLANS.md` and `.agent/AGENTS.md` are up to date.
- [x] (2025-12-06T00:02Z) Decide exact file path for the new niche page (`niches/estate-agents.html`) and create the `niches/` directory if it does not exist.
- [x] (2025-12-06T00:02Z) Implement the Estate Agents hero section with gold/amber hero shader variant, accurate copy, bullet list, and CTAs.
- [x] (2025-12-06T00:02Z) Implement the Niche Pain section (3.2) using service-row style with Real_Estate_1 image and neon card, including iconised bullet list.
- [x] (2025-12-06T00:02Z) Implement the Bundle / Counter-Product Overview section (3.3) using service-row style with Real_Estate_2 image and neon card, section heading, and iconised bullets.
- [x] (2025-12-06T00:02Z) Implement the Proof in Numbers strip (3.4) as four static stats cards with top icons and percentages, and adjust `assets/js/script.js` so this section does **not** animate.
- [x] (2025-12-06T00:02Z) Implement the Outcomes & Benefits section (3.5) using service-row style with Real_Estate_3 image and neon card, with iconised outcome bullets and alternating orientation.
- [x] (2025-12-06T00:02Z) Implement How It Works (3.6) as a row of four value-style neon cards with top icons and explanatory copy.
- [x] (2025-12-06T00:02Z) Implement Risk Reversal & Reassurance (3.7) as a row of four value-style neon cards plus intro paragraph.
- [x] (2025-12-06T00:02Z) Insert a visually integrated but minimal Pricing Placeholder section (3.8) ready for future pricing content.
- [x] (2025-12-06T00:02Z) Implement the FAQs section (3.9) using the existing FAQ `<details>` pattern, populated with Q&A from Section 8 of the spec.
- [x] (2025-12-06T00:02Z) Implement the final CTA block (3.10) using the shared CTA pattern from index/about/book.
- [x] (2025-12-06T00:02Z) Ensure the footer (3.11) is identical to the main pages and that the logo loads correctly.
- [x] (2025-12-06T00:02Z) Wire the navigation so the “Estate Agents” link under the Services dropdown points to `/niches/estate-agents` rather than a `services.html#estate-agents` anchor.
- [x] (2025-12-06T00:02Z) Update `sitemap.xml` to include `https://silverstone-ai.com/niches/estate-agents` with appropriate priority.
- [ ] (…) Manually validate layout, interactions, and copy across desktop, tablet, and mobile viewports.
- [x] (2025-12-06T00:02Z) Update `Outcomes & Retrospective` with a summary of what was achieved and any follow-ups.

## Surprises & Discoveries

Use this section to record unexpected or noteworthy findings while implementing this plan.

- Observation: Parallax mobile background URLs in `assets/js/script.js` were relative paths, which would break on the new `/niches/` page.
  - Evidence: Updated PARALLAX_MAP entries to use root-relative URLs so backgrounds load on nested paths.

## Decision Log

Record important decisions and their rationale here.

- Decision: Use `niches/estate-agents.html` as the page path and map it to `https://silverstone-ai.com/niches/estate-agents`.
  - Rationale: The spec recommends this slug; the repo currently has no `niches/` directory, so adding one is a minimal and clear extension.
  - Date/Author: 2025-12-06 / Codex
- Decision: Use the `amber` hero shader variant (via `data-variant="amber"`) for the Estate Agents hero to create the “gold” look.
  - Rationale: `assets/js/hero-shader.js` defines `amber` as a deep amber/gold variant used on `book.html`, so reusing it maintains visual coherence.
  - Date/Author: 2025-12-06 / Codex
- Decision: Disable stats counter animation for the Estate Agents Proof in Numbers block via a dedicated data attribute on its `.stats` container.
  - Rationale: The spec requires static percentages and forbids the counter effect; using an attribute keeps the change minimal and backwards-compatible.
  - Date/Author: 2025-12-06 / Codex
- Decision: Switch PARALLAX_MAP image URLs to root-relative paths.
  - Rationale: Ensures parallax backgrounds load correctly on nested pages such as `/niches/estate-agents.html` without breaking existing pages.
  - Date/Author: 2025-12-06 / Codex

(Add further decisions as they arise.)

## Outcomes & Retrospective

- Outcomes:
  - Implemented the full Estate Agents landing page at `niches/estate-agents.html` with hero, alternating service rows, static stats, how-it-works, reassurance, FAQ, CTA, and footer.
  - Added navigation and sitemap wiring plus root-relative parallax assets so nested paths retain the correct background treatment.
- Gaps or follow-ups:
  - Manual responsive validation still pending; run through desktop, tablet, and mobile viewports to confirm spacing and header behavior.
- Lessons learned:
  - Root-relative asset URLs keep parallax backgrounds resilient when adding subdirectories, avoiding duplicated constants per page.

## Context and Orientation

### Current site architecture

The Silverstone site is a static HTML/CSS/JS marketing site. Key pages:

- `index.html` — main hero, feature cards, Proof in Numbers stats, primary FAQ block, and CTA.
- `about.html` — hero, mission, “Our Values” cards, additional stats.
- `services.html` — long list of service “rows” with image + neon card, each containing text and icon bullets.
- `book.html` — hero using amber hero shader variant, parallax “book” theme, bullets for “What happens on your 30-minute automation call”.
- `contact.html` and `privacy-policy.html` — use the shared header/footer and standard content layout.

Global assets:

- `assets/css/styles.css` — primary layout, typography, card styling, header/footer, sections.
- `assets/css/hero-base.css` — hero `.title-band` styling and hero-media/content layout.
- `assets/css/mobile.css` — responsive tweaks.
- `assets/css/icons.css` — local Font Awesome font-face declarations and icon mappings.
- `assets/js/script.js` — header/minimizing menu behavior, parallax background handling, stats counters, and other interactions.
- `assets/js/hero-shader.js` — WebGL hero shader with variants including `default`, `blue`, `green`, `amber` (golden), etc.
- `assets/webfonts/` — local Font Awesome fonts (`fa-solid-900`, `fa-regular-400`, `fa-brands-400`).
- `assets/images/internet` and `assets/images/internet/mobile` — hero/parallax images including `book-hero-calendly-mobile-2025@1x/2x/3x.webp`.
- `assets/images/socialmedia` — “social” imagery, including:
  - `Real_Estate_1.jpeg`
  - `Real_Estate_2.jpeg`
  - `Real_Estate_3.jpeg`

### Existing layout and component patterns

#### Navigation and minimizing header

- Markup: `<header class="site-header">` with logo, nav links, a Services dropdown, and mobile nav toggle.
- Behavior is controlled by `assets/js/script.js`:
  - Header hides on scroll; a slim `#header-indicator` “Menu” bar appears.
  - Hovering or tapping the indicator shows the header.
- The header appears identically on all main pages and must be reused verbatim on the Estate Agents page.

#### Hero title-band

- Structure (for example on `index.html`):

  - `<section class="hero title-band">`
    - `<div class="hero-media"><canvas id="hero-shader-canvas"></canvas></div>`
    - `<div class="content">…</div>`

- On `about.html` and `book.html`, the canvas includes `data-variant` (for example `data-variant="green"` or `data-variant="amber"`).
- The Estate Agents page must use this same structure, with `data-variant="amber"` to create a gold-feeling variant.

#### Parallax sections and backgrounds

- Sections with parallax backgrounds use `.parallax-section` plus `data-parallax-theme`, for example:

  - `data-parallax-theme="lines"` on `index.html`.
  - `data-parallax-theme="mesh"` or `circuit` on some sections.
  - `data-parallax-theme="book"` on parts of `book.html`.

- `script.js` defines a `PARALLAX_MAP` that associates theme names with background colors and image sets. The `book` and some other themes use the `book-hero-calendly-mobile-2025@*x.webp` assets.

For the Estate Agents page:

- All parallax sections should use a theme that corresponds to the `book-hero-calendly-mobile-2025@*x.webp` image (for example `book`).
- New parallax themes or background images should not be introduced.

#### Neon cards and service rows

- On `services.html`, service rows are encoded as:

  - `<div class="service-row animate" id="…">`
    - `<div class="service-image">…</div>`
    - `<div class="service-content neon-card">…</div>`

- The `service-content` card uses `.neon-card` for a dark semi-transparent background, rounded corners, and a neon border/glow.
- Bullets inside service cards use `<li><i class="fa-solid fa-…"></i> …</li>`.

These patterns are reused in this ExecPlan for:

- Niche Pains (3.2).
- Bundle / Counter-Product overview (3.3).
- Outcomes & Benefits (3.5).

Orientation (image left vs right) is controlled via DOM order and/or CSS; service rows alternate automatically. The Estate Agents page should mirror this alternating pattern.

#### Values cards

- On `about.html`, the “Our Values” section uses:

  - `<div class="values">`
    - `<div class="value-card neon-card">`
      - `<i class="fa-solid fa-ear-listen"></i>`
      - `<h4>…</h4>`
      - `<p>…</p>`

These value-card neon blocks will be repurposed for:

- How It Works (3.6) — four steps in a row.
- Risk Reversal & Reassurance (3.7) — four reassurance points in a row.

Each card will have:

- A top-of-card icon.
- A heading (for 3.6).
- Supporting text in silver/grey.

#### Proof in Numbers stats strip

- On `index.html`, the stats strip uses:

  - `<div class="stats">`
    - `<div class="neon-card stat">`
      - `<div class="number" data-target="…">0</div>`
      - `<div class="label">…</div>`

- `assets/js/script.js` animates `.number` elements from 0 to `data-target` when the section enters the viewport.

For the Estate Agents page:

- There must be four stats cards, each with:
  - A percentage or numeric figure (for example “40%”, “47%”, “100×”, “0.5–1.2%”).
  - A descriptive label/copy following the spec.
  - A top-of-card icon (using a suitable `fa-solid` icon).
- The counter behavior must be disabled for this block so that values remain static.

#### FAQs

- FAQs on `index.html` are implemented using `<details class="neon-card faq-item">` with `<summary>` and `<p>` content.
- CSS/JS provide plus/minus behavior and animation.
- The Estate Agents page must reuse this exact pattern, simply replacing questions and answers with those from Section 8 of the spec.

#### Footer

- All pages share `<footer class="site-footer">` markup with:
  - `.footer-logo` image pointing to `assets/logo/silverstone-logo-cropped-whitebg-v2.png`.
  - Quick links.
  - Contact info with `fa-solid fa-location-dot` and `fa-solid fa-envelope` icons.
  - Social icons.

The Estate Agents page must include this footer unmodified (apart from relative hrefs where needed).

### Bullet icon inventory and patterns

As described in `.agent/PLANS.md`, bullet icons must come from `assets/css/icons.css` and use `fa-solid` classes. We rely on the following solid icons, which are guaranteed to exist:

- `fa-arrows-rotate`, `fa-bell`, `fa-bolt`, `fa-calculator`, `fa-calendar-check`, `fa-chart-bar`, `fa-chart-line`, `fa-chart-pie`, `fa-check-circle`, `fa-clock`, `fa-cloud`, `fa-code`, `fa-comments`, `fa-diagram-project`, `fa-ear-listen`, `fa-envelope`, `fa-file-invoice-dollar`, `fa-file-lines`, `fa-flask`, `fa-gauge-high`, `fa-gears`, `fa-info-circle`, `fa-layer-group`, `fa-lightbulb`, `fa-location-dot`, `fa-lock`, `fa-network-wired`, `fa-plug`, `fa-robot`, `fa-rocket`, `fa-shield-halved`, `fa-tags`, `fa-users`.

Bullet lists must follow patterns from `index.html`, `services.html`, and `book.html`:

- `<ul>`
  - `<li><i class="fa-solid fa-…"></i> Bullet text…</li>`
- Every `<li>` has an icon; icons differ per list item.

ExecPlan icon mappings for each section are provided in the Plan of Work.

## Plan of Work

This section outlines the sequence of work at a narrative level. Concrete file edits and steps follow later.

1. **Confirm and document repo patterns**

   - Reconfirm header, hero title-band, parallax themes, neon cards, stats strips, value cards, FAQs, and footer patterns by re-reading `index.html`, `about.html`, `services.html`, `book.html`, and `assets/css`/`assets/js` files.
   - Summarize this in the Context and Orientation (done above).

2. **Choose and create the Estate Agents page file and URL**

   - Decide on `niches/estate-agents.html` as the page path, matching the spec.
   - Create a new `niches/` directory if needed and add `estate-agents.html` modelled after an existing page (index/about/book) for base structure: DOCTYPE, `<head>` meta, header/nav, hero, and footer.

3. **Implement the Estate Agents hero (3.1)**

   - Use the hero title-band section pattern:
     - `<section class="hero title-band">` with `.hero-media` and `.content`.
     - Set `<canvas id="hero-shader-canvas" data-variant="amber">` for a gold/amber look.
   - Insert H1, sub-headline, hero bullet list, and CTAs exactly per the spec:
     - H1: “Estate agents: never miss a viewing again.”
     - Sub-headline: “A simple automation system that answers enquiries, books viewings and chases feedback while your negotiators focus on instructions and sales.”
     - Four bullets.
     - Primary CTA: “Book a free 30-minute automation audit”.
     - Secondary CTA: “See the ‘Never Miss a Viewing’ Pack”.
   - Design hero bullets using four distinct `fa-solid` icons that exist in the local set (for example `fa-clock`, `fa-calendar-check`, `fa-shield-halved`, `fa-check-circle`) and ensure each `<li>` has its own icon.

4. **Implement the Niche Pains service-row (3.2)**

   - Create a section using `.section` and `.parallax-section` with `data-parallax-theme="book"` to reuse the book hero background.
   - Inside the container, add a `.service-row` with:
     - `.service-image` showing `assets/images/socialmedia/Real_Estate_1.jpeg`.
     - `.service-content.neon-card` titled “What a busy branch really looks like”.
     - A bullet list of pains exactly as in the spec, each with a different `fa-solid` icon.
   - Ensure cards use the same typography and colors as service cards on `services.html` (secondary accent blue for the card title and silver/grey for body text).

5. **Implement the Bundle / Counter-Product Overview service-row (3.3)**

   - Add a section above the service-row with a centered `<h2>` subheading in the same blue style used for section titles on `index.html` and `about.html`:
     - “Our flagship estate-agent bundle (one of many ways we can help)”.
   - Below, add another `.service-row` with:
     - The image on the opposite side of 3.2’s card to establish alternating orientation (if 3.2 had image left, 3.3 should have image right).
     - `.service-content.neon-card` titled “The ‘Never Miss a Viewing’ Pack”.
     - The intro paragraph and bullets as specified in the template (24/7 capture, smart triage, live diary integration, etc.).
   - Use six unique `fa-solid` icons from the allowed set, one per bullet.

6. **Implement the Proof in Numbers strip (3.4)**

   - Create a stats section using the same structure as `index.html`:
     - A section with `.section` and `.parallax-section` (reusing the same parallax theme).
     - `<div class="stats">` containing four `<div class="neon-card stat">` cards.
   - For each stat card:
     - Add a top-of-card icon via `<i class="fa-solid fa-..."></i>` consistent with the stat.
     - Use static text (no `data-target`) for the number:
       - “40%”
       - “47%”
       - “100×”
       - “0.5–1.2%”
     - Include the accompanying body copy exactly as specified.
   - Update `assets/js/script.js` so that the stats animation does **not** run for any `.stats` container intended to be static:
     - Introduce a data attribute such as `data-counter="off"` on the Real Estate stats container.
     - Change the query in the stats animation code so it only selects `.stats` containers without `data-counter="off"` (or equivalent).
     - Confirm existing pages still animate as before.

7. **Implement the Outcomes & Benefits service-row (3.5)**

   - Add another `.section.parallax-section` with the same parallax theme.
   - Inside, add a `.service-row` that alternates orientation relative to 3.3 (if 3.3 had image right, 3.5 should have image left).
   - Use `Real_Estate_3.jpeg` as the image with a neon border treatment (via `.service-image` or wrapping the image in `.neon-card`).
   - Add a `.service-content.neon-card` with:
     - Card title: “What this means for your branch”.
     - The six outcome-focused bullets from the spec (more valuations, higher viewing attendance, etc.), each with a unique `fa-solid` icon.

8. **Implement How It Works (3.6)**

   - Add a section with a blue subheading “How it works”.
   - Within it, create a row of four cards using the `.value-card.neon-card` structure from `about.html`:
     - Each card gets a top-of-card icon, a title (“1. Quick automation audit”, etc.), and explanatory text.
     - Card contents follow the four-step copy from the spec.
   - Ensure text uses silver/grey body color and the card titles use the secondary accent blue.

9. **Implement Risk Reversal & Reassurance (3.7)**

   - Add another section with blue subheading “Risk Reversal & Reassurance”.
   - Add an intro paragraph under the heading:
     - “This is designed to feel like hiring a sharp part-time assistant, not rolling out a risky new platform.”
   - Below, create four `.value-card.neon-card` cards in a row (using the same structure as 3.6) with:
     - One reassurance point per card, from the spec:
       - Clear setup/monthly fees.
       - No need to be “technical”.
       - Tone of voice alignment.
       - GDPR-aware data handling.
     - Each card can optionally have a relevant icon at the top from the allowed `fa-solid` set.

10. **Add a Pricing Placeholder section (3.8)**

    - Insert a simple placeholder section between 3.7 and 3.9:
      - Title (optional) such as “Pricing” or a subtle subheading.
      - A short paragraph explaining that pricing content will be added later.
    - Style it to match existing sections but keep the markup simple so it’s easy to replace.

11. **Implement FAQs (3.9)**

    - Add a FAQ section with structure identical to `index.html`:
      - `<div class="faq-section">`
        - `<h2 class="section-title">` — Estate-agent-appropriate title such as “Estate Agent Automation FAQs”.
        - `<div class="faq-list">` containing `<details class="neon-card faq-item">` blocks.
    - Insert Q&A pairs from Section 8 of the spec:
      - “Will this replace my negotiators?”
      - “Does it work with our existing CRM and calendars?”
      - “How long does it take to go live?”
      - “Will it sound robotic or scripted?”
      - “What happens if something goes wrong or we want to change the journeys?”
      - “Is this suitable for multi-branch agencies?”
    - Each `<details>` should have a `<summary>` with the question and a `<p>` (or multiple `<p>`) with the answer.

12. **Implement the final CTA (3.10)**

    - At the bottom of the page (above the footer), reuse the CTA block style from `index.html`, `about.html`, or `book.html`:
      - Heading: “Ready to stop losing instructions to missed calls?”
      - Supporting paragraph as provided in the spec.
      - CTA button label: “Book my free estate agency automation audit”.
    - Ensure button classes and alignment match existing CTAs.

13. **Footer (3.11)**

    - Include the same `<footer class="site-footer">` markup as used on `index.html`.
    - Confirm the logo path and Quick Links remain correct relative to `niches/estate-agents.html`.

14. **Additional requirements and URL mapping (3.12, Section 10, Section 11)**

    - Ensure all content sits above the parallax background tied to `book-hero-calendly-mobile-2025@*x.webp`.
      - Use consistent `data-parallax-theme` values (likely `book`) for all new `.parallax-section` elements on this page.
    - Implement URL and metadata:
      - `niches/estate-agents.html` mapped to `https://silverstone-ai.com/niches/estate-agents`.
      - Page `<title>`: “Estate Agent Automation | Never Miss a Viewing”.
      - Meta description: “A simple automation bundle for estate agents that captures every lead, books more viewings and cuts branch admin.”
    - Update navigation:
      - In the Services dropdown and pills, change the “Estate Agents” link to `niches/estate-agents.html` (or `/niches/estate-agents` depending on existing pattern).
    - Update `sitemap.xml`:
      - Add a `<url>` entry for `https://silverstone-ai.com/niches/estate-agents` with an appropriate `<priority>` (for example `0.90`).

15. **Validation and responsive checks**

    - Open the new page in a browser and inspect:
      - Header and hero behavior, parallax, stats, cards, FAQs, CTA, footer.
      - Desktop, tablet, and mobile widths.
    - Confirm bullet icons, copy accuracy, and visual fidelity.

## Concrete Steps

This section spells out the exact steps and file edits in order. All paths are relative to the repo root.

1. **Repo orientation and safety**

   - Ensure you are in the repo root (for example `silverstone-site-main/`).
   - Re-read:
     - `index.html`
     - `about.html`
     - `services.html`
     - `book.html`
     - `assets/css/styles.css`
     - `assets/css/hero-base.css`
     - `assets/css/icons.css`
     - `assets/js/script.js`
     - `assets/js/hero-shader.js`
   - Confirm that:
     - `assets/images/socialmedia/Real_Estate_1.jpeg`, `_2.jpeg`, `_3.jpeg` exist.
     - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp` (and 2x/3x) is present.

2. **Create the `niches/` directory and base page**

   - If `niches/` does not exist at the repo root, create it.
   - Copy the basic structure of a main page (for example `about.html`) into `niches/estate-agents.html`:
     - Keep `<head>` meta tags but adjust `<title>`, `meta description`, canonical URL, and Open Graph tags for the Estate Agents page as per the spec.
     - Include the same `<header class="site-header">` block and `<footer class="site-footer">`.
   - Remove content sections not needed for this page and prepare placeholder sections for 3.1–3.11.

3. **Implement the Estate Agents hero**

   - In `niches/estate-agents.html`, after the header, insert:

     - `<section class="hero title-band">`
       - `<div class="hero-media"><canvas id="hero-shader-canvas" data-variant="amber"></canvas></div>`
       - `<div class="content">…</div>`

   - Fill `.content` with:
     - `<h1>Estate agents: never miss a viewing again.</h1>`
     - `<p>` containing the sub-headline.
     - Two buttons:
       - Primary: `<a href="book.html" class="btn btn-primary">Book a free 30-minute automation audit</a>`
       - Secondary: `<a href="#never-miss-viewing-pack" class="btn btn-secondary">See the ‘Never Miss a Viewing’ Pack</a>` (anchor ID may be placed on the 3.3 section or card).
     - `<ul class="hero-bullets">` with four `<li>` items:
       - Each `<li>` contains `<i class="fa-solid fa-…"></i><span>…</span>`.
       - Use icons:
         - `fa-clock` for “Respond to portal leads and missed calls in minutes, not hours.”
         - `fa-calendar-check` for “Fill diaries automatically with qualified viewings and valuations.”
         - `fa-shield-halved` for “Stop losing instructions because nobody was free to pick up the phone.”
         - `fa-check-circle` for “Give vendors, landlords and buyers a fast, professional experience every time.”

4. **Niche Pains section**

   - Add a section after the hero, for example:

     - `<section class="section parallax-section" data-parallax-theme="book">`
       - `<div class="container">`
         - `<div class="service-row">` …

   - Inside `.service-row`:
     - First child: `<div class="service-image">` with `<img src="assets/images/socialmedia/Real_Estate_1.jpeg" …>` and classes mirroring `services.html` images (e.g. `class="service-img"`).
     - Second child: `<div class="service-content neon-card">` with:
       - `<h3>What a busy branch really looks like</h3>`
       - A `<ul>` of pain bullets:
         - “Portal leads and calls stack up whenever the team is out on viewings or valuations.”
         - “Missed calls quietly turn into lost instructions because sellers simply ring the next agent.”
         - “Negotiators spend evenings chasing viewing confirmations and feedback instead of closing deals.”
         - “Shared inboxes are full of unread messages from buyers, tenants and landlords.”
         - “There is no consistent follow-up process for warm buyers, lapsed applicants or past clients.”
         - “Out-of-hours enquiries are dealt with “tomorrow” – by which time the opportunity has often gone.”
       - Each `<li>` should include a unique `fa-solid` icon, for example:
         - `fa-bell`, `fa-phone` (if mapped), `fa-clock`, `fa-comments`, `fa-layer-group`, `fa-arrows-rotate` (choose from the valid list and document mapping in the Decision Log).
   - Ensure typography (card heading, bullet text) matches service cards in `services.html` (secondary accent blue and silver/grey text).

5. **Bundle / Counter-Product Overview section**

   - Above the next `.service-row`, add a centered `<h2 class="section-title">Our flagship estate-agent bundle (one of many ways we can help)</h2>`.
   - Optionally include a subheading `<p class="section-subtitle">` if consistent with other pages.
   - Add another `.service-row` inside the same or next `.section`:

     - Reverse image/card order relative to 3.2 to start the alternating pattern (if 3.2 used image left, this one uses image right).
     - Use `Real_Estate_2.jpeg` for the image.
     - Use `.service-content.neon-card` with:
       - `<h3>The ‘Never Miss a Viewing’ Pack</h3>`
       - Intro paragraph:
         - “A plug-in virtual office for estate agents that captures every lead, qualifies prospects and keeps viewings moving without adding headcount or ripping out your existing CRM and calendars.”
       - `<ul>` for bullets:
         - “24/7 capture of website, portal and missed-call enquiries with instant text or email responses.”
         - “Smart triage questions that separate casual browsers from serious buyers and motivated sellers.”
         - “Live diary integration to offer available viewing and valuation slots and book them straight into negotiators’ calendars.”
         - “Automatic confirmations, reminders and directions so viewers actually turn up.”
         - “Post-viewing follow-up sequences to collect feedback, surface offers and keep chains warm.”
         - “Structured workflows for landlord enquiries and new instructions so nothing falls between systems.”
       - Assign six unique `fa-solid` icons mapping logically to each bullet (for example `fa-cloud`, `fa-lightbulb`, `fa-calendar-check`, `fa-bell`, `fa-file-lines`, `fa-diagram-project`).

6. **Proof in Numbers (static stats strip)**

   - Add a section similar to the Proof in Numbers block on `index.html`:

     - `<section class="section parallax-section" data-parallax-theme="book">`
       - `<div class="container">`
         - Optional section title and subtitle (or keep this strip visually tied to the preceding content).
         - `<div class="stats" data-counter="off">`
           - Four `<div class="neon-card stat">` elements.

   - Each stat card:
     - Starts with an icon (for example `fa-chart-line`, `fa-clock`, `fa-chart-bar`, `fa-calculator`) via `<i class="fa-solid fa-…"></i>`.
     - Contains:
       - `<div class="number">40%</div>`
         - Label text: “of buyer enquiries now happen outside normal office hours – if your branch isn’t responsive 24/7, you’re simply not in the conversation.”
       - `<div class="number">47%</div>`
         - Label text: “of first calls to UK SMEs go unanswered, and most of those callers never try again – they just move on to the next agent.”
       - `<div class="number">100×</div>`
         - Label text: “higher chance of connecting with and converting a new lead when you respond within five minutes instead of half an hour or more.”
       - `<div class="number">0.5–1.2%</div>`
         - Label text: “is a typical real-estate lead-to-sale conversion rate, so every extra valuation or viewing you secure has a meaningful impact on your pipeline and revenue.”
   - Modify `assets/js/script.js`:
     - Locate the code that selects `const statsSections = document.querySelectorAll('.stats');`.
     - Change it to ignore `.stats` containers marked with `data-counter="off"`, for example:
       - Select only `document.querySelectorAll('.stats:not([data-counter="off"])')` or filter the NodeList accordingly.
     - Ensure existing stats on `index.html` and `about.html` still animate.

7. **Outcomes & Benefits section**

   - Add another `.section.parallax-section` with `data-parallax-theme="book">` and a `.container`.
   - Create a `.service-row` with orientation alternating from 3.3:
     - If 3.3 had image right, give this row image left.
     - Use `Real_Estate_3.jpeg` for the image.
     - Card:
       - `<div class="service-content neon-card">`
         - `<h3>What this means for your branch</h3>`
         - `<ul>` with bullets:
           - “More valuations and instructions because you respond first, every time.”
           - “Higher viewing attendance and fewer wasted slots in the diary.”
           - “Negotiators spending more of the day in money-making conversations and less wrestling with admin.”
           - “Vendors and landlords feeling that your branch is always on the ball and easy to reach.”
           - “Cleaner pipeline visibility with every enquiry logged, tagged and tracked.”
           - “Less stress about evenings and weekends – enquiries are acknowledged even when the office is closed.”
         - Assign six unique `fa-solid` icons (e.g. `fa-chart-line`, `fa-gauge-high`, `fa-comments`, `fa-users`, `fa-layer-group`, `fa-clock`).

8. **How It Works (four-step row)**

   - Add a new section:

     - `<section class="section parallax-section" data-parallax-theme="book">`
       - `<div class="container">`
         - `<h2 class="section-title">How it works</h2>`

   - Under the heading, create a `.values` container or similarly styled row with four `.value-card.neon-card` elements:

     - Card 1:
       - Icon (for example `fa-diagram-project`).
       - Title: “1. Quick automation audit”.
       - Text: “A short session to map how leads currently arrive, how your team responds and where deals are being lost.”
     - Card 2:
       - Icon (for example `fa-lightbulb`).
       - Title: “2. Design your estate agency playbook”.
       - Text: “We co-write the qualification questions, follow-up journeys and handover rules that fit your branch.”
     - Card 3:
       - Icon (for example `fa-plug`).
       - Title: “3. Build and launch”.
       - Text: “We connect the system to your email, calendars and key tools, then switch it on in a controlled way.”
     - Card 4:
       - Icon (for example `fa-arrows-rotate`).
       - Title: “4. Refine and optimise”.
       - Text: “We monitor results, tweak messages and add extra journeys as your team spots new opportunities.”

   - Ensure the card row is responsive, similar to the “Our Values” row in `about.html`.

9. **Risk Reversal & Reassurance section**

   - Add another section:

     - `<section class="section parallax-section" data-parallax-theme="book">`
       - `<div class="container">`
         - `<h2 class="section-title">Risk Reversal &amp; Reassurance</h2>`
         - `<p class="section-subtitle">This is designed to feel like hiring a sharp part-time assistant, not rolling out a risky new platform.</p>`

   - Below the intro paragraph, create a four-card row using `.value-card.neon-card`:

     - Card 1:
       - Icon (for example `fa-file-invoice-dollar`).
       - Text: “Clear setup and monthly fees with defined inclusions – no open-ended day rates.”
     - Card 2:
       - Icon (for example `fa-code` or `fa-lightbulb`).
       - Text: “No need to be “technical” – your team approves the flows and wording, we handle the build.”
     - Card 3:
       - Icon (for example `fa-comments`).
       - Text: “Tone of voice is based on your existing emails and brochures so replies sound like your branch, not a robot.”
     - Card 4:
       - Icon (for example `fa-shield-halved`).
       - Text: “Data is handled through sensible, GDPR-aware processes using tools you already trust wherever possible.”

10. **Pricing placeholder**

    - Insert a simple section labelled as a placeholder, for example:

      - `<section class="section parallax-section" data-parallax-theme="book">`
        - `<div class="container">`
          - `<h2 class="section-title">Pricing</h2>`
          - `<p class="section-subtitle">Pricing details for the ‘Never Miss a Viewing’ Pack will be added here.</p>`

    - Keep markup minimal so it can be replaced later.

11. **FAQs**

    - Add a FAQ section following `index.html`:

      - `<section class="section parallax-section" data-parallax-theme="book">`
        - `<div class="container">`
          - `<div class="faq-section">`
            - `<h2 class="section-title">Estate Agent Automation FAQs</h2>`
            - `<div class="faq-list">` containing six `<details class="neon-card faq-item">`.

    - For each FAQ, use:

      - `<summary>` with the question.
      - `<p>` (and additional paragraphs if needed) with the answer.

12. **Final CTA**

    - Add the CTA block near the bottom of the page, above the footer, mirroring index/about/book CTA structure:

      - Heading: “Ready to stop losing instructions to missed calls?”
      - Supporting paragraph: as provided in the spec.
      - Button: `<a href="book.html" class="btn btn-primary">Book my free estate agency automation audit</a>`

13. **Footer and navigation wiring**

    - At the bottom of `niches/estate-agents.html`, paste the same `<footer class="site-footer">` used in `index.html`.
    - In `index.html` and other pages where the Services dropdown exists:
      - Change the “Estate Agents” link from `services.html#estate-agents` to `niches/estate-agents.html` (or `/niches/estate-agents`, matching the rest of the site’s style).
    - In any pill-based service navigation (for example in `services.html`), consider whether to adjust the Estate Agents link to point to the new niche page or leave it as a placeholder; record your decision.

14. **Sitemap update**

    - Edit `sitemap.xml` to add:

      - `<url>`
        - `<loc>https://silverstone-ai.com/niches/estate-agents</loc>`
        - `<lastmod>` set to the current date in `YYYY-MM-DD` format.
        - `<priority>0.90</priority>`
      - `</url>`

15. **Manual validation**

    - Open `niches/estate-agents.html` in a browser.
    - Verify:
      - Header/minimizing nav works as on other pages.
      - Hero shader displays a gold/amber effect and content is readable.
      - Sections 3.2–3.7, 3.9–3.11 appear in the correct order and use the right card/row patterns.
      - Real Estate images show with neon borders and correct alt text.
      - Proof in Numbers stats show static values and do **not** animate.
      - All bullet lists show icons for every `<li>`, with differing icons per list.
      - FAQs expand/collapse as on `index.html`.
      - Footer matches `index.html` exactly, including logo, Quick Links, contact info, and social icons.
    - Check responsive behavior by resizing the browser or using dev tools to simulate breakpoints around ~768px and ~992px.

## Validation and Acceptance

The plan is considered successfully implemented when:

- **URL and routing**

  - `niches/estate-agents.html` exists.
  - Navigating from the Services dropdown “Estate Agents” link loads this page.
  - `sitemap.xml` contains an entry for `https://silverstone-ai.com/niches/estate-agents`.

- **Visual fidelity**

  - Hero:
    - Uses `<section class="hero title-band">` with `data-variant="amber"` on the hero canvas.
    - Matches the general look and feel of `index.html` and `book.html` heroes.
  - Background:
    - All `.parallax-section` blocks on the page use a theme that maps to `book-hero-calendly-mobile-2025@*x.webp`.
    - There are no new hero background assets or mismatched overlays.
  - Cards:
    - All `.neon-card` instances in this page have the same dark, premium styling seen in `index.html` and `services.html`.
    - Service rows in 3.2, 3.3, and 3.5 alternate orientation appropriately.
  - Icons:
    - Every bullet `<li>` has a `fa-solid` icon.
    - No bullet uses an icon class that is not defined in `assets/css/icons.css`.
    - Within a single list, icons are distinct per bullet.
    - Cards in 3.4 (Proof in Numbers) and 3.6 (How it works) each have a single, prominent top-of-card icon.

- **Behavior**

  - Header and minimizing menu:
    - Hides and shows on scroll exactly as on other pages.
    - The “Menu” indicator bar appears and behaves correctly.
  - Hero shader:
    - Runs smoothly (unless reduced-motion is requested) and uses the amber/gold theme.
  - Parallax:
    - Backgrounds change or animate with scroll identically to similar sections on existing pages.
  - Stats:
    - Proof in Numbers section displays the correct percentages and descriptions.
    - No animated counting occurs in this section; stats appear immediately as static text.
    - Stats on `index.html` and `about.html` continue to animate as before.
  - FAQs:
    - `<details>` expand/collapse, maintain plus/minus icon behavior and height transitions as on `index.html`.

- **Copy fidelity**

  - All hero text, card titles, bullet text, stat descriptions, FAQ questions and answers, and CTA copy match the Estate Agents spec text, especially those labeled “FOLLOW ACCURATELY”.
  - No inadvertent rewrites or copy drift.

- **Accessibility and resilience**

  - Links are keyboard-focusable.
  - Summary elements in FAQs are keyboard-operable.
  - Hero text maintains sufficient contrast on the hero background.
  - No console errors occur in modern browsers when loading the page.

## Idempotence and Recovery

- The steps described here are additive and safe to repeat:

  - Re-running `apply_patch` for the same HTML sections will simply overwrite the same blocks.
  - Adjusting `script.js` or `sitemap.xml` can be repeated as long as modified blocks are kept small and clearly delimited.

- If partial work has been done:

  - Use the `Progress` checklist to determine which sections remain.
  - For incomplete sections (for example only 3.2 implemented), you can revisit the Plan of Work for that section and re-apply the patch.

- If the stats animation change causes issues:

  - Roll back by restoring the previous selector logic in `assets/js/script.js`.
  - Then reattempt the modification using a safer approach (for example, checking for a `data-target` attribute and skipping elements without it).

- If layout looks broken:

  - Compare HTML in `niches/estate-agents.html` against references in `index.html`, `about.html`, `services.html`, and `book.html`.
  - Make sure class names, container nesting, and ordering follow the patterns there.

## Artifacts and Notes

Use this section to record any especially helpful snippets or references during implementation, such as:

- Example of a working stats card from `index.html` or `about.html`.
- Example of the values card structure from `about.html`.
- Example of a hero bullet list from `index.html`.

Keep these snippets short and focused.

## Interfaces and Dependencies

This plan depends on the following interfaces and components:

- Header and navigation implemented in `index.html`, `about.html`, etc., with behavior in `assets/js/script.js`.
- Hero shader implementation and theme selection in `assets/js/hero-shader.js`.
- Parallax theme configuration in `assets/js/script.js` (the `PARALLAX_MAP` object).
- Neon card styling in `assets/css/styles.css` and related files.
- Font Awesome integration and icon mappings in `assets/css/icons.css` and `assets/webfonts/fa-solid-900.*`.
- FAQ styles and behaviors in `assets/css/styles.css`, `assets/css/mobile.css`, and `assets/js` as used on `index.html`.
- Sitemap structure in `sitemap.xml`.

## Assumptions & Decisions

- The Estate Agents page lives at `niches/estate-agents.html` and is deployed at `https://silverstone-ai.com/niches/estate-agents` (matching the spec).
- The “gold” hero variant is implemented using the existing `amber` theme in `hero-shader.js` (`data-variant="amber"`).
- Backgrounds for all Estate Agents sections use imagery tied to `book-hero-calendly-mobile-2025@*x.webp` by selecting an appropriate `data-parallax-theme`.
- Bullet icon assignments are restricted to the icons enumerated in `.agent/PLANS.md` and `assets/css/icons.css`.
- Disabling stats animation is done via a non-breaking, attribute-based filter in `assets/js/script.js` rather than removing the animation entirely.

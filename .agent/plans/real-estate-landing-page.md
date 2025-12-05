# Build the Estate Agents / Real Estate niche landing page

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` at the repository root. The canonical path for this ExecPlan is `.agent/plans/real-estate-landing-page.md`.


## Purpose / Big Picture

Independent estate and lettings agents live and die by how quickly they can capture and convert new enquiries. The goal of this ExecPlan is to design and implement a dedicated Estate Agents / Real Estate niche landing page for Silverstone that:

- Speaks directly to UK estate and lettings agents (branches and small groups) about missed calls, portal leads, viewings, valuations, and instructions.
- Presents the “Never Miss a Viewing” productised automation bundle using existing hero, card, stats, and FAQ patterns.
- Quantifies the problem with a proof-in-numbers strip tailored to real estate benchmarks.
- Shows outcomes, how the system works, risk reversal, FAQs, and a final CTA.

From a user’s perspective, after this change:

- They can click “Estate Agents” in the Services dropdown and land on a premium, on-brand niche page at `niches/estate-agents.html` (canonical URL `https://silverstone-ai.com/niches/estate-agents` or similar).
- The hero clearly states “Estate agents: never miss a viewing again.” with estate-specific bullets and CTAs.
- The page clearly explains pains, the “Never Miss a Viewing” Pack, numerical proof, outcomes, how it works, reassurance, FAQs, and a clear next step.
- The page visually matches the rest of the site: same hero shader style, neon cards, stats tiles, CTA, and footer.

This page’s copy and structure are based on the “Estate Agents – Niche Landing Page Content” spec; key copy is reproduced below so this ExecPlan is self-contained.


## Progress

Use this checklist to track work as you implement the plan. Timestamps are UTC or local time, ISO-like format.

- [x] (2025-12-05 00:00) Drafted this ExecPlan for `.agent/plans/real-estate-landing-page.md`; no code changed yet.
- [ ] Create `niches/estate-agents.html` using existing page templates and hook it into the nav.
- [ ] Implement the hero (3.1) with a gold shader variant, hero bullets, and CTAs.
- [ ] Implement niche pains (3.2), bundle overview (3.3), proof in numbers (3.4), and outcomes & benefits (3.5) using service-row neon cards and alternating orientations.
- [ ] Implement “How It Works” (3.6) and “Risk Reversal & Reassurance” (3.7) using values-style cards.
- [ ] Insert the pricing placeholder section (3.8).
- [ ] Implement FAQs (3.9) using the existing FAQ pattern and provided Q&A content.
- [ ] Implement the final CTA (3.10) and footer (3.11) as per existing pages.
- [ ] Apply the additional design requirements (3.12): book parallax background, bullet icon enforcement, and card orientation.
- [ ] Run visual and functional validation across desktop and mobile; update this ExecPlan’s `Outcomes & Retrospective` once complete.


## Surprises & Discoveries

Document any unexpected issues or helpful discoveries during implementation.

- None yet. Add entries here as you encounter quirks in hero-shader behavior, parallax backgrounds, bullet icon rendering, or layout interactions.


## Decision Log

Record all key decisions.

- Decision: Keep this ExecPlan at `.agent/plans/real-estate-landing-page.md` rather than renaming it, reusing the existing planning convention for this feature.  
  Rationale: The repo already references a Real Estate ExecPlan at this path; updating its contents avoids breaking references.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.

- Decision: Create the new landing page at `niches/estate-agents.html` and update the Services dropdown “Estate Agents” link from `services.html#estate-agents` to `niches/estate-agents.html`.  
  Rationale: The spec recommends the slug `/niches/estate-agents`. A dedicated file under `niches/` preserves existing root pages and keeps niche pages grouped together.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.

- Decision: Use the existing `book` parallax theme for all parallax sections on the Estate Agents page so that `book-hero-calendly-mobile-2025@*x.webp` is the only background image used.  
  Rationale: The spec requires the book hero background as the sole background image. `parallax-fix.css` already defines `data-parallax-theme="book"` for this asset.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.

- Decision: Introduce a `gold` hero shader theme as an alias to the existing `amber` (book) theme in `assets/js/hero-shader.js`, and use `data-variant="gold"` on the Estate Agents hero canvas.  
  Rationale: The spec asks for a new “gold” shader hero variant. Reusing the amber color values under a new key avoids major shader changes while respecting the naming requirement.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.

- Decision: For all bullet lists inside neon cards on the Estate Agents page (3.2, 3.3, 3.5 and any similar lists), use explicit icon markup in each `<li>` with `<i class="fa-solid fa-check-circle"></i>` or other icons defined in `assets/css/icons.css`.  
  Rationale: This matches existing patterns in `services.html` and `book.html` and guarantees every bullet renders with an icon backed by the local webfont.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.

- Decision: For hero supporting bullets, reuse the `.hero-bullets` pattern from `index.html`, with one `<i>` per `<li>` and a `<span>` wrapper for the text.  
  Rationale: Ensures consistent hero layout and alignment with the rest of the site’s design system.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.

- Decision: Insert a simple “Pricing coming soon” style placeholder section where 3.8 is specified, using existing section and neon-card styles but minimal content.  
  Rationale: The spec requires a placeholder now and detailed pricing later; a minimal on-brand block provides a clear insertion point without over-specifying pricing.  
  Date/Author: 2025-12-05 / Codex-initiated ExecPlan.


## Outcomes & Retrospective

To be completed after implementation.

Once the page is implemented and validated, summarise:

- What changed in the codebase (files touched).
- How the final Estate Agents page behaves for users.
- Any deviations from the spec and why.
- Lessons about working with hero-shader, parallax backgrounds, and bullet icons on this site.


## Context and Orientation

This section orients a novice to the repo and the Estate Agents spec.

### Repo overview

- Root HTML pages:
  - `index.html` — main marketing home; includes hero, feature cards, stats strip, FAQ (`<details class="neon-card faq-item">`), CTA, and footer.
  - `about.html` — about page; includes hero, mission & values, `.values` section with `.value-card.neon-card` cards, stats, CTA, footer.
  - `services.html` — service overview; includes hero with `#hero-shader-canvas` (`data-variant="blue"`), a parallax section containing multiple `.service-row` elements with `.service-image` and `.service-content.neon-card`.
  - `book.html` — booking page; hero with `data-variant="amber"`, discovery section, bullet lists with icons, CTA, footer.
  - `contact.html` and `privacy-policy.html` — additional content pages sharing the same header and footer patterns.

- Navigation:
  - Each page includes a `<header class="site-header">` with a logo, a mobile nav toggle, and a `<nav>` list that contains a Services dropdown:
    - The Services menu includes a link currently pointing to `services.html#estate-agents` with label “Estate Agents”.
    - We will repoint that link to `niches/estate-agents.html` after creating the new page.

- CSS:
  - `assets/css/styles.css` — base styling, color system, `.section`, `.neon-card`, `.cta-card`, `.site-footer`, etc.
  - `assets/css/custom.css`, `assets/css/custom-styles.css` — responsive tweaks and layout refinements.
  - `assets/css/services.css` — service-row layout and card adjustments on `services.html`.
  - `assets/css/hero-base.css` — hero layout (full-height sections, content alignment).
  - `assets/css/parallax-fix.css` — parallax background; defines `data-parallax-theme="book"` to use `book-hero-calendly-mobile-2025@*x.webp`.
  - `assets/css/icons.css` — Font Awesome webfont integration and icon mappings.

- JS:
  - `assets/js/script.js` — header behavior, cookie banner, animate-on-scroll (`.animate`), stats counter for `.stats .number[data-target]`, and other enhancements.
  - `assets/js/hero-shader.js` — canvas shader hero with theme variants keyed by `data-variant` values such as `default`, `blue`, `green`, `amber`, `silver`.

- Icons and bullets:
  - `assets/webfonts/` — Font Awesome webfonts (`fa-solid`, `fa-brands`).
  - Bullet icons are implemented via `<i class="fa-solid fa-…"></i>` inside `<li>` in `services.html` and `book.html`, and via `.hero-bullets` in `index.html`.


### Real Estate / Estate Agents spec overview

The template (“Estate Agents – Niche Landing Page Content”) defines:

- Section order:
  1. Hero
  2. Niche pains
  3. Bundle / counter-product overview
  4. Proof in Numbers strip
  5. Outcomes & benefits
  6. How it works
  7. Pricing placeholder
  8. Risk & reassurance
  9. FAQs
  10. Final CTA
  11. Footer

- Key copy to use verbatim:

  **Hero (3.1)**  
  - H1:  
    `Estate agents: never miss a viewing again.`  
  - Sub-headline:  
    `A simple automation system that answers enquiries, books viewings and chases feedback while your negotiators focus on instructions and sales.`  
  - Supporting bullets:
    - `Respond to portal leads and missed calls in minutes, not hours.`
    - `Fill diaries automatically with qualified viewings and valuations.`
    - `Stop losing instructions because nobody was free to pick up the phone.`
    - `Give vendors, landlords and buyers a fast, professional experience every time.`
  - Primary CTA label:  
    `Book a free 30-minute automation audit`
  - Secondary CTA label (optional):  
    `See the ‘Never Miss a Viewing’ Pack`

  **Niche Pain (3.2) — card text**  
  - Card title: `What a busy branch really looks like`  
  - Bullets:
    - `Portal leads and calls stack up whenever the team is out on viewings or valuations.`
    - `Missed calls quietly turn into lost instructions because sellers simply ring the next agent.`
    - `Negotiators spend evenings chasing viewing confirmations and feedback instead of closing deals.`
    - `Shared inboxes are full of unread messages from buyers, tenants and landlords.`
    - `There is no consistent follow-up process for warm buyers, lapsed applicants or past clients.`
    - `Out-of-hours enquiries are dealt with “tomorrow” – by which time the opportunity has often gone.`

  **Bundle / Counter-Product Overview (3.3)**  
  - Section title (above card):  
    `Our flagship estate-agent bundle (one of many ways we can help)`  
  - Card title:  
    `The ‘Never Miss a Viewing’ Pack`  
  - Intro paragraph (inside card):  
    `A plug-in virtual office for estate agents that captures every lead, qualifies prospects and keeps viewings moving without adding headcount or ripping out your existing CRM and calendars.`  
  - Bullets (inside card):
    - `24/7 capture of website, portal and missed-call enquiries with instant text or email responses.`
    - `Smart triage questions that separate casual browsers from serious buyers and motivated sellers.`
    - `Live diary integration to offer available viewing and valuation slots and book them straight into negotiators’ calendars.`
    - `Automatic confirmations, reminders and directions so viewers actually turn up.`
    - `Post-viewing follow-up sequences to collect feedback, surface offers and keep chains warm.`
    - `Structured workflows for landlord enquiries and new instructions so nothing falls between systems.`

  **Proof in Numbers strip (3.4)**  
  Four stats cards with:
  - `40%`  
    `of buyer enquiries now happen outside normal office hours – if your branch isn’t responsive 24/7, you’re simply not in the conversation.`
  - `47%`  
    `of first calls to UK SMEs go unanswered, and most of those callers never try again – they just move on to the next agent.`
  - `100×`  
    `higher chance of connecting with and converting a new lead when you respond within five minutes instead of half an hour or more.`
  - `0.5–1.2%`  
    `is a typical real-estate lead-to-sale conversion rate, so every extra valuation or viewing you secure has a meaningful impact on your pipeline and revenue.`

  **Outcomes & Benefits (3.5)**  
  - Card title: `What this means for your branch`  
  - Bullets:
    - `More valuations and instructions because you respond first, every time.`
    - `Higher viewing attendance and fewer wasted slots in the diary.`
    - `Negotiators spending more of the day in money-making conversations and less wrestling with admin.`
    - `Vendors and landlords feeling that your branch is always on the ball and easy to reach.`
    - `Cleaner pipeline visibility with every enquiry logged, tagged and tracked.`
    - `Less stress about evenings and weekends – enquiries are acknowledged even when the office is closed.`

  **How It Works (3.6)** — four steps, each as a card:
  1. `Quick automation audit – a short session to map how leads currently arrive, how your team responds and where deals are being lost.`
  2. `Design your estate agency playbook – we co-write the qualification questions, follow-up journeys and handover rules that fit your branch.`
  3. `Build and launch – we connect the system to your email, calendars and key tools, then switch it on in a controlled way.`
  4. `Refine and optimise – we monitor results, tweak messages and add extra journeys as your team spots new opportunities.`

  **Risk-Reversal & Reassurance (3.7)**  
  - Section title: `Risk Reversal & Reassurance`  
  - Intro paragraph:  
    `This is designed to feel like hiring a sharp part-time assistant, not rolling out a risky new platform.`  
  - Card contents:
    - `Clear setup and monthly fees with defined inclusions – no open-ended day rates.`
    - `No need to be “technical” – your team approves the flows and wording, we handle the build.`
    - `Tone of voice is based on your existing emails and brochures so replies sound like your branch, not a robot.`
    - `Data is handled through sensible, GDPR-aware processes using tools you already trust wherever possible.`

  **Pricing Placeholder (3.8)**  
  - A clearly marked placeholder section for pricing that will be filled in later.

  **FAQs (3.9)** — each Q&A is a `<details class="neon-card faq-item">` block:
  - Q: `Will this replace my negotiators?`  
    A: As specified in the doc (describing relieving negotiators, not replacing them).
  - Q: `Does it work with our existing CRM and calendars?`
  - Q: `How long does it take to go live?`
  - Q: `Will it sound robotic or scripted?`
  - Q: `What happens if something goes wrong or we want to change the journeys?`
  - Q: `Is this suitable for multi-branch agencies?`
  (Use the exact Q&A text from the spec.)

  **Final CTA (3.10)**  
  - Heading: `Ready to stop losing instructions to missed calls?`  
  - Supporting paragraph: as in the spec, explaining the ‘Never Miss a Viewing’ Pack as a simple way to fix leakage and what the audit call covers.  
  - CTA label: `Book my free estate agency automation audit`

  **Footer (3.11)**  
  - Identical to the global site footer used on `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `privacy-policy.html`.


### Additional requirements (3.12)

- Backgrounds:
  - The only background image used on the Estate Agents niche page should be `book-hero-calendly-mobile-2025@1x/2x/3x.webp`.
  - Use `data-parallax-theme="book"` on `.parallax-section` blocks for this page; avoid `bg-circuit`, `bg-lines`, or `bg-mesh` classes that introduce other backgrounds.
- Cards:
  - Sections 3.2, 3.3, and 3.5 must reuse the `services.html` neon service-row card pattern and **alternate orientation** (image/card ordering) like the service rows.
  - 3.4 (Proof in Numbers) must sit between 3.3 and 3.5.
- Bullets:
  - Every bullet list must use icon bullets sourced from the local webfonts.
  - Every `<li>` must have its own icon; no plain bullets.
- Footer:
  - Footer must be structurally identical to other core pages.


## Plan of Work

This plan assumes you start from a clean working tree at the repo root.

1. **Create the `niches/` folder and page scaffold.**  
   - Add `niches/estate-agents.html` using a copy of an existing page, preferably `services.html` or `book.html`, as a starting template.
   - Keep:
     - Doctype, `<html>`, `<head>` with SEO tags, fonts, CSS links, favicon.
     - Cookie banner markup and scripts.
     - Header and navigation.
     - Footer.
   - Replace the main content with the new Estate Agents page structure described below.

2. **Configure meta information and URL slug.**  
   - In `niches/estate-agents.html`:
     - Set `<title>` to: `Estate Agent Automation | Never Miss a Viewing`.
     - Set meta description to the spec’s recommended description (e.g. “A simple automation bundle for estate agents that captures every lead, books more viewings and cuts branch admin.”).
     - Set canonical link to `https://silverstone-ai.com/niches/estate-agents` (or the production domain in use).
     - Update Open Graph tags if present to reference the new URL and title.

3. **Wire the navigation to the new page.**  
   - In all pages that contain the Services dropdown (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`):
     - Find the `<a class="service-link" href="services.html#estate-agents">Estate Agents</a>` entry.
     - Change its `href` to `niches/estate-agents.html`.
   - Ensure the Services dropdown structure remains otherwise unchanged.

4. **Add a gold hero shader variant.**  
   - In `assets/js/hero-shader.js`:
     - Locate the `const THEMES = { … }` definition.
     - Add a new key `gold` whose `line`, `bg1`, and `bg2` colors match the existing `amber` theme (you can copy the `amber` object and rename it `gold`).
   - In `niches/estate-agents.html`:
     - Create a hero section mirroring `index.html`/`services.html`:
       - `<section class="hero title-band">`
       - Inside it, a `.hero-media` div containing `<canvas id="hero-shader-canvas" data-variant="gold"></canvas>`.
       - A `.content` div with:
         - `<h1>` set to the hero H1.
         - A `<p>` subheading.
         - A primary CTA button linking to `book.html` (or the booking section) with the specified label.
         - An optional secondary CTA button linking to the bundle section (`#never-miss-viewing-pack`).
         - A `<ul class="hero-bullets">` with four `<li>` elements:
           - Each `<li>` contains `<i class="fa-solid …"></i><span>…</span>`, with icons chosen from `icons.css` (for example: `fa-check-circle`, `fa-calendar-check`, `fa-robot`, `fa-users`), and the bullet text from the spec.
     - Confirm the hero structure matches the other pages so the shader and layout CSS work unchanged.

5. **Implement Section 3.2 – Niche Pains using a service-row card.**  
   - Create a new content section immediately below the hero:
     - `<section class="section animate parallax-section" data-parallax-theme="book">`.
     - Inside: `<div class="container">` with a single `.service-row`:
       - `.service-image` containing an `<img>` pointing to `assets/images/socialmedia/Real_Estate_1.jpeg`. Use an informative `alt` attribute describing the image.
       - `.service-content.neon-card` containing:
         - `<h3>` with card title `What a busy branch really looks like`.
         - `<ul>` for the six pain bullets. Each `<li>` must be:
           - `<li><i class="fa-solid fa-check-circle"></i> Portal leads and calls stack up …</li>`, repeating check-circle or another consistent icon for all items.
   - Match typography (card heading and text) and spacing to `services.html`.

6. **Implement Section 3.3 – Bundle / Counter-Product Overview.**  
   - Below 3.2, add another parallax section:
     - `<section class="section animate parallax-section" data-parallax-theme="book">`.
     - Inside container:
       - A centered section title `<h2 class="section-title">Our flagship estate-agent bundle (one of many ways we can help)</h2>` styled in blue like other subheadings.
       - A `.service-row` using the same neon-card pattern:
         - One side: `.service-image` with `<img src="assets/images/socialmedia/Real_Estate_2.jpeg" …>`.
         - Other side: `.service-content.neon-card` with:
           - `<h3>`: `The ‘Never Miss a Viewing’ Pack`.
           - `<p>`: intro paragraph as given.
           - `<ul>` with six bullets describing what the system covers, each using `<i class="fa-solid fa-check-circle"></i>` (or other icons defined in `icons.css`) before the text.
       - Ensure this `.service-row` orientation alternates relative to Section 3.2. If `services.css` uses nth-child selectors, mirror its pattern; if it uses a helper (e.g. a “reverse” class), reuse that/classic pattern instead of writing new CSS.

7. **Implement Section 3.4 – Proof in Numbers strip.**  
   - Below 3.3, add a stats strip replicating the structure from `index.html`:
     - A `<section>` (can share the same parallax background or be its own `section` with `parallax-section` and `data-parallax-theme="book"`).
     - Inside:
       - Optional section title (e.g. “Proof in Numbers”) and subtitle as per the spec’s tone, or leave headings minimal if the template does not specify them.
       - A `<div class="stats">` containing four stats cards, each as `<div class="neon-card stat">` with:
         - `<div class="number" data-target="…">0</div>` — use numeric values `40`, `47`, `100`, and something like `1.2` or a representative scalar, where visual representation of `0.5–1.2%` is handled via label.
         - `<div class="label">…</div>` containing the full descriptive text.
       - For the “100×” card, the `data-target` can be `100` and the label expresses “100× higher chance…”. Use `data-plus="+"` where needed if you want a plus appended, consistent with existing stats.
     - Ensure class names `.stats`, `.neon-card.stat`, `.number`, and `.label` are identical so the JS counter animation in `script.js` applies.

8. **Implement Section 3.5 – Outcomes & Benefits using a service-row card.**  
   - Add another parallax section for outcomes:
     - `<section class="section animate parallax-section" data-parallax-theme="book">`.
     - Inside container: `.service-row` with:
       - `.service-image` containing `Real_Estate_3.jpeg`.
       - `.service-content.neon-card` containing:
         - `<h3>`: `What this means for your branch`.
         - `<ul>` for the outcomes bullets. Each `<li>` again must use `<i class="fa-solid fa-check-circle"></i>` (or consistent icon) before the text.
     - Ensure orientation alternates relative to 3.3 in the same way service rows alternate on `services.html` (image/card swapping or flex-direction reversal according to existing patterns).

9. **Implement Section 3.6 – How It Works with values-style cards.**  
   - Add a section with a structure similar to the “Our Values” block in `about.html`:
     - `<section class="section animate parallax-section" data-parallax-theme="book">`.
     - Inside `<div class="container">`:
       - Centered `<h2 class="section-title">How it works</h2>` in the same blue heading style.
       - Optional `<p class="section-subtitle">` summarising the steps.
       - `<div class="values">` containing four `.value-card.neon-card` items, each representing a step:
         1. Card 1:
            - `<i class="fa-solid …"></i>` icon (e.g. `fa-comments`, `fa-info-circle`, or `fa-lightbulb`, chosen from `icons.css`).
            - `<h4>1. Quick automation audit</h4>`
            - `<p>` body with the corresponding spec text.
         2. Card 2:
            - `<h4>2. Design your estate agency playbook</h4>` and its description.
         3. Card 3:
            - `<h4>3. Build and launch</h4>` and its description.
         4. Card 4:
            - `<h4>4. Refine and optimise</h4>` and its description.
       - Ensure spacing, card size, and responsive behavior match the `.values` section on `about.html`.

10. **Implement Section 3.7 – Risk-Reversal & Reassurance cards.**  
    - Add another parallax section:
      - `<section class="section animate parallax-section" data-parallax-theme="book">`.
      - Inside container:
        - `<h2 class="section-title">Risk Reversal &amp; Reassurance</h2>` styled like other subheadings.
        - `<p class="section-subtitle">This is designed to feel like hiring a sharp part-time assistant, not rolling out a risky new platform.</p>`
        - A `.values`-style row but with four cards in a row:
          - Each card uses `.value-card.neon-card` with:
            - An icon `<i class="fa-solid …"></i>` that fits the reassurance (for example: `fa-shield-halved`, `fa-lightbulb`, `fa-users`, `fa-file-invoice-dollar`), chosen from `icons.css`.
            - A short heading summarising the reassurance line (or reuse the first phrase of each bullet as the heading).
            - A `<p>` containing each reassurance sentence from the spec as the body text.

11. **Insert Section 3.8 – Pricing placeholder.**  
    - Insert a section clearly marked as a placeholder:
      - `<section class="section animate parallax-section" data-parallax-theme="book">`.
      - Inside container:
        - A `.neon-card` centered card with:
          - Heading such as `Pricing for the ‘Never Miss a Viewing’ Pack`.
          - Short placeholder text: e.g. `Detailed pricing for this bundle will appear here. In the meantime, your automation audit is completely free and we’ll tailor pricing based on your branch’s needs.`
      - Keep styling minimal and on brand; do not add complex pricing tables yet.

12. **Implement Section 3.9 – FAQs using the existing FAQ structure.**  
    - Use the same structure as the FAQ section on `index.html`, but tailored to Estate Agents:
      - A heading such as `Estate Agent FAQs` or `Estate Agent Automation FAQs`.
      - A `<div class="faq-list">` containing multiple `<details class="neon-card faq-item">` blocks.
      - For each Q&A from the spec:
        - `<summary>` with the question.
        - `<p>` containing the full answer paragraph(s).
    - Ensure the markup (`<details>`, `<summary>`, `.faq-item`) matches existing usage so any CSS or JS behavior applies.

13. **Implement Section 3.10 – Final CTA.**  
    - Reuse the CTA block pattern from `index.html` / `about.html` / `book.html`:
      - `<section class="section brand-gradient animate">`.
      - Inside container:
        - `<div class="neon-card cta-card" style="text-align: center;">`
          - `<h2 class="section-title" style="color: var(--color-white);">Ready to stop losing instructions to missed calls?</h2>`
          - `<p class="section-subtitle" style="color: var(--color-silver);">…</p>` with the exact supporting paragraph from the spec describing the ‘Never Miss a Viewing’ Pack and the audit call.
          - `<a href="book.html" class="btn btn-primary">Book my free estate agency automation audit</a>`

14. **Implement Section 3.11 – Footer.**  
    - Copy the footer from an existing page (e.g. `index.html`) verbatim into `niches/estate-agents.html`:
      - `<footer class="site-footer">` with `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-contact`, `.footer-social`.
    - Do not alter footer styling or structure; only update textual references to the page where necessary (if any).

15. **Ensure background and parallax requirements (3.12) are met.**  
    - For all content sections on this page (excluding the hero and footer):
      - Use `class="section animate parallax-section"` with `data-parallax-theme="book"`.
      - Do **not** use `bg-circuit`, `bg-lines`, `bg-mesh`, or other background helper classes that would swap in different images.
    - Confirm that `parallax-fix.css` applies the book-hero background to all these sections.

16. **Enforce bullet icon usage across the page.**  
    - Verify every list on `niches/estate-agents.html`:
      - Hero bullet list (`.hero-bullets`).
      - Pain bullets (3.2).
      - Bundle bullets (3.3).
      - Outcomes bullets (3.5).
      - Any additional bullet-style lists.
    - Ensure that:
      - No `<ul>` is used with plain browser bullets.
      - Each `<li>` includes an `<i class="fa-solid …"></i>` icon or is covered by a helper that injects icons for **every** `<li>`.
      - All chosen icons exist in `assets/css/icons.css`.

17. **Run and visually validate the page.**  
    - From the repo root, run a simple static server, for example:
      - `python -m http.server 8000`
    - Open `http://localhost:8000/niches/estate-agents.html` in a desktop browser.
    - Validate:
      - Hero:
        - Shader background animates with the new `gold` variant.
        - H1, subheading, bullets, and CTAs match the spec text.
      - Niche pain, bundle, outcomes:
        - Each uses a neon-card service-row layout identical to `services.html`.
        - Orientation alternates across 3.2, 3.3, 3.5.
      - Proof in Numbers:
        - Stats layout matches `index.html`.
        - Numbers count up on scroll.
      - “How It Works” and “Risk Reversal”:
        - Cards visually match `about.html` values cards.
      - FAQs:
        - Details/summary expand and collapse.
      - CTA and footer:
        - Match existing pattern and link to the correct pages.
      - Background:
        - Content scrolls over the book hero parallax background without conflicting overlays.

18. **Mobile/responsive checks.**  
    - Using browser dev tools, test responsive breakpoints:
      - Check hero layout, card stacking, stats wrapping, and FAQ behavior on mobile widths.
      - Confirm that text remains legible over the background and cards keep the neon style without layout glitches.

19. **Update this ExecPlan after implementation.**  
    - Fill in `Progress` entries as tasks are completed.
    - Add `Surprises & Discoveries` if you encounter subtle behaviors (e.g. parallax quirks, shader performance).
    - Add any additional `Decision Log` entries if you deviate from this plan.
    - Write an `Outcomes & Retrospective` summarising the implementation once complete.


## Concrete Steps

This section condenses the Plan of Work into a sequence of operations a novice can follow.

1. From the repo root, confirm key files exist:
   - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`.
   - `assets/css/styles.css`, `assets/css/custom.css`, `assets/css/parallax-fix.css`, `assets/css/icons.css`.
   - `assets/js/script.js`, `assets/js/hero-shader.js`.

2. Create `niches/` if it does not exist, then create `niches/estate-agents.html` by copying `services.html` or `book.html` and trimming its main content.

3. In `niches/estate-agents.html`:
   - Update `<title>`, meta description, canonical, and OG tags for Estate Agents.
   - Keep the cookie banner, header, and footer sections unchanged for now.

4. Edit the hero section in `niches/estate-agents.html`:
   - Replace the hero heading, subheading, CTAs, and bullets with the Estate Agents hero copy.
   - Change the hero canvas to `<canvas id="hero-shader-canvas" data-variant="gold"></canvas>`.
   - Ensure hero bullets use `<ul class="hero-bullets">` with `<li><i class="fa-solid …"></i><span>…</span></li>`.

5. In `assets/js/hero-shader.js`:
   - Add a `gold` theme in the `THEMES` map with the same color values as `amber`.

6. In `niches/estate-agents.html`, implement sections 3.2–3.5:
   - Add parallax sections with `class="section animate parallax-section"` and `data-parallax-theme="book"`.
   - For each, add a `.container` with a `.service-row` and the neon-card content as described in the Plan of Work (pain, bundle, stats, outcomes).
   - Use `Real_Estate_1.jpeg`, `Real_Estate_2.jpeg`, and `Real_Estate_3.jpeg` for images.

7. Implement the “How it works” and “Risk Reversal & Reassurance” sections by copying the markup patterns from the `about.html` values section and adjusting headings, icons, and copy.

8. Insert a simple pricing placeholder section with a `.neon-card` that states pricing details will follow.

9. Implement the FAQ list using `<details class="neon-card faq-item">` blocks with Q&A content from the spec.

10. Implement the final CTA section using the `.section.brand-gradient` and `.cta-card` pattern from `index.html` or `about.html`, updating the heading, paragraph, and button text only.

11. Copy the footer from `index.html` into `niches/estate-agents.html` if not already present; ensure classes and structure match other pages.

12. Update navigation:
    - In each root HTML file containing the Services dropdown, replace the Estate Agents link target from `services.html#estate-agents` to `niches/estate-agents.html`.

13. Search `niches/estate-agents.html` for `<ul` and `<li>`:
    - Confirm each visual bullet has an `<i class="fa-solid …"></i>` icon.
    - Confirm no default bullets remain.

14. Start a static server from the repo root (for example, `python -m http.server 8000`) and visit `http://localhost:8000/niches/estate-agents.html`.

15. Manually validate the hero, sections, backgrounds, bullet icons, FAQs, CTA, footer, and responsive behavior as outlined in the Plan of Work.

16. Update the `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections of this ExecPlan to reflect the work done and any deviations.


## Validation and Acceptance

The Estate Agents / Real Estate niche landing page is considered accepted when:

- **Navigation and URL:**
  - The Services dropdown “Estate Agents” item links to `niches/estate-agents.html`.
  - `niches/estate-agents.html` loads without errors in a modern desktop browser.

- **Hero (3.1):**
  - The hero heading, subheading, bullets, and CTAs match the spec text exactly.
  - The hero canvas displays a gold-toned shader background via `data-variant="gold"`.

- **Niche Pains, Bundle, Outcomes (3.2, 3.3, 3.5):**
  - Each section uses a `.service-row` with image + neon card.
  - Card titles and bullet text match the spec.
  - Orientation alternates across these sections in a way consistent with `services.html`.
  - Every bullet uses an icon from `assets/css/icons.css`.

- **Proof in Numbers (3.4):**
  - Four stats tiles appear in a row (or responsive stack) using `.neon-card.stat`.
  - Numbers animate from 0 to their `data-target` values on scroll.
  - Labels match the spec text.

- **How It Works and Risk-Reversal (3.6, 3.7):**
  - Four cards per section, styled like the values cards on `about.html`.
  - Headings and descriptions match the spec text.
  - Icons appear above each card title.

- **Pricing placeholder (3.8):**
  - A clearly labelled placeholder section exists for pricing, visually integrated but minimal.

- **FAQs (3.9):**
  - Each FAQ uses `<details class="neon-card faq-item">` with `<summary>` and `<p>`.
  - All question and answer text matches the spec.
  - Clicking a summary expands and collapses the answer.

- **Final CTA & Footer (3.10, 3.11):**
  - Final CTA uses the brand-gradient + neon-card pattern with the specified heading, paragraph, and button label.
  - Footer is visually and structurally identical to other pages.

- **Backgrounds and parallax (3.12):**
  - All content sections on the Estate Agents page that use parallax backgrounds rely on `data-parallax-theme="book"`.
  - No additional background images are introduced.

- **Bullet icons:**
  - An inspection of the DOM shows that every `<li>` that functions as a bullet has an icon (either via `<i class="fa-solid …"></i>` or a dedicated icon-list helper).
  - No default `ul` bullets appear on the page.

- **Responsive behavior:**
  - On tablet and mobile breakpoints, cards stack reasonably, text remains readable, hero content stays usable, and there are no overflow or layout glitches.


## Idempotence and Recovery

- The steps in this plan are additive and can be re-run safely:
  - Re-running `python -m http.server` is safe.
  - Re-reading and re-saving `niches/estate-agents.html` with the same content is idempotent.
- Use Git to manage changes:
  - Before starting, ensure you have a clean working tree.
  - Commit after implementing the page and again after final validation.
  - If you make a mistake in a file, you can:
    - Compare it with its template source (e.g. `services.html` or `about.html`).
    - Use `git restore <file>` to revert and re-apply changes according to this plan.
- If something goes wrong with hero-shader or parallax:
  - Verify that `hero-shader.js` still contains the original theme entries plus the new `gold` key.
  - Verify that parallax sections use `data-parallax-theme="book"` only.
  - Use browser dev tools to confirm script and CSS files load without errors.


## Artifacts and Notes

Use this section to record particularly useful snippets or reminders as you implement.

Examples (to be filled by implementer as needed):

- A sample `.service-row` block reused for 3.2/3.3/3.5.
- A sample `.values` block reused for 3.6/3.7.
- The exact `THEMES.gold` entry in `hero-shader.js` (if helpful).
- Any small CSS adjustments made to ensure card layouts look good for 4-up rows on desktop and stack nicely on mobile.


## Interfaces and Dependencies

Key interfaces and dependencies for this plan:

- **Hero shader interface:**
  - `#hero-shader-canvas[data-variant]` — the `data-variant` attribute selects a theme from the `THEMES` map in `assets/js/hero-shader.js`.

- **Parallax background interface:**
  - `.parallax-section[data-parallax-theme="book"]` — uses the `book-hero-calendly-mobile-2025` assets via `parallax-fix.css`.

- **Neon cards and service rows:**
  - `.service-row`, `.service-image`, `.service-content.neon-card` — used in `services.html`.
  - `.value-card.neon-card` — used in the “Our Values” section of `about.html`.

- **Stats interface:**
  - `.stats` container with `.neon-card.stat` and `.number[data-target]` — structure required for the counter animation in `assets/js/script.js`.

- **FAQ interface:**
  - `<details class="neon-card faq-item">` with `<summary>` and `<p>` — used for collapsible FAQs in `index.html`.

- **CTA and footer:**
  - `.section.brand-gradient .neon-card.cta-card` — final CTA block.
  - `.site-footer .footer-container` — global footer layout.

Any change made while implementing this plan MUST preserve these interfaces so other pages continue to behave and render correctly.

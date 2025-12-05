# Build the Real Estate niche landing page for estate and lettings agents

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept accurate as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` at the repository root.

## Purpose / Big Picture

The goal of this ExecPlan is to design and implement a Real Estate niche landing page targeted at independent UK estate and lettings agents (branches and small groups focused on residential sales, lettings, and property management).

After this plan is implemented:

- Users can navigate to the Real Estate niche URL (recommended slug `/niches/estate-agents`) from the main navigation.
- They will see a premium, on-brand landing page that:
  - Speaks directly to estate/letting agents about missed enquiries, viewings, and instructions.
  - Presents the “Never Miss a Viewing” automation bundle using the site’s existing neon-card and hero patterns.
  - Quantifies the problem with a proof-in-numbers strip.
  - Explains outcomes, how the service works, risk reversal, and FAQs, ending with a clear CTA.
- The page will reuse this repo’s existing design system (hero layout, neon cards, stats cards, FAQ accordion, CTA, footer) so it feels consistent with `index.html`, `about.html`, `services.html`, and `book.html`.

The intended audience is estate/letting agents who are time-poor but revenue-focused. The page must be clear, fast to scan, and visually aligned with the rest of the site.

## Progress

Use this checklist to track actual work performed. Update it with timestamps (`YYYY-MM-DD hh:mmZ`) as you go.

- [x] (2025-12-05 19:26Z) Confirm repo structure, design system files, and existing niche or services page patterns.
- [x] (2025-12-05 19:29Z) Decide and create the Real Estate niche page file and slug (for example, `niches/estate-agents.html` or similar) based on existing patterns.
- [x] (2025-12-05 19:29Z) Implement the hero section with shader animation background and correct copy/CTAs.
- [x] (2025-12-05 19:29Z) Implement the niche pains section as image + neon card using `.service-row` pattern.
- [x] (2025-12-05 19:29Z) Implement the bundle / “Never Miss a Viewing” section as image + neon card with proper heading and copy.
- [x] (2025-12-05 19:29Z) Implement the proof-in-numbers stats strip using existing `.stats-card` styling.
- [x] (2025-12-05 19:29Z) Implement the outcomes & benefits section as image + neon card.
- [x] (2025-12-05 19:29Z) Implement the “How it works” row of four cards mirroring value cards on `about.html`.
- [x] (2025-12-05 19:29Z) Implement the risk reversal & reassurance row of four cards with intro copy.
- [x] (2025-12-05 19:29Z) Add a pricing section placeholder consistent with design system spacing and typography.
- [x] (2025-12-05 19:29Z) Implement the Real Estate FAQs using the existing FAQ accordion component and the specified Q&A content.
- [x] (2025-12-05 19:29Z) Implement the final CTA block mirroring existing CTA markup, with Real Estate-specific copy.
- [x] (2025-12-05 19:29Z) Ensure the footer matches the shared footer used on other pages.
- [x] (2025-12-05 19:29Z) Wire the Real Estate page into navigation (for example, under a “Real Estate” item or dropdown) and confirm the URL slug.
- [x] (2025-12-05 19:31Z) Run build/test commands and visually validate the page across desktop and mobile breakpoints. (Attempted `npm run build:css` but npm is unavailable in this environment; manual validation performed via code review.)

## Surprises & Discoveries

Record unexpected findings here (for example, differences in file structure, unexpected CSS naming, or behavior).

- Observation: Stats strip uses `.stats` with `.stat` cards rather than `.stats-card` naming.
  Evidence: `index.html` around the “Proof in Numbers” section shows `<div class="stats">` containing `.neon-card.stat` cards.
- Observation: Stats numbers auto-animate via `assets/js/script.js`; static values with non-numeric symbols need a bypass.
  Evidence: Added `data-static="true"` handling to `assets/js/script.js` so percentage/range values can render verbatim.
- Observation: npm CLI is not available in the environment, so build scripts cannot be executed.
  Evidence: `npm run build:css` returns “command not found: npm”.

## Decision Log

Record each material decision, especially where the repo’s current state required tradeoffs or interpretation of the spec.

- Decision: …
  Rationale: …
  Date/Author: …
- Decision: Introduced a magenta theme in `assets/js/hero-shader.js` and applied it to the Real Estate hero to give a pink-leaning on-brand variant.
  Rationale: The spec called for a pink/estate-agent flavor while reusing the shader hero system; existing themes were green/blue/amber/silver.
  Date/Author: 2025-12-05 / Codex agent
- Decision: Added a `data-static="true"` escape hatch in the stats animation to allow percentage/range figures to render without being overwritten.
  Rationale: Real Estate stats include ranges and symbols that would be stripped by the integer-only counter logic; skipping animation preserves the exact copy.
  Date/Author: 2025-12-05 / Codex agent

## Outcomes & Retrospective

All Real Estate niche sections were implemented in `niches/estate-agents.html` with hero, pains, bundle, proof strip, outcomes, how-it-works, pricing placeholder, risk/reassurance, FAQs, CTA, and footer. Navigation across all pages now includes a “Real Estate” entry pointing to the new slug, and the sitemap lists the new URL. A magenta shader variant was added for the niche hero, and stats animation now supports static values. Build scripts could not run because npm is unavailable in this environment; manual validation was performed via code review.

## Context and Orientation

This section orients a complete novice to the repo and the Real Estate spec.

### Repository layout and design system (expected patterns)

The exact paths may vary, but the repo is expected to have:

- **Top-level HTML pages** (at the repo root or under a `pages/` directory):
  - `index.html` — home page, including:
    - A hero section with animated shader background, large H1, subheading, and CTA buttons.
    - A “Proof in Numbers” or stats strip (row of cards with large numbers and supporting text).
    - A FAQ section using an accordion pattern.
    - A CTA block near the bottom.
    - A shared footer.
  - `about.html` — about page, including:
    - “Values” or principle cards, likely using `.neon-card` and `.value-card` classes.
  - `services.html` (possibly `pages/services.html`) — services page, including:
    - `.service-row` layouts where an image and a neon card sit side-by-side.
  - `book.html` — booking/contact page, likely reusing hero, CTA, and footer patterns.

- **CSS** under `assets/css/`:
  - `styles.css` — global styles including:
    - Color tokens (CSS variables in `:root`).
    - Typography (heading and body fonts).
    - Card styles such as `.neon-card`, `.stats-card`, `.value-card`.
    - Navigation, footer, FAQ, buttons, and responsive behavior.
  - Possibly `hero-base.css` or similar — hero animations and gradients.

- **JavaScript** under `assets/js/`:
  - `scripts.js` or similar, handling:
    - FAQ accordion toggle behavior (`.faq-item`, `.faq-question`, `.faq-answer` and their active states).
    - Any scroll/hover animations.

- **Images and icons** under `assets/images/`:
  - The Real Estate page expects:
    - `assets/images/socialmedia/Real_Estate_1.jpeg`
    - `assets/images/socialmedia/Real_Estate_2.jpeg`
    - `assets/images/socialmedia/Real_Estate_3.jpeg`
  - Font Awesome or a similar webfont is likely used for icons (`fa fa-check-circle` etc.) under an `assets/webfonts/` or similar directory.

When executing this plan, always use `ls`, `find`, or `rg --files` to confirm these structures and adapt paths and filenames if they differ.

### Design system summary (from existing pages and spec)

Colors (approximate; actual values come from CSS variables):

- Primary Accent (Green) — for main CTAs, key numbers, and highlights.
- Secondary Accent (Blue) — for subheadings, secondary buttons, and icons.
- Tertiary Accent (Purple) — for active nav, highlights, and gradients.
- Dark backgrounds — main page and card backgrounds.
- Light dark backgrounds — alternate sections.
- White and off-white — text on dark backgrounds.
- Silver/Grey — secondary text and icon outlines.

Typography:

- Headings (H1–H3) use a bold sans serif (for example, Poppins) with large size and tight letterspacing.
- Body text uses a clean, legible sans serif (for example, Open Sans) with comfortable line height.
- Buttons and labels may use a display font (for example, Montserrat) in uppercase.

Shared components:

- **Navigation bar:** Fixed header with logo left, nav links right, possibly with a hover-to-expand mini bar.
- **Hero sections:** Full-height sections with animated gradient/shader backgrounds, centered content, large H1, subheading, and one or two buttons.
- **Neon cards (`.neon-card`):** Dark translucent containers with neon borders, large border radius, glow, and optional icons.
- **Stats cards (`.stats-card`):** Cards featuring a large number with accent color and smaller supporting text, arranged in a responsive row.
- **Values / feature cards:** often `.neon-card` or `.value-card`, arranged in a grid.
- **FAQ accordion:** `.faq-item` elements with clickable `.faq-question` and hidden `.faq-answer`, toggled by JS.
- **CTA blocks:** Wide sections with bold heading, supporting paragraph, and one main CTA button.
- **Footer:** Full-width white section with grid-based columns (`.footer-column`).

Animations:

- Scroll/entrance animations (cards sliding in or fading up).
- Hover animations (cards lift slightly, borders glow stronger, icons scale).
- FAQ accordion transitions.

### Real Estate niche page content and structure

The Real Estate page must follow the section map and copy specified in the niche template. The high-level narrative is:

1. **Hero:** Speak directly to estate agents, promising to never miss a viewing again.
2. **Niche pains:** Show what a busy branch really looks like.
3. **Bundle overview:** Introduce the “Never Miss a Viewing” pack, a plug-in virtual office.
4. **Proof in numbers:** Quantify call misses, response times, and conversion rates.
5. **Outcomes & benefits:** Paint a picture of a calmer, more productive branch.
6. **How it works:** Explain the implementation journey in four simple steps.
7. **Pricing placeholder:** Reserve space for future pricing content.
8. **Risk & reassurance:** Address cost, complexity, tone-of-voice, and data handling concerns.
9. **FAQs:** Answer practical and emotional objections.
10. **Final CTA:** Invite the agent to book a free automation audit.
11. **Footer:** Reuse the shared site footer.

Detailed content per section:

#### Hero (shader hero animation with pink variant)

- **H1:**
  - “Estate agents: never miss a viewing again.”
- **Sub-heading:**
  - “A simple automation system that answers enquiries, books viewings and chases feedback while your negotiators focus on instructions and sales.”
- **Supporting bullets:**
  - “Respond to portal leads and missed calls in minutes, not hours.”
  - “Fill diaries automatically with qualified viewings and valuations.”
  - “Stop losing instructions because nobody was free to pick up the phone.”
  - “Give vendors, landlords and buyers a fast, professional experience every time.”
- **Primary CTA label:**
  - “Book a free 30-minute automation audit”
- **Secondary CTA label (optional):**
  - “See the ‘Never Miss a Viewing’ Pack”
- **Visual behavior:**
  - Use the hero section structure and shader animation from existing pages, but configure color tokens/variant to lean into a pink/estate-agent flavor while staying on-brand.

#### Niche pain section (image + neon card)

- No standalone section title; the emphasis is the card title.
- **Image:**
  - `assets/images/socialmedia/Real_Estate_1.jpeg` (estate-agency imagery).
- **Card title (inside neon card):**
  - “What a busy branch really looks like”
- **Pain bullets (inside the card, styled as icon bullets):**
  - “Portal leads and calls stack up whenever the team is out on viewings or valuations.”
  - “Missed calls quietly turn into lost instructions because sellers simply ring the next agent.”
  - “Negotiators spend evenings chasing viewing confirmations and feedback instead of closing deals.”
  - “Shared inboxes are full of unread messages from buyers, tenants and landlords.”
  - “There is no consistent follow-up process for warm buyers, lapsed applicants or past clients.”
  - “Out-of-hours enquiries are dealt with ‘tomorrow’ – by which time the opportunity has often gone.”
- **Layout and styling:**
  - Use the `.service-row` layout from `services.html`:
    - `<div class="service-row">`
      - `<div class="service-image">` for the image.
      - `<div class="service-content neon-card">` for the card.
  - Use icons from the existing webfont (e.g., `fa fa-check-circle` or similar) instead of plain bullets.
  - Use secondary accent blue for the card title, silver/grey for bullet text.

#### Bundle / counter-product overview (image + neon card)

- **Section title (centered above card + image):**
  - “Our flagship estate-agent bundle (one of many ways we can help)”
- **Image:**
  - `assets/images/socialmedia/Real_Estate_2.jpeg`
- **Card title:**
  - “The ‘Never Miss a Viewing’ Pack”
- **Intro paragraph (inside card):**
  - “A plug-in virtual office for estate agents that captures every lead, qualifies prospects and keeps viewings moving without adding headcount or ripping out your existing CRM and calendars.”
- **Bullets – what the system covers (inside card, icon bullets):**
  - “24/7 capture of website, portal and missed-call enquiries with instant text or email responses.”
  - “Smart triage questions that separate casual browsers from serious buyers and motivated sellers.”
  - “Live diary integration to offer available viewing and valuation slots and book them straight into negotiators’ calendars.”
  - “Automatic confirmations, reminders and directions so viewers actually turn up.”
  - “Post-viewing follow-up sequences to collect feedback, surface offers and keep chains warm.”
  - “Structured workflows for landlord enquiries and new instructions so nothing falls between systems.”
- **Layout and styling:**
  - Use `.service-row` again, reusing `.neon-card` and typography.

#### Proof in numbers strip

- Layout: identical to the home page “Proof in Numbers” section.
  - Four `.stats-card` elements in a row on desktop, responsive stacking on smaller viewports.
  - Large accent-colored numbers with smaller body text below.
- Cards and copy (each card: number + body):

  1. `40%`
     - “of buyer enquiries now happen outside normal office hours – if your branch isn’t responsive 24/7, you’re simply not in the conversation.”
  2. `47%`
     - “of first calls to UK SMEs go unanswered, and most of those callers never try again – they just move on to the next agent.”
  3. `100×`
     - “higher chance of connecting with and converting a new lead when you respond within five minutes instead of half an hour or more.”
  4. `0.5–1.2%`
     - “is a typical real-estate lead-to-sale conversion rate, so every extra valuation or viewing you secure has a meaningful impact on your pipeline and revenue.”

- Use the same typography and card backgrounds as the existing stats strip.

#### Outcomes & benefits (image + neon card)

- No standalone section heading.
- **Image:**
  - `assets/images/socialmedia/Real_Estate_3.jpeg`
- **Card title:**
  - “What this means for your branch”
- **Outcome-focused bullets:**
  - “More valuations and instructions because you respond first, every time.”
  - “Higher viewing attendance and fewer wasted slots in the diary.”
  - “Negotiators spending more of the day in money-making conversations and less wrestling with admin.”
  - “Vendors and landlords feeling that your branch is always on the ball and easy to reach.”
  - “Cleaner pipeline visibility with every enquiry logged, tagged and tracked.”
  - “Less stress about evenings and weekends – enquiries are acknowledged even when the office is closed.”
- Layout: another `.service-row` with the image and `.neon-card` content, consistent with previous sections.

#### How it works (row of four cards)

- **Section heading (centered, blue accent):**
  - “How it works”
- **Cards:** four cards in a row (on desktop), visually similar to “values” cards on `about.html`. Each card includes an icon, a title, and body text.

  1. Card 1:
     - Title: “Quick automation audit”
     - Body: “a short session to map how leads currently arrive, how your team responds and where deals are being lost.”
  2. Card 2:
     - Title: “Design your estate agency playbook”
     - Body: “we co-write the qualification questions, follow-up journeys and handover rules that fit your branch.”
  3. Card 3:
     - Title: “Build and launch”
     - Body: “we connect the system to your email, calendars and key tools, then switch it on in a controlled way.”
  4. Card 4:
     - Title: “Refine and optimise”
     - Body: “we monitor results, tweak messages and add extra journeys as your team spots new opportunities.”

- Layout and styling:
  - Use the same structure and classes as about-page value cards (`.neon-card`, `.value-card`, or similar).
  - Include icons from the existing icon set above the card titles.

#### Risk reversal & reassurance (row of four cards)

- **Section heading (centered, blue accent):**
  - “Risk Reversal & Reassurance”
- **Intro paragraph (under heading, smaller, silver/grey):**
  - “This is designed to feel like hiring a sharp part-time assistant, not rolling out a risky new platform.”
- **Cards:** four cards, using the same layout as “How it works” or values cards. Each card can treat one of the following lines as its headline and/or main text:

  1. “Clear setup and monthly fees with defined inclusions – no open-ended day rates.”
  2. “No need to be ‘technical’ – your team approves the flows and wording, we handle the build.”
  3. “Tone of voice is based on your existing emails and brochures so replies sound like your branch, not a robot.”
  4. “Data is handled through sensible, GDPR-aware processes using tools you already trust wherever possible.”

#### Pricing section placeholder

- Insert a dedicated section in the correct position with:
  - A clear section heading (for example, “Pricing” or “Estate-agent-friendly pricing”) styled like other H2s.
  - A short placeholder note (for example, “Pricing details will be added here in a future iteration.”) using body text styles.
- No actual pricing tables yet; structure only.

#### FAQs (using existing accordion)

- FAQ layout and behavior must be identical to the FAQ section on `index.html`:
  - Use `.faq-item`, `.faq-question`, `.faq-answer` markup.
  - Reuse any existing JS that toggles FAQ items.

Insert the following FAQs (questions and answers):

1. **Will this replace my negotiators?**
   - “No. The system is there to take the pressure off your negotiators, not replace them. It handles routine questions, basic qualification and booking so your team can focus on pricing, negotiations and client relationships. Whenever a conversation needs judgement, it is handed back to a human.”

2. **Does it work with our existing CRM and calendars?**
   - “In most cases we connect directly into the tools you already use for diaries, email and contact records. Where a direct integration is not possible, we design simple, reliable handovers so that every enquiry still ends up in the right place. You keep ownership of your data at all times.”

3. **How long does it take to go live?**
   - “For a typical independent branch, the core system is usually live within a few weeks. We start small, focusing on one or two high-impact journeys such as portal leads and missed calls, then expand once the team is comfortable. There is no need for a long implementation project.”

4. **Will it sound robotic or scripted?**
   - “The flows are built from your own language – we base messages on real emails, texts and phone scripts your staff already use. You approve all wording before anything goes live, and we can adjust tone over time based on feedback from your team and clients.”

5. **What happens if something goes wrong or we want to change the journeys?**
   - “You are not left on your own. Ongoing support is included so you can request tweaks, pause specific journeys or expand the system as your branch evolves. We also keep an eye on performance and suggest improvements based on what the data shows.”

6. **Is this suitable for multi-branch agencies?**
   - “Yes. The same core framework can be rolled out across several branches with local variations where needed. You can standardise best practice while still allowing each office to keep its own branding, contact details and diary rules.”

#### Final CTA block

- Layout: identical to the CTA blocks found on `index.html`, `about.html`, and `book.html`.
- **Heading:**
  - “Ready to stop losing instructions to missed calls?”
- **Supporting paragraph:**
  - “If you know too many enquiries slip through the cracks, the ‘Never Miss a Viewing’ Pack is a simple way to fix it. One short conversation is enough to see where automation can plug the gaps in your branch and what this could mean for your pipeline over the next few months.”
- **CTA label:**
  - “Book my free estate agency automation audit”

#### Footer

- Use the same footer markup as existing pages:
  - Full-width white section with 3–4 columns for logo/tagline, navigation, contact info, and social icons.
  - Responsive behavior as defined in `assets/css/styles.css`.

#### URL mapping and metadata

- Recommended URL slug: `estate-agents`.
- Full URL path: `/niches/estate-agents` (mirroring how the site maps other niches or secondary pages).
- Suggested page title:
  - “Estate Agent Automation | Never Miss a Viewing”
- Suggested meta description:
  - “A simple automation bundle for estate agents that captures every lead, books more viewings and cuts branch admin.”
- Navigation:
  - Add or update a nav entry so the Real Estate niche page is reachable via a “Real Estate” item or dropdown.

## Plan of Work

This section describes the narrative milestones and how the work should proceed.

### Milestone 1: Understand repo structure and design system

- Use `shell` to list the repo root and inspect:
  - `index.html`, `about.html`, `services.html`, `book.html` (or similar).
  - `assets/css/styles.css`, `assets/css/hero-base.css` (if present).
  - `assets/js/scripts.js` (or equivalent).
  - `assets/images/socialmedia/`.
- Confirm the presence of:
  - `.service-row` layouts.
  - `.neon-card` styling.
  - `.stats-card` styling.
  - FAQ markup and JS behavior.
  - CTA and footer markup.
- Capture notes in `Surprises & Discoveries` if the structure differs from expectations.

Outcome: You have a clear map of which files and selectors to reuse for each Real Estate section.

### Milestone 2: Create the Real Estate page skeleton and routing

- Identify how additional pages are organized:
  - If the site uses simple static HTML pages, there may be files like `niches/some-niche.html` or similar.
  - If there is no `niches/` directory, inspect existing patterns for secondary pages and mirror them.
- Decide on a page file path, for example:
  - `niches/estate-agents.html` or `pages/niches/estate-agents.html`.
- Copy the base HTML structure (doctype, `<head>`, `<body>`, header/nav, footer scripts) from an existing page (for example, `services.html` or `book.html`) into the new page.
- Update:
  - `<title>` and `<meta>` description to match the Real Estate spec.
  - The `body` classes to include a page-specific class (for example, `class="niche-page niche-estate-agents"`).

Outcome: A new Real Estate HTML page exists, loads the shared header, CSS, and JS, and can be opened directly in a browser (even if sections are still placeholder).

### Milestone 3: Implement hero, pains, and bundle sections

- Implement the hero section at the top of the Real Estate page by:
  - Copying the hero structure from the home or booking page.
  - Applying a Real Estate-specific wrapper class (for example, `hero hero--estate-agents`).
  - Inserting the hero copy and CTAs as specified.
  - If the design system supports hero color variants via a class or data attribute, choose or add a variant consistent with a pink/estate-agent theme.
- Implement the **niche pain** section immediately below the hero:
  - Mirror `.service-row` structure from `services.html`.
  - Ensure the image container uses `Real_Estate_1.jpeg`.
  - Implement the neon card with the card title and pain bullets, styled identically to service cards (icons, fonts, colors).
- Implement the **bundle** section:
  - Insert the centered section heading.
  - Add another `.service-row` with `Real_Estate_2.jpeg` and a neon card containing the title, intro paragraph, and bullets.

Outcome: The top of the Real Estate page has a working hero and the first two content sections (pains and bundle) that visually match existing site patterns.

### Milestone 4: Implement proof strip and outcomes section

- Implement the **proof-in-numbers** strip by:
  - Locating the stats strip in `index.html`.
  - Copying the entire structure (container + `.stats-card` elements) into the Real Estate page.
  - Replacing the numbers and body copy with Real Estate-specific stats.
- Implement the **outcomes & benefits** section:
  - Another `.service-row` with `Real_Estate_3.jpeg`.
  - Neon card with the outcomes card title and bullets.

Outcome: The Real Estate page clearly quantifies the problem/opportunity and shows the positive outcomes of implementing the “Never Miss a Viewing” pack.

### Milestone 5: Implement “How it works”, risk & reassurance, and pricing placeholder

- Implement the **How it works** section:
  - Use the same markup as value cards on `about.html`.
  - Arrange four cards in a row (desktop) with icons, titles, and body texts per the spec.
- Implement the **Risk Reversal & Reassurance** section:
  - Insert the section heading and intro paragraph.
  - Implement four cards in a row (same card component), with each reassurance item as the text of one card.
- Implement the **pricing placeholder** section:
  - Add a section with a heading and a short placeholder paragraph indicating that pricing content will be added later.

Outcome: The mid-to-lower portion of the page makes implementation feel simple and low-risk, with a placeholder where pricing will later live.

### Milestone 6: Implement FAQs, final CTA, footer, and navigation

- Implement the **FAQs**:
  - Copy the FAQ section markup from `index.html` and reuse JS behavior.
  - Replace questions and answers with the Real Estate Q&A items.
- Implement the **final CTA**:
  - Copy the CTA markup from an existing page (e.g., `book.html`).
  - Replace heading, text, and button label with the Real Estate final CTA content.
- Ensure the **footer** is consistent:
  - Reuse the same footer markup as existing pages, with no Real Estate-specific changes.
- Wire up **navigation and URL**:
  - Update the header navigation to include a link to the Real Estate page under a logical label (for example, “Real Estate” in a dropdown).
  - Ensure the href matches the Real Estate page path.

Outcome: The page is fully wired into the site and behaves like all other core pages, including nav and footer.

### Milestone 7: Validation, responsiveness, and polish

- Run the build/test/dev commands defined in `package.json` or `README.md`.
- Start the dev server (if applicable) and navigate to the Real Estate URL, or open the HTML file directly.
- Validate:
  - All sections appear in the correct order.
  - Text matches the spec (headlines, bullets, CTAs, stats).
  - Layout is responsive: on desktop, card rows appear as rows; on mobile, they stack with sane spacing.
  - FAQ accordion behavior works as on the home page.
  - CTA and nav links work as expected.
- Make small adjustments if spacing, alignment, or readability deviate from other pages, keeping CSS minimal and token-based.

Outcome: A polished Real Estate niche landing page fully integrated into the site, visually consistent and functionally correct.

## Concrete Steps

This section is the primary execution guide for agents started under a system prompt that auto-runs `.agent/plans/real-estate-landing-page.md`: begin at step 1 and proceed in order, updating `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` as you advance.

This section translates the plan into specific actions and commands. Commands are examples; adjust file paths as discovered.

### 1. Explore the repo

From the repo root:

    bash -lc "ls"
    bash -lc "ls assets"
    bash -lc "ls assets/css"
    bash -lc "ls assets/js"
    bash -lc "rg \"neon-card\" -n . || true"
    bash -lc "rg \"stats-card\" -n . || true"
    bash -lc "rg \"faq-item\" -n . || true"
    bash -lc "rg \"service-row\" -n . || true"

Read the key HTML and CSS files you find (for example, `index.html`, `about.html`, `services.html`, `book.html`, `assets/css/styles.css`) to confirm patterns.

Update `Surprises & Discoveries` if the structure differs significantly.

### 2. Identify how pages and navigation are structured

- Inspect the header/nav in one of the main pages (for example, `index.html`) to understand:
  - How nav links are arranged.
  - Whether there is a dropdown that might hold “Real Estate” or “Niches”.
- Check for existing secondary pages (e.g., `niches/` directory or similar) by listing subdirectories:

    bash -lc "find . -maxdepth 3 -type f -name \"*.html\""

Use this information to decide where the Real Estate page file should live.

### 3. Create the Real Estate page file

- Choose a path based on patterns (for example, if there is already `niches/` directory, create `niches/estate-agents.html`).
- Use `apply_patch` to create the file by copying the structure of a similar page (for example, `services.html` or `book.html`), including:
  - `<head>` with CSS and JS includes.
  - `<body>` with header/nav, main content container, and footer.
- Update:
  - `<title>` to “Estate Agent Automation | Never Miss a Viewing”.
  - The meta description to the Real Estate description.
  - `body` or top-level wrapper to include a page-level class such as `niche-estate-agents`.

### 4. Implement hero section

- Locate the hero section in an existing page (likely `index.html` or `book.html`), identify its container classes and structure.
- In the Real Estate page, implement a hero section with:
  - Same container and structure.
  - H1, subheading, bullets, and primary/secondary CTAs as specified.
  - If hero variants are controlled by classes (for example, `hero hero--green`, `hero hero--blue`), either:
    - Use an existing variant if suitable, or
    - Introduce a new `hero--estate-agents` or similar class with small, token-based adjustments.

### 5. Implement niche pains and bundle sections

- Copy a `.service-row` section structure from `services.html`.
- For the niche pains section:
  - Point the image `<img>` at `assets/images/socialmedia/Real_Estate_1.jpeg`.
  - Place the card title and pain bullets in a `.neon-card` container.
  - Use icons in `<li>` items consistent with other service cards.
- For the bundle section:
  - Insert a centered heading.
  - Add another `.service-row` with:
    - `Real_Estate_2.jpeg` as the image.
    - Card content (title, intro paragraph, bullets) inside a `.neon-card`.

### 6. Implement proof strip and outcomes section

- Identify the stats strip markup in `index.html` (look for `.stats-card`).
- Copy the entire container and card structure to the Real Estate page.
- Replace each card’s number and text with the Real Estate stats.
- Implement the outcomes section:
  - Another `.service-row` with `Real_Estate_3.jpeg`.
  - Neon card with outcomes title and bullet list.

### 7. Implement “How it works” and risk & reassurance sections

- Find the values or feature cards on `about.html` (look for `.value-card` or similar).
- Implement a “How it works” section using that card structure:
  - Four cards, each with an icon, title, and body copy.
- Implement the “Risk Reversal & Reassurance” section:
  - Section heading and intro paragraph.
  - Four cards using the same layout, with reassurance content.

### 8. Implement pricing placeholder

- Insert a new section (for example, `<section class="section section-pricing-placeholder niche-estate-agents">`) with:
  - Heading styled like other H2s.
  - Short placeholder note.
- Ensure spacing matches other sections and uses existing typography classes.

### 9. Implement FAQs

- Locate the FAQ markup in `index.html` and the supporting JS in `assets/js/scripts.js`.
- Copy the `.faq-item` structure into the Real Estate page, adjusting IDs or attributes if needed.
- Insert the Real Estate FAQ questions and answers.
- Confirm that the accordion behavior still works (clicking questions toggles answers).

### 10. Implement final CTA and footer

- Copy an existing CTA section from `index.html` or `book.html`.
- Replace heading, body, and CTA label with Real Estate content.
- Ensure the shared footer markup is present and unchanged aside from any site-wide updates.

### 11. Wire navigation and validate URL

- Update the header navigation in the shared header section so that:
  - There is a “Real Estate” or similar nav item that points to the Real Estate page’s path.
- If nav is duplicated across multiple pages, update the relevant files consistently (or the shared include, if there is one).

### 12. Run build/test/dev and validate visually

- From the repo root, inspect `package.json` and `README.md`:
  - If there are scripts:
    - Run `npm install` (if not already done).
    - Run `npm run dev` or `npm run start` (as appropriate).
  - If it’s a static HTML site with no build, open the Real Estate HTML file directly in a browser.
- Once the site is running, navigate to the Real Estate page URL and confirm:
  - All sections appear in the correct order.
  - Headings, bullets, and CTAs match the spec.
  - Stats strip shows the correct numbers.
  - FAQ accordion opens and closes smoothly.
  - Layout is responsive (test at least desktop and mobile widths).
- Update `Progress` and `Outcomes & Retrospective` based on results.

## Validation and Acceptance

The implementation is accepted when all of the following are true:

- **Behavioral acceptance:**
  - Visiting the Real Estate URL (for example, `/niches/estate-agents`) displays:
    - Hero with correct H1, subheading, bullets, and both CTAs.
    - Niche pains section with image and card content as specified.
    - Bundle section showcasing “The ‘Never Miss a Viewing’ Pack”.
    - Proof-in-numbers strip with four stats cards and correct copy.
    - Outcomes & benefits section with correct bullet list.
    - “How it works” section with four cards describing the journey.
    - Risk reversal & reassurance section with heading, intro, and four cards.
    - Pricing placeholder section in place.
    - FAQ accordion with six Real Estate questions and answers, functioning as on the home page.
    - Final CTA block with correct copy and button label.
    - Shared footer identical in structure to other pages.
- **Visual acceptance:**
  - Colors, typography, and card shapes match the site’s design system.
  - Section spacing and responsive behavior match comparable sections on existing pages.
- **Technical acceptance:**
  - Any existing build/test scripts run successfully (if present).
  - There are no console errors in the browser related to missing assets, JS errors, or 404s for images or scripts.
- **Navigation acceptance:**
  - The Real Estate page is reachable from the main navigation.

## Idempotence and Recovery

- This plan is designed so that steps can be re-run safely:
  - Re-running `apply_patch` to adjust HTML/CSS is safe as long as patches are kept small and focused.
  - Re-running build/test commands is safe at any time.
- If a patch fails:
  - Review the file to ensure the context in the patch matches the current file contents.
  - Update the patch context or apply a smaller change.
- Avoid destructive actions:
  - Do not delete or drastically refactor shared components (nav, footer, CSS tokens) as part of this plan.
  - If you must change a shared selector, document it in the `Decision Log` and explain how it was validated.

## Artifacts and Notes

As you implement this plan, you may include short examples here that will help a future reader, such as:

- A brief excerpt of the Real Estate hero markup.
- A snippet of the `.stats-card` row as used on the new page.
- Sample terminal output from a successful `npm run build`.

Keep these snippets focused and concise.

## Interfaces and Dependencies

At the end of this plan, the following interfaces and dependencies should exist and function:

- **HTML:**
  - A new Real Estate page file (e.g., `niches/estate-agents.html` or similar).
  - Hero, `.service-row`, `.neon-card`, `.stats-card`, FAQ, CTA, and footer markup mirroring patterns from core pages.
- **CSS:**
  - Existing `.neon-card`, `.stats-card`, `.value-card` (if used) and button styles correctly applied.
  - Optional, minimal new selectors scoped under a Real Estate-specific class (e.g., `.niche-estate-agents`) if necessary for layout tweaks.
- **JS:**
  - FAQ accordion handling reused from `assets/js/scripts.js` (or equivalent) works on the new Real Estate FAQ items.
- **Navigation:**
  - A nav link to the Real Estate page using the repo’s existing header structure.

These interfaces should rely on the existing design system instead of introducing new global patterns. Any deviations must be clearly documented in the `Decision Log` with rationale and validation evidence.

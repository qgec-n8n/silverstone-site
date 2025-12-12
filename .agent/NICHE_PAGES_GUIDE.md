<!-- FILE: .agent/NICHE_PAGES_GUIDE.md -->

# Niche Pages Generation Guide (Estate Agents as the Layout Template)

## Objective
Generate one niche landing page per `niche_copy_templates/*_Template.md` file (excluding Estate Agents), using:
- `niches/estate-agents.html` as the markup/layout template
- The template Markdown file as the copy + image source-of-truth

State goals:
- Pages should look **almost identical** to `niches/estate-agents.html`
- Swap only:
  - metadata (title/description/canonical/OG),
  - copy text,
  - bullet icons,
  - image assets and alt text,
  - page identifiers (body classes)

## Inputs
- Markup template:
  - `niches/estate-agents.html`
- Copy + image templates:
  - `niche_copy_templates/*_Template.md`
- Icon inventory:
  - `.agent/ICON_CATALOG.md`
- Mapping:
  - `.agent/NICHE_TEMPLATES_INDEX.md`

## Output
- New HTML pages under `niches/` for each slug
- Converted `.webp` images in `assets/images/socialmedia/`
- Updated Services dropdown links site-wide
- Updated `sitemap.xml`

---

## Golden Rules (Non-negotiable)
1. **Do not change layout structure.**
   - Keep section ordering, wrappers, and class names consistent with `estate-agents.html`.
2. **Do not leak template instructions.**
   - Anything in **square brackets** in the template is an instruction and must not appear in final HTML.
3. **Icons must be supported.**
   - Use only icon classes listed in `.agent/ICON_CATALOG.md`.
4. **Images must be responsive and prefer WebP.**
   - Convert the template-listed `.jpeg` assets to `.webp`.
   - Use `.webp` in `<picture>` sources and keep mobile/desktop variants.

---

## Image Handling: Required `<picture>` Pattern
For each of the 3 image sections (template sections 3.4, 3.5, 3.7), follow the existing `estate-agents.html` structure.

Use this pattern (adapt filenames and alt text):

    <picture>
      <source srcset="../assets/images/socialmedia/<Desktop>_Mobile.webp" type="image/webp" media="(max-width: 768px)">
      <source srcset="../assets/images/socialmedia/<Desktop>.webp" type="image/webp" media="(min-width: 769px)">
      <source srcset="../assets/images/socialmedia/<Desktop>_Mobile.jpeg" media="(max-width: 768px)">
      <source srcset="../assets/images/socialmedia/<Desktop>.jpeg" media="(min-width: 769px)">
      <img src="../assets/images/socialmedia/<Desktop>.jpeg" alt="<meaningful alt text>" class="service-img" loading="lazy" />
    </picture>

Notes:
- Use the exact filenames specified in each template (case-sensitive).
- The `.webp` must exist; generate them before final validation.
- Preserve the mobile/desktop media query split.

---

## Copy Handling: How to Treat Template Instructions
The templates include bracketed instructions like:
- **_[Codex should generate a sentence that increases SEO, user retention and conversion]_**

For these:
- Generate final copy that matches the tone and density of `estate-agents.html`.
- Keep it short:
  - Headings: 4–10 words, punchy, benefit-led.
  - Subtitles: 1 sentence.
  - Card title: 3–8 words.
  - Card intro paragraph: 1–2 sentences max.
- Prefer UK English spelling (e.g., “personalise”, “favourite”).
- Use niche keywords naturally (e.g., “salon bookings”, “abandoned carts”, “no-shows”, “patient enquiries”).

Never leave brackets or the words “Codex should…” in final HTML.

---

## Bullet Lists: Required Icon Format
Use the same `<li>` structure as `estate-agents.html`:

    <li><i class="fa-solid fa-<icon>"></i>Your bullet text here.</li>

Icon selection:
- Choose icons from `.agent/ICON_CATALOG.md` only.
- Keep icons semantically aligned with the bullet.

---

## Navigation Wiring (Services Dropdown)
Update the Services menu items across all pages:

Root-level pages must link to:
- `niches/<slug>.html`

Pages inside `niches/` must link to:
- `<slug>.html` (same folder)

Apply this to:
- Desktop menu (`.services-menu`)
- Mobile overlay list (`.services-overlay__grid`)

Do not change menu labels; only update the `href`s.

---

## Minimal Shared CSS Change (So all niche pages inherit estate-agents styling)
Currently, some niche-page styling is scoped to `.page-estate-agents`.

For multiple niche pages:
- Add `page-niche` to `niches/estate-agents.html` and every new niche page body class.
- Update `src/css/pages/estate-agents.css` selectors from `.page-estate-agents …` to `.page-niche …`
  (keep file name; it becomes the shared niche style sheet).

This is the only intended CSS change for this workstream.

---

## Required Verification
After generating all niche pages:
- `node scripts/convert-template-images-to-webp.js`
- `node scripts/validate-niche-pages.js --strict`
- `npm run build:css`
- `npm run build:js`

Validation must confirm:
- All pages exist
- No template instruction strings remain
- All required `.webp` assets exist and are referenced
- Navigation links are correctly wired
- Sitemap contains the new niche URLs

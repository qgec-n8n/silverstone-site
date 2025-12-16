<!-- FILE: ExecPlan.md -->

# ExecPlan — Services Page Overhaul (services.html)

## Mission
Overhaul **`/services.html`** so it looks and behaves **almost identically to** **`/niches/estate-agents.html`** (same section structure, layout, classes, and component patterns), but uses the **copy + structure** from **`Services_Overhaul_Copy.md`**, uses the **specified images** from `assets/images/socialmedia/` (character/case sensitive), and preserves the following **locked blocks** from the current `services.html`:

1) **Final CTA banner** (must remain **exactly** the same HTML, styling, and placement relative to the footer as it is today)
2) **Innovation Gallery + Double Marquee** (must remain **exactly** the same HTML/IDs/classes as it is today)
3) **Never include Single Marquee** (services page must continue to be the Double Marquee page)

## Key deviation from estate-agents template
Section **3.5** is intentionally **different** from `estate-agents.html`:
- It must be **split into TWO separate cards** (stacked), each with its own adjacent image:
  - Card 1: **Card on left, Image on right** using `General_Services_2A(.jpeg/.webp)` (+ mobile)
  - Card 2: **Card on right, Image on left** using `General_Services_2B(.jpeg/.webp)` (+ mobile)

## Source-of-truth inputs (read in full before editing anything)
- `Services_Overhaul_Copy.md` (copy + section ordering + constraints; instructions are in **bold italic inside [square brackets]** and must be obeyed)
- `niches/estate-agents.html` (the template structure to mirror)
- `services.html` (to extract the locked blocks: Innovation Gallery + Double Marquee, and Final CTA banner)
- `.agent/ICON_CATALOG.md` and `src/css/base/typography.css` (allowed Font Awesome solid icon classes)
- `assets/js/app.js` (marquee behavior; services page must remain the “double marquee” page)

## Non-negotiable constraints
- **Body class must remain**: `page-services` (this is what keeps Single Marquee off and Double Marquee on).
- The **General** item in the Services dropdown must link to **`services.html`** (verify after changes).
- The revised page must use the **estate-agents component patterns**:
  - `section.hero.title-band`
  - `section.section ... parallax-section` blocks with `container`, `service-row`, `service-image neon-card`, `service-content neon-card (and optional dark-card)`
  - `stats` block format for proof numbers
  - `values` grid format for “How it works”
  - `details.faq-item` format for FAQs
- The image sections (3.4, **3.5 card 1**, **3.5 card 2**, 3.7) must use `<picture>` with:
  - WebP preferred sources (desktop + mobile)
  - JPEG fallbacks (desktop + mobile)
  - An `<img ... loading="lazy">` fallback (like estate-agents)
- Convert **each** JPEG referenced by Sections **3.4 / 3.5 / 3.7** of `Services_Overhaul_Copy.md` to **very high resolution WebP** and use the `.webp` files as preferred image sources.

## Locked blocks to preserve verbatim (do not “recreate”; copy exact HTML)
### Locked Block A — Innovation Gallery + Double Marquee
From the *current* `services.html`, locate the section that contains:
- `id="innovation-gallery"`
- `class="neural-grid"` and `id="neural-grid"`
- the slot: `id="innovation-marquee-slot"`

Copy that markup **verbatim**, preserving:
- all IDs, classes, inline styles, image filenames, alt text
- the marquee slot element exactly

Place it where `Services_Overhaul_Copy.md` indicates (Section 3.12).

### Locked Block B — Final CTA banner (must remain exactly the same)
From the *current* `services.html`, copy **verbatim** the entire final CTA `<section ...>` that contains the headline:
- `Start with a simple automation audit`

Preserve:
- exact heading, subheading, button label, classes, inline styles
- its placement immediately before the global footer
- do not change the CTA copy, spacing, or styles

## Icon discipline (Font Awesome)
This repo uses a **curated subset** of Font Awesome solid icons. Before writing or modifying any bullet lists:
1) Read `.agent/ICON_CATALOG.md`
2) Verify allowed icons by inspecting mappings in `src/css/base/typography.css`
3) Use only icon classes that exist in those mappings.

Every bullet item in the new services page that is presented as a “feature/outcome bullet” must include an appropriate `<i class="fa-solid fa-..."></i>` icon.

## Implementation phases (follow in order)

### Phase 0 — Preflight inventory (no edits yet)
- Open and understand `Services_Overhaul_Copy.md` sections 3.1–3.14.
- Open `niches/estate-agents.html` and outline section-by-section structure and key classnames/patterns.
- Open current `services.html` and extract:
  - Locked Block A (Innovation Gallery + Double Marquee)
  - Locked Block B (Final CTA banner)

Deliverable: a quick internal mapping of “Copy Section → Template Section”.

### Phase 1 — Generate high-res WebP assets for the Services image sections
- Add and run `scripts/convert-services-images-to-webp.js`.
- Ensure `.webp` outputs exist for every required image (desktop + mobile):
  - `General_Services_1(.jpeg/.webp)` + `_Mobile`
  - `General_Services_2A(.jpeg/.webp)` + `_Mobile`
  - `General_Services_2B(.jpeg/.webp)` + `_Mobile`
  - `General_Services_3(.jpeg/.webp)` + `_Mobile`
- Do not delete the original `.jpeg` files (they are required as fallbacks).

### Phase 2 — Rebuild `services.html` using estate-agents as the structural template
Create the new `services.html` by porting the structure of `niches/estate-agents.html` with these adjustments:
- Paths: convert `../assets/...` to `assets/...` as needed (services.html is at repo root).
- Nav links: ensure “General” under Services points to `services.html` and relative paths match root pages.
- Body classes: ensure `<body class="page-services">`
- Head metadata:
  - Title, meta description, OG/Twitter descriptions per `Services_Overhaul_Copy.md` (3.1 + 3.2)
- Replace all copy and section headings/subheadings/cards/FAQs per `Services_Overhaul_Copy.md`.
- Maintain the template’s HTML patterns and classnames so the layout matches estate-agents.

### Phase 3 — Implement image + card sections with WebP-first `<picture>`
- Section 3.4: implement exactly as specified with WebP-first `<picture>`
- Section 3.5: implement as **two stacked cards** (special case)
  - Card 1: Card-left / Image-right using `General_Services_2A.webp` preferred (and `_Mobile.webp`)
  - Card 2: Card-right / Image-left using `General_Services_2B.webp` preferred (and `_Mobile.webp`)
- Section 3.7: implement exactly as specified with WebP-first `<picture>`

### Phase 4 — Insert locked blocks (Innovation Gallery + Double Marquee, then Final CTA)
- Insert Locked Block A where `Services_Overhaul_Copy.md` (3.12) specifies.
- Ensure **no Single Marquee** markup is added.
- Insert Locked Block B at the end exactly as it exists today (3.13), immediately before the footer.

### Phase 5 — Validation + formatting
Run:
- `bash scripts/codex.maintenance.sh`
- `node scripts/validate-services-page.js --strict`
- `npm run build:css`
- `npm run build:js`

Fix any failures until all checks pass.

## Acceptance criteria (must all be true)
- `services.html` visually follows the estate-agents layout patterns (same component structures/classes).
- **Section 3.5 is split into TWO cards** with alternating layout and uses:
  - `General_Services_2A.webp` + `General_Services_2A_Mobile.webp`
  - `General_Services_2B.webp` + `General_Services_2B_Mobile.webp`
- The **Innovation Gallery + Double Marquee block** is identical to the current services page block.
- The **Final CTA banner** is identical to the current services page CTA.
- No Single Marquee is included; `page-services` class remains on `<body>`.
- Image sections use `<picture>` with WebP-first sources and JPEG fallbacks.
- All feature/outcome bullet lists use mapped Font Awesome solid icons (allowed set only).
- `node scripts/validate-services-page.js --strict` passes.

## Final deliverable requirements (Codex final message)
- List changed/added files (with paths)
- Commands run + results
- Short checklist confirming each acceptance criterion
- Rollback note: `git checkout -- services.html` and remove newly generated webp files if needed

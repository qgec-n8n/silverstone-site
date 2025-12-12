<!-- FILE: .agent/ExecPlan.Niches.Batch.md -->

# ExecPlan.Niches.Batch — Generate All Niche Pages (Non–Estate Agents)

## 1) Objective
Create all niche pages defined in `.agent/NICHE_TEMPLATES_INDEX.md` (excluding Estate Agents), using:
- `niches/estate-agents.html` as the markup template
- `niche_copy_templates/*_Template.md` as the copy + image source-of-truth

Then wire all pages into the Services dropdown menu and update `sitemap.xml`.

## 2) In Scope
- Create 8 new niche pages in `niches/`:
  - `hospitality.html`
  - `salons-barbers.html`
  - `trades-virtual-office.html`
  - `ecommerce.html`
  - `physios-chiropractors.html`
  - `dentists.html`
  - `gyms-fitness-studios.html`
  - `fitness-coaches.html`
- Convert template-listed `.jpeg` images to `.webp` and prefer `.webp` via `<picture>` sources.
- Update the Services dropdown `href`s across all site pages (desktop + mobile overlay).
- Update `sitemap.xml` to include niche URLs.
- Minimal shared CSS generalisation to support multiple niche pages:
  - Scope: `src/css/pages/estate-agents.css` selector generalisation to `.page-niche`

## 3) Out of Scope
- Redesigning sections or changing the layout pattern
- Adding new JS features or new global CSS systems
- Changing menu labels or adding new navigation items
- Any copy changes not instructed by the templates (except the explicitly marked “Codex should generate…” items)

## 4) Inputs (Source Files)
- `niches/estate-agents.html` (layout template)
- `niche_copy_templates/*_Template.md` (copy + images)
- `.agent/NICHE_TEMPLATES_INDEX.md` (slug + output mapping)
- `.agent/NICHE_PAGES_GUIDE.md` (rules + patterns)
- `.agent/ICON_CATALOG.md` (allowed icons)

## 5) Outputs (Files Created/Edited)
### New files
- `niches/hospitality.html`
- `niches/salons-barbers.html`
- `niches/trades-virtual-office.html`
- `niches/ecommerce.html`
- `niches/physios-chiropractors.html`
- `niches/dentists.html`
- `niches/gyms-fitness-studios.html`
- `niches/fitness-coaches.html`
- `.webp` images in `assets/images/socialmedia/` for each template-listed `.jpeg`

### Edited files
- `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`
- `niches/estate-agents.html` (body class + menu links)
- `sitemap.xml`
- `src/css/pages/estate-agents.css` (generalise to `.page-niche`)

## 6) Step-by-Step Procedure

### Phase A — Preflight (must be clean before creating pages)
1. Confirm templates exist:
   - `ls niche_copy_templates/*_Template.md`
2. Confirm missing assets are resolved:
   - Ensure `assets/images/socialmedia/Physio_2.jpeg`, `Physio_3.jpeg`, `Physio_3_Mobile.jpeg` exist.
3. Run icon inventory check:
   - `rg "\.fa-solid\.fa-" src/css/base/typography.css`
   - Use only icons listed in `.agent/ICON_CATALOG.md`.

### Phase B — Generate required WebP assets
4. Run conversion:
   - `node scripts/convert-template-images-to-webp.js`
5. Confirm `.webp` files exist for each template image.

### Phase C — Shared styling generalisation for niche pages
6. Add `page-niche` class:
   - Update `niches/estate-agents.html` `<body>` to include `page-niche`.
7. Generalise CSS:
   - Edit `src/css/pages/estate-agents.css`:
     - Replace `.page-estate-agents …` with `.page-niche …`
     - Replace `body.page-estate-agents` with `body.page-niche` for the mobile background rule.
8. Rebuild CSS:
   - `npm run build:css`

### Phase D — Navigation wiring (site-wide)
9. Update Services dropdown links across:
   - Root pages: link to `niches/<slug>.html`
   - Niche pages: link to `<slug>.html`
10. Apply to both menus:
   - Desktop `.services-menu`
   - Mobile `.services-overlay__grid`

### Phase E — Create niche pages sequentially
For each niche, run the corresponding per-niche ExecPlan in this exact order:
1. `.agent/ExecPlan.Niche.Hospitality.md`
2. `.agent/ExecPlan.Niche.SalonsBarbers.md`
3. `.agent/ExecPlan.Niche.TradesVirtualOffice.md`
4. `.agent/ExecPlan.Niche.Ecommerce.md`
5. `.agent/ExecPlan.Niche.PhysiosChiropractors.md`
6. `.agent/ExecPlan.Niche.Dentists.md`
7. `.agent/ExecPlan.Niche.GymsFitnessStudios.md`
8. `.agent/ExecPlan.Niche.FitnessCoaches.md`

After each page is created:
- Run `node scripts/validate-niche-pages.js` (soft)
- Fix any obvious issues before proceeding to the next page.

### Phase F — Sitemap update
11. Update `sitemap.xml`:
- Add `<url>` entries for each niche canonical URL:
  - `https://silverstone-ai.com/niches/<slug>`
- Keep formatting consistent with the existing file.

### Phase G — Final verification & cleanup
12. Run strict validation:
- `node scripts/validate-niche-pages.js --strict`
13. Run build checks:
- `npm run build:css`
- `npm run build:js`
14. Ensure no template instruction text remains anywhere:
- `rg "Codex should generate|\\[Codex should|\\[Note:" niches/ niche_copy_templates/`
  - It is OK for templates to contain instructions; it is NOT OK for `niches/*.html` to contain them.

## 7) Entry Criteria / Exit Criteria
### Entry
- Repo is clean.
- Template files exist.
- Missing Physio images are present.
- WebP conversion script runs without missing-file errors.

### Exit
- All 8 niche pages exist and render with estate-agents layout structure.
- Services dropdown links to new niche pages on desktop + mobile menus.
- `.webp` assets exist and are preferred in HTML `<picture>` sources.
- `sitemap.xml` includes all niche URLs.
- `node scripts/validate-niche-pages.js --strict` passes.

## 8) Verification
Primary:
- `node scripts/validate-niche-pages.js --strict`

Secondary (sanity):
- `npm run build:css`
- `npm run build:js`

## 9) Rollback Safety
- New pages can be removed by deleting `niches/<slug>.html`.
- WebP assets can be removed by deleting corresponding `.webp` files (but prefer keeping them once referenced).
- CSS generalisation can be reverted by restoring `src/css/pages/estate-agents.css` from git history.

<!-- FILE: .agent/ExecPlan.Niche.Hospitality.md -->

# ExecPlan.Niche.Hospitality — Generate `niches/hospitality.html`

## Objective
Create `niches/hospitality.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/Hospitality_Template.md` as the copy + image source-of-truth.

## In scope
- New page file creation
- Copy + image replacement per template
- Bullet icon assignment using `.agent/ICON_CATALOG.md`
- Correct menu links within this new niche page

## Out of scope
- Layout redesign
- New icon class introduction outside the allowed catalog

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/Hospitality_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/hospitality.html`

## Page Identity
- Slug: `hospitality`
- Menu label: `Hospitality`
- Canonical / OG URL: `https://silverstone-ai.com/niches/hospitality`
- Images (desktop / mobile):
  - `Hospitality_1.jpeg` / `Hospitality_1_Mobile.jpeg`
  - `Hospitality_2.jpeg` / `Hospitality_2_Mobile.jpeg`
  - `Hospitality_3.jpeg` / `Hospitality_3_Mobile.jpeg`

## Procedure (file-specific)
1. Copy:
   - `cp niches/estate-agents.html niches/hospitality.html`
2. Update `<head>` metadata in `niches/hospitality.html`:
   - `<title>` from template section “Page Title”
   - `<meta name="description">` from template “Meta Description” (or generate if instructed)
   - `<link rel="canonical">` → `https://silverstone-ai.com/niches/hospitality`
   - `<meta property="og:title">`, `og:description`, `og:url` accordingly
3. Update `<body>` class:
   - Include `page-niche` and a page identifier like `page-hospitality`
4. Replace hero section copy (template sections 3.1–3.3):
   - H1, supporting paragraph, primary CTA label, secondary CTA label
   - If template instructs shader colour: keep `data-variant="amber"` unless explicitly required otherwise
5. Replace three image sections (template 3.4, 3.5, 3.7):
   - Swap section titles/subtitles, card titles, card intro paragraphs, bullet lists
   - Replace images using the `<picture>` pattern from `.agent/NICHE_PAGES_GUIDE.md`
   - Provide accurate `alt` text for hospitality context
6. Replace numbers section (template 3.6):
   - Update section title/subtitle
   - Update the 4 stat cards’ number text + labels
   - Keep `data-counter="off"` (no counter animations)
7. Replace “How it works” and “Safe/compliant” cards (template 3.8–3.9):
   - Update headings, subtitles, card headings and paragraphs
   - Keep layout and classes identical
8. Replace FAQ section (template 3.11):
   - Update FAQ title and each Q/A pair
9. Replace Final CTA block (template 3.12):
   - Update heading, paragraph, button label
10. Update Services dropdown links inside this file:
   - Point to sibling niche pages via `<slug>.html` (same folder)
11. Validate:
   - `node scripts/validate-niche-pages.js`
   - Fix any reported issues for this page

## Entry / Exit Criteria
- Entry: WebP conversion completed and required images exist
- Exit: Page exists, has no template-instruction text, uses `.webp` sources, and menu links are correct

## Verification
- `node scripts/validate-niche-pages.js --strict` must pass once all pages are completed

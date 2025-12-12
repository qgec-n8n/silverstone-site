<!-- FILE: .agent/ExecPlan.Niche.SalonsBarbers.md -->

# ExecPlan.Niche.SalonsBarbers — Generate `niches/salons-barbers.html`

## Objective
Create `niches/salons-barbers.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/Salons_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/Salons_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/salons-barbers.html`

## Page Identity
- Slug: `salons-barbers`
- Menu label: `Salons & Barbers`
- Canonical / OG URL: `https://silverstone-ai.com/niches/salons-barbers`
- Images (desktop / mobile):
  - `Salon_1.jpeg` / `Salon_1_Mobile.jpeg`
  - `Salon_2.jpeg` / `Salon_2_Mobile.jpeg`
  - `Salon_3.jpeg` / `Salon_3_Mobile.jpeg`

## Procedure
Follow the exact steps in `.agent/NICHE_PAGES_GUIDE.md` and mirror the hospitality approach:
1. Copy estate agents → salons file
2. Update metadata + canonical/OG
3. Add body classes: `page-niche page-salons-barbers`
4. Replace copy per template sections 3.1–3.12
5. Assign bullet icons using only `.agent/ICON_CATALOG.md`
6. Replace the 3 image sections with correct filenames and meaningful alt text
7. Ensure services dropdown links in this file target sibling niche pages via `<slug>.html`
8. Validate with `node scripts/validate-niche-pages.js`

## Exit Criteria
- File exists, `.webp` sources are used, no template instructions remain, and links are correct

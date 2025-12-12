<!-- FILE: .agent/ExecPlan.Niche.Ecommerce.md -->

# ExecPlan.Niche.Ecommerce — Generate `niches/ecommerce.html`

## Objective
Create `niches/ecommerce.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/eCommerce_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/eCommerce_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/ecommerce.html`

## Page Identity
- Slug: `ecommerce`
- Menu label: `eCommerce Brands`
- Canonical / OG URL: `https://silverstone-ai.com/niches/ecommerce`
- Images (desktop / mobile):
  - `eComm_1.jpeg` / `eComm_1_Mobile.jpeg`
  - `eComm_2.jpeg` / `eComm_2_Mobile.jpeg`
  - `eComm_3.jpeg` / `eComm_3_Mobile.jpeg`

## Procedure
Follow `.agent/NICHE_PAGES_GUIDE.md` exactly:
- Copy → update metadata → add `page-niche page-ecommerce`
- Replace copy per template sections (especially many “Codex should generate…” slots)
- Use only icons from `.agent/ICON_CATALOG.md` (choose the closest semantic match)
- Replace the 3 image sections with the eComm images and correct alt text
- Update Services dropdown links inside this file to sibling niche pages
- Validate via `node scripts/validate-niche-pages.js`

## Exit Criteria
- Page exists, uses `.webp` sources, and passes soft validation

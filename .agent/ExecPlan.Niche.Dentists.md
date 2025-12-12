<!-- FILE: .agent/ExecPlan.Niche.Dentists.md -->

# ExecPlan.Niche.Dentists — Generate `niches/dentists.html`

## Objective
Create `niches/dentists.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/Dentists_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/Dentists_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/dentists.html`

## Page Identity
- Slug: `dentists`
- Menu label: `Dentists`
- Canonical / OG URL: `https://silverstone-ai.com/niches/dentists`
- Images (desktop / mobile):
  - `Dentists_1.jpeg` / `Dentists_1_Mobile.jpeg`
  - `Dentists_2.jpeg` / `Dentists_2_Mobile.jpeg`
  - `Dentists_3.jpeg` / `Dentists_3_Mobile.jpeg`

## Procedure
Follow `.agent/NICHE_PAGES_GUIDE.md`:
- Copy → update metadata → add `page-niche page-dentists`
- Replace template sections 3.1–3.12 copy
- Assign bullet icons from `.agent/ICON_CATALOG.md`
- Replace images with dentists assets and correct alt text
- Update Services dropdown links inside this file to sibling niche pages
- Validate via `node scripts/validate-niche-pages.js`

## Exit Criteria
- Page exists, `.webp` sources present, no instruction text remains

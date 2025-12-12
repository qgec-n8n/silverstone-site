<!-- FILE: .agent/ExecPlan.Niche.GymsFitnessStudios.md -->

# ExecPlan.Niche.GymsFitnessStudios — Generate `niches/gyms-fitness-studios.html`

## Objective
Create `niches/gyms-fitness-studios.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/Gyms_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/Gyms_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/gyms-fitness-studios.html`

## Page Identity
- Slug: `gyms-fitness-studios`
- Menu label: `Gyms & Fitness Studios`
- Canonical / OG URL: `https://silverstone-ai.com/niches/gyms-fitness-studios`
- Images (desktop / mobile):
  - `Gyms_1.jpeg` / `Gyms_1_Mobile.jpeg`
  - `Gyms_2.jpeg` / `Gyms_2_Mobile.jpeg`
  - `Gyms_3.jpeg` / `Gyms_3_Mobile.jpeg`

## Procedure
Follow `.agent/NICHE_PAGES_GUIDE.md` exactly:
- Copy → update metadata → add `page-niche page-gyms-fitness-studios`
- Replace template sections 3.1–3.12 copy
- Use icon classes only from `.agent/ICON_CATALOG.md`
- Replace the 3 image sections with gyms assets and correct alt text
- Update Services dropdown links inside this file to sibling niche pages
- Validate via `node scripts/validate-niche-pages.js`

## Exit Criteria
- Page exists, references `.webp` sources, no leftover template instructions

<!-- FILE: .agent/ExecPlan.Niche.FitnessCoaches.md -->

# ExecPlan.Niche.FitnessCoaches — Generate `niches/fitness-coaches.html`

## Objective
Create `niches/fitness-coaches.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/OnlineCoaches_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/OnlineCoaches_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/fitness-coaches.html`

## Page Identity
- Slug: `fitness-coaches`
- Menu label: `Fitness Influencers & Online Coaches`
- Canonical / OG URL: `https://silverstone-ai.com/niches/fitness-coaches`
- Images (desktop / mobile):
  - `Online_Coach_1.jpeg` / `Online_Coach_1_Mobile.jpeg`
  - `Online_Coach_2.jpeg` / `Online_Coach_2_Mobile.jpeg`
  - `Online_Coach_3.jpeg` / `Online_Coach_3_Mobile.jpeg`

## Procedure
Follow `.agent/NICHE_PAGES_GUIDE.md`:
- Copy → update metadata → add `page-niche page-fitness-coaches`
- Replace template sections 3.1–3.12 copy
- Use only icons from `.agent/ICON_CATALOG.md`
- Replace images and set correct alt text for fitness coaching context
- Update Services dropdown links inside this file to sibling niche pages
- Validate via `node scripts/validate-niche-pages.js`

## Exit Criteria
- Page exists with correct metadata, correct images, and no template instructions visible

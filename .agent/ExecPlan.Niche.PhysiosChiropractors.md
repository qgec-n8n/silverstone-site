<!-- FILE: .agent/ExecPlan.Niche.PhysiosChiropractors.md -->

# ExecPlan.Niche.PhysiosChiropractors — Generate `niches/physios-chiropractors.html`

## Objective
Create `niches/physios-chiropractors.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/Physios_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/Physios_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/physios-chiropractors.html`

## Page Identity
- Slug: `physios-chiropractors`
- Menu label: `Physios & Chiropractors`
- Canonical / OG URL: `https://silverstone-ai.com/niches/physios-chiropractors`
- Images (desktop / mobile):
  - `Physio_1.jpeg` / `Physio_1_Mobile.jpeg`
  - `Physio_2.jpeg` / `Physio_2_Mobile.jpeg`
  - `Physio_3.jpeg` / `Physio_3_Mobile.jpeg`

## Critical prerequisite (must be true before you proceed)
The following images must exist in `assets/images/socialmedia/`:
- `Physio_2.jpeg`
- `Physio_3.jpeg`
- `Physio_3_Mobile.jpeg`

If missing, stop and request they be added before continuing.

## Procedure
Same as other niche pages:
- Copy → update metadata → add `page-niche page-physios-chiropractors`
- Replace template sections 3.1–3.12 copy
- Use only icon classes from `.agent/ICON_CATALOG.md`
- Replace the 3 image sections with Physio images and appropriate alt text
- Update Services dropdown links inside this file to sibling niche pages
- Validate via `node scripts/validate-niche-pages.js`

## Exit Criteria
- Page exists, references `.webp` sources, and contains no template instruction text

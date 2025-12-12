<!-- FILE: .agent/ExecPlan.Niche.TradesVirtualOffice.md -->

# ExecPlan.Niche.TradesVirtualOffice — Generate `niches/trades-virtual-office.html`

## Objective
Create `niches/trades-virtual-office.html` using `niches/estate-agents.html` as the markup template and `niche_copy_templates/Trades_Template.md` as the copy + image source-of-truth.

## Inputs
- `niches/estate-agents.html`
- `niche_copy_templates/Trades_Template.md`
- `.agent/NICHE_PAGES_GUIDE.md`
- `.agent/ICON_CATALOG.md`

## Outputs
- `niches/trades-virtual-office.html`

## Page Identity
- Slug: `trades-virtual-office`
- Menu label: `Trades & Field Services`
- Canonical / OG URL: `https://silverstone-ai.com/niches/trades-virtual-office`
- Images (desktop / mobile):
  - `Trades_1.jpeg` / `Trades_1_Mobile.jpeg`
  - `Trades_2.jpeg` / `Trades_2_Mobile.jpeg`
  - `Trades_3.jpeg` / `Trades_3_Mobile.jpeg`

## Procedure
Same as other niche pages (see `.agent/NICHE_PAGES_GUIDE.md`):
- Copy → update metadata → add `page-niche page-trades-virtual-office`
- Replace all template sections 3.1–3.12 copy into the matching estate-agents sections
- Choose icons only from `.agent/ICON_CATALOG.md`
- Replace images in sections 3.4/3.5/3.7 using the required `<picture>` pattern
- Update the Services dropdown links within this niche page to sibling niche pages
- Validate via `node scripts/validate-niche-pages.js`

## Exit Criteria
- Page exists with correct slug URL metadata, correct images, and no leftover template instructions

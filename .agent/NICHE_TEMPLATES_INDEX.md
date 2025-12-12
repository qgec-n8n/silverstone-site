<!-- FILE: .agent/NICHE_TEMPLATES_INDEX.md -->

# Niche Templates Index

This is the authoritative mapping from template files → niche output pages → navigation wiring.

## Output Location
All niche pages live in: `niches/`

## Navigation Requirement
Every niche page must be linked from the **Services** dropdown menu in:
- Desktop menu list (`.services-menu`)
- Mobile overlay pill list (`.services-overlay__grid`)

…across:
`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`,
`niches/estate-agents.html`, and all newly created niche pages.

---

## Niche Pages to Generate (Non–Estate Agents)

| Menu Label (keep as-is) | Template File | Recommended Slug | Output HTML |
|---|---|---|---|
| Hospitality | `niche_copy_templates/Hospitality_Template.md` | `hospitality` | `niches/hospitality.html` |
| Salons & Barbers | `niche_copy_templates/Salons_Template.md` | `salons-barbers` | `niches/salons-barbers.html` |
| Trades & Field Services | `niche_copy_templates/Trades_Template.md` | `trades-virtual-office` | `niches/trades-virtual-office.html` |
| eCommerce Brands | `niche_copy_templates/eCommerce_Template.md` | `ecommerce` | `niches/ecommerce.html` |
| Physios & Chiropractors | `niche_copy_templates/Physios_Template.md` | `physios-chiropractors` | `niches/physios-chiropractors.html` |
| Dentists | `niche_copy_templates/Dentists_Template.md` | `dentists` | `niches/dentists.html` |
| Gyms & Fitness Studios | `niche_copy_templates/Gyms_Template.md` | `gyms-fitness-studios` | `niches/gyms-fitness-studios.html` |
| Fitness Influencers & Online Coaches | `niche_copy_templates/OnlineCoaches_Template.md` | `fitness-coaches` | `niches/fitness-coaches.html` |

---

## Image Conversion Requirement (Template Sections 3.4 / 3.5 / 3.7)
Each template specifies 3 desktop images and 3 mobile images (all `.jpeg`) located in:
`assets/images/socialmedia/`

Codex must:
1. Convert each of those `.jpeg` files to `.webp` (same basename).
2. Prefer `.webp` in the niche page `<picture>` sources.
3. Preserve responsive selection: mobile uses the `*_Mobile.*` variant.

---

## Known Asset Issue (Must be resolved before running Codex)
The following template-referenced images are missing from `assets/images/socialmedia/`:
- `Physio_2.jpeg`
- `Physio_3.jpeg`
- `Physio_3_Mobile.jpeg`

These must exist (real image files, not placeholders) before image conversion and page generation.

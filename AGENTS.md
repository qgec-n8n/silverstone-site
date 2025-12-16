<!-- FILE: AGENTS.md -->

# Silverstone Site — Codex Operating Guide (Services Overhaul)

## What you are doing in this repo
This run is **only** for the **Services (General) page overhaul**:
- Rebuild `services.html` to mirror `niches/estate-agents.html` structure
- Apply copy from `Services_Overhaul_Copy.md`
- Preserve locked Services-only blocks (Innovation Gallery + Double Marquee, Final CTA)
- Generate WebP assets for the required image sections

## Read-first order (mandatory)
1) `ExecPlan.md` (task spec + locked blocks + special-case 3.5)
2) `Services_Overhaul_Copy.md` (copy, section map, and constraints)
3) `niches/estate-agents.html` (template structure)
4) `services.html` (extract locked blocks)
5) `.agent/ICON_CATALOG.md` + `src/css/base/typography.css` (allowed icons)

## Hard rules (do not violate)
- **Do not** add Single Marquee to Services.
- **Do not** remove `page-services` body class.
- **Do not** “recreate” locked blocks; copy them verbatim from current `services.html`.
- **Do not** invent Font Awesome icons. Use only mapped icons in `src/css/base/typography.css`.
- **Do not** refactor unrelated pages, CSS, or JS.

## Special-case rule: Section 3.5
Section 3.5 must be split into **two stacked cards** (this is a deliberate deviation from the template):
- Card 1: Card-left / Image-right using `General_Services_2A(.webp preferred)`
- Card 2: Card-right / Image-left using `General_Services_2B(.webp preferred)`

## Commands you are expected to use
Setup (once per environment):
- `bash scripts/codex.setup.sh`

During iteration:
- `bash scripts/codex.maintenance.sh`
- `node scripts/validate-services-page.js --strict`

Build sanity:
- `npm run build:css`
- `npm run build:js`

## Bullet/icon contract
Before writing bullet lists:
- Read `.agent/ICON_CATALOG.md`
- Verify icon mappings exist in `src/css/base/typography.css`
- Every “feature/outcome bullet” must include `<i class="fa-solid fa-..."></i>`

## Image/WebP contract
You must ensure the JPEGs referenced in `Services_Overhaul_Copy.md` sections 3.4/3.5/3.7 have corresponding WebPs:
- Use `node scripts/convert-services-images-to-webp.js`
- In HTML, use WebP sources first, JPEG fallbacks second (estate-agents `<picture>` pattern).

Required WebP outputs:
- `General_Services_1.webp` + `General_Services_1_Mobile.webp`
- `General_Services_2A.webp` + `General_Services_2A_Mobile.webp`
- `General_Services_2B.webp` + `General_Services_2B_Mobile.webp`
- `General_Services_3.webp` + `General_Services_3_Mobile.webp`

## Final response format (required)
Include:
- Files changed/added (paths)
- Commands run (with pass/fail)
- Checklist confirming:
  - body class is `page-services`
  - section 3.5 is TWO cards with 2A/2B images
  - locked Innovation Gallery + Double Marquee is preserved verbatim
  - locked Final CTA is preserved verbatim
  - no Single Marquee
  - image sections use WebP-first `<picture>`
  - bullet icons are from allowed mapped set
  - `node scripts/validate-services-page.js --strict` passes

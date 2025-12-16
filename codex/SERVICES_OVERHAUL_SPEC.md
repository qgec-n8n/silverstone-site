<!-- FILE: codex/SERVICES_OVERHAUL_SPEC.md -->

# Services (General) Overhaul — Spec Companion

This file exists to reduce ambiguity when executing `ExecPlan.md`.

## Page target
- File: `services.html`
- Must mirror: `niches/estate-agents.html` (structure + patterns)
- Must use copy from: `Services_Overhaul_Copy.md`

## Template deviation (intentional): Section 3.5
Section 3.5 must be **split into TWO separate cards** (stacked one after the other):
- **Card 1**: Card on the left, Image on the right
  - Image: `assets/images/socialmedia/General_Services_2A.webp` preferred
  - Mobile: `assets/images/socialmedia/General_Services_2A_Mobile.webp` preferred
- **Card 2**: Card on the right, Image on the left
  - Image: `assets/images/socialmedia/General_Services_2B.webp` preferred
  - Mobile: `assets/images/socialmedia/General_Services_2B_Mobile.webp` preferred

Both cards must use the estate-agents card + image section pattern (same classnames), but stacked within the same 3.5 section.

## Services-only locked blocks (copy verbatim from current services.html)
1) Innovation Gallery + Double Marquee block
   - Must include: `id="innovation-gallery"`, `id="neural-grid"`, and `id="innovation-marquee-slot"`
   - Keep all image filenames, alt text, IDs, classes, and inline styles unchanged

2) Final CTA banner block
   - Must include headline: `Start with a simple automation audit`
   - Keep markup and styling unchanged and keep its location immediately above the footer

## Marquee rule
- Services must remain the **Double Marquee** page.
- Do not add any `.single-marquee` markup.
- Ensure `<body class="page-services">` is preserved (this is what keeps Single Marquee disabled in `assets/js/app.js`).

## Image rule (required image sections)
The image sections referenced in `Services_Overhaul_Copy.md` must:
- Use exactly the filenames specified there (case sensitive)
- Use estate-agents `<picture>` pattern
- Prefer `.webp` sources (desktop + mobile) generated alongside the `.jpeg` originals

Required directory:
- `assets/images/socialmedia/`

Required images (desktop + mobile):
- `General_Services_1.jpeg` / `General_Services_1_Mobile.jpeg`
- `General_Services_2A.jpeg` / `General_Services_2A_Mobile.jpeg`
- `General_Services_2B.jpeg` / `General_Services_2B_Mobile.jpeg`
- `General_Services_3.jpeg` / `General_Services_3_Mobile.jpeg`

## Icon rule (Font Awesome)
- Allowed icons are the ones mapped in:
  - `src/css/base/typography.css`
- Additional guidance:
  - `.agent/ICON_CATALOG.md`

Every “feature/outcome bullet” must include:
- `<i class="fa-solid fa-..."></i>` using only mapped icon classes.

## Navigation rule
- The Services dropdown’s **General** link must point to `services.html`.
- Verify after the rebuild.

## Where to put each copy section
Use `Services_Overhaul_Copy.md` section ordering (3.1–3.14) and map onto the estate-agents structure in this order:
1) Meta + Hero (3.1, 3.2)
2) Menu Bar (3.3) — preserve standard site nav; verify links
3) Pain (3.4) — image + card section pattern
4) Bundle/Pack (3.5) — TWO stacked cards with alternating layout (2A then 2B)
5) Proof in numbers (3.6) — stats block pattern
6) Outcomes (3.7) — image + card section pattern
7) How it works (3.8) — values grid pattern
8) Risk reversal/reassurance (3.9) — reassurance card section pattern
9) Pricing placeholder (3.10) — keep placeholder style consistent
10) FAQs (3.11) — FAQ accordion pattern
11) Innovation Gallery + Double Marquee (3.12) — locked block
12) Final CTA (3.13) — locked block
13) Footer (3.14) — preserve global footer

<!-- FILE: codex/SERVICES_OVERHAUL_SPEC.md -->

# Services (General) Overhaul — Spec Companion

This file exists to reduce ambiguity when executing `ExecPlan.md`.

## Page target
- File: `services.html`
- Must mirror: `niches/estate-agents.html` (structure + patterns)
- Must use copy from: `Services_Overhaul_Copy.md`

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

## Image rule (3 image sections)
- The 3 image sections referenced in `Services_Overhaul_Copy.md` (Sections 3.4 / 3.5 / 3.7) must:
  - Use exactly the filenames specified there (case sensitive)
  - Use estate-agents `<picture>` pattern
  - Prefer `.webp` sources (desktop + mobile) generated alongside the `.jpeg` originals

Expected directory:
- `assets/images/socialmedia/`

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
4) Bundle/Pack (3.5) — image + card section pattern (wrap-reverse like estate-agents)
5) Proof in numbers (3.6) — stats block pattern
6) Outcomes (3.7) — image + card section pattern
7) How it works (3.8) — values grid pattern
8) Risk reversal/reassurance (3.9) — reassurance card section pattern
9) Pricing placeholder (3.10) — keep placeholder style consistent
10) FAQs (3.11) — FAQ accordion pattern
11) Innovation Gallery + Double Marquee (3.12) — locked block
12) Final CTA (3.13) — locked block
13) Footer (3.14) — preserve global footer

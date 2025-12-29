<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log (Requested Edits 1–6)

Use this log to record baseline failures, discoveries, decisions, and verification notes for Requested Edits 1–6.

## Baseline

- Date: 2025-12-29
- `bash scripts/codex.requested-edits.sh` baseline result: fail
- Baseline failures summary:
  - `bash scripts/codex.setup.sh` failed: `npm` error building `sharp` (missing `vips/vips8`, EPERM writing `/Users/quentingeczy/.npm`).
  - `bash scripts/codex.requested-edits.sh` failed at `validate-core-pages`: `services.html` expected `data-variant="green"` but found `data-variant="blue"`.

## Discoveries (repo reality that affects approach)

Record findings that influence implementation choices:
- File paths and selectors controlling each requirement
- Conflicts with existing styles and how you handled them
  - Shader theme map lives in `src/js/hero-shader.js` with keys `default`, `blue`, `green`, `amber`; all core pages currently set `data-variant="blue"` (about, services, book, contact) and will need per-page updates.
  - Hero glass panel is `.hero.title-band .content` in `src/css/components/hero.css` with background/border/box-shadow/backdrop-filter; mobile block repeats `.hero.title-band .content` for padding.
  - Section subtitle color is `.section-subtitle` in `src/css/base/layout.css` and is forced to white by `--color-silver: var(--color-white)` plus inline `style="color: var(--color-silver)"` on many `.section-subtitle` elements across core + niche pages.
  - Service image fit uses global `.service-image img { object-fit: contain; }` in `src/css/components/cards.css` plus services overrides in `src/css/pages/services.css` and niche override in `src/css/pages/estate-agents.css` that keep `object-fit: contain`.
  - About images rely on base `.service-image img` rules (contain) plus mobile-only overrides in `src/css/pages/about.css`; need top-safe positioning on desktop as well.

## Decisions (why we chose an approach)

Format:
- Date — Area — Decision — Why — Alternatives considered

## Approach (per requested edit)

- Edit 1 — Shader colors per page
  - Change: update `data-variant` values in `about.html`, `services.html`, `book.html`, `contact.html`; add `pink` and `orange` themes (and update theme map) in `src/js/hero-shader.js`.
  - Minimality: keep existing shader architecture + data-variant mechanism; only adjust required pages and theme map.
  - Verify: `node scripts/validate-core-pages.js`; manual hue check per page.
  - Proof marker: `SPEC: SHADER_COLORS_PER_PAGE_2025_12` in `src/js/hero-shader.js` near theme map.

- Edit 2 — Hero glass panel removal + legibility
  - Change: remove background/border/box-shadow/backdrop-filter from `.hero.title-band .content` in `src/css/components/hero.css`; increase text-shadow/contrast for hero text + CTA legibility without new panel.
  - Minimality: only touch the hero content rule (and related text shadow tweaks if needed) without introducing new layout blocks.
  - Verify: `node scripts/validate-requested-edits.js --strict`; manual readability on core + niche pages.
  - Proof marker: `SPEC: HERO_NO_GLASS_PANEL_2025_12` in `src/css/components/hero.css` near updated rule.

- Edit 3 — Index button nowrap
  - Change: add `btn-nowrap` class to the “Streamline workflows” anchor in `index.html`; add `.btn-nowrap { white-space: nowrap; }` to `src/css/components/buttons.css`.
  - Minimality: single class addition + single utility rule.
  - Verify: `node scripts/validate-requested-edits.js --strict`; manual narrow-width check.
  - Proof marker: `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12` near the HTML class and/or CSS rule.

- Edit 4 — Section subtitles grey globally
  - Change: update `.section-subtitle` to use `--color-silver-original` in `src/css/base/layout.css`; remove inline `color: var(--color-silver)` from `.section-subtitle` elements across core + niche pages.
  - Minimality: keep token system intact; only touch subtitle color and inline overrides.
  - Verify: `node scripts/validate-requested-edits.js --strict`; spot check core + niche pages.
  - Proof marker: `SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12` in `src/css/base/layout.css` near `.section-subtitle`.

- Edit 5 — Services + niches images fill card (width crop only)
  - Change: add page-scoped rule for `.page-services .service-image .service-img` and `.page-niche .service-image .service-img` to size by height, allow horizontal overflow, and center; remove `max-width: 100%` constraints in those scopes.
  - Minimality: new scoped override to avoid affecting about/other pages; no markup changes required.
  - Verify: `node scripts/validate-requested-edits.js --strict`; manual check on services + 2 niche pages.
  - Proof marker: `SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12` near the new CSS rule.

- Edit 6 — About images copy visible (top-safe)
  - Change: add `.page-about .service-image img` rule to enforce `object-fit: contain` and `object-position: top` (desktop + mobile).
  - Minimality: scoped to about page; preserves contain behavior for other pages.
  - Verify: `node scripts/validate-requested-edits.js --strict`; manual check for top text on about images.
  - Proof marker: `SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12` near the about-specific rule.

## Changelog (what changed)

Format:
- Date — Files changed — Summary — Automated validations run — Manual checks done
 - 2025-12-29 — `src/js/hero-shader.js`, `about.html`, `services.html`, `book.html`, `contact.html`, `src/css/components/hero.css`, `src/css/base/layout.css`, `src/css/components/buttons.css`, `src/css/components/cards.css`, `src/css/pages/services.css`, `src/css/pages/estate-agents.css`, `src/css/pages/about.css`, `index.html`, `niches/*.html` — Applied shader variants + hero panel removal + subtitle color fix + nowrap utility + image fit overrides + about image top-safe rule — `npm run build:css`, `npm run build:js`, `node scripts/validate-core-pages.js`, `node scripts/validate-requested-edits.js --strict`, `bash scripts/codex.requested-edits.sh` — Manual QA pending.

## Final verification summary

Automated:
- `bash scripts/codex.requested-edits.sh` (pass)

Manual QA:
- `codex/MANUAL_QA_CHECKLIST.md` completed (no; manual visual QA pending)

Evidence:
- Edit 1 proof: `src/js/hero-shader.js` theme map + `SPEC: SHADER_COLORS_PER_PAGE_2025_12`; `about.html`/`services.html`/`book.html`/`contact.html` data-variant updates; `node scripts/validate-core-pages.js` pass.
- Edit 2 proof: `.hero.title-band .content` cleanup in `src/css/components/hero.css` + `SPEC: HERO_NO_GLASS_PANEL_2025_12`; `node scripts/validate-requested-edits.js --strict` pass.
- Edit 3 proof: `index.html` `btn-nowrap` + `.btn-nowrap` rule in `src/css/components/buttons.css` with `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12`; validator pass.
- Edit 4 proof: `.section-subtitle` uses `var(--color-silver-original)` in `src/css/base/layout.css` with `SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12`; inline color removed across core + niche HTML; validator pass.
- Edit 5 proof: `.page-services/.page-niche .service-img` fill rule in `src/css/components/cards.css` with `SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12`; services/niche overrides aligned in `src/css/pages/services.css` + `src/css/pages/estate-agents.css`; validator pass.
- Edit 6 proof: `.page-about .service-image img` rule in `src/css/pages/about.css` with `SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12`; validator pass.

Remaining risks / known limitations:
- Manual visual QA still required (see `codex/MANUAL_QA_CHECKLIST.md`).
- `npm run build` fails locally due to missing `sharp` module (setup/build dependency issue).

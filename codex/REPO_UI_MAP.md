<!-- FILE: codex/REPO_UI_MAP.md -->
# Repo UI Map (for Requested Edits 1–6)

This map helps Codex quickly locate the “control points” for the requested UI edits.

## Pages in scope

Core pages:
- `index.html` (`<body class="page-home">`)
- `about.html` (`<body class="page-about">`)
- `services.html` (`<body class="page-services">`)
- `book.html` (`<body class="page-book">`)
- `contact.html` (`<body class="page-contact">`)

Niche pages:
- `niches/*.html` (each uses `<body class="page-… page-niche">`)

---

## 1) Hero shader system (Edit 1)

Where the shader is wired:
- Each page hero contains:
  - `<canvas id="hero-shader-canvas" ...></canvas>`
- Per-page color selection is controlled via:
  - canvas `data-variant` (or its absence for default)

Where themes are defined:
- `src/js/hero-shader.js`
  - Theme map/object literal near top (expects keys like default/blue/green/pink/orange)
  - The shader reads `canvas.dataset.variant || "default"`

Core page current wiring (must be updated for Edit 1):
- `index.html`: keep blue (scope guard against accidental change)
- `about.html`: should be purple => default theme (no variant or "default")
- `services.html`: should be green
- `book.html`: should be neon pink (new theme key)
- `contact.html`: should be fire orange (new theme key)

Niche pages:
- `niches/*.html` should stay default/purple (no data-variant)

Validators:
- `node scripts/validate-core-pages.js`

---

## 2) Hero legibility / glass panel removal (Edit 2)

The glass container is implemented in:
- `src/css/components/hero.css`
  - Selector: `.hero.title-band .content`
  - Mobile tweak repeats `.hero.title-band .content` in the `@media (max-width: 768px)` block
  - Currently includes background + blur/backdrop-filter + border + shadow

Edit 2 requires removing the panel and relying on:
- typography tweaks
- text-shadow
- layout (max-width/spacing)
…without adding a new translucent panel.

Validator:
- `node scripts/validate-requested-edits.js --strict`

---

## 3) Index "Streamline workflows" button nowrap (Edit 3)

Where the button is:
- `index.html`
  - Services tiles section
  - Anchor text: “Streamline workflows”

Recommended deterministic mechanism:
- Add `btn-nowrap` class on that anchor only
- Add `.btn-nowrap { white-space: nowrap; }` in:
  - `src/css/components/buttons.css`

Validator:
- `node scripts/validate-requested-edits.js --strict`

---

## 4) Section subtitles are white due to variable overrides (Edit 4)

Global subtitle selector:
- `.section-subtitle`

Defined in:
- `src/css/base/layout.css`
  - `.section-subtitle { color: var(--color-silver); ... }`

Why they appear white:
- Same file sets `--color-silver: var(--color-white)` for many pages/sections
- Many pages also include inline styles like `color: var(--color-silver)` on `.section-subtitle`

Edit 4 requires:
- Make `.section-subtitle` always resolve to grey (recommended: `--color-silver-original`)
- Remove/replace inline subtitle colors that reference `--color-silver` or white

Validator:
- `node scripts/validate-requested-edits.js --strict`

---

## 5) Services + niche service-row images (Edit 5)

Structure:
- Services and niches use `.service-row` with:
  - `.service-image.neon-card` wrapping `<img class="service-img">` (services) or plain `<img>` (some niches)

Current image fit rules live in:
- `src/css/components/cards.css`
  - `.service-image img` currently uses `object-fit: contain` (causes letterboxing)
- `src/css/pages/services.css`
  - Overrides for `.page-services .service-row .service-image img, .service-img` currently use `object-fit: contain`
- `src/css/pages/estate-agents.css`
  - Niche-specific overrides set `.page-niche .service-image.neon-card img` to `width: 100%`, `height: auto`

Edit 5 requires:
- image fills the card area
- crop width only (left/right) by allowing horizontal overflow
- do not crop height
- recommended to target `.service-img` within `.page-services` and `.page-niche`

Validator:
- `node scripts/validate-requested-edits.js --strict`
Manual QA required.

---

## 6) About images copy must stay visible (Edit 6)

About uses `.service-image.neon-card` but images often DO NOT use `.service-img`.
- About images should remain non-cropping.
- About mobile image rules already exist in:
  - `src/css/pages/about.css`
  - Desktop uses base `.service-image img` rules from `src/css/components/cards.css`

Edit 6 requires:
- `object-fit: contain` (no crop)
- explicit top-safe positioning recommended (object-position top)

Validator:
- `node scripts/validate-requested-edits.js --strict`
Manual QA required.

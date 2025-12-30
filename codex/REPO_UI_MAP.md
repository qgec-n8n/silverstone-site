<!-- FILE: codex/REPO_UI_MAP.md -->
# Repo UI Map (Discovery Artifact)

This file exists to prevent “lost in the repo” mistakes. Update it during Milestone 1 discovery.

## Page inventory (in scope)

Root pages:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`

Niche pages:
- `niches/*.html` (dentists, ecommerce, estate agents, fitness coaches, gyms, hospitality, physios, salons, trades)

## Build pipeline map

CSS:
- Source: `src/css/**`
- Main hero styles: `src/css/components/hero.css`
- Section title/subtitle styles and the page-level silver/white overrides: `src/css/base/layout.css`
- Bundled output: `assets/css/styles.css`
- Build: `npm run build:css` (runs `build-css.js`)

JS:
- Source: `src/js/**`
- Hero shader: `src/js/hero-shader.js`
- Bundled output: `assets/js/app.js`
- Build: `npm run build:js` (runs `scripts/build-js.js`)

## Requested Edits mapping (pre-filled pointers; verify and expand)

### Edit 1 — Hero shader colors per page
- Shader code: `src/js/hero-shader.js`
  - Theme map uses a “variant key” read from `#hero-shader-canvas` `data-variant`.
- Per-page hook:
  - Each page’s hero includes:
    - `<canvas id="hero-shader-canvas" ...>`
  - Main pages currently set `data-variant` explicitly (verify desired final values per spec).
- Rebuild required:
  - Any shader change in `src/js/hero-shader.js` must be rebuilt into `assets/js/app.js`.

### Edit 2 — Remove hero glass/blur container
- Hero content panel is controlled by:
  - `src/css/components/hero.css` selector targeting the hero `.content` wrapper.
- “Glass” effect is created by:
  - translucent background
  - border + box-shadow
  - backdrop blur
- Rebuild required:
  - CSS changes must be rebuilt into `assets/css/styles.css`.

### Edit 3 — Hero copy/CTA placement (no midline obstruction)
- Base hero layout is controlled in:
  - `src/css/components/hero.css`
- Desktop positioning and mobile overrides both live there.
- Goal:
  - Move hero content away from the midline region without adding a glass panel back.

### Edit 4 — Index “Streamline Workflows” button one line
- Location in HTML:
  - `index.html` contains a “Streamline workflows” button in the “service tiles” area.
- Supporting CSS:
  - `src/css/pages/home.css` contains `.service-tile__actions .btn` width constraints (this is a likely cause of wrapping).
- Strategy:
  - Add a dedicated class to only that one button and give it nowrap + balanced padding/width.

### Edit 5 — Qualifying section subtitles grey across all pages incl. niches
- The subtitle class is:
  - `.section-subtitle` in `src/css/base/layout.css`
- Current behavior:
  - `.section-subtitle` uses a silver token, but some page-level rules override that token to white for body sections.
- Strategy:
  - Apply a narrowly-scoped rule that targets only the “subtitle under blue title” pattern and sets color to a stable grey token not affected by the override (or remove the override if safe and truly intended).

### Edit 6 — About images cover-fill
- Images in `about.html`:
  - `assets/images/zip/Silverstone_28.jpg`
  - `assets/images/zip/Silverstone_22.jpg`
- Container:
  - Both live inside `.service-image.neon-card` wrappers, which use absolute-positioned images.
- Current image fit:
  - The shared `.service-image img` pattern uses contain in multiple places.
- Strategy:
  - Apply a class hook to only these two images and override to cover+center.

### Edit 7 — Services images cover-fill
- Images in `services.html`:
  - `assets/images/socialmedia/General_Services_1.jpeg`
  - `assets/images/socialmedia/General_Services_2A.jpeg`
  - `assets/images/socialmedia/General_Services_2B.jpeg`
  - `assets/images/socialmedia/General_Services_3.jpeg`
- They appear as `img.service-img` inside `picture` elements.
- Services page CSS contains multiple contain rules (some with `!important`) in `src/css/pages/services.css`.
- Strategy:
  - Apply `img-cover-center` to only these images and ensure the services CSS overrides force cover+center for that class.

## Notes / pitfalls to watch

- This repo requires rebuilding `assets/css/styles.css` and `assets/js/app.js` after changes in `src/`.
- Services page has several `!important` rules; your cover-fill override may also need to be explicit and narrowly scoped.
- Do not touch pricing-widget code for this task.

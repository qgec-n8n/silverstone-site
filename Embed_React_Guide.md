# React-in-Static-Site Embedding Forensics Report (silverstone-site-main)

## 1. Executive summary

* **This repo is a static multi-page site** (plain `.html` files) that ships **one global CSS bundle** and **one global JS bundle**: `assets/css/styles.css` and `assets/js/app.js`. Evidence: `package.json`, `build-css.js`, `scripts/build-js.js`, and the `<link>/<script>` tags in pages like `index.html`.
* **There is no React app/tooling in this ZIP.** No `react`/`react-dom` deps, no CRA/Vite/webpack config, no `.jsx/.tsx` sources, and no multi-script “chunk” includes on the HTML pages.
* The “hero shader animation” in this repo is **implemented as vanilla JS**, not React: it initializes by querying `#hero-shader-canvas`, reads config via `data-variant`, runs on DOMContentLoaded, and cleans up on unload. Evidence: `src/js/hero-shader.js` + `<canvas id="hero-shader-canvas" ...>` in pages.
* **The hero shader still demonstrates the same embedding primitives you’d use for a React widget**:

  * a dedicated container element (`#hero-shader-canvas`)
  * config passed via `data-*` attributes (`data-variant`)
  * predictable init timing (DOMContentLoaded)
  * lifecycle cleanup (`beforeunload`)
* The Medium article’s embedding technique is **CRA build → copy build output JS chunks → include them as `<script>` tags in the host page**, with a unique mount `<div>` id and `"homepage": "."` for relative asset paths. ([Better Programming][1])
* **The repo’s actual build pipeline does not match the article’s CRA/chunk-copy approach**. It uses **simple concatenation** of `src/js/*.js` into one `assets/js/app.js` and similarly for CSS.
* To embed a new React “pricing section” into this site with minimal risk, the safest pattern is: **treat React as a widget**:

  * build **separate** static widget assets (JS + CSS) that do not touch the existing bundle
  * include them per-page (like other assets)
  * mount into a dedicated container in the pricing section
  * keep CSS scoped to the widget root to avoid collisions
* For implementation, prefer a modern bundler (e.g. Vite) because React’s own docs recommend setting up a modular JS environment and suggest Vite if you don’t already have one. ([React][2])
* Biggest practical risk in this repo’s current deployment model: **stable (non-hashed) filenames** (`styles.css`, `app.js`) mean you need to think about browser/CDN caching when you add a new widget with stable names.

---

## 2. Embedding architecture overview

This is the “widget embedding” architecture you want for pricing (and any future React section):

```
Host HTML page
  ├─ <link rel="stylesheet" href=".../assets/css/styles.css">        (site CSS)
  ├─ <section id="pricing">
  │     └─ <div class="ss-pricing" data-ss-pricing-page="..."></div> (mount container)
  ├─ <link rel="stylesheet" href=".../assets/css/pricing-widget.css">(widget CSS, scoped)
  ├─ <script src=".../assets/js/app.js"></script>                   (site JS)
  └─ <script src=".../assets/js/pricing-widget.js"></script>        (widget JS)
          └─ window.SilverstonePricingWidget.mount(...)
                 └─ React createRoot(container).render(<Pricing .../>)
                        ├─ reads data-* / config
                        ├─ attaches listeners (resize, observers)
                        └─ provides unmount cleanup
```

Lifecycle (recommended):

* **mount**: on DOMContentLoaded (or immediate if already loaded), find containers and mount.
* **update** (optional): if host changes attributes/config dynamically.
* **unmount**: on explicit call, or `beforeunload`, or when container removed.

Styling isolation:

* Keep widget CSS **scoped under the mount root** (e.g. `.ss-pricing ...`) OR use CSS Modules / prefixed Tailwind, so it won’t affect the rest of the static site.

---

## 3. How embedding works in THIS repo (evidence-based)

### Repo reality check: where is the React embed?

**I could not find any React embed implementation in this ZIP.** Concretely:

* `package.json` has no `react` or `react-dom` dependencies (only `prettier` and `sharp` under `devDependencies`).
* Only one `package.json` exists in the repo (no nested React project).
* No `.jsx`, `.tsx`, or TS files exist.
* HTML pages include only one JS file (`assets/js/app.js`) and do not include any CRA-style hashed chunks.

**Plausible interpretations (and how to confirm):**

1. **React widget was built elsewhere and its build artifacts weren’t included in this ZIP.**
   Confirm by checking the original repo history/branches or CI artifacts, or looking for missing `assets/js/<widget>.js` + `assets/css/<widget>.css` in the deployed site.

2. **React widget is loaded from an external CDN at runtime (not committed).**
   Confirm by checking the deployed site HTML for `<script src="https://...">` tags or dynamic script injection in JS (search for `createElement('script')` with external URLs).

3. **The hero shader is not React (it’s vanilla), and the embedding technique was conceptual rather than literally React in this repo.**
   Confirm by checking `src/js/hero-shader.js` and the built `assets/js/app.js`—they contain WebGL code, not React calls.

What *is* present is a clean example of “embedded widget” mechanics using vanilla JS (hero shader), which is the same shape you’ll replicate for a React pricing widget.

---

### Build system & outputs

**Build entrypoint:** `package.json`

```json
// package.json
"scripts": {
  "build:css": "node build-css.js",
  "build:js": "node scripts/build-js.js",
  "build": "node scripts/optimize-images.js && npm run build:css && npm run build:js"
}
```

**CSS build:** `build-css.js` concatenates modular CSS from `src/css/**` into a single output file:

```js
// build-css.js
const outDir = path.join(projectRoot, 'assets', 'css');
const outFile = path.join(outDir, 'styles.css');
// ...
fs.writeFileSync(outFile, combined, 'utf8');
```

**JS build:** `scripts/build-js.js` concatenates multiple JS files from `src/js/` into one output file:

```js
// scripts/build-js.js
const outDir = path.join(projectRoot, 'assets', 'js');
const outFile = path.join(outDir, 'app.js');

const jsOrder = [
  'header-nav.js',
  'scroll-reveal.js',
  'stats.js',
  'parallax.js',
  'hero-shader.js',
  // ...
  'app.js'
];
```

**Key point:** There is **no module bundler** (webpack/vite/rollup) in use for production JS in this repo. It is a concatenation pipeline.

---

### How bundles/assets are included in the static site

Example root page (`index.html`):

```html
<link rel="stylesheet" href="assets/css/styles.css" />
<!-- ... -->
<script src="assets/js/app.js"></script>
```

Example nested page (`niches/dentists.html`) shows the same assets but via `../` relative paths:

```html
<link rel="stylesheet" href="../assets/css/styles.css">
<!-- ... -->
<script src="../assets/js/app.js"></script>
```

**Implication for your React pricing widget:** if it’s embedded across both root pages and `/niches/*`, you either:

* add **two different relative paths** per page (`assets/...` vs `../assets/...`), *or*
* switch to **root-relative** (`/assets/...`) for the widget assets (but this would differ from current style).

---

### Mount/unmount API & initialization timing

There is no React mount API in this repo, but the hero shader shows the site’s “embedded widget” pattern.

**Container selection + config injection:**

```js
// src/js/hero-shader.js
const canvas = document.getElementById('hero-shader-canvas');
if (!canvas) return;

const variant = canvas.dataset.variant || 'default';
```

**Init timing (DOMContentLoaded):**

```js
// src/js/hero-shader.js
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroShader);
} else {
  initHeroShader();
}
```

**Lifecycle cleanup:**

```js
// src/js/hero-shader.js
window.addEventListener('resize', resizeCanvas);
// ...
window.addEventListener('beforeunload', function handleBeforeUnload() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
```

**Host markup provides the container and data attributes.** For example `about.html`:

```html
<canvas id="hero-shader-canvas" data-variant="green"></canvas>
```

**Takeaway for React pricing:** emulate this exact shape:

* dedicated mount element (`<div class="ss-pricing" ...>`)
* config via `data-*`
* safe init (don’t crash if missing)
* idempotent mount/unmount

---

### CSS strategy & collision risks

The site CSS is **global** and bundled in `assets/css/styles.css`. Example of global hero canvas styling:

```css
/* assets/css/styles.css */
#hero-shader-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
```

There is no isolation mechanism like CSS Modules, Shadow DOM, or namespaced CSS.
**Risk for React pricing:** if you ship widget CSS that contains broad selectors (`button`, `h2`, `*`, Tailwind preflight, etc.), you can easily break the host site styling.

---

### Data/config passing mechanism

The existing widget-like code uses `data-*` on the mount element. Example: `data-variant` on the hero canvas, read via `canvas.dataset.variant`.

For the pricing widget, there are also repository steering docs that explicitly recommend `data-ss-pricing-page` (see `AGENTS.md` / `ExecPlan.md`), but those docs describe a *planned* React integration, not an existing one.

---

### Deployment/caching implications

What’s observable in this repo:

* **Stable filenames** for primary assets: `assets/css/styles.css` and `assets/js/app.js`.
* `netlify.toml` sets `publish = "."` (site root). No custom caching headers are configured in this repo.

```toml
# netlify.toml
[build]
  publish = "."
```

**Implication:** without filename hashing or explicit headers, asset caching behavior depends on the hosting defaults. If you add `assets/js/pricing-widget.js` with a stable name, browsers/CDNs may serve stale copies after a deploy unless you handle cache invalidation.

---

## 4. Medium article: what method it teaches (with citations)

The BetterProgramming/Medium article describes a CRA-based widget-embedding approach:

* **Create a React app using create-react-app** (CRA) and develop your widget normally. ([Better Programming][1])
* **Step 1: make the React app mount to a unique DOM node** by changing the target div id to something unique (example “javascriptExample”). ([Better Programming][1])
* **Step 2: set CRA’s `homepage` to `"."`** so the build can be served from “wherever your website lives” (i.e., use relative asset paths). The article also notes routing changes this. ([Better Programming][1])
* **Step 3: run `yarn build`, then extract/copy the Webpack build output JS files** needed to run the app. It calls out three files:

  * a “libraries” chunk: `build/static/js/2.<hash>.chunk.js`
  * your app chunk: `build/static/js/main.<hash>.chunk.js`
  * the runtime loader: `build/static/js/runtime-main.<hash>.js` ([Better Programming][1])
* **Step 4: include those static assets in the host website’s HTML and mount to the chosen `<div>`**, with the important warning that **script order matters**. ([Better Programming][1])

Minimal steps (as taught by the article):

1. Create CRA app
2. Change mount id
3. Set `homepage="."`
4. `yarn build`
5. Copy the three JS build files into a folder you’ll host on the static site
6. Add `<script>` tags (in the right order) + the mount `<div>` to the host HTML ([Better Programming][1])

Common pitfalls implied by the article:

* **Wrong `homepage`/base path** → broken asset loading (especially on nested routes). ([Better Programming][1])
* **Wrong script order** → runtime can’t find chunks / app fails. ([Better Programming][1])
* **Client-side routing** adds complexity vs a simple widget. ([Better Programming][1])

---

## 5. Article → Repo mapping table

| Article step                                      | Repo implementation                                             | Evidence (path + excerpt anchor)                                                                                                  | Risk/notes                                                                                                   |
| ------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1) Create widget with CRA                         | **Not present** (no CRA/Vite project, no React deps)            | `package.json` shows only `prettier` + `sharp` in `devDependencies`                                                               | Either React embed isn’t in this ZIP, or it was never React in this repo.                                    |
| 2) Mount to unique `<div id="...">`               | Same concept exists, but via **canvas id** for shader           | `src/js/hero-shader.js`: `document.getElementById('hero-shader-canvas')` and `about.html`: `<canvas id="hero-shader-canvas" ...>` | This is the right pattern for a React widget too (dedicated mount node).                                     |
| 3) Set CRA `homepage="."` for relative assets     | Site uses **relative asset paths** in HTML                      | `index.html`: `assets/css/styles.css`, `assets/js/app.js`; `niches/dentists.html`: `../assets/...`                                | For a widget used across nested pages, base/paths matter a lot.                                              |
| 4) `yarn build` and copy 3 CRA JS files           | Repo does **concatenation** into 1 JS file (`assets/js/app.js`) | `scripts/build-js.js`: `outFile = .../assets/js/app.js` and `jsOrder` list                                                        | This is **not** CRA chunk-copy; it’s a single bundle via concatenation (no JSX support).                     |
| 5) Include widget JS files in host HTML (ordered) | Host includes **one** script: `assets/js/app.js`                | `index.html`: `<script src="assets/js/app.js"></script>`                                                                          | If you add CRA output, you’ll likely add multiple `<script>` tags; ensure they don’t block page or conflict. |
| 6) Widget auto-mounts when scripts load           | Hero shader auto-inits on DOMContentLoaded                      | `src/js/hero-shader.js`: DOMContentLoaded guard + `initHeroShader()`                                                              | Good model: your React widget can auto-mount similarly (or expose `mount()` API).                            |

---

## 6. Replication guide (copy/paste-friendly)

This is the “hand to Codex” recipe to embed a new React pricing widget into this exact repo style (static pages + stable asset includes), with minimal blast radius.

### Recommended approach for THIS repo: “React widget as static assets” (Vite build, stable filenames)

#### 1) Folder layout (isolated)

Create a dedicated widget project inside the repo:

```
/pricing-widget/                 # new (isolated React build)
/pricing-widget/package.json
/pricing-widget/vite.config.ts
/pricing-widget/src/embed.tsx    # entrypoint that exposes mount/unmount
/assets/js/pricing-widget.js     # build output (stable filename)
/assets/css/pricing-widget.css   # build output (stable filename)
```

Keep it isolated so `assets/js/app.js` and `build-js.js` remain untouched.

#### 2) Build output format: single JS + single CSS (stable names)

**Goal:** produce exactly:

* `assets/js/pricing-widget.js`
* `assets/css/pricing-widget.css`

If you use Vite, configure library mode + deterministic filenames (pseudo-config you can hand to Codex):

```ts
// pricing-widget/vite.config.ts (illustrative)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/embed.tsx',
      name: 'SilverstonePricingWidget',
      formats: ['iife'],               // easiest drop-in for static sites
      fileName: () => 'pricing-widget.js',
    },
    rollupOptions: {
      output: {
        // force deterministic names for CSS and assets
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'pricing-widget.css';
          return assetInfo.name ?? 'asset';
        },
      },
    },
    outDir: '../assets/js',            // or build to temp then copy
    emptyOutDir: false,
  },
});
```

Notes:

* This keeps your widget **drop-in** (script tag, no module loader needed).
* You can output CSS to `assets/css/` instead of `assets/js/` (via copy step).

React’s docs recommend setting up a modular JS environment and explicitly mention Vite if you don’t already have compilation tooling. ([React][2])

#### 3) Expose a clean mount/unmount API (and optionally auto-mount)

In `pricing-widget/src/embed.tsx`, structure it like a widget library:

```tsx
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import './pricing-widget.css';
import { Pricing } from './Pricing';

const roots = new WeakMap<Element, Root>();

export function mount(el: Element, options?: { pageKey?: string }) {
  if (roots.has(el)) return; // idempotent
  const pageKey = options?.pageKey ?? (el as HTMLElement).dataset.ssPricingPage ?? '';
  const root = createRoot(el);
  roots.set(el, root);
  root.render(<Pricing pageKey={pageKey} />);
}

export function unmount(el: Element) {
  const root = roots.get(el);
  if (!root) return;
  root.unmount();
  roots.delete(el);
}

// Optional: auto-mount all containers
function autoMount() {
  document.querySelectorAll('.ss-pricing').forEach((el) => mount(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoMount);
} else {
  autoMount();
}

// Optional: expose global API for debugging/manual control
(window as any).SilverstonePricingWidget = { mount, unmount };
```

This mirrors the repo’s existing “embedded widget” behavior (safe init + auto-run) as seen in `src/js/hero-shader.js`.

React’s official docs also describe the general approach: add a unique id in HTML and render a React component into it via `createRoot`. ([React][2])

#### 4) Host HTML snippet (container + asset includes)

On each target page, add a dedicated mount element inside the pricing section:

```html
<section id="pricing">
  <div class="ss-pricing" data-ss-pricing-page="services.html"></div>
</section>
```

Include the widget CSS + JS **in addition to** existing site assets.

For root-level pages (like `services.html`):

```html
<link rel="stylesheet" href="assets/css/pricing-widget.css">
<!-- existing -->
<script src="assets/js/app.js"></script>
<script src="assets/js/pricing-widget.js"></script>
```

For nested pages (like `niches/dentists.html`), match the repo’s relative style:

```html
<link rel="stylesheet" href="../assets/css/pricing-widget.css">
<!-- existing -->
<script src="../assets/js/app.js"></script>
<script src="../assets/js/pricing-widget.js"></script>
```

#### 5) CSS isolation recommendations (don’t break the static site)

Minimum viable rule: **scope everything under the widget root**:

```css
/* pricing-widget.css */
.ss-pricing { /* widget container styles */ }
.ss-pricing .card { /* ... */ }
/* Avoid global tags selectors like button {}, h2 {}, * {} */
```

If you use Tailwind:

* disable preflight resets (they can restyle the whole page),
* use a prefix for utility classes, and/or
* render inside a scoped container and ensure Tailwind output only targets that container.

#### 6) Data/config injection pattern

Prefer `data-*` attributes on the mount element (mirrors hero shader approach):

```html
<div class="ss-pricing"
     data-ss-pricing-page="niches/dentists.html"
     data-ss-pricing-variant="dark">
</div>
```

Inside the widget, read via `el.dataset.ssPricingPage`.

This keeps the host site “dumb” (just markup), and keeps the widget portable.

#### 7) Local dev & production deployment notes

* **Local dev:** you must serve the static HTML pages from a local web server (not `file://`) if your widget loads assets via relative URLs.
* **Production:** if you keep stable filenames (`pricing-widget.js/css`), plan for caching:

  * simplest: set `Cache-Control: no-cache` (or low TTL) for these widget files
  * better: use content-hashed filenames + update HTML or load via a manifest (more work, but robust)

---

### Alternative approach: follow the Medium article exactly (CRA chunk-copy approach)

If you want to replicate the Medium article 1:1, the flow is:

1. Create CRA app (`yarn create react-app ...`) ([Better Programming][1])
2. Change React entrypoint mount id to a unique `<div id="...">` ([Better Programming][1])
3. Add `"homepage": "."` in CRA `package.json` ([Better Programming][1])
4. `yarn build` ([Better Programming][1])
5. Copy the 3 required JS files out of `build/static/js/` into a folder in this static site ([Better Programming][1])
6. Include those JS files in the host HTML in the correct order (article warns order matters) ([Better Programming][1])

**Practical caveat for this repo:** CRA’s filenames are hashed, so you either:

* rename them to stable names during copy (recommended if you want deterministic HTML), or
* update every HTML page on each build (high risk / annoying).

---

## 7. “Make it solid & maintainable” checklist

Use this as a go/no-go checklist for a pricing widget embed (and future React sections):

### Correctness & lifecycle

* [ ] Widget JS is safe if container is missing (no uncaught errors).
* [ ] Mount is idempotent (won’t double-render if script is included twice).
* [ ] Unmount exists (even if only used for tests / future SPA embedding).
* [ ] Handles `prefers-reduced-motion` if you add motion/heavy effects (mirrors hero shader’s behavior).

### Multiple pages / multiple instances

* [ ] Widget can mount on multiple pages with different copy/config via `data-*`.
* [ ] If future needs multiple widgets on one page, you can mount multiple containers (querySelectorAll).

### Responsiveness

* [ ] Widget layout adapts to parent width (don’t assume fullscreen).
* [ ] Avoid absolute positioning that could overlap site sections.

### CSS conflicts

* [ ] No global resets or tag selectors escaping the widget root.
* [ ] All widget styles are scoped to `.ss-pricing` (or CSS Modules).
* [ ] Widget z-indexes don’t unexpectedly overlay nav/hero.

### Asset pathing

* [ ] Works both at root (`assets/...`) and nested pages (`../assets/...`) OR uses `/assets/...` consistently.
* [ ] Any widget images/fonts resolve correctly after deploy.

### Caching/versioning

* [ ] You have a deliberate plan for cache invalidation:

  * stable filenames + no-cache headers, OR
  * hashed filenames + manifest / HTML update step.

### Graceful failure

* [ ] If `pricing-widget.js` fails to load, the page still renders (static HTML remains usable).
* [ ] If widget throws at runtime, it fails inside the widget container only (error boundary).

### Performance

* [ ] Consider lazy-mount (IntersectionObserver) if widget is below the fold.
* [ ] Don’t block first paint: avoid huge synchronous work at load.

---

## 8. Risks & recommended improvements (grounded in findings)

### High priority

1. **React embedding example is not present in this ZIP**
   If you expected to learn from a concrete React embed, you currently can’t—because the repo ships only vanilla JS in `assets/js/app.js` and has no React toolchain.
   *Recommendation:* treat the hero shader as the “widget embedding example,” and introduce a new isolated widget build for pricing (don’t try to force React into the concatenated `app.js` pipeline).

2. **Caching risk due to stable asset filenames**
   The repo uses stable names (`assets/js/app.js`, `assets/css/styles.css`) and does not define caching headers in-repo. Adding `assets/js/pricing-widget.js` with a stable name can produce stale client caches after deploy.
   *Recommendation:* either add cache headers (Netlify `_headers`) for widget assets or adopt hashed filenames + manifest loader.

### Medium priority

3. **Relative path complexity across nested pages**
   The site uses `assets/...` on root pages and `../assets/...` under `/niches`. That means every new widget include must get the path right per page.
   *Recommendation:* either standardize to root-relative `/assets/...` for *new* widget assets, or add a tiny validation script that asserts correct paths exist per page.

4. **CSS collision risk**
   The site is global-CSS-based. A widget that ships broad CSS (or Tailwind preflight) can regress unrelated pages.
   *Recommendation:* enforce a “scoped-only CSS” rule for widgets (everything under `.ss-pricing`), and add a simple lint/grep check for forbidden selectors.

---

If you want, I can also add a short “verification probes” section (commands + what to inspect) tailored for Codex, but the core embedding pattern + repo truth is above.

[1]: https://betterprogramming.pub/how-to-embed-a-react-application-on-any-website-1bee1d15617f "How to Embed a React Application in Any Website | by Jeremiah Tabb | Better Programming"
[2]: https://react.dev/learn/add-react-to-an-existing-project "Add React to an Existing Project – React"

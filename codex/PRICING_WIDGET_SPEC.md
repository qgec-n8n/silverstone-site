<!-- FILE: codex/PRICING_WIDGET_SPEC.md -->
# Pricing widget spec (React embed into static HTML)

This spec defines the required architecture and UI contract for the pricing integration.

---

## 0) Terminology
- **Target pages**: `services.html` and every file under `/niches/` (currently 9 niche pages).
- **Mount**: the single DOM element per target page where React renders pricing.
- **Widget assets**: the built, static JS + CSS files included by the target pages.

---

## 1) Mount contract (HTML)

### 1.1 Mount element (required)
On each target page, inside `<section id="pricing">`, add exactly one mount element:

- Tag: `div`
- Required class: `ss-pricing`
- Required attribute: `data-ss-pricing-page="<pageId>"`

`<pageId>` must match the canonical key from `PRICING_COPY_MAP.md` headings
(see `codex/PRICING_COPY_MAP_SPEC.md`).

Examples:
- `data-ss-pricing-page="services.html"`
- `data-ss-pricing-page="niches/dentists.html"`

### 1.2 Where to put the mount (required)
Replace the current placeholder pricing block (the `.neon-card` that contains the placeholder paragraph)
with the mount element.

Constraints:
- Keep `<section id="pricing">` in place (do not rename or remove the anchor id).
- Do not move or change the hero section.

---

## 2) Asset contract (static site embedding)

### 2.1 Stable output filenames (required)
The pricing widget build must output:
- `assets/css/pricing-widget.css`
- `assets/js/pricing-widget.js`

No hashes in filenames.

### 2.2 Include tags (required)
Each target page must include:
- A stylesheet link to `assets/css/pricing-widget.css`
- A script tag for `assets/js/pricing-widget.js`

Placement rules:
- CSS link: in `<head>` after the main site stylesheet(s)
- JS script: near the end of `<body>` (adjacent to existing `assets/js/app.js` include)

### 2.3 Initialization timing (required)
The widget must mount after the mount element exists.
Acceptable approaches:
- Place the script tag at the end of `<body>` (recommended, matches existing site pattern)
- Or use `defer` on the script tag

---

## 3) Tooling requirements (React + TS + Tailwind)

The current repo is not a React app. The pricing widget must be introduced as a small, isolated build target.

### 3.1 Required runtime dependencies
The widget build must include:
- React 18 + ReactDOM
- TypeScript (build-time)
- Tailwind CSS (build-time; scoped)
- Packages used by the baseline component:
  - `motion`
  - `framer-motion`
  - `@number-flow/react`
  - `@tsparticles/react`
  - `@tsparticles/slim`

### 3.2 shadcn-like structure (required)
The widget source must include a `/components/ui` folder (shadcn convention) because the baseline imports assume it.

Minimum required UI components:
- `components/ui/card` (use the provided shadcn card implementation)
- `components/ui/sparkles` (use the provided sparkles implementation)
- `components/ui/vertical-cut-reveal` (use the provided implementation)
- `components/ui/timeline-animation` (must exist and match the baseline component API)

Also required:
- `lib/utils` that exports `cn(...)`

### 3.3 Build approach (required properties)
You may choose the bundler, but it MUST:
- Bundle TSX → a single `assets/js/pricing-widget.js` output
- Produce stable filenames
- Not require a framework
- Not rewrite the existing site build system

Recommended (lowest risk): esbuild-based bundling.

---

## 4) Styling isolation (no regressions)

The baseline pricing component is Tailwind-based. The host site must not be affected.

### 4.1 Required CSS scoping
Compile Tailwind so utility selectors apply only under `.ss-pricing`.

Implementation requirement:
- The final CSS file must not include global resets affecting host elements outside `.ss-pricing`.

### 4.2 Allowed global CSS side-effects
- CSS variables (e.g., theme variables) are acceptable if they do not alter existing host styles.
- Avoid global element selectors (`button`, `ul`, `h1`, etc.) outside `.ss-pricing`.

---

## 5) React runtime behavior

`assets/js/pricing-widget.js` must:
- Find all elements matching `.ss-pricing`
- For each mount:
  - Read `data-ss-pricing-page`
  - Lookup page copy from the generated copy module
  - Render the widget into the mount

No-mount behavior:
- If no mounts exist on a page: no-op (no console errors)

Unknown-page behavior:
- If a mount has an unknown `data-ss-pricing-page`, render a small non-breaking message in the mount and log a single console warning (do not throw).

---

## 6) UI requirements (must match baseline look)

### 6.1 Baseline component (non-negotiable)
The UI must be based on `pricing_code.tsx`.
Preserve structure, layout, classes, and effects.

### 6.2 Two-row layout (required)
Each target page renders:
- Row 1: heading + subtitle + toggle + 3 plan cards
- Visible break (spacing/divider)
- Row 2: heading + subtitle (no toggle) + 3 summary cards

Total cards per page: **6** (2 rows × 3 cards).

### 6.3 Row 1 toggle behavior (required)
- Toggle exists and must look identical to baseline switch.
- Labels:
  - left: `Monthly`
  - right: `Setup` (replaces baseline `Yearly`)
- When `Monthly` is active:
  - each plan card price displays that plan’s `monthlyRetainer` value
  - suffix shows `/month`
- When `Setup` is active:
  - each plan card price displays that plan’s `setupFee` value
  - suffix shows `/setup`

### 6.4 Row 1 card mapping (required)
For each plan:
- Card title: plan `name`
- Price: per toggle state
- Description text: plan `bestFor` (prefixed with `Best for:`)
- “What’s included” label + bullet list: plan `includes`
- Badge: if `badge` exists, render it using the existing “popular” styling pattern (no new design language)

### 6.5 Row 2 card mapping (required)
For each Row 2 card:
- Card title: card `label`
- Description: card `oneLiner`
- “Plans included” label + content: `plansIncluded[]`

Row 2 must NOT show the monthly/setup toggle.

### 6.6 Row 2 light restyling rules (allowed)
Row 2 content can be longer than Row 1.

Allowed adjustments (choose the minimum needed):
- Smaller text sizes for the plans list (only the list)
- A scrollable region for the plans list if needed (no truncation)
- Category-label formatting:
  - if a list item begins with `**` and contains `:**`, emphasize only the label portion

Not allowed:
- Collapsing/truncation that hides copy
- Changing card background gradients or the overall black/sparkles background treatment
- Introducing new interactive controls

---

## 7) Required DOM markers (for validation & future automation)
Add these attributes to the rendered output:
- Row 1 wrapper: `data-ss-pricing-row="1"`
- Row 2 wrapper: `data-ss-pricing-row="2"`
- Toggle wrapper: `data-ss-pricing-toggle="true"` (Row 1 only)

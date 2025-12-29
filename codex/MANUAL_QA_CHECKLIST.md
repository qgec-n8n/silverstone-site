<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist (Requested Edits 1–12)

Complete this checklist before considering the work finished.

## Setup

1. Start a local server from repo root:
   - Run: `bash scripts/serve.sh`
2. Open in Chrome:
   - Desktop check: 1440×900
   - Mobile emulation checks:
     - 390×844 (typical modern iPhone)
     - 375×667 (smaller iPhone)

Pages to open:
- `index.html`
- `services.html`
- `about.html`
- `book.html`
- `contact.html`
- At least 2 niche pages (e.g., `niches/dentists.html`, `niches/ecommerce.html`)

## 1) Pricing widget light background vibrancy

On pages with pricing:
- Confirm the “white” pricing background has visible pink/blue tint (noticeably more than before).
- Confirm it still reads as a premium white/light mode, not overly saturated.
- Confirm pricing card text contrast remains strong.

## 2) Services page images neon border parity

Open:
- `services.html`
- a representative niche page (any `niches/*.html`)

For each services image next to cards:
- Border wraps tightly (no extra inner padding).
- Image is fully visible (not cropped).
- Matches the niche look (border, radius, spacing).

## 3) Section subtitle color (white → grey)

On each page listed above:
- Under blue section headings, the subtitle sentence is grey (clearly not white).
- Confirm this change does not affect card text inside neon cards.

## 4) Hero subtitle non-white

On each page with a shader hero:
- The subtitle directly under the hero title is not pure white.

## 5) Hero shader legibility (premium)

On desktop and mobile:
- Hero title and subtitle are readable instantly (no squinting).
- Shader animation is still clearly visible and visually present (not “washed out” by a heavy overlay).
- The readability solution looks intentional/premium (e.g., subtle glass panel, refined shadowing).

## 6) Hero CTA spacing

Pages with hero CTAs (at least index, services, and a niche page):
- Buttons never touch when stacked vertically.
- Buttons never touch when wrapped horizontally.
- Check narrow widths where they wrap.

## 7) Images next to cards quality & fit

On `about.html`, `services.html`, and niche pages:
- Images are crisp (no obvious pixelation).
- Text in images (where present) is not blurry/pixelated.
- Images are not cropped; they are fully visible.
- Neon border is tight and consistent.

## 8) Calendly loading performance

On `book.html`:
- Hard refresh (Cmd/Ctrl+Shift+R).
- Scroll down to Calendly widget section.
- The widget should initialize quickly (minimal buffering delay).

## 9) About “Experience by the Numbers” exact stats

On `about.html`:
- The stats show exactly:
  - 17 Clients Served
  - 18 Automations Delivered
  - 2,300+ Hours Saved
  - 9 Industries Served
- “30 minute AI Audit” is removed.
- Animation still works and formats 2,300 with comma, plus sign present.

## 10) Index “No hype. Just measurable wins.” updates

On `index.html` stats section:
- The two updated stats read exactly:
  - 100% of all calls, emails and texts answered
  - 10x Lead Conversion Rate
- “100%” and “10x” are blue; the rest of each sentence is white under it.
- Animation:
  - Only the numeric portion animates (100 / 10)
  - Suffix (% / x) does not animate independently

## 11) Index “Our Services” image tiles + lightbox

On `index.html`:
Desktop (2×2 grid):
- The 4 old text cards are gone; replaced by 4 images.
- Images are not cropped; copy on images is readable.
- Each tile has a clear button linking to `services.html` (or another relevant page).
- It’s obvious the images are clickable to expand (cursor/overlay affordance).

Mobile (stacked):
- Images stack vertically with spacing.
- Mobile-specific image variants are used.
- Tap each image -> premium lightbox opens.
- Lightbox close works; returns to page without layout glitches.

## 12) Mobile-only behavior checks

### 12a) Menu banner two-step
In mobile emulation:
- Scroll so the header minimizes and the banner/indicator is visible.
- First tap on the banner:
  - Header maximizes only
  - Nav panel does NOT open
- Tap hamburger:
  - Nav panel opens
- Tap outside/backdrop:
  - Panel does NOT close (backdrop click disabled)
- Tap back button in panel:
  - Panel slides out
  - Header stays maximized until panel fully out
  - Header then auto-minimizes

### 12b) Hero CTAs moved up
On pages with hero CTAs:
- Buttons are visible at load above the browser URL bar area (no “cut off” feel).

### 12c) Hero shader title/subtitle placement
On mobile:
- Title sits just under the maximized menu bar.
- Subtitle is smaller and placed just under title.
- No overlap with header/banner.

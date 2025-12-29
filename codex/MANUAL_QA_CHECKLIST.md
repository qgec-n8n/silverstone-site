<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist (Requested Edits 1–6)

This checklist is mandatory. Automated validators cannot fully confirm legibility and cropping direction.

## How to run locally

1. Build:
- `npm run build`

2. Serve:
- `bash scripts/serve.sh`

3. Test breakpoints (minimum):
- Mobile: ~375px wide
- Tablet: ~768px wide
- Desktop: ~1280–1440px wide

## Pages to open

Core:
- `/index.html`
- `/about.html`
- `/services.html`
- `/book.html`
- `/contact.html`

Niches (pick at least 3 with images):
- `/niches/estate-agents.html`
- `/niches/dentists.html`
- `/niches/ecommerce.html`

---

## Edit 1 — Shader colors per page

### about.html
- [ ] Shader reads clearly **purple** (dominant hue).

### services.html
- [ ] Hero shader reads clearly **green**.

### book.html
- [ ] Shader reads clearly **bright neon pink**.

### contact.html
- [ ] Hero shader reads clearly **fire orange**.

Niches:
- [ ] Niche hero shaders remain default/purple (not forced to a core variant).

---

## Edit 2 — Hero glass panel removed, legibility excellent

On each page with hero copy + CTA:
- [ ] There is **no blurred/translucent panel** behind the hero copy.
- [ ] Shader remains visible behind the hero content.
- [ ] Copy is still easy to read on:
  - [ ] Mobile
  - [ ] Desktop
- [ ] CTA buttons remain clearly visible and usable.

Test at least:
- services page hero
- contact page hero
- one niche hero

---

## Edit 3 — index “Streamline workflows” button is one line

- [ ] On mobile width, the “Streamline workflows” button label does not wrap.
- [ ] No overflow/cutoff occurs; button remains clickable.

---

## Edit 4 — Section subtitles grey across all pages

For each tested page:
- [ ] Subtitles under blue section titles are grey (not white).
- [ ] Spot check at least 2 sections per page.

Pay special attention to:
- the long descriptive subtitle blocks on `index.html`
- the “pain point” subtitles on niche pages

---

## Edit 5 — Services + niche images fill their cards (width crop only)

On `services.html`:
- [ ] In each service-row image card:
  - [ ] Image touches card edges (no inner blank area)
  - [ ] If cropping occurs, it is only left/right
  - [ ] Top/bottom content is not cropped

On at least 2 niche pages:
- [ ] Same checks as above

---

## Edit 6 — About images: embedded copy remains visible

On `about.html`:
- [ ] Images with embedded copy near the top show that copy fully (no cropping).
- [ ] Verify on both mobile and desktop.

---

## Completion record

- Date tested:
- Tester:
- Notes / remaining issues:

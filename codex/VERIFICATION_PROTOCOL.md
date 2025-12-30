<!-- FILE: codex/VERIFICATION_PROTOCOL.md -->
# Verification Protocol (Automated + Manual)

This protocol is how we prevent false “done”.

---

## 1) Automated verification (required)

### Setup (once per environment)
- `bash scripts/codex.setup.sh`

### Build + validate (run after each milestone)
- `bash scripts/codex.requested-edits.sh`

What it does:
- rebuilds CSS + JS bundles
- runs the fatal grader: `node scripts/assert-ui-spec.js`

**Do not** claim completion unless this passes.

---

## 2) Manual verification (required)

### Run a local static server
From repo root:
- `python3 -m http.server 8080`

Open in a browser:
- `http://localhost:8080/index.html`
- `http://localhost:8080/about.html`
- `http://localhost:8080/services.html`
- At least two niche pages under `/niches/`

### Viewport presets
- Desktop: 1440×900 (or similar)
- Mobile: 390×844 and 375×812 (or similar)

---

## 3) Per-edit manual checks

### Edit 1 — Desktop hero container
- Desktop only:
  - hero copy + CTAs sit inside a visibly bounded container (tight to content, not full width)
  - readability improves against shader background

### Edit 7 — Mobile hero subheading removal (no layout shift)
- Mobile only:
  - grey hero subheading text is not visible
  - title and CTAs are in the same positions as before (no “jump” upward)

### Edit 2 — About desktop images fill + neon border wrap
- Desktop only on about:
  - Silverstone_28 and Silverstone_22 fill their containers (no letterboxing)
  - neon border tightly wraps the container

### Edit 3 — Services desktop HD General_Services cards
- Desktop only:
  - baked-in copy inside images is crisp (check at 125–200% zoom)
  - images do not show obvious blocky compression artifacts

### Edit 4 — Services mobile portrait 2:3 cards
- Mobile only:
  - General_Services cards render as portrait 2:3 and not inside a landscape frame
  - compare visually to niches image cards; spacing/border treatment should match

### Edits 5–6 — Services Innovation Gallery Neural Grid swaps
- Desktop + mobile:
  - the grid no longer shows old `1-1`, `2-3`, `3-2` imagery
  - tiles display the new assets from `codex/ASSET_REPLACEMENT_MATRIX.md`

### Edit 8 — Index targeted sentences grey
- Desktop + mobile:
  - only the two specified sentences are grey (not white)
  - other subtitles retain their existing colors

---

## 4) Documentation evidence

Before final completion:
- Update `ExecPlan.md` evidence table for each edit.
- Update `codex/UI_CHANGE_LOG.md` final summary.
- Check off `codex/MANUAL_QA_CHECKLIST.md`.

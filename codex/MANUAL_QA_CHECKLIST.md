<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — Requested Edits 1–8

Complete this after `bash scripts/codex.requested-edits.sh` passes.

Run local server:
- `python3 -m http.server 8080`

Test viewports:
- Desktop: 1440×900
- Mobile: 390×844 (and optionally 375×812)

---

## A) Global hero checks (Edits 1 + 7)

Pages to check:
- `index.html`
- `about.html`
- `services.html`
- `niches/dentists.html` (sample)
- `niches/hospitality.html` (sample)

### Desktop (Edit 1)
- [ ] Hero copy + CTA buttons are inside a tight container (not full-width).
- [ ] Container improves readability on shader background.
- [ ] No unexpected overlaps with shader visuals.

### Mobile (Edit 7)
- [ ] Grey hero subheading text is not visible.
- [ ] Hero title position unchanged.
- [ ] CTA button positions unchanged.
- [ ] Spacing feels identical (no vertical jump).

---

## B) About page image fill (Edit 2)

Page:
- `about.html`

Desktop only:
- [ ] Silverstone_28 image fills its container (no letterboxing).
- [ ] Silverstone_22 image fills its container (no letterboxing).
- [ ] Neon border tightly wraps the container (no weird inset gaps).

Mobile:
- [ ] No unintended changes to mobile appearance (unless explicitly required; Edit 2 is desktop-only).

---

## C) Services General_Services images (Edits 3 + 4)

Page:
- `services.html`

Desktop only (Edit 3):
- [ ] General_Services_1 image looks HD; baked-in copy is crisp at 125–200% zoom.
- [ ] General_Services_2A image looks HD; baked-in copy is crisp.
- [ ] General_Services_2B image looks HD; baked-in copy is crisp.
- [ ] General_Services_3 image looks HD; baked-in copy is crisp.

Mobile only (Edit 4):
- [ ] Those four image cards are portrait (2:3) and not presented in a landscape frame.
- [ ] Visually matches niches image-card presentation (compare with a niche page at same viewport).

---

## D) Services Innovation Gallery Neural Grid (Edits 5 + 6)

Page:
- `services.html`

Desktop + mobile:
- [ ] Grid images are replaced; no legacy `1-1`, `2-3`, or `3-2` images appear.
- [ ] Portrait tiles show varied prefixes (not multiple variants of the same prefix).
- [ ] No broken images; tiles load.

---

## E) Index subtitles grey (Edit 8)

Page:
- `index.html`

Desktop + mobile:
- [ ] Sentence 1 is grey (not white): “Four practical ways we help UK small businesses save time, respond faster, and keep customers moving - without ripping out the tools you already use.”
- [ ] Sentence 2 is grey (not white): “Clear setup + monthly support. Start with a flagship system, or pick a smaller module if you're fixing one leak first.”
- [ ] No other subtitles were unintentionally recolored.

---

## Final sign-off

- [ ] `bash scripts/codex.requested-edits.sh` passes
- [ ] ExecPlan evidence table filled for Edits 1–8
- [ ] `codex/UI_CHANGE_LOG.md` final summary updated

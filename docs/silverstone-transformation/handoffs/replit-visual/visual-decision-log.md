# Visual Decision Log — High-Visibility Home (Precision Luminescence)

Art direction (LOCKED): **Precision Luminescence** — 70% platinum / 20% graphite /
10% luminous accent. Not a generic AI gradient. Home concept: *"From friction to flow."*

## Decision D-001 — Home direction: SHIP "Platinum Constellation" (Direction A)

Two materially-different directions were prototyped, screenshotted at desktop, and
placed side-by-side on the Replit Canvas for review (labeled image shapes + decision
note).

| Direction | File | Read of the brief |
| --- | --- | --- |
| **A — Platinum Constellation** (SELECTED) | `web/public/prototypes/directions/platinum-constellation.html` | Light-led. Calm platinum field, fine titanium linework, graphite reserved for the conversion chamber. Copy-first hero; the operating-system constellation leads. |
| B — Graphite Instrument | `web/public/prototypes/directions/graphite-instrument.html` | Contained dark "instrument" hero stage. More cinematic, but front-loads dark and competes with the copy-first hero. |

**Selected: A.** It is the literal 70/20/10 reading of the art direction — platinum
dominant, graphite as the accent material (conversion chamber + service band), luminous
cyan/violet kept to ~10% as signal routes. Premium and quiet; hierarchy stays on the
copy and the constellation.

**What we borrow from B:** the luminous-route contrast of B's dark stage is carried into
A only as the Tier-A WebGL signal-field bloom (deferred, ≥1024px) and the graphite
service band / CTA chamber — so the cinematic moment appears where it converts, not at
first paint.

**Rejected for the default home:** B as the hero. Dark-first weakens the copy-first
hierarchy the concept requires and pushes graphite past its 20% budget.

### Evidence
- `screenshots/direction-a-platinum.jpg`
- `screenshots/direction-b-graphite.jpg`
- Canvas: labeled comparison + decision note (shapes `ss-cmp-*`).

---

## Page Features v1 — full-site decisions

### Decision D-010 — Two deliverables at different granularity
- **Static prototypes carry the full per-page composition** for all 27 non-home pages. They are the real previewable acceptance/screenshot surface.
- **The React handoff carries reusable typed primitives, NOT 25 dead page files.** Production mounts each primitive once into the route that needs it.
- **Why:** authoring 25 throwaway page components would be dead code the production owner must delete; the home precedent already established "typed liftable handoff." The right liftable unit here is the reusable primitive (demo shell, tools rail, signatures, instrument, matrix, atlas), not the page. The static prototype is where full-page composition belongs because it is the acceptance surface, not shipped code.

### Decision D-011 — One signature concept per service, one shared instrument for industries
- Each service page gets a distinct signature figure + matching synthetic demo: web-design → conversion-path lens (`web-conversion`); app-dev → product-state stack (`app-state`); voice → call-flow oscilloscope (`voice-callflow`); receptionists → front-desk convergence (`reception-console`); content → editorial loom (`content-loom`); automation → process lattice (`automation-lattice`).
- The nine industry pages share ONE "industry instrument" template (sector-specific intake → triage → human-handoff sequence + a human-in-control boundary note), parameterised per sector. Demo id `industry-<slug>`.
- **Why:** services are genuinely different capabilities and earn distinct signatures; industries are the same operating pattern applied to different sectors, so a shared instrument keeps them coherent and avoids nine bespoke one-offs. The React `IndustryInstrument` mirrors this — one component, per-sector `InstrumentStep[]`.

### Decision D-012 — Synthetic, deterministic, "demonstrates / does not predict"
- Every demo uses deterministic synthetic data, renders a visible `ss-note--info` safeguard, and never confirms/books/decides anything or claims real results.
- Tools rails frame categories as "compatibility categories, not confirmed live integrations" — no vendor partnership or live-integration claims.
- **Why:** the hard constraint forbids invented proof/metrics and copied wording. The instruments must read as honest illustrations of a workflow shape, not product claims.

### Decision D-013 — Overflow fixes belong in `pages.css` at the validation phase
Two real responsive-overflow defects were fixed in `web/public/prototypes/assets/pages.css`:
- `.ss-boundary` — `flex-wrap: wrap` + `> * { min-width: 0 }` (overflow at 360/390/412 px).
- `.ss-page-hero__title` — `overflow-wrap: break-word; hyphens: auto` (overflow at 320 px).
- **Why:** subagents were forbidden from touching shared assets to avoid parallel-edit conflicts, so structural overflow bugs in shared CSS could only be surfaced and fixed by the main agent during validation. The fixes are minimal, additive, and confined to the two offending rules. See `validation-matrix.md` for the before/after audit.

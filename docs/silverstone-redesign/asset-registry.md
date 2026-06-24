# Silverstone AI — Asset Registry (V2 Redesign)

> **Governing document:** `docs/silverstone-redesign/v2-creative-directive.md`.
> **Source CSV:** `docs/silverstone-redesign/source/body-images.csv` (37 image rows).

This registry maps **all 37 rows** of the body-images CSV to their legacy repository source,
availability, focal-treatment suggestion, and responsive usage. Verbatim adjacent copy is
preserved in the source CSV; the tables below use the opening headline/phrase of each block as
a concise, scannable label.

## Availability summary

| Group | Rows | Legacy source | Served copy | Status |
| --- | --- | --- | --- | --- |
| Homepage (`/`) | 4 | `assets/images/socialmedia/` | `web/public/images/home/` | **Available — copied** |
| About (`/about`) | 2 | `assets/images/zip/derived/` | `web/public/images/studio/` | **Available — copied** |
| Service / industry `-960` rows | 31 | — | — | **MISSING — not available in legacy assets** |
| Cinematic body background | n/a | `assets/images/body_section_parallax/` | `web/public/images/texture/` | **Available — copied** |

> **Naming note.** The CSV references size-suffixed names (`-640`, `-960`,
> `_mobile-640`, `-mobile-768`). The actual legacy homepage files are stored **without** the
> `-640` suffix (e.g. CSV `services_consulting-640.jpg` → repo
> `assets/images/socialmedia/services_consulting.jpg`). Sizes are produced by the build's
> responsive pipeline rather than baked into the filename.

---

## 1. Homepage assets — `https://silverstone-ai.com/` (AVAILABLE)

These four rows exist in `assets/images/socialmedia/` and have been copied to
`web/public/images/home/`.

| # | Desktop (CSV) | Mobile (CSV) | Adjacent copy | Repository source path | Focal treatment suggestion | Responsive usage |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `services_consulting-640.jpg` | `services_consulting_mobile-640.jpg` | "Explore consulting" | `assets/images/socialmedia/services_consulting.jpg` (+`_mobile.jpg`) | Centre-weighted; subtle parallax; cyan edge glow | `<picture>`: mobile source ≤768px, desktop ≥769px |
| 2 | `services_lead_followup-640.jpg` | `services_lead_followup_mobile-640.jpg` | "Automate follow-up" | `assets/images/socialmedia/services_lead_followup.jpg` (+`_mobile.jpg`) | Lead-in left third; masked reveal on scroll | `<picture>`: mobile source ≤768px, desktop ≥769px |
| 3 | `services_workflow_automation-640.jpg` | `services_workflow_automation_mobile-640.jpg` | "Streamline workflows" | `assets/images/socialmedia/services_workflow_automation.jpg` (+`_mobile.jpg`) | Diagonal motion crop; violet accent | `<picture>`: mobile source ≤768px, desktop ≥769px |
| 4 | `services_data_integration-640.jpg` | `services_data_integration_mobile-640.jpg` | "Connect your stack" | `assets/images/socialmedia/services_data_integration.jpg` (+`_mobile.jpg`) | Node/network focal point centred; pink-glow rim | `<picture>`: mobile source ≤768px, desktop ≥769px |

---

## 2. About assets — `https://silverstone-ai.com/about` (AVAILABLE)

These two rows exist under `assets/images/zip/derived/` (in `-640`/`-960` × `avif`/`jpg`/`webp`)
and have been copied to `web/public/images/studio/`.

| # | Desktop (CSV) | Mobile (CSV) | Adjacent copy | Repository source path | Focal treatment suggestion | Responsive usage |
| --- | --- | --- | --- | --- | --- | --- |
| 5 | `Silverstone_28-640.jpg` | _(none)_ | "Our Mission — Silverstone AI helps UK small businesses run with the clarity, consistency, and commercial control of a much larger team…" | `assets/images/zip/derived/Silverstone_28-640.jpg` / `-960.{jpg,webp,avif}` | Editorial portrait crop; platinum-on-graphite contrast | Single art-directed source scaled fluidly; no separate mobile crop supplied |
| 6 | `Silverstone_22-640.jpg` | _(none)_ | "Our Story — Founded by a team of technologists and entrepreneurs, Silverstone AI was born out of a desire to help small businesses harness the power of automation without the complexity…" | `assets/images/zip/derived/Silverstone_22-640.jpg` / `-960.{jpg,webp,avif}` | Wide environmental crop; subtle Lenis parallax | Single art-directed source scaled fluidly; no separate mobile crop supplied |

---

## 3. Service / industry assets — `-960` rows (MISSING / NOT AVAILABLE)

The following **31 rows** reference `-960` desktop derivatives and `-768`/`-mobile` mobile
derivatives that are **not present in the legacy `assets/` tree**. They are marked **MISSING /
not available** and must be sourced or regenerated before these sections can ship with real
imagery.

> **Clarifying note.** Some loosely-related base social images exist in
> `assets/images/socialmedia/` under different naming conventions (e.g. `Hospitality_1.jpeg`,
> `Physio_2.jpeg`, `Dentists_1.jpeg`, `Gyms_1.jpeg`, `eComm_1.jpeg`, `General_Services_1.jpeg`).
> These are **not** the exact CSV-referenced `-960` body derivatives and were **not** part of
> the homepage-ready copy set, so the precise assets named below remain unavailable.

| # | Desktop (CSV) | Mobile (CSV) | Page | Adjacent copy (opening) | Status |
| --- | --- | --- | --- | --- | --- |
| 7 | `general-services-1-960.jpg` | `general-services-1-mobile-768.jpg` | `/services` | "Where leads and time leak." | **MISSING** |
| 8 | `general-services-2a-960.jpg` | `general-services-2a-mobile-768.jpg` | `/services` | "Start small. Prove ROI. Scale." | **MISSING** |
| 9 | `general-services-2b-960.jpg` | `general-services-2b-mobile-768.jpg` | `/services` | "Extend the core workflow." | **MISSING** |
| 10 | `general-services-3-960.jpg` | `general-services-3-mobile-768.jpg` | `/services` | "What changes after launch." | **MISSING** |
| 11 | `Real_Estate_1-960.jpg` | `Real_Estate_1_Mobile-768.jpg` | `/services/estate-agents` | "Where instructions slip away." | **MISSING** |
| 12 | `Real_Estate_2-960.jpg` | `Real_Estate_2_Mobile-768.jpg` | `/services/estate-agents` | "Reply first. Book faster." | **MISSING** |
| 13 | `Real_Estate_3-960.jpg` | `Real_Estate_3_Mobile-768.jpg` | `/services/estate-agents` | "Less chasing. More instructions." | **MISSING** |
| 14 | `Hospitality_1-960.jpg` | `Hospitality_1_Mobile-768.jpg` | `/services/hospitality` | "Where bookings get lost." | **MISSING** |
| 15 | `Hospitality_2-960.jpg` | `Hospitality_2_Mobile-768.jpg` | `/services/hospitality` | "A digital front desk, 24/7." | **MISSING** |
| 16 | `Hospitality_3-960.jpg` | `Hospitality_3_Mobile-768.jpg` | `/services/hospitality` | "Less firefighting. More covers." | **MISSING** |
| 17 | `Salon_1-960.jpg` | `Salon_1_Mobile-768.jpg` | `/services/salons-barbers` | "Where diary revenue leaks." | **MISSING** |
| 18 | `salon-2-960.jpg` | `salon-2-mobile-768.jpg` | `/services/salons-barbers` | "Keep columns full quietly." | **MISSING** |
| 19 | `salon-3-960.jpg` | `salon-3-mobile-768.jpg` | `/services/salons-barbers` | "Less admin. Fuller days." | **MISSING** |
| 20 | `Trades_1-960.jpg` | `Trades_1_Mobile-768.jpg` | `/services/trades` | "Stop losing work on the first ring." | **MISSING** |
| 21 | `Trades_2-960.jpg` | `Trades_2_Mobile-768.jpg` | `/services/trades` | "Your virtual office on site." | **MISSING** |
| 22 | `Trades_3-960.jpg` | `Trades_3_Mobile-768.jpg` | `/services/trades` | "Book more jobs. Fewer late nights." | **MISSING** |
| 23 | `eComm_1-960.jpg` | `eComm_1_Mobile-768.jpg` | `/services/ecommerce` | "Where growth gets stuck." | **MISSING** |
| 24 | `eComm_2-960.jpg` | `eComm_2_Mobile-768.jpg` | `/services/ecommerce` | "Recover carts. Grow retention." | **MISSING** |
| 25 | `eComm_3-960.jpg` | `eComm_3_Mobile-768.jpg` | `/services/ecommerce` | "Turn automation into margin." | **MISSING** |
| 26 | `physio-1-960.jpg` | `physio-1-mobile-768.jpg` | `/services/physios-chiropractors` | "Where clinic time leaks." | **MISSING** |
| 27 | `Physio_2-960.jpg` | `Physio_2_Mobile-768.jpg` | `/services/physios-chiropractors` | "Intake and rebooking in sync." | **MISSING** |
| 28 | `physio-3-960.jpg` | `physio-3-mobile-768.jpg` | `/services/physios-chiropractors` | "Support outcomes and utilisation." | **MISSING** |
| 29 | `dentist-1-960.jpg` | `dentist-1-mobile-768.jpg` | `/services/dentists` | "Where chair time leaks." | **MISSING** |
| 30 | `dentist-2-960.jpg` | `dentist-2-mobile-768.jpg` | `/services/dentists` | "Structured recall, less chasing." | **MISSING** |
| 31 | `dentist-3-960.jpg` | `dentist-3-mobile-768.jpg` | `/services/dentists` | "Keep chairs consistently full." | **MISSING** |
| 32 | `gyms-1-960.jpg` | `gyms-1-mobile-768.jpg` | `/services/gyms-fitness-studios` | "Where retention slips." | **MISSING** |
| 33 | `gyms-2-960.jpg` | `gyms-2-mobile-768.jpg` | `/services/gyms-fitness-studios` | "Retention triggers that actually run." | **MISSING** |
| 34 | `gyms-3-960.jpg` | `gyms-3-mobile-768.jpg` | `/services/gyms-fitness-studios` | "Turn engagement into retention." | **MISSING** |
| 35 | `onlinecoach-1-960.jpg` | `onlinecoach-1-mobile-768.jpg` | `/services/fitness-coaches` | "Where leads go cold." | **MISSING** |
| 36 | `onlinecoach-2-960.jpg` | `onlinecoach-2-mobile-768.jpg` | `/services/fitness-coaches` | "Turn DMs into a pipeline." | **MISSING** |
| 37 | `onlinecoach-3-960.jpg` | `onlinecoach-3-mobile-768.jpg` | `/services/fitness-coaches` | "Protect your energy and revenue." | **MISSING** |

**Focal treatment / responsive guidance for when these assets are sourced:** treat each as a
cinematic full-width or split storytelling band — desktop `-960` source above the `768px`
breakpoint, dedicated mobile `-768` crop below it via `<picture>`; apply masked reveals,
parallax, and page-family colour accents consistent with the V2 directive.

---

## 4. Cinematic body background (AVAILABLE)

| Asset | Repository source path | Served copy | Suggested use |
| --- | --- | --- | --- |
| `body-section-background-2025.webp` | `assets/images/body_section_parallax/body-section-background-2025.webp` | `web/public/images/texture/body-section-background-2025.webp` | Subtle animated/parallax body background texture behind dark sections; pair with reduced-motion static fallback |

---

## Homepage-ready assets (served paths now available under `web/public/images/`)

These are the exact served paths currently available for the V2 build:

**`web/public/images/home/`** (homepage row imagery)

- `services_consulting.jpg`
- `services_consulting_mobile.jpg`
- `services_lead_followup.jpg`
- `services_lead_followup_mobile.jpg`
- `services_workflow_automation.jpg`
- `services_workflow_automation_mobile.jpg`
- `services_data_integration.jpg`
- `services_data_integration_mobile.jpg`

**`web/public/images/studio/`** (about / studio imagery, `-640` + `-960` in `avif`/`jpg`/`webp`)

- `Silverstone_22-640.{avif,jpg,webp}`, `Silverstone_22-960.{avif,jpg,webp}`
- `Silverstone_28-640.{avif,jpg,webp}`, `Silverstone_28-960.{avif,jpg,webp}`
- `Silverstone_04-640.{avif,jpg,webp}`, `Silverstone_04-960.{avif,jpg,webp}`
- `Silverstone_06-640.{avif,jpg,webp}`, `Silverstone_06-960.{avif,jpg,webp}`
- `Silverstone_27-640.{avif,jpg,webp}`, `Silverstone_27-960.{avif,jpg,webp}`

**`web/public/images/texture/`** (cinematic background)

- `body-section-background-2025.webp`

**`web/public/brand/`** (locked brand assets — logos + icon)

- `silverstone-icon.png` (header/navigation on every page)
- `silverstone-logo-new.png` (footer / standard logo lockup)
- `silverstone-logo-new@2x.png` (high-DPI logo lockup)

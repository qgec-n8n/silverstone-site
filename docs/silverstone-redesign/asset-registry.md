# Asset Registry — V2 Homepage

All assets are **local** (no remote runtime dependencies). Generated imagery is
cinematic dark luxury-tech, consistent with the Precision Luminescence directive.

## Brand assets — `web/public/brand/`

| File | Source | Notes |
| --- | --- | --- |
| `silverstone-emblem.png` | `attached_assets/silverstone-icon_*.png` | Background removed → transparent RGBA (1254×1254). Header/loader/footer emblem. |
| `silverstone-logo.png` | `attached_assets/silverstone-logo-new@2x_*.png` | Background removed → transparent RGBA (1256×702). Emblem-only crop of the lockup. |
| `silverstone-emblem-source.png` | original | Untouched original kept for reference. |
| `silverstone-logo-source.png` / `…-source@2x.png` | originals | Untouched originals kept for reference. |

> The original brand PNGs shipped on a white raster background; transparent
> derivatives are required for the dark theme (no white logo plates).
>
> The source lockup pairs the emblem with a **dark slate "SILVERSTONE AI"
> wordmark** that is invisible on a dark surface. So the wordmark is rendered as
> **styled text** beside the transparent emblem in the header and footer (full
> control on dark, crisp at any size, accessible) rather than as a baked image.
> `silverstone-logo.png` is therefore an emblem-only derivative.

## Generated imagery — `web/public/home-v2/` (AI-generated, local)

| File | Aspect | Used by |
| --- | --- | --- |
| `hero-poster.png` | 16:9 | Hero static poster (source of truth / fallback for shader hero) |
| `hero-poster-portrait.png` | 9:16 | Hero poster, mobile/portrait |
| `story-operating-surface.png` | 16:9 | Storytelling — "one calm operating surface" |
| `story-voice-signal.png` | 4:3 | Storytelling — "conversations that never sleep" |
| `story-human-loop.png` | 4:3 | Storytelling — "a human always in the signal" |
| `consulting-strategy.png` | 4:3 | AI consulting section |
| `standard-chrome.png` | 16:9 | Silverstone Standard section texture |

Art direction: near-black graphite base, volumetric depth, electric cyan +
violet luminescence, chrome highlights, no text, no UI, no faces.

## Integration marks — `web/public/integrations/` (local SVG, currentColor)

Stylized **original** monochrome marks (not pixel copies of trademarks), tinted
to chrome/platinum on dark. Two marquee rows.

Row A: `whatsapp`, `gmail`, `google-calendar`, `slack`, `hubspot`, `stripe`, `calendly`
Row B: `microsoft-teams`, `outlook`, `zapier`, `make`, `notion`, `twilio`, `shopify`

## Original-site imagery imported — `web/public/home-v2/` (CSV re-audit, T008)

Re-audit of `attached_assets/silverstone_body_images_with_mobile_desktop_1782315914595.csv`
(per the "IMAGE CSV RE-AUDIT" directive). **Correction:** the previous audit
concluded the CSV body images were unavailable. That was wrong — **every** CSV
row maps to a Silverstone-owned file already in the repo (under
`assets/images/socialmedia/**`, `assets/images/zip/**`). No remote download was
required and no remote runtime dependency is introduced.

The homepage-relevant subset was copied locally and re-encoded (ImageMagick,
local) to web-appropriate sizes — desktop ≤1280w, mobile ≤768w — as `webp`
(primary) + `jpg` (fallback). The four `services_*_mobile.jpg` source files are
actually PNG (RGBA 2048²); they were re-encoded, not copied verbatim.

| Home-v2 file (per base) | CSV source (desktop / mobile) | Homepage use |
| --- | --- | --- |
| `service-consulting.{webp,jpg}` + `-mobile.{webp,jpg}` | `services_consulting` / `_mobile` | Service card — Consulting |
| `service-lead-followup.{webp,jpg}` + `-mobile.{webp,jpg}` | `services_lead_followup` / `_mobile` | Service card — Lead follow-up |
| `service-workflow-automation.{webp,jpg}` + `-mobile.{webp,jpg}` | `services_workflow_automation` / `_mobile` | Service card — Workflow automation |
| `service-data-integration.{webp,jpg}` + `-mobile.{webp,jpg}` | `services_data_integration` / `_mobile` | Service card — Data integration |
| `general-services-1.{webp,jpg}` + `-mobile.{webp,jpg}` | `General_Services_1` / `_Mobile` | Storytelling — where leads/time leak |
| `general-services-2a.{webp,jpg}` + `-mobile.{webp,jpg}` | `General_Services_2A` / `_Mobile` | Storytelling — start small, prove ROI |
| `general-services-2b.{webp,jpg}` + `-mobile.{webp,jpg}` | `General_Services_2B` / `_Mobile` | Storytelling — extend the core workflow |
| `general-services-3.{webp,jpg}` + `-mobile.{webp,jpg}` | `General_Services_3` / `_Mobile` | Storytelling — what changes after launch |
| `studio-story.{webp,jpg}` | `Silverstone_22` (about/story) | Brand credibility (secondary hero / standard) |
| `studio-mission.{webp,jpg}` | `Silverstone_28` (about/mission) | Brand credibility (secondary hero / standard) |

> These are made available for the homepage (wiring is handled by the serial
> section tasks, not this re-audit). The previously generated `*.png` cinematic
> posters above remain as fallbacks/source-of-truth and are unaffected.

## Complete CSV re-audit table (all 37 rows)

Status key: **used** = copied to `web/public/home-v2/` for homepage;
**reserved** = Silverstone-owned, kept in-repo for the later service/industry
page it belongs to (not forced onto the homepage); no rows were **rejected /
missing / low-res / irrelevant**.

| CSV page | CSV desktop / mobile basename | Local source (in repo) | Status |
| --- | --- | --- | --- |
| `/` | `services_consulting` / `_mobile` | `assets/images/socialmedia/services_consulting{,_mobile}.jpg` | **used** |
| `/` | `services_lead_followup` / `_mobile` | `assets/images/socialmedia/services_lead_followup{,_mobile}.jpg` | **used** |
| `/` | `services_workflow_automation` / `_mobile` | `assets/images/socialmedia/services_workflow_automation{,_mobile}.jpg` | **used** |
| `/` | `services_data_integration` / `_mobile` | `assets/images/socialmedia/services_data_integration{,_mobile}.jpg` | **used** |
| `/about` | `Silverstone_28` | `assets/images/zip/Silverstone_28.jpg` (+ `derived/`) | **used** (mission) |
| `/about` | `Silverstone_22` | `assets/images/zip/Silverstone_22.jpg` (+ `derived/`) | **used** (story) |
| `/services` | `general-services-1` / `-mobile` | `assets/images/socialmedia/General_Services_1{,_Mobile}.webp` (+ `derived/`) | **used** |
| `/services` | `general-services-2a` / `-mobile` | `assets/images/socialmedia/General_Services_2A{,_Mobile}.webp` (+ `derived/`) | **used** |
| `/services` | `general-services-2b` / `-mobile` | `assets/images/socialmedia/General_Services_2B{,_Mobile}.webp` (+ `derived/`) | **used** |
| `/services` | `general-services-3` / `-mobile` | `assets/images/socialmedia/General_Services_3{,_Mobile}.webp` (+ `derived/`) | **used** |
| `/services/estate-agents` | `Real_Estate_1..3` / `_Mobile` | `assets/images/socialmedia/Real_Estate_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (estate-agents) |
| `/services/hospitality` | `Hospitality_1..3` / `_Mobile` | `assets/images/socialmedia/Hospitality_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (hospitality) |
| `/services/salons-barbers` | `Salon_1`, `salon-2`, `salon-3` / `_Mobile` | `assets/images/socialmedia/Salon_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (salons-barbers) |
| `/services/trades` | `Trades_1..3` / `_Mobile` | `assets/images/socialmedia/Trades_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (trades) |
| `/services/ecommerce` | `eComm_1..3` / `_Mobile` | `assets/images/socialmedia/eComm_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (ecommerce) |
| `/services/physios-chiropractors` | `physio-1`, `Physio_2`, `physio-3` / `_Mobile` | `assets/images/socialmedia/Physio_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (physios) |
| `/services/dentists` | `dentist-1..3` / `-mobile` | `assets/images/socialmedia/Dentists_{1,2,3}{,_Mobile}.{webp,jpeg}` (+ `derived/`) | reserved (dentists) |
| `/services/gyms-fitness-studios` | `gyms-1..3` / `-mobile` | `assets/images/socialmedia/Gyms_{1,2,3}{,_Mobile}.{webp,jpeg}` | reserved (gyms) |
| `/services/fitness-coaches` | `onlinecoach-1..3` / `-mobile` | `assets/images/socialmedia/onlinecoach-{1,2,3}{,-mobile}.png` | reserved (fitness-coaches) |

Notes:
- **Duplicates** observed (not an error): most industry images ship in several
  forms — `Name.jpeg`, `Name.webp`, lowercase `name.png`, and a `derived/`
  responsive ladder (`-320/-480/-640/-768/-960` × `avif/jpg/webp`). The `webp`
  base / `derived` ladder is the preferred source for later wiring.
- **Format quirk:** the four `/` homepage `services_*_mobile.jpg` files are PNG
  (RGBA, 2048²). Re-encoded to optimised `webp`+`jpg` on import; the giant PNGs
  were not shipped into `home-v2/`.
- **No remote runtime:** all imagery resolves to local files; nothing is fetched
  from `silverstone-ai.com` at runtime.

## Pre-existing local studio photography — `web/public/migrated-assets/`

`Silverstone_04/06/27-640.jpg` were already migrated here; the full studio set
(`Silverstone_04/06/22/27/28`) also exists under `assets/images/zip/**` with a
responsive `derived/` ladder, available for `/about` and brand sections.

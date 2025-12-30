<!-- FILE: codex/ASSET_REPLACEMENT_MATRIX.md -->
# Asset Replacement Matrix (Deterministic Mapping)

This file exists to remove guesswork. Codex should follow this mapping exactly unless a blocking constraint is discovered.

---

## Services — Innovation Gallery Neural Grid (source: `src/js/gallery.js` CURATED_IMAGES)

### A) Replace ALL square (1:1) tiles

Replace any square tile whose old filename contains `1-1` with these (all 1:1):

- `services_lead_followup_mobile.jpg`
- `services_consulting_mobile.jpg`
- `services_data_integration_mobile.jpg`
- `services_workflow_automation_mobile.jpg`

Recommended mapping (old → new):
- `1-1_business_chart-icon_growth.jpg` → `services_lead_followup_mobile.jpg`
- `1-1_marketing_laptop_holographic-calendar.jpg` → `services_consulting_mobile.jpg`
- `1-1_recruitment_resume-stack_ai_shortlist.jpg` → `services_data_integration_mobile.jpg`
- `1-1_legal_desk_contract-automation.jpg` → `services_workflow_automation_mobile.jpg`

### B) Replace ALL landscape (3:2) tiles

Replace any landscape tile whose old filename contains `3-2` with these (all 3:2):

- `services_data_integration.jpg`
- `services_workflow_automation.jpg`
- `services_consulting.jpg`

Recommended mapping (old → new):
- `3-2_business_laptop_holographic-workflow.jpg` → `services_data_integration.jpg`
- `3-2_legal_laptop_compliance-dashboard.jpg` → `services_workflow_automation.jpg`
- `3-2_logistics_tablet_route-optimisation.jpg` → `services_consulting.jpg`

(Leave `services_lead_followup.jpg` unused in the grid; it remains available.)

### C) Replace ALL portrait (2:3) tiles

Replace every portrait tile (old filenames contain `2-3`) with the following **distinct-prefix** set:

- `Dentists_1_Mobile.jpeg`
- `Gyms_2_Mobile.jpeg`
- `Hospitality_3_Mobile.jpeg`
- `Online_Coach_1_Mobile.jpeg`
- `Physio_2_Mobile.jpeg`
- `Real_Estate_3_Mobile.jpeg`
- `Salon_1_Mobile.jpeg`
- `Trades_2_Mobile.jpeg`

Rules:
- All chosen portrait filenames match `*_1_Mobile.jpeg`, `*_2_Mobile.jpeg`, or `*_3_Mobile.jpeg`.
- Prefix variety is maximized (no duplicate prefix).

---

## Services — General_Services image cards (pixelation + mobile aspect)

### A) Desktop HD requirement (services.html)

For these four cards:
- `General_Services_1`
- `General_Services_2A`
- `General_Services_2B`
- `General_Services_3`

Required behavior:
- Mobile continues using `*_Mobile.webp` sources.
- Desktop must use `.jpeg` sources (do not use the desktop `.webp` sources).

### B) Mobile portrait card requirement (services.html + services.css)

Required class hook (HTML):
- Add class `general-services-card` to the **four** General_Services image card wrappers:
  - `<div class="service-image neon-card general-services-card">`

Required mobile styling (CSS):
- In `src/css/pages/services.css` under `@media (max-width: 768px)`:
  - `.page-services .general-services-card` uses aspect-ratio **2 / 3**
  - image fills the card without letterboxing (align with niches image-card behavior)

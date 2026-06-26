# Prompt 2 Page Image Decisions

Date: 2026-06-26

Scope: `/services`, the six existing service detail routes, and the new AI & Automation Consulting service route in `/web`.

Source files consulted:

- `docs/codex/image-assets/page-image-selection-policy.md`
- `docs/codex/image-assets/verified-image-asset-manifest.json`
- `docs/codex/image-assets/route-image-candidates.json`
- `docs/codex/image-assets/contact-sheets/service-foundation.png`

Policy applied:

- Use local verified assets only.
- Prefer direct route-specific score 9-10 assets where they make the page more premium, professional, distinctive and editorially clear.
- Treat dashboards, names, appointments, values and performance language inside images as illustrative mock content.
- Keep images with baked-in copy as self-contained panels; do not overlay competing live text.
- Use `<picture>` with desktop and mobile pairs, explicit dimensions, accurate `sizes`, eager decode for first service visual, lazy loading below fold.

## Implementation Plan

1. Add service-route two-state intro/body experience by reusing the shared Aether field, `ExploreSystemButton`, `ExploreSystemTransition`, CoreSpin loader, body `particles.js`, shared header and footer systems.
2. Expand each service route from the current signature/demo/tools trio into a service-specific sequence: secondary hero, challenge/outcome narrative, responsive image panel, capability architecture, workflow/process, interactive demo, governance, FAQ/related-service links and connector rail.
3. Add the seventh service, AI & Automation Consulting, through the route manifest, migrated-content overlay, navigation, service directory matrix, related links, metadata, breadcrumbs, sitemap and schema path.
4. Keep Cybercore and Background Gradient out of Prompt 2 service routes. They remain industry-only assets.

## `/services` Services Directory

Selected:

- `csv-03-desktop` / `csv-03-mobile`: `assets/images/socialmedia/services_workflow_automation.jpg`, `assets/images/socialmedia/services_workflow_automation_mobile.jpg`; public pair `/home-v2/service-workflow-automation.{webp,jpg}` and `/home-v2/service-workflow-automation-mobile.{webp,jpg}`.
  - Placement: services directory image-led capability overview.
  - Loading: eager, first visual module.
  - Alt: "Illustrative workflow automation and reporting interface for service discovery."
  - Reason: strongest overview asset for the services ecosystem; reads premium and operational.

Rejected:

- `csv-07-desktop` / `csv-07-mobile`: strong but more reception-specific than directory-wide.
- `csv-08-desktop` / `csv-08-mobile`: useful for modular delivery, but lower clarity for all-service navigation.
- `csv-04-desktop` / `csv-04-mobile`: integration-specific, better for app and architecture sections.

## `/services/web-design-development`

Selected:

- `csv-07-desktop` / `csv-07-mobile`: `assets/images/socialmedia/derived/General_Services_1-960.jpg`, `assets/images/socialmedia/derived/General_Services_1_Mobile-768.jpg`; public pair `/home-v2/general-services-1.{webp,jpg}` and `/home-v2/general-services-1-mobile.{webp,jpg}`.
  - Placement: first image-led editorial panel about conversion-path clarity and lead capture.
  - Loading: eager, first service visual.
  - Alt: "Illustrative reception and enquiry capture panel used to explain conversion-path design."
  - Reason: supports lead capture and conversion architecture without implying a real client website.

Secondary candidate used:

- `csv-09-desktop` / `csv-09-mobile`: public `/home-v2/general-services-2b.*`.
  - Placement: lower integration ecosystem panel only when space allows.
  - Loading: lazy.
  - Alt: "Illustrative integrated business workflow panel for website systems and handoffs."

Rejected:

- `csv-08-desktop` / `csv-08-mobile`: good modular-package message, but less directly tied to website conversion.
- `csv-10-desktop` / `csv-10-mobile`: booking/admin framing overlaps more strongly with reception and automation.

## `/services/app-development`

Selected:

- `csv-04-desktop` / `csv-04-mobile`: public `/home-v2/service-data-integration.{webp,jpg}` and `/home-v2/service-data-integration-mobile.{webp,jpg}`.
  - Placement: data architecture and connected-application panel.
  - Loading: eager, first service visual.
  - Alt: "Illustrative systems and data integration panel for application architecture."
  - Reason: best direct match for APIs, data models and internal tools.

Secondary candidate used:

- `csv-09-desktop` / `csv-09-mobile`: public `/home-v2/general-services-2b.*`.
  - Placement: integration ecosystem support panel.
  - Loading: lazy.
  - Alt: "Illustrative integrated platform ecosystem for application delivery."

Rejected:

- `csv-08-desktop` / `csv-08-mobile`: suitable for MVP roadmap but less application-specific than data integration.
- `email-email-6-jpeg`: rejected because no verified mobile pair and healthcare-specific context would narrow the service incorrectly.

## `/services/ai-voice-agents`

Selected:

- `csv-02-desktop` / `csv-02-mobile`: public `/home-v2/service-lead-followup.{webp,jpg}` and `/home-v2/service-lead-followup-mobile.{webp,jpg}`.
  - Placement: lead follow-up, booking and call outcome panel.
  - Loading: eager, first service visual.
  - Alt: "Illustrative automated lead follow-up panel for voice-agent booking workflows."
  - Reason: supports call capture, qualification, follow-up and booking without presenting a live call system.

Secondary candidate used:

- `csv-03-desktop` / `csv-03-mobile`: public `/home-v2/service-workflow-automation.*`.
  - Placement: monitoring and workflow-reporting panel.
  - Loading: lazy.
  - Alt: "Illustrative workflow automation and reporting panel for voice-agent governance."

Rejected:

- `csv-07-desktop` / `csv-07-mobile`: strong missed-call asset, but already selected for web and reception-adjacent storytelling.
- `email-email-1-jpeg`: no verified mobile pair and healthcare-specific context.

## `/services/ai-receptionists`

Selected:

- `csv-07-desktop` / `csv-07-mobile`: public `/home-v2/general-services-1.*`.
  - Placement: first reception/after-hours capture editorial panel.
  - Loading: eager, first service visual.
  - Alt: "Illustrative reception closed, revenue open panel for after-hours enquiry capture."
  - Reason: direct and distinctive fit for front-desk coverage.

Secondary candidate used:

- `csv-10-desktop` / `csv-10-mobile`: public `/home-v2/general-services-3.*`.
  - Placement: booking and diary administration support panel.
  - Loading: lazy.
  - Alt: "Illustrative full diary, zero admin panel for reception scheduling workflows."

Rejected:

- `csv-02-desktop` / `csv-02-mobile`: better used on Voice Agents where lead follow-up is the main story.
- `email-booking-confirmation-email-jpg`: no verified mobile pair.
- `email-email-1-jpeg`: no verified mobile pair and too healthcare-specific.

## `/services/content-creation`

Selected:

- `csv-08-desktop` / `csv-08-mobile`: public `/home-v2/general-services-2a.{webp,jpg}` and `/home-v2/general-services-2a-mobile.{webp,jpg}`.
  - Placement: content system / campaign package visual break.
  - Loading: eager, first service visual.
  - Alt: "Illustrative modular content and follow-up package panel."
  - Reason: supports repurposing systems and editorial operations without pretending to be a published result.

Secondary candidate used:

- `csv-03-desktop` / `csv-03-mobile`: public `/home-v2/service-workflow-automation.*`.
  - Placement: analytics feedback and review workflow panel.
  - Loading: lazy.
  - Alt: "Illustrative workflow automation and reporting panel for content review operations."

Rejected:

- `csv-05-desktop`: no verified mobile pair and generic strategy language.
- `csv-09-desktop` / `csv-09-mobile`: stronger fit for app/web integration than content operations.

## `/services/ai-automation`

Selected:

- `csv-03-desktop` / `csv-03-mobile`: public `/home-v2/service-workflow-automation.*`.
  - Placement: core automation workflow and monitoring panel.
  - Loading: eager, first service visual.
  - Alt: "Illustrative workflow automation and reporting interface for agent workflows."
  - Reason: strongest direct score-9 automation asset and compatible with a premium operational route.

Secondary candidate used:

- `csv-04-desktop` / `csv-04-mobile`: public `/home-v2/service-data-integration.*`.
  - Placement: data integration and single-source-of-truth panel.
  - Loading: lazy.
  - Alt: "Illustrative systems and data integration panel for automation architecture."

Rejected:

- `csv-10-desktop` / `csv-10-mobile`: useful booking/admin message, but less comprehensive than workflow automation.
- `email-booking-confirmation-email-jpg`: no verified mobile pair and too narrow.

## `/services/ai-consulting`

Selected:

- `csv-01-desktop` / `csv-01-mobile`: public `/home-v2/service-consulting.{webp,jpg}` and `/home-v2/service-consulting-mobile.{webp,jpg}`.
  - Placement: first consulting audit and roadmap panel.
  - Loading: eager, first service visual.
  - Alt: "Illustrative AI consulting and readiness audit panel."
  - Reason: direct consulting/readiness fit, premium boardroom setting, and clear audit-roadmap messaging.

Rejected:

- `csv-05-desktop`: no verified mobile pair; generic transformation copy limits reuse.
- `csv-06-desktop`: no verified mobile pair; small labels are hard to read.
- `email-email-8-jpeg`: no verified mobile pair and healthcare-specific context.


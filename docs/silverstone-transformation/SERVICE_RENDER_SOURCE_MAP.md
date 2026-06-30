# Service Render Source Map

**Date:** 2026-06-30  
**Source of truth:** `docs/approved-copy/services/` and `web/src/content/services/generated/approved-services.json`.

## Active Render Chain

`.replit` or root scripts -> `/web` React Router/Vite -> `web/src/app/routes.ts` -> `web/src/routes/services/detail.tsx` -> `web/src/routes/templates/service-page.tsx` -> `web/src/visual/data/page-modules.tsx` -> `web/src/visual/components/approved-service-page.tsx` -> `web/src/content/services/approved-services.ts`.

The canonical service pages do not render from `/web/public/prototypes/services/**`, root static HTML, or migrated service records.

## Route Map

| Route                              | Source Markdown                      | SHA-256                                                            | H1                                                                 | CoreSpin line                                          | Aether title                                         | FAQ count | Demo slots                                                            |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------- | --------: | --------------------------------------------------------------------- |
| `/services/web-design-development` | `01_WEB_DESIGN_AND_DEVELOPMENT.md`   | `68abc66173881e4d7533b0a9540cedaf2ee5da627c327e773ae595b1344d0df7` | A website engineered to move buyers forward                        | Aligning message, movement and measurement             | Make the website earn its place                      |         5 | `futureWebsitePreviewPrimaryUrl`, `futureWebsitePreviewSecondaryUrl`  |
| `/services/app-development`        | `02_APP_DEVELOPMENT.md`              | `bd6de606338ab2a39f9cfdd8cc9c84721bfe8c4070825bfae2909d61bb1c9183` | Build the smallest app that proves the value                       | Reducing the idea to its most valuable working state   | Prove the workflow before expanding the product      |         8 | deterministic synthetic demo                                          |
| `/services/ai-voice-agents`        | `03_AI_VOICE_AGENTS.md`              | `54ad35a889a2254b9f28bebb7b2ad8f7d45757a462f043cc0fb71ecaa1407bb8` | Voice agents designed for real conversations—and real consequences | Synchronising speech, action and human fallback        | Give every call a controlled next state              |         9 | `futureVoiceElevenLabsAgent`, `futureVoiceTranscriptSource`           |
| `/services/ai-receptionists`       | `04_AI_RECEPTIONISTS.md`             | `76d38c031c6919f24eeb9130c4e37b80db411928c14da457b961cd2242888344` | A front desk that answers, qualifies and knows when to hand over   | Converging every enquiry into the right next action    | Turn every routine enquiry into a controlled handoff |         5 | `futureReceptionistChatEmbedUrl`, `futureReceptionistElevenLabsAgent` |
| `/services/content-creation`       | `05_CONTENT_CREATION.md`             | `3ecb7b2b0ce602e9954fb61e93a56d4b0ea9eeafec3e918c967a099c67eb778d` | Turn expertise into a governed content engine                      | Structuring expertise into reusable editorial momentum | Make every strong idea travel further                |         5 | deterministic synthetic demo                                          |
| `/services/ai-automation`          | `06_AI_AUTOMATION.md`                | `f25fcee8c1adbc24255eafa45a2ba8cf075cbffe6106aea7e2c3a1716bc74c64` | Engineer the work between your systems                             | Orchestrating data, decisions and accountable action   | Make the handoffs work without hiding the exceptions |         5 | deterministic synthetic demo                                          |
| `/services/ai-consulting`          | `07_AI_AND_AUTOMATION_CONSULTING.md` | `4dd22e951306c5d31af64eda15bea43d0fa1000da5319e5ed012365a541ed2cf` | Decide what to automate before you buy the tools                   | Converting ambition into an ordered set of decisions   | Put judgement before implementation                  |         6 | deterministic synthetic demo                                          |

## Aliases

- `/services/website-design-development` resolves to `/services/web-design-development`.
- `/services/ai-agents-automation` resolves to `/services/ai-automation`.

The aliases do not replace canonical route records, metadata, internal links, or sitemap/canonical sources.

## Copy-Fidelity Guardrails

- `web/tests/unit/approved-services.test.ts` validates route mapping, source hashes, route-entry copy, distinctive public phrases, FAQ counts, benchmark metrics, demo config slots, and alias preservation.
- `web/tests/e2e/services-rendering.spec.ts` validates approved public copy in raw HTML and hydrated DOM and blocks known prototype phrases.
- `web/tests/unit/service-assets.test.ts` validates approved image usage and demo placeholders from the approved services manifest/renderer.

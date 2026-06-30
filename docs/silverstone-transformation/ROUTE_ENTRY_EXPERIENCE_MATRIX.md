# Route Entry Experience Matrix

**Status:** `/web` implementation handoff for the route-entry experience pass.  
**Last updated:** 2026-06-30.

## Governing Implementation

- Full route copy registry: `web/src/data/route-experiences.ts`.
- Canonical route source: `web/src/data/future-routes.ts`.
- Browser sequence wrapper: `web/src/routes/templates/route-experience-frame.tsx`.
- Shared intro surface: `web/src/visual/components/route-experience-intro.tsx`.
- Route-specific loader replay: `web/src/components/ui/core-spin-loader.tsx`.
- Unit coverage requires one route experience for every governed `futureRouteManifest` path.

## Sequence Contract

Every non-home route follows the same first-entry and replay path:

1. CoreSpin loader with route-specific text.
2. Aether intro containing only pill, title, subtitle, and the route button.
3. Shared expandable button transition.
4. Route body.
5. Reverse X control returning to the same route intro.

The homepage keeps the protected `Explore the system` label. Non-home routes must not reuse it.

## Service Route Matrix

| Requested surface            | Governed canonical route           | Compatibility alias                    | Button label                      | Approved visual source             | Benchmark source                                                                        |
| ---------------------------- | ---------------------------------- | -------------------------------------- | --------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| Services hub                 | `/services`                        | none                                   | Explore our services              | `services_workflow_automation.jpg` | `attached_assets/silverstone_ai_agency_performance_metrics_23_6_2026_1782315909364.csv` |
| Website Design & Development | `/services/web-design-development` | `/services/website-design-development` | Explore website systems           | `general-services-1.png`           | Same approved CSV                                                                       |
| App Development              | `/services/app-development`        | none                                   | Explore app development           | `services_data_integration.jpg`    | Same approved CSV                                                                       |
| AI Voice Agents              | `/services/ai-voice-agents`        | none                                   | Explore intelligent conversations | `services_lead_followup.jpg`       | Same approved CSV                                                                       |
| AI Receptionists             | `/services/ai-receptionists`       | none                                   | Meet your AI front desk           | `general-services-1.png`           | Same approved CSV                                                                       |
| Content Creation             | `/services/content-creation`       | none                                   | Explore content systems           | `general-services-2a.png`          | Same approved CSV                                                                       |
| AI Agents & Automation       | `/services/ai-automation`          | `/services/ai-agents-automation`       | Explore automation systems        | `services_workflow_automation.jpg` | Same approved CSV                                                                       |

Aliases are app-layer compatibility lookups only. Canonical metadata, internal links, sitemap generation, and route governance continue to use the governed canonical paths.

## Reserved Demo Slots

- Website Design & Development includes two reserved browser-window placeholders for future website previews.
- AI Receptionists includes reserved AI chat and ElevenLabs call-demo placeholders.
- AI Voice Agents includes reserved ElevenLabs call and illustrative transcript placeholders.

These slots intentionally do not contain API keys, agent IDs, live appointments, live call recordings, fake production transcripts, or fabricated customer outcomes.

## Verification Evidence

- `npm run test -- tests/unit/route-experiences.test.ts tests/unit/benchmark-metrics.test.ts tests/unit/service-assets.test.ts tests/unit/app-shell.test.tsx tests/unit/route-backgrounds.test.ts`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run test:e2e -- tests/e2e/route-entry.spec.ts`: passed with 12 tests across desktop and mobile, including prompt aliases and reduced-motion usability.
- `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts tests/e2e/foundation.spec.ts`: passed with 18 passing and 10 expected skips.

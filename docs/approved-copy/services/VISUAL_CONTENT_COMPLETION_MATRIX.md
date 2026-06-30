# Silverstone Services Prompt 5 Visual And Content Completion Matrix

Generated: 2026-06-30

## Scope

This matrix records the local completion evidence for the seven canonical service routes rebuilt from the approved services copy pack.

## Browser Sweep Evidence

Command context: `/web`, staging preview on `http://127.0.0.1:4173` after `npm run build`.

The custom Playwright browser sweep verified, per route:

- Section 3 CoreSpin loader line.
- Section 4 Aether pill and route-entry button.
- Desktop Aether pointer disruption by sampling 8,000 canvas pixels before pointer entry, at pointer centre, and after pointer exit.
- Body H1 and approved distinctive body phrase.
- Benchmark disclaimer and first benchmark metric.
- Required reserved demo config slots or deterministic demo heading.
- At least one approved image from `/approved-images/`.
- Mobile route entry and body H1/distinctive phrase.
- No browser console errors or page errors.

| Route | Source Markdown | Body H1 | Desktop Aether changed samples, enter/exit | Desktop content | Mobile content | Required demo | Approved image | Status |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| `/services/web-design-development` | `01_WEB_DESIGN_AND_DEVELOPMENT.md` | A website engineered to move buyers forward | 2136 / 2138 | Pass | Pass | `futureWebsitePreviewPrimaryUrl`, `futureWebsitePreviewSecondaryUrl` | Pass | Pass |
| `/services/app-development` | `02_APP_DEVELOPMENT.md` | Build the smallest app that proves the value | 2006 / 1972 | Pass | Pass | Deterministic first-release state map | Pass | Pass |
| `/services/ai-voice-agents` | `03_AI_VOICE_AGENTS.md` | Voice agents designed for real conversations—and real consequences | 2108 / 2143 | Pass | Pass | `futureVoiceElevenLabsAgent`, `futureVoiceTranscriptSource` | Pass | Pass |
| `/services/ai-receptionists` | `04_AI_RECEPTIONISTS.md` | A front desk that answers, qualifies and knows when to hand over | 2077 / 2079 | Pass | Pass | `futureReceptionistChatEmbedUrl`, `futureReceptionistElevenLabsAgent` | Pass | Pass |
| `/services/content-creation` | `05_CONTENT_CREATION.md` | Turn expertise into a governed content engine | 2080 / 2063 | Pass | Pass | Deterministic content atomisation plan | Pass | Pass |
| `/services/ai-automation` | `06_AI_AUTOMATION.md` | Engineer the work between your systems | 2048 / 2057 | Pass | Pass | Deterministic workflow control surface | Pass | Pass |
| `/services/ai-consulting` | `07_AI_AND_AUTOMATION_CONSULTING.md` | Decide what to automate before you buy the tools | 1952 / 1970 | Pass | Pass | Deterministic opportunity-prioritisation surface | Pass | Pass |

## Automated Verification

Passing commands from `/web`:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run staging:safety`
- `npm run test:e2e -- route-entry.spec.ts`

The unit suite includes source-hash, route mapping, route-entry copy, public phrase, benchmark/disclaimer, demo slot, metadata uniqueness, image-source, Aether geometry, and alias checks.

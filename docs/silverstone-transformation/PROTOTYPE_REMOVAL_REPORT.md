# Prototype Removal Report

**Date:** 2026-06-30  
**Scope:** Prompt 5.5 prototype removal and source-of-truth cleanup.

## Removed Static Prototype Pages

The obsolete static prototype service surface was deleted from `/web/public/prototypes/services/`:

- `ai-automation/demo.js`
- `ai-automation/index.html`
- `ai-receptionists/demo.js`
- `ai-receptionists/index.html`
- `ai-voice-agents/demo.js`
- `ai-voice-agents/index.html`
- `app-development/demo.js`
- `app-development/index.html`
- `content-creation/demo.js`
- `content-creation/index.html`
- `index.html`
- `web-design-development/demo.js`
- `web-design-development/index.html`

These files were not migration evidence for the frozen root app. They were stale `/web` public prototype surfaces and are no longer a valid runtime or preview fallback.

## Removed React Prototype Fallback

`web/src/visual/data/page-modules.tsx` no longer contains the obsolete service fallback implementation:

- Removed `SERVICE_MODULES`.
- Removed `SERVICE_STORIES`.
- Removed generic service cards, metric rails, signature diagrams, demo scenario configs, and old route-story strings.
- `ServicePageVisuals` now renders:
  - `/services` index decision matrix, or
  - `ApprovedServicePageVisuals` from `web/src/content/services/approved-services.ts` for the seven approved canonical service routes.

Industry visual modules remain intact.

## Removed Migrated Service Registry Entries

The seven canonical service pages are no longer registered as migrated content in `web/src/content/migrated/approved/registry.ts`. They now render only through the approved service content manifest:

- `/services/web-design-development`
- `/services/app-development`
- `/services/ai-voice-agents`
- `/services/ai-receptionists`
- `/services/content-creation`
- `/services/ai-automation`
- `/services/ai-consulting`

`web/src/routes/services/detail.tsx` now skips migrated-content loading for approved service routes and uses the approved service source path instead.

## Retained Evidence

The frozen legacy root application and legacy industry service pages remain untouched as migration evidence. They are not the active Replit/dev/preview runtime after this correction.

## Verification

- `rg` checks found no retained old service phrases in the active approved service rendering path.
- `web/tests/unit/migrated-content.test.ts` now asserts approved service routes are excluded from the migrated-content registry.
- `web/tests/e2e/services-rendering.spec.ts` asserts approved body copy appears in prerendered HTML and hydrated DOM, and forbidden prototype phrases are absent.

---
name: Node.js 22 navigator in SSR causes hydration mismatch
description: Node.js 22+ exposes navigator.hardwareConcurrency as a global; direct reads in component bodies produce server/client divergence → structural hydration cascade.
---

## The rule

Any function that reads `navigator.*` directly in a React component body (not via `useSyncExternalStore` with a server snapshot) will cause server/client divergence on Node.js 22+.

**Why:** Node.js 22.22.0 added `navigator` as a partial global. In the Replit container, `navigator.hardwareConcurrency = 2` (2 CPU container). The screenshot tool's Chromium reports a different count. `detectLowPower()` in `use-capability-tier.ts` was reading this directly in the component body → server computed `lowPower=true → tier="minimal" → motionEnabled=false`. The browser computed `motionEnabled=true`. `HeroAetherField` has `if (!enabled) return null` — presence/absence of the canvas element between server and client is a structural hydration mismatch → "Hydration failed" → cascade "Invalid hook call" during React 19 error recovery.

**How to apply:** Wrap any `navigator.*` / `window.*` / `document.*` read that varies between environments in `useSyncExternalStore` with a safe server snapshot:

```ts
function subscribeStatic() { return () => undefined; }
function getServerSnapshot() { return false; }

const lowPower = useSyncExternalStore(subscribeStatic, detectLowPower, getServerSnapshot);
```

The server snapshot must return a value that makes `motionEnabled=true` (i.e., `lowPower=false`, `reducedMotion=false`) so that conditionally-rendered animation components are present in BOTH the server HTML and the client's initial render. The attribute `data-tier` may still differ (balanced vs full) but attribute-only mismatches are warnings, not errors — structural presence/absence is the fatal case.

**Fix applied:** `web/src/visual/hooks/use-capability-tier.ts` — replaced `const lowPower = detectLowPower()` with `useSyncExternalStore(subscribeLowPower, detectLowPower, getServerLowPowerSnapshot)`.

**Verified:** After fix, server renders `data-tier="balanced"` (was "minimal"); browser logs show zero errors on service page load.

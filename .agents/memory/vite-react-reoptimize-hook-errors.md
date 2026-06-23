---
name: Vite dev re-optimization → Invalid hook call / Hydration failed
description: Why React Router 7 (ssr:false) dev shows transient "Invalid hook call"/"Hydration failed", and the canonical config fix.
---

# Transient "Invalid hook call (more than one copy of React)" + "Hydration failed" in dev

**Symptom:** Browser console shows these two errors intermittently in the `/web` dev preview, but fresh clean loads after the dev server settles are error-free. Static review of the render path finds no rules-of-hooks violation and no SSR-nondeterministic code.

**Root cause:** Vite mid-session **dependency re-optimization**. When the optimizer re-bundles deps (e.g. a lazily-imported dep is discovered, or a `vite.config.ts` edit forces a cold re-optimize), it triggers a full reload. A browser still holding the **stale** React chunk briefly mixes it with freshly-optimized modules → two React copies → "Invalid hook call" → that throws during hydration → "Hydration failed." Not an app-code bug.

**Why it's dev-only here:** `web/react-router.config.ts` has `ssr: false`. Routes not in the `prerender` list (including `/` home) are **client-rendered in production** (no hydration at all). The dev server still does on-demand SSR + hydrate, so the mismatch only exists in dev.

**Canonical fix (production-safe, in `web/vite.config.ts`):**
- `resolve.dedupe: ["react", "react-dom"]` — guarantees a single React instance; directly cures "more than one copy of React".
- `optimizeDeps.include: [...]` — pre-bundle React core + any **lazily-discovered** heavy deps so the optimizer doesn't re-run mid-session. The load-bearing entries are the lazily-imported ones (here `framer-motion`, `gsap`, used only by the dev-only `__components`/component-lab route). Statically-imported UI libs are already in the startup pass, so listing them is redundant (optional).

**How to apply:** If these errors reappear, do NOT hunt for a hooks bug first — restart the dev server and confirm fresh loads are clean. If they recur on clean loads, next lever is disabling `future.v8_viteEnvironmentApi` in dev only to isolate framework-level instability.

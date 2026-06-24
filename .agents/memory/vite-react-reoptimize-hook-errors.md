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
- `optimizeDeps.include: [...]` — pre-bundle React core **plus every runtime dep reached through the SSR'd route tree** so the optimizer never discovers one mid-session. This must include the UI libs the routes pull in (`radix-ui`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`), not just heavy animation deps (`framer-motion`, `gsap`).

**Correction (do not repeat the earlier mistake):** an earlier version of this note claimed statically-imported UI libs are "already in the startup pass, so listing them is redundant." That is FALSE for this app. When the route-wiring layer mounts shared primitives (Breadcrumb→`radix-ui`, icons→`lucide-react`, variant helpers→`cva`/`clsx`/`tailwind-merge`) into the route tree, Vite's startup scan does **not** reliably reach them under `ssr:false` framework mode. They get discovered on first request → re-optimize → full reload → dual-React flash on *nearly every load*, which blanks the Preview iframe (not a one-off). The decisive signal is the dev workflow log line `✨ new dependencies optimized: <names>` followed by `✨ optimized dependencies changed. reloading` — the named deps are exactly what's missing from `optimizeDeps.include`.

**How to apply:** Read the dev workflow log (via `refresh_all_logs`, not stale `/tmp/logs` snapshots) for the `new dependencies optimized: …` line, add every named dep to `optimizeDeps.include`, then `rm -rf web/node_modules/.vite` and restart so Vite pre-bundles the full set at boot. Verify by counting error bursts across warm loads (should drop to 0; one cold-compile flash at boot is normal). Only if errors persist on warm loads after this is it worth suspecting a real hooks/SSR bug or `future.v8_viteEnvironmentApi`.

# AGENTS.override

Codex instructions for `/web`, the active React application.

## Scope

- New website implementation work belongs under `/web`.
- Routes, components, styles, tests, content implementation, application assets, scripts, and integration adapters for the active site live under `/web`.
- To reduce token usage, search and read only the `/web` files relevant to the task. Run commands from `/web` and use scoped paths rather than repository-wide scans.
- Do not inspect the frozen legacy root implementation for ordinary `/web` work. Root-level reads are limited to repository instructions, active configuration, or a specifically named project document required by the current task.
- The frozen legacy root remains migration evidence unless the user explicitly names legacy-root files.
- Applicable records under `docs/silverstone-transformation/` are authoritative.

## Application Constraints

- Use the approved React Router/Vite architecture inside `/web`.
- Keep `/web` isolated from the frozen legacy root until a separately approved cutover.
- Preserve required route content, metadata, canonical tags, JSON-LD, links, pricing essentials, legal text, and conversion paths in initial HTML. Do not ship client-only shells for indexable routes.
- Each external integration must remain environment-aware, validated, mockable or safely disabled in staging, and free of production side effects during local or staging work.
- Source-controlled generated contracts under `web/src/**/generated/` may be changed only through documented scripts or with matching source evidence.

## Active V2 Presentation Invariants

- The active homepage uses the V2 dark cinematic presentation layer under `web/src/visual/home-v2/**`, `web/src/data/home-v2/**`, and `web/src/styles/visual/home-v2.css`, routed through `web/src/routes/company/home.tsx` to `home-v2.tsx`.
- The V2 rebuild changes presentation only; routing, data, content, SEO, and staging safety remain governed by the repository contracts.
- Shared route background systems, CoreSpin Loader, and Expendable Hero Button remain canonical unless the user explicitly authorizes a different background or entry system.
- Do not reintroduce removed hybrid intro backgrounds or route-specific background exceptions without a new owner decision and browser verification.

## Accessibility And Browser Behavior

- Preserve semantic landmarks, skip links, keyboard navigation, visible focus, labelled controls, sensible heading order, zoom/reflow, reduced motion, and accessible status messages.
- Preserve native scrolling. Do not add scroll hijacking, virtual scroll, or forced smoothing.
- WebGL, shader, and heavy motion effects must be optional, deferred, reduced-motion aware, low-power gated, and backed by static fallbacks.
- Images must reserve layout space through dimensions, aspect ratios, or stable containers.

## Conditional Specialist Guidance

- For image, asset, route redesign, or image-performance work, use `docs/codex/image-assets/page-image-selection-policy.md` and the verified image manifests.
- For skill/MCP selection, use `docs/codex/skill-mcp-routing.md` as an optional reference; no skill or MCP is required for routine code reading, small fixes, or local validation.
- Use component-library MCP servers only when a live registry or remote provider materially improves the task. Prefer existing project components and CLI commands first.

## Validation

- Run commands from `/web`.
- Match validation to the changed files. For narrow edits, use targeted tests or checks; for cross-cutting runtime changes, use the relevant subset of `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run staging:safety`.
- Use `npm run verify` and broad Playwright/E2E only for release-level, routing, rendering, deployment, or wide behavior changes.
- Do not claim success without fresh verification, and report any skipped or failing command exactly.

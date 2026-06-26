# AGENTS

This file defines the permanent operating contract for agents working in this repository.

## Repository Architecture

- This repository intentionally contains two website implementations.
- The legacy vanilla HTML, CSS, and JavaScript website at the repository root is frozen production and migration evidence.
- The active rebuild target is the React/Vite application under `/web`.
- Active `/web` work follows `/web/AGENTS.override.md`; read it before changing files under `/web`.
- `/docs/silverstone-transformation/` contains authoritative specifications, audits, decisions, route contracts, quality baselines, and handoff records.
- Do not assume future work happens on separate transformation branches. Future work occurs from the current repository state unless the user explicitly says otherwise.

## Non-Negotiable Production Protection

- Do not deploy, push, modify DNS, modify production Netlify settings, modify production environment variables, alter production Resend configuration, change production analytics identifiers or consent configuration, change production Calendly account/event settings, send production emails, or create real Calendly appointments unless a future prompt explicitly authorizes that exact action.
- Do not delete, overwrite, or migrate the legacy root application during `/web` rebuild work.
- Do not edit production `netlify.toml` behaviour unless the task is documentation-only or a future prompt explicitly authorizes deployment-layer work.
- Do not run destructive Git commands. `git reset --hard`, force checkout, and force push are prohibited unless the user explicitly asks for that exact operation.
- Never discard existing uncommitted user changes.
- Codex and Replit must not edit overlapping files concurrently.

## Workspace Skills And MCP

- Skill review is mandatory immediately after every prompt. Review relevant skills in `.agents/skills/`, keep re-reviewing as work evolves, and use configured MCP servers when their domain applies. See `.agents/SKILL_REVIEW_POLICY.md`.
- Use Context7 MCP for current library, framework, SDK, API, CLI, and cloud-service documentation whenever the user asks about those domains. Start with `resolve-library-id`, then query the selected docs.
- Shared skills live in `.agents/skills/`; Codex MCP server wiring is generated from `.mcp.json` into `.codex/config.toml`.
- After adding/removing a skill or editing `.mcp.json`, run `node .agents/sync-skills.mjs`; use `--check` for verification.

## Evidence-First Operating Loop

Repeat until the acceptance criteria are met:

1. Analyze: reproduce or inspect the existing behaviour, collect logs, route data, screenshots, or metrics, and map hypotheses to code or docs.
2. Measure: define the observable pass/fail signal.
3. Improve: make the smallest scoped change.
4. Verify: rerun the relevant command, route check, browser check, or regression test.
5. Record: update the relevant state, decision, route, asset, quality, or handoff document.

## Implementation Boundaries

- Presentation-layer rebuild work belongs under `/web/**`.
- The legacy root app is read-only migration evidence unless a future prompt explicitly names root legacy files.
- Non-`/web` edits are limited to governance, documentation, repository instructions, or explicitly approved configuration work.
- Do not import legacy CSS wholesale into `/web`.
- Do not reproduce the legacy DOM, duplicated page templates, or generated bundle architecture as the target model.
- Preserve useful content, assets, URLs, business details, integrations, and observable behaviour by contract, while redesigning presentation and implementation.

## Approved Technology Constraints

- The target implementation is React/Vite with React Router, TypeScript, Tailwind CSS, shadcn/ui primitives, GSAP, Framer Motion, and isolated shader/WebGL adapters as documented in `docs/silverstone-transformation/architecture/execution-blueprint-v1/target-architecture-v1.md`.
- Each external dependency must be accessed through an environment-aware adapter with validation, fallbacks, mocks, and no production side effects in staging.
- Essential route content, metadata, canonical tags, JSON-LD, links, pricing essentials, legal text, and conversion paths must be present in initial HTML. A client-only SPA shell is not acceptable for indexable routes.

## UI MCP And Component-Library Routing

- Use TypeUI primarily for the project's chosen design system, visual direction, layout guidance, and design tokens.
- Use Untitled UI React primarily for accessible React Aria-based application components, forms, navigation, dashboards, and conventional interface foundations.
- Use Aceternity primarily for intentional animation, motion, advanced visual effects, backgrounds, and high-impact marketing sections.
- Use 21st.dev Magic primarily for component inspiration, alternative visual concepts, and generated UI variants.
- Before adding a component, inspect the current project design system and existing components.
- Prefer reuse and adaptation over introducing duplicate components.
- Do not mix multiple component libraries within one component without a documented reason.
- Do not let a provider overwrite established project tokens, typography, spacing, global CSS, or accessibility behaviour.
- For any installation, inspect generated files and dependency changes before accepting them.
- Use only one provider as the primary visual authority for a given page or feature unless the user explicitly asks for a blend.
- Never use PRO-only assets unless authenticated access has been confirmed.

## Route Preservation

- The approved first-release migration baseline is the 50 canonical routes in `docs/silverstone-transformation/audits/route-inventory-v1.csv` and `web/src/data/generated/future-route-manifest.json`.
- Do not silently remove or rename any route because it is inconvenient.
- `/services/gyms-fitness-studios` remains canonical. `/services/gyms` is an unresolved alias/discrepancy until a fresh crawl and owner decision prove otherwise.
- Historical `.html`, `/niches/*`, long-form blog slug, and other audited redirect sources remain deployment-layer requirements. Do not add, remove, or alter redirects without an approved redirect diff.
- Sitemap, robots, breadcrumbs, metadata, schema, and internal links must be generated from the same governed route source.

## Content And Claims

- Work only from repository evidence, approved project documents, and existing functional behaviour.
- Never invent business claims, customers, testimonials, awards, performance metrics, integrations, or proof.
- Preserve exact legal content unless a future prompt explicitly authorizes legal copy changes.
- Unsupported quantified, absolute, guarantee-like, ROI, delivery-time, or performance claims must be substantiated, qualified, removed, or marked evidence-pending before reuse.
- Blog/article content and approved written content are migration assets; repetitive template wrappers are not.

## Functional Contracts

- Preserve `/contact` business behaviour: visible name/email/message intent, honeypot/abuse-prevention intent, accessible success/error states, and compatibility with `/.netlify/functions/send-email` unless an approved adapter/redirect replaces it.
- Preserve Resend environment-variable names as documentation-only references. Never commit secret values.
- Preserve Calendly booking intent and the production URL `https://calendly.com/silverstone-ai/30min`, but never create a real appointment during rebuild validation.
- Preserve analytics and consent requirements without contaminating production analytics. Staging analytics must be disabled or use a staging-only property.
- Preserve the Google Maps business-location purpose with accessible fallback.
- IndexNow is disabled outside an authorized production release.

## Environment Separation

- Local, CI, Replit preview, and integration staging must be non-indexable and incapable of production email, production booking, production analytics, or production indexing submissions.
- Staging requires both page-level robots metadata and `X-Robots-Tag` noindex headers.
- `.env.example` and staging env files may contain variable names and safe placeholders only.

## Accessibility, Performance, And Browser Verification

- Every route must support semantic landmarks, skip links, keyboard navigation, visible focus, labelled controls, sensible heading order, zoom/reflow, reduced motion, and accessible status messages.
- Preserve native scrolling. Do not use scroll hijacking, virtual scroll, or forced smoothing.
- WebGL/shader effects must be optional, deferred, reduced-motion aware, low-power gated, and backed by static fallbacks.
- Images must reserve layout space through dimensions, aspect ratios, or stable containers.
- Verify relevant changes in a browser across desktop and mobile. For visual or motion work, include reduced-motion and constrained-device checks.

## Validation Commands

- For root legacy SEO/indexability work: run `npm run seo:audit` and any targeted root build/sitemap command required by the change.
- For `/web` work: run commands from `/web`, normally `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run staging:safety`, and targeted Playwright tests. Use `npm run verify` only when the known format baseline is intentionally in scope.
- Do not claim success without fresh verification. If a validation command is known pre-existing failing, document the exact failure and run the narrower changed-file or targeted checks.

## Git Safety And Commits

- Check branch and worktree state before edits.
- Keep diffs minimal and scoped.
- Do not stage ignored dependency folders, build output, framework caches, coverage, Playwright reports, test results, local logs, `.DS_Store`, editor metadata, or unrelated user changes.
- Local commits are allowed when the user asks for them and the repository is in a safe state. Do not push unless explicitly requested.

## State Files

Update the relevant state files when architecture, routes, functional contracts, redirects, assets, quality baseline, or decisions change:

- `docs/silverstone-transformation/PROJECT_STATE.md`
- `docs/silverstone-transformation/ROUTE_MANIFEST.md`
- `docs/silverstone-transformation/FUNCTIONAL_CONTRACT.md`
- `docs/silverstone-transformation/ASSET_REUSE_MATRIX.md`
- `docs/silverstone-transformation/QUALITY_BASELINE.md`
- `docs/silverstone-transformation/REDIRECT_REQUIREMENTS.md`
- `docs/silverstone-transformation/DECISION_LOG.md`

## Prohibited Actions

- Deleting parallax code or forcing parallax off to fix layout issues.
- Changing spacing, typography, colour, copy, claims, or information architecture just to "improve" it outside the active task.
- Running repo-wide formatters that touch unrelated files.
- Fixing unrelated warnings or refactoring modules not required for the active outcome.
- Adding `noindex`, robots blocks, or removing canonical/sitemap entries unless explicitly required by the active ExecPlan.

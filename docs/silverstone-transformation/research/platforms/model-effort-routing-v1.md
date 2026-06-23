# Model and Effort Routing v1

**Date:** 2026-06-22  
**Scope:** Decision rules for ChatGPT, Codex macOS, and Replit Core.  
**Consumers:** C-01 and D-01.  
**No implementation:** This document does not authorise repository changes.

## Routing principles

1. **Recommendation:** Choose the platform before choosing the model. ChatGPT is the research and independent reasoning layer; Codex is the repository-native engineering layer; Replit is the visual iteration and Replit-hosted validation layer.
2. **Recommendation:** Start at the lowest setting likely to succeed, then escalate on evidence: failed tests, incomplete repository comprehension, repeated regressions, unresolved ambiguity, or a material risk boundary.
3. **Verified capability:** OpenAI recommends GPT-5.5 Medium as the balanced starting point and warns that higher reasoning effort is not automatically better. [OAI-01]
4. **Recommendation:** Extra High/xhigh is an exception setting, not a quality ritual. It is justified only for the hardest bounded tasks with explicit success criteria and a validation harness.
5. **Recommendation:** Do not use two agents to edit the same files concurrently. Use separate worktrees or branches and integrate only after review. Codex worktrees are explicitly designed for independent parallel tasks in Git repositories. [OAI-06]

## ChatGPT routing

| User-provided setting | Claim type | Recommended use | Avoid / escalation rule |
|---|---|---|---|
| GPT-5.5 Instant | User-provided availability + Recommendation | Fast clarification, prompt cleanup, small copy alternatives, formatting, simple comparison, or summarising already-grounded material. | Do not use as the primary environment for multi-source evidence synthesis, architecture decisions, or final QA adjudication. Escalate to Medium when multiple constraints interact. |
| GPT-5.5 Medium | User-provided availability + Recommendation | Default for scoped research, ordinary analysis, document drafting, requirements refinement, and workstream planning. | Escalate to High for conflicting evidence, large source sets, cross-platform architecture, high-stakes routing, or independent audit work. |
| GPT-5.5 High | User-provided availability + Recommendation | Deep official-source research, architecture challenge, SEO strategy, integration analysis, root-cause hypothesis generation, acceptance criteria, risk review, and final synthesis. | Do not use merely to rewrite simple text. Keep stopping rules and source constraints explicit because higher effort can over-search or overthink open-ended tasks. [OAI-01] |

**Unknown:** No official one-to-one mapping was established between ChatGPT's Instant/Medium/High labels and API reasoning-effort values.

## Codex model and effort routing

### GPT-5.5

| Effort | Claim type | Recommended use | Escalation boundary |
|---|---|---|---|
| Low | User-provided availability + Recommendation | Narrow repository lookup, simple file edits, small tests, static metadata, low-risk documentation, and deterministic fixes with clear file targets. | Move to Medium when more than a few files or runtime behaviour must be understood. |
| Medium | User-provided availability + Recommendation | Default engineering setting: repository inspection, ordinary features, routine refactors, frontend implementation, test repair, SEO implementation, and documentation linked to code. | Move to High for cross-cutting architecture, difficult bugs, complex integrations, or large refactors. |
| High | User-provided availability + Recommendation | Complex features, architecture-sensitive refactors, integration work, browser-driven debugging, shader implementation, performance defects, security-sensitive flows, and release QA. | Move to Extra High only after the task is tightly bounded and Medium/High has failed or an evaluation requires maximum depth. |
| Extra High (`xhigh`) | Verified effort name + User-provided availability + Recommendation | Rare escalation for the hardest multi-system defect, deeply coupled migration, ambiguous performance failure, non-trivial shader/rendering problem, or exhaustive final repair loop. | Do not use for routine implementation. OpenAI recommends xhigh only for the hardest asynchronous agentic tasks or boundary-testing evaluations. [OAI-01][OAI-02] |

### GPT-5.4

| Effort | Recommendation |
|---|---|
| Low | Mechanical, low-risk edits when GPT-5.5 is unnecessary. |
| Medium | Cost-conscious default for ordinary coding, tests, documentation, and predictable refactoring. |
| High | Complex work when GPT-5.5 is unavailable or when observed results show no need for the newer model. |
| Extra High (`xhigh`) | Generally prefer GPT-5.5 High first. Use only when continuity on GPT-5.4 matters and the task has a strong validation harness. |

**Verified capability:** GPT-5.4 is positioned as a more affordable full model for coding and professional work and supports all listed reasoning-effort values. [OAI-03]

### GPT-5.4 mini

| Effort | Recommendation |
|---|---|
| Low | File classification, inventories, grep-led inspection, formatting, metadata edits, and simple documentation. |
| Medium | Bulk repetitive edits, test scaffolds, lint/type fixes, static page generation from a fixed template, and well-specified component variants. |
| High | Use sparingly for a bounded high-volume task where mini's speed/efficiency remains valuable and the output is automatically validated. |
| Extra High (`xhigh`) | Usually inefficient routing. Prefer GPT-5.5 Medium/High for genuinely hard work. |

**Verified capability:** GPT-5.4 mini is designed for faster, high-volume workloads and supports coding, computer use, subagents, and all listed reasoning-effort values. [OAI-04]

## Codex feature routing

| Need | Verified capability | Recommendation |
|---|---|---|
| Parallel implementation | Worktrees isolate independent tasks in the same Git project. [OAI-06] | Use one worktree per substantial workstream; merge only after tests and review. |
| Visual frontend debugging | In-app browser can operate unauthenticated local/public pages, inspect rendered state, take screenshots, and verify fixes. [OAI-07] | Pair GPT-5.5 Medium/High with browser use for UI bugs and responsive regression checks. |
| Authenticated or desktop-only flow | Computer use can interact with approved desktop apps; the in-app browser does not inherit normal cookies or signed-in state. [OAI-07][OAI-08] | Keep the task narrow and supervised. Prefer a manual browser or test account when practical. |
| Change review | Review pane shows repository diffs and supports inline feedback, staging, and reversion. [OAI-09] | Require a review pass before integration; use a separate review thread for high-risk changes. |
| Persistent repository policy | `AGENTS.md` is loaded before work and supports layered overrides. [OAI-10] | Store commands, architecture boundaries, coding conventions, and mandatory validation there. |
| Repeatable procedure | Skills package instructions, scripts, references, and assets. [OAI-11] | Create skills for SEO checks, schema validation, accessibility smoke tests, and release checklists. |

## Replit Core routing

| Mode/tool | Claim type | Recommended use | Core constraint / caveat |
|---|---|---|---|
| Plan Mode | Verified capability + Recommendation | Explore UI directions, break work into tasks, and discuss Replit-specific architecture without changing code or data. [REP-03] | Billable even without code changes. [REP-11] |
| Lite | Verified capability + Recommendation | Tiny UI polish, obvious bugs, direct content changes, and short iteration loops. [REP-02] | App Testing and Code Optimizations remain off. [REP-02] |
| Economy | Verified capability + Recommendation | Default Replit Agent mode for routine visual and Replit-specific implementation with cost control. [REP-02] | Use High effort only when the hard portion justifies it. |
| Power | Verified capability + Recommendation | Production-grade Replit work, difficult visual integration, larger changes, or complex Replit configuration. [REP-02] | Official changelog identifies Claude Opus 4.7 as the current Power model as of 2026-04-17. [REP-15] |
| High effort | Verified capability + Recommendation | Difficult refactor, persistent bug, or complex visual/functional task in Economy or Power. [REP-02] | Selective routing; up to ~2x cost on the toughest tasks. Do not leave on for routine changes. [REP-02] |
| Turbo | Verified capability | Fastest Power responses. [REP-02] | Not available on Core; do not include in the Silverstone plan. [REP-02][REP-11] |
| Canvas | Verified capability + Recommendation | Generate and compare visual directions without committing immediately to the live app. [REP-04] | Separate mockups from source-of-truth implementation until selected. |
| Visual Editor | Verified capability + Recommendation | Direct text, colour, spacing, layout, and image polish. [REP-05] | Simple edits can be no-credit; complex edits route to Agent. Web-only. [REP-05] |
| Preview | Verified capability + Recommendation | Responsive checks, devtools inspection, and live interaction through a temporary URL. [REP-06] | Preview is not proof of published-environment parity. [REP-14] |
| App Testing | Verified capability + Recommendation | Critical user-flow smoke tests for supported web apps. [REP-13] | Available in Economy/Power, effort-billed, and not a replacement for repository tests or manual sign-off. |

## Escalation ladder

1. **Recommendation:** Clarify scope and acceptance criteria in ChatGPT Medium or Replit Plan Mode.
2. **Recommendation:** Use Codex GPT-5.4 mini Low/Medium or GPT-5.5 Low for deterministic, low-risk work.
3. **Recommendation:** Use Codex GPT-5.5 Medium for normal implementation.
4. **Recommendation:** Use Codex GPT-5.5 High for cross-cutting or difficult work; use a worktree and explicit test gate.
5. **Recommendation:** Use GPT-5.5 Extra High only after documenting why High was insufficient and what automated or manual evaluation will determine success.
6. **Recommendation:** Use Replit Power + High effort only when the task specifically benefits from Replit's visual/runtime context; otherwise keep the hard engineering task in Codex.

## Model disclosure and usage uncertainty

**Verified capability:** Replit currently names Claude Opus 4.7 for Power mode. [REP-15]

**Unknown:** Exact models for Lite, Economy, High effort routing, App Testing, and Code Optimizations are not completely disclosed in the current official sources. Route by mode behaviour, not inferred vendor models. [REP-02][REP-11]

**Unknown:** Precise task-level ChatGPT/Codex subscription usage and future Replit credits cannot be responsibly forecast from the official documentation. Use relative routing, platform meters, and observed completed-task cost. [REP-11][REP-12]

## Source registry

- **OAI-01** — Using GPT-5.5: https://developers.openai.com/api/docs/guides/latest-model
- **OAI-02** — GPT-5.5 model: https://developers.openai.com/api/docs/models/gpt-5.5
- **OAI-03** — GPT-5.4 model: https://developers.openai.com/api/docs/models/gpt-5.4
- **OAI-04** — GPT-5.4 mini model: https://developers.openai.com/api/docs/models/gpt-5.4-mini
- **OAI-05** — Codex app features: https://developers.openai.com/codex/app/features
- **OAI-06** — Codex app worktrees: https://developers.openai.com/codex/app/worktrees
- **OAI-07** — Codex in-app browser: https://developers.openai.com/codex/app/browser
- **OAI-08** — Codex computer use: https://developers.openai.com/codex/app/computer-use
- **OAI-09** — Codex app review pane: https://developers.openai.com/codex/app/review
- **OAI-10** — Codex AGENTS.md guidance: https://developers.openai.com/codex/guides/agents-md
- **OAI-11** — Codex Agent Skills: https://developers.openai.com/codex/skills
- **REP-01** — Replit pricing and plans: https://docs.replit.com/help/pricing-and-plans
- **REP-02** — Replit Agent modes: https://docs.replit.com/references/agent/agent-modes
- **REP-03** — Replit Plan mode: https://docs.replit.com/references/agent/plan-mode
- **REP-04** — Replit Canvas: https://docs.replit.com/learn/design/canvas
- **REP-05** — Replit Visual Editor: https://docs.replit.com/learn/design/visual-editor
- **REP-06** — Replit Preview: https://docs.replit.com/references/editor/preview
- **REP-07** — Replit checkpoints and rollbacks: https://docs.replit.com/references/version-control/checkpoints-and-rollbacks
- **REP-08** — Replit version control: https://docs.replit.com/learn/projects-and-artifacts/version-control
- **REP-09** — Replit replit.md: https://docs.replit.com/references/project-setup/replit-dot-md
- **REP-10** — Replit app configuration: https://docs.replit.com/references/project-setup/configuration
- **REP-11** — Replit AI billing: https://docs.replit.com/billing/ai-billing
- **REP-12** — Replit managing spend: https://docs.replit.com/billing/managing-spend
- **REP-13** — Replit App Testing: https://docs.replit.com/references/agent/app-testing
- **REP-14** — Replit publishing troubleshooting: https://docs.replit.com/build/troubleshooting
- **REP-15** — Replit April 17, 2026 changelog: https://docs.replit.com/updates/2026/04/17/changelog
- **REP-16** — Replit Agent integrations: https://docs.replit.com/references/integrations/overview
- **REP-17** — Replit Agent overview: https://docs.replit.com/references/agent/overview

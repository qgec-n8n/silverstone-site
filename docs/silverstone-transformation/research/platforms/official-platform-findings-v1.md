# Official Platform Findings v1

**Research date:** 2026-06-22  
**Scope:** Platform and model routing for the Silverstone website transformation.  
**Implementation status:** Research only; no repository changes were made.  
**Downstream consumers:** C-01 and D-01. Their identifiers were supplied by the user; their detailed scopes were not supplied and are therefore not inferred.

## Claim taxonomy

- **Verified capability** — directly stated in current official OpenAI or Replit documentation.
- **User-provided availability** — a model, effort level, plan, or setting explicitly stated by the user as available in their environment.
- **Recommendation** — a routing decision derived from the verified capabilities and the transformation workstreams.
- **Inference** — a conclusion formed by combining verified facts; it is not an explicit vendor statement.
- **Unknown** — material information not established by the official sources reviewed.

## Executive finding

**Recommendation:** Use a three-layer workflow. Use ChatGPT GPT-5.5 High for evidence gathering, cross-source synthesis, architecture challenge, SEO strategy, and independent QA planning. Use Codex macOS as the primary repository-native engineering environment for inspection, implementation, refactoring, debugging, reviews, and test execution. Use Replit Core selectively for Canvas-led visual exploration, direct visual edits, responsive Preview, App Testing, and Replit-specific staging or configuration. Keep the Git repository as the source of truth and avoid duplicating architecture decisions across platforms.

**Inference:** This division reduces context loss: ChatGPT is strongest as the independent research and reasoning layer; Codex has the most direct repository, Git, worktree, review, browser, computer-use, AGENTS.md, and Skills affordances; Replit provides the strongest documented visual editing loop and integrated preview/testing surface. [OAI-05][OAI-06][OAI-07][OAI-08][OAI-09][OAI-10][OAI-11][REP-04][REP-05][REP-06][REP-13]

## OpenAI models

### GPT-5.5

**Verified capability:** OpenAI describes GPT-5.5 as its newest frontier model for the most complex professional work, with text and image input, text output, a 1,050,000-token context window, and configurable reasoning effort values `none`, `low`, `medium`, `high`, and `xhigh`; `medium` is the documented default. [OAI-01][OAI-02]

**Verified capability:** OpenAI recommends `medium` as the balanced starting point; `low` for efficient reasoning; `high` for complex agentic tasks where latency matters less; and `xhigh` for the hardest asynchronous agentic tasks or boundary-testing evaluations. OpenAI also states that higher effort is not automatically better and should be increased only when evaluation shows a measurable gain. [OAI-01]

**User-provided availability:** In ChatGPT, the available labels are GPT-5.5 Instant, Medium, and High. In Codex macOS, GPT-5.5 is available at Low, Medium, High, and Extra High.

**Unknown:** The reviewed official documentation does not establish a stable one-to-one mapping between the user-facing ChatGPT labels `Instant`, `Medium`, and `High` and API `reasoning.effort` values. The report therefore treats the ChatGPT labels as relative user-facing settings rather than claiming an API-equivalent configuration.

### GPT-5.4

**Verified capability:** OpenAI describes GPT-5.4 as a frontier model for complex professional work and a more affordable model for coding and professional work. It supports `none`, `low`, `medium`, `high`, and `xhigh` reasoning effort and a 1,050,000-token context window. [OAI-03]

**User-provided availability:** In Codex macOS, GPT-5.4 is available at Low, Medium, High, and Extra High.

**Recommendation:** Use GPT-5.4 as the cost-conscious full-model fallback for routine repository work, mechanical refactoring, ordinary tests, and documentation when GPT-5.5's incremental capability is not needed. Do not automatically raise GPT-5.4 to Extra High for a hard task; first consider GPT-5.5 High, because the newer model is the stronger default for the most complex work. [OAI-01][OAI-02][OAI-03]

### GPT-5.4 mini

**Verified capability:** OpenAI describes GPT-5.4 mini as a faster, more efficient model for high-volume workloads and as its strongest mini model for coding, computer use, and subagents. It supports `none`, `low`, `medium`, `high`, and `xhigh` reasoning effort and a 400,000-token context window. [OAI-04]

**User-provided availability:** In Codex macOS, GPT-5.4-mini is available at Low, Medium, High, and Extra High. The official model display name is “GPT-5.4 mini”; the user-provided UI label contains a hyphen.

**Recommendation:** Route repetitive, well-specified, low-risk work to GPT-5.4 mini Low or Medium: file inventories, metadata sweeps, static copy placement, test scaffolds, lint fixes, documentation updates, and bulk mechanical edits. Escalate to a full model instead of using mini High or Extra High when the task requires architecture judgment, difficult debugging, cross-cutting refactoring, security-sensitive integration work, or subtle visual correctness.

## Codex macOS

### Repository-native execution

**Verified capability:** The Codex app supports parallel project threads, built-in worktrees, automations, Git functionality, and Skills. [OAI-05]

**Verified capability:** Codex worktrees allow independent tasks in the same Git project without interfering with one another. Worktrees require a Git repository, and automations use dedicated background worktrees for Git repositories. [OAI-06]

**Recommendation:** Make Codex the primary implementation environment. Use a dedicated worktree or branch for each substantial workstream, keep one objective per thread, and reserve the local checkout for integration and final validation.

### Browser and computer interaction

**Verified capability:** The Codex in-app browser provides a shared rendered-page view, supports local development servers, file-backed previews, public pages without sign-in, visual comments, clicking, typing, screenshots, read-only page inspection JavaScript, and fix verification. It does not support normal browser profiles, existing cookies, extensions, or authenticated flows. [OAI-07]

**Verified capability:** Codex computer use can view and interact with allowed desktop applications, subject to installation, OS permissions, app-level approvals, and safety constraints. [OAI-08]

**Recommendation:** Use the in-app browser for unauthenticated frontend reproduction and regression verification. Use computer use only for narrow, supervised desktop flows that cannot be validated through the repository, shell, or browser. Do not make computer use the default coding path.

### Review, persistent guidance, and repeatable workflows

**Verified capability:** The Codex review pane is Git-dependent and can show all uncommitted repository changes, all branch changes, or the last turn's changes. It supports staging, reversion, and line-specific feedback. [OAI-09]

**Verified capability:** Codex reads `AGENTS.md` before work, layers global and project-specific guidance, and allows more specific nested guidance to override broader instructions. [OAI-10]

**Verified capability:** Codex Skills package instructions, resources, optional scripts, references, and assets into reusable workflows, and are available in the CLI, IDE extension, and Codex app. [OAI-11]

**Recommendation:** Put stable repository rules, commands, architecture boundaries, and validation gates in `AGENTS.md`. Put repeatable multi-step procedures—such as SEO page validation, visual regression checks, structured-data verification, or release readiness—in Skills. Keep one-off task detail in the thread prompt.

## Replit Core

### Plan availability

**Verified capability:** Replit Core includes monthly credits, full Agent access with Plan and Build modes, up to five collaborators, unlimited published apps, and a seven-day database restore window. [REP-01]

**Verified capability:** Replit's current Core feature table includes Agent chat, Lite build, full build, Canvas, Visual Editor, Plan Mode, connectors, one active background task, and unlimited published apps; Turbo is not available on Core. [REP-11]

**Inference:** Core supports Lite, Economy, and Power because the Agent overview lists those modes as Core capabilities and the mode documentation makes High effort available in Economy and Power. Therefore Core can use High effort, but not Turbo. [REP-02][REP-11][REP-17]

### Agent modes and High effort

**Verified capability:** Replit documents Lite for quick scoped edits, Economy for cost-conscious everyday work, and Power for complex tasks, larger codebases, and production-grade projects. High effort is an opt-in toggle in Economy and Power that selectively invokes the most capable frontier models for genuinely hard parts of a task. [REP-02]

**Verified capability:** Replit states that High effort can add up to approximately twice the cost on the toughest tasks, while adding little or no cost on simpler work. Turbo is Power-only, approximately twice the cost of Power, and limited to Pro and Enterprise. [REP-02]

**Recommendation:** On Core, use Lite for narrow UI or bug-fix loops; Economy for ordinary Replit work; Power for production-grade or codebase-wide work; and High effort only for difficult visual integration, complex refactoring, or persistent defects. Do not purchase credits merely to keep High effort permanently enabled.

### Plan mode, Canvas, Visual Editor, Preview, and App Testing

**Verified capability:** Plan Mode supports brainstorming, architecture planning, structured task lists, and guidance without changing code or data. [REP-03]

**Verified capability:** Canvas supports live app frames, separate design mockups, side-by-side visual exploration, screenshots, references, and application of chosen designs back to an app. [REP-04]

**Verified capability:** Visual Editor can directly change text, colours, spacing, layout, and images in Canvas or Preview. Simple deterministic edits update source code without consuming AI credits; more complex changes route to Agent. Visual Editor is web-only. [REP-05]

**Verified capability:** Preview provides a temporary internet-reachable URL, live interaction, developer tools, and responsive device-size testing. [REP-06]

**Verified capability:** App Testing can navigate supported web apps like a user, test UI and functionality, analyse failures, and self-correct; it is available in Economy or Power, not Lite, and is usage-billed by effort. [REP-13]

**Recommendation:** Replit's highest-value role in this transformation is visual convergence: explore directions in Canvas, apply deterministic polish in Visual Editor, inspect responsive states in Preview, and use App Testing for selected critical flows. Move architecture-heavy and repository-wide edits back to Codex.

### Git, checkpoints, project guidance, and configuration

**Verified capability:** Replit version control uses the same underlying Git repository across Agent checkpoints, Git pane, Git CLI, and file history. [REP-08]

**Verified capability:** Agent checkpoints can be reviewed and rolled back, restoring project files, database state, and AI context. [REP-07]

**Verified capability:** Replit automatically reads root-level `replit.md` to understand project architecture, coding conventions, package managers, and dependencies. [REP-09]

**Verified capability:** Replit apps use `.replit` and `replit.nix` for run behaviour, environment, system dependencies, and deployment configuration. [REP-10]

**Recommendation:** Keep `replit.md` aligned with `AGENTS.md` but avoid contradictory duplicated rules. Use `replit.md` for Replit-specific behaviour and commands; keep canonical engineering policy in repository documentation. Commit or checkpoint before Agent-led visual or configuration changes.

### Staging and production behaviour

**Verified capability:** Replit explicitly documents that an app can work in Preview but fail to publish or behave differently at its public URL. [REP-14]

**Inference:** A Replit Preview URL is a development verification surface, not proof of production parity. A deployment or staging release must be validated separately with its own environment variables, build command, routing, asset paths, caching, and integration configuration. [REP-06][REP-10][REP-14]

**Recommendation:** For the Silverstone transformation, use a dedicated Git branch and preview deployment as the release candidate. Use Replit Preview as an additional visual and functional check, not as the sole staging gate.

## Replit underlying model disclosure

**Verified capability:** Replit's April 17, 2026 official changelog states that Power mode runs on Anthropic Claude Opus 4.7. [REP-15]

**Verified capability:** Replit's current mode documentation otherwise describes Lite as using fast lightweight models, Economy as cost-optimised, Power as more capable, and High effort as selectively invoking its most capable frontier models. [REP-02]

**Unknown:** The official sources reviewed do not disclose a complete, stable model roster or routing map for Lite, Economy, High effort, App Testing, Code Optimizations, or every subtask. Replit also notes that some Agent services may use third-party APIs such as Claude, ChatGPT, and Gemini-family services, but this does not identify the exact model used for each request. [REP-11]

**Recommendation:** Route Replit work by documented mode behaviour and observed output quality, not by assumed hidden model identity. Re-check the changelog before any future report that depends on a named underlying model.

## Usage and credit estimability

**Verified capability:** Replit bills Agent usage by actual effort and task complexity. Plan Mode text guidance is billable even when no code checkpoint is created. Replit exposes completed-task pricing and usage dashboards, and Core users can purchase non-renewing credit packs that expire after six months. [REP-11][REP-12]

**Unknown:** The official sources reviewed do not provide a responsible formula for predicting precise Replit credits for a specific future coding task before execution. Repository size, prompt scope, model routing, tool use, testing, retries, generated assets, and third-party Agent services materially affect consumption.

**Unknown:** The official OpenAI sources reviewed do not provide task-level ChatGPT or Codex subscription consumption figures for the user-facing model and effort settings. API token pricing is not equivalent to subscription usage, and should not be used to fabricate per-task subscription estimates. [OAI-02][OAI-03][OAI-04]

**Recommendation:** Use relative effort bands and post-task measurements. Track each workstream's actual Replit credit usage and Codex/ChatGPT limit impact, then refine routing from observed data. Do not publish estimated credits or “prompts remaining” without a platform-provided meter.

## Official source registry

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

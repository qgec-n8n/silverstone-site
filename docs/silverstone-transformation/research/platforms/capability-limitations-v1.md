# Capability Limitations v1

**Date:** 2026-06-22  
**Purpose:** Prevent over-claiming, unsafe routing, and false cost certainty.  
**Consumers:** C-01 and D-01.

## OpenAI limitations

### ChatGPT label mapping

**Unknown:** The reviewed official sources do not establish a stable technical mapping from ChatGPT GPT-5.5 `Instant`, `Medium`, and `High` to API `reasoning.effort` values. Treat them as user-facing relative settings.

### Subscription usage

**Unknown:** API token pricing cannot be used to calculate ChatGPT or Codex subscription consumption. No precise task-level subscription figure is supplied in the sources reviewed. [OAI-02][OAI-03][OAI-04]

### Higher effort

**Verified capability:** Higher GPT-5.5 reasoning effort is not automatically better and can cause overthinking or unnecessary searching when instructions, stopping rules, or tool boundaries are weak. [OAI-01]

**Recommendation:** Require explicit success criteria, repository boundaries, and test commands before High or Extra High work.

### Codex worktrees and review

**Verified capability:** Worktrees require a Git repository, and the review pane also requires a Git repository. [OAI-06][OAI-09]

**Limitation:** Worktrees isolate files but do not automatically resolve architectural conflicts, incompatible migrations, shared external state, or competing changes to the same dependency.

### Codex browser

**Verified capability:** The in-app browser does not use the user's normal browser profile, cookies, extensions, existing tabs, or authenticated state. [OAI-07]

**Limitation:** It cannot be the sole validator for signed-in dashboards, payment flows, OAuth, extension-dependent pages, or production-only access controls.

### Computer use

**Verified capability:** Computer use requires installation, OS permissions, per-app approval, and supervised handling of sensitive or disruptive actions. [OAI-08]

**Limitation:** It is slower and less deterministic than repository or browser automation, and visible screen content may be processed as task context. Use it narrowly.

### AGENTS.md and Skills

**Verified capability:** `AGENTS.md` is loaded into the instruction chain and has size/scope behaviour; Skills use progressive disclosure and load full instructions when selected. [OAI-10][OAI-11]

**Limitation:** Conflicting, stale, oversized, or ambiguous guidance can degrade output. These files require versioned maintenance and periodic pruning.

## Replit limitations

### Underlying models

**Verified capability:** Power mode is officially identified as Claude Opus 4.7 in the April 17, 2026 changelog. [REP-15]

**Unknown:** Exact current models and routing for Lite, Economy, High effort, App Testing, Code Optimizations, and every internal subtask are not fully disclosed. [REP-02][REP-11]

**Limitation:** A named model in one mode should not be extrapolated to other modes or future dates.

### Core plan

**Verified capability:** Core includes full build, Plan Mode, Canvas, Visual Editor, connectors, one active background task, and unlimited published apps; Turbo is excluded. [REP-11]

**Limitation:** “Full build” and access to a mode do not guarantee fixed latency, fixed quality, or fixed per-task credit use.

### Effort-based billing

**Verified capability:** All Agent interactions are billable, including Plan Mode guidance without code changes. Complexity and actual work affect cost. [REP-11]

**Unknown:** No deterministic pre-execution credit estimate exists in the reviewed documentation.

**Limitation:** Long prompts, broad tasks, retries, App Testing, generated assets, and third-party services can increase actual usage unpredictably.

### Visual Editor

**Verified capability:** Direct simple changes can avoid AI credits, but complex edits are automatically handed to Agent. Visual Editor is web-only. [REP-05]

**Limitation:** A seemingly simple visual request may conceal component, state, responsive, or design-system complexity and therefore trigger Agent use.

### Preview and staging

**Verified capability:** Preview provides a temporary reachable URL and responsive/devtools inspection, but Replit acknowledges that published behaviour can differ from Preview. [REP-06][REP-14]

**Limitation:** Preview does not validate production environment variables, cache/CDN behaviour, final domains, redirects, security headers, analytics, third-party allowlists, or deployment-specific build differences unless explicitly reproduced.

### App Testing

**Verified capability:** App Testing is effort-billed, available in Economy and Power, and currently limited to supported web application types described by Replit. [REP-13]

**Limitation:** It is not exhaustive browser coverage, security testing, accessibility certification, cross-browser certification, or proof of production correctness.

### Checkpoints and Git

**Verified capability:** Checkpoints integrate with Git and can restore project files, database state, and AI context. [REP-07][REP-08]

**Limitation:** Rollback can discard intended changes, does not replace remote repository backup, and may not reverse external side effects in third-party systems.

### replit.md and configuration

**Verified capability:** `replit.md` guides Agent; `.replit` and `replit.nix` control project behaviour, dependencies, and deployment configuration. [REP-09][REP-10]

**Limitation:** Duplicating the same rules in `replit.md`, `AGENTS.md`, prompts, and project documentation can create drift. Assign one canonical owner for each rule.

## Transformation-specific guardrails

1. **Recommendation:** Do not let Replit Agent and Codex edit the same branch simultaneously.
2. **Recommendation:** Do not use Replit Preview as the only staging approval.
3. **Recommendation:** Do not use GPT-5.4 mini for final architecture, high-risk integrations, shaders with difficult performance constraints, or release adjudication.
4. **Recommendation:** Do not use Extra High without a bounded question and validation harness.
5. **Recommendation:** Do not infer Replit credit cost from task wording alone.
6. **Recommendation:** Do not infer hidden Replit models beyond official disclosures.
7. **Recommendation:** Require human approval before production deployment, secrets changes, payment changes, DNS changes, or destructive database actions.

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

# Usage Efficiency Guidance v1

**Date:** 2026-06-22  
**Objective:** Minimise subscription and credit waste without reducing transformation quality.  
**Consumers:** C-01 and D-01.

## What can and cannot be estimated

**Verified capability:** Replit uses effort-based pricing. Simple requests generally cost less than complex builds; Plan Mode is still billable; completed work is reflected in usage records; and some Agent services can add third-party API charges to Replit credits. [REP-11]

**Verified capability:** Replit states that High effort can add up to approximately twice the cost on the toughest tasks, while Turbo is approximately twice Power and is unavailable on Core. [REP-02][REP-11]

**Unknown:** A precise future credit figure for “refactor the Silverstone site,” “build the shader,” or “run QA” cannot be estimated responsibly before the task is executed. The official documentation does not provide a deterministic task-to-credit formula.

**Unknown:** ChatGPT and Codex subscription consumption cannot be converted responsibly into API-token cost or a fixed number of tasks. The API model pages publish token pricing, but that is not evidence of the user's subscription accounting. [OAI-02][OAI-03][OAI-04]

**Recommendation:** Use only three forecast bands—low, medium, high—based on task scope and expected tool activity. Record actual consumption after each workstream and use the result to tune future allocation.

## Efficiency rules

### 1. Separate thinking from editing

**Recommendation:** Complete research, requirements, acceptance criteria, and architecture decisions in ChatGPT before asking Codex or Replit to edit. This prevents paid implementation loops caused by unresolved scope.

**Verified capability:** Replit Plan Mode can plan without changing code or data, but remains billable. [REP-03][REP-11]

**Recommendation:** Prefer ChatGPT Medium/High for platform-neutral planning already covered by the ChatGPT subscription; use Replit Plan Mode only when the plan needs live project context or Replit-specific capabilities.

### 2. Use the cheapest sufficient coding route

- **Recommendation:** GPT-5.4 mini Low/Medium for inventories, repetitive changes, test scaffolds, metadata, and documentation.
- **Recommendation:** GPT-5.4 Medium for predictable implementation and mechanical refactors.
- **Recommendation:** GPT-5.5 Medium as the normal Codex default for production changes.
- **Recommendation:** GPT-5.5 High for complex architecture, integrations, hard debugging, shaders, and high-risk QA.
- **Recommendation:** GPT-5.5 Extra High only after a documented escalation trigger.

**Verified capability:** OpenAI recommends GPT-5.5 Medium as a balanced starting point and says higher effort should be justified by measurable quality gain. [OAI-01]

### 3. Constrain context and concurrency

**Recommendation:** Give each Codex thread one workstream, explicit file boundaries, test commands, and a stopping condition. Use worktrees for independent parallel changes. [OAI-06]

**Recommendation:** Do not run Codex and Replit Agent against the same branch concurrently. Parallel activity increases merge conflicts and can cause each agent to reason from stale files.

**Recommendation:** Keep `AGENTS.md` concise and canonical; use nested overrides only where rules genuinely differ. Store reusable procedures in Skills rather than repeating long prompts. [OAI-10][OAI-11]

### 4. Reserve Replit for its comparative advantages

**Recommendation:** Use Replit when the task benefits from Canvas, Visual Editor, responsive Preview, App Testing, Replit configuration, or Replit-managed integrations. [REP-04][REP-05][REP-06][REP-10][REP-13][REP-16]

**Recommendation:** Avoid spending Replit credits on broad research, generic code explanation, large repository audits, or documentation that ChatGPT/Codex can complete without the Replit runtime.

**Verified capability:** Direct Visual Editor changes to text, colours, spacing, and similar properties can update source code without AI credits; complex changes route to Agent. [REP-05]

### 5. Use Replit modes intentionally on Core

| Task type | Core mode | High effort | Rationale |
|---|---|---|---|
| Direct visual tweak | Visual Editor or Lite | Off | Deterministic direct edits may be no-credit; Lite is scoped and lightweight. [REP-02][REP-05] |
| Ordinary Replit implementation | Economy | Off | Cost-optimised default. [REP-02] |
| Production-grade Replit task | Power | Off initially | More capable mode for harder problems and larger codebases. [REP-02] |
| Persistent complex defect or refactor | Power | On for the bounded attempt | High effort is intended for complex features, large refactors, and tricky bugs. [REP-02] |
| Fastest possible response | Not available on Core | N/A | Turbo is Pro/Enterprise only. [REP-02][REP-11] |

### 6. Measure before buying Replit credit packs

**Verified capability:** Core and Pro users can purchase credit packs; packs do not renew, expire after six months, and are consumed automatically. [REP-12]

**Recommendation:** Purchase a pack only when all of the following are true:

1. The remaining task materially benefits from Replit-specific visual/runtime tools.
2. The task has a bounded plan and acceptance criteria.
3. The current account meter shows insufficient remaining credits.
4. Equivalent work cannot be routed to Codex or ChatGPT without losing the required Replit context.
5. A spending limit is configured before the task starts.

**Recommendation:** Do not pre-purchase a large pack based on a speculative task estimate.

### 7. Build an empirical routing ledger

Create a simple internal ledger with:

- workstream ID;
- platform and model/mode;
- effort level;
- files or pages affected;
- test/tool calls used;
- number of correction cycles;
- Replit credits shown after completion;
- outcome quality and defects found in review;
- whether escalation improved the result.

**Recommendation:** After three to five comparable tasks, update the routing policy from observed Silverstone data rather than generic assumptions.

## Suggested budget posture

**Recommendation:** Use the existing ChatGPT and Codex subscriptions as the default capacity. Treat Replit credits as a scarce specialist budget for visual development, runtime-specific debugging, and selected browser testing. Purchase additional Replit credits only against a defined backlog item, not for open-ended exploration.

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

# ExecPlans

This repo uses “ExecPlans” as self-contained design-and-implementation documents that Codex must follow for complex or multi-step work. ExecPlans are defined in `.agent/PLANS.md`.

## When to use an ExecPlan

- For any multi-file change, new page, or significant layout/design-system work, including **all work on the Real Estate niche landing page for estate/letting agents**, you MUST create or update an ExecPlan and work from it end-to-end.
- For quick, low-risk tweaks confined to a single file (for example: small copy edits or a tiny style adjustment that clearly mirrors an existing pattern), you MAY skip an ExecPlan.

## How Codex should use ExecPlans

- Before taking any action on a planned task, read `.agent/PLANS.md` and the relevant ExecPlan in full.
- Treat the ExecPlan as the primary specification for your work, alongside the current working tree. If the ExecPlan and existing code conflict, assume the ExecPlan reflects the desired future state.
- Keep ExecPlans as living documents:
  - Always keep the `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections accurate as work proceeds.
  - When you pause or finish a block of work, update `Progress` so that a novice can see what is done and what remains.
- When the user asks you to “follow the Real Estate ExecPlan” (or similar), locate the corresponding file under `.agent/plans/` (for example `.agent/plans/real-estate-landing-page.md`), read it carefully, and then execute it step by step.
- When a task is clearly small and localized (for example: “change one CTA label” or “tweak spacing on an existing card”), you can work directly without drafting an ExecPlan, but you should still respect the design system and safety practices described in the ExecPlans you have seen.
- When launched under a system prompt that automatically runs `.agent/plans/real-estate-landing-page.md`, you must still follow this document: treat that ExecPlan as a living spec, keep its checklists and logs updated, and do not skip reading `.agent/PLANS.md` before executing it.

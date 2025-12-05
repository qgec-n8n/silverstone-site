# PLANS.md — ExecPlans for this repo

This file defines how to create and maintain **ExecPlans**: living execution documents that Codex and humans can use to implement multi-step work in this repository.

ExecPlans follow the pattern described in the OpenAI Cookbook article “Using PLANS.md for multi-hour problem solving (ExecPlans and PLANS.md)” and are tailored here to this codebase and to the Real Estate niche landing page work. :contentReference[oaicite:0]{index=0}


---

## 1. What is an ExecPlan?

An **ExecPlan** is a single Markdown file that:

- Describes a concrete, non-trivial piece of work in this repo (e.g. “Estate Agents Niche Landing Page”).
- Orients a complete newcomer to:
  - What we are trying to achieve.
  - Where in the repo the relevant code lives.
  - How to run the project, validate behavior, and visually inspect the result.
- Breaks the work into **milestones** and **checklisted steps** with observable outcomes.
- Is kept up-to-date as the work happens (progress, surprises, decisions, and final outcomes).

ExecPlans are written for both:

- **Codex** (to plan, execute, and justify multi-step changes).
- **Humans** (to understand what was done and how to continue or revisit it later).


---

## 2. Where ExecPlans live and how to name them

- Store all ExecPlans under:

  - `.agent/exec-plans/`

- File naming convention:

  - `YYYY-MM-DD_short-slug.md`

- Examples:

  - `.agent/exec-plans/2025-01-10_estate-agents-landing-page.md`
  - `.agent/exec-plans/2025-01-10_design-system-refactor-neon-cards.md`

- One ExecPlan should cover one coherent piece of work. A large project may have multiple ExecPlans (e.g., “estate-agents-page_v1”, “estate-agents-page_AB-testing”, etc.) if phases are meaningfully separate.


---

## 3. When to create or update an ExecPlan

Create or update an ExecPlan when:

1. **Designing or significantly changing the Real Estate niche landing page**  
   - Any work that:
     - Adds the `/niches/estate-agents` (or equivalent) route/page.
     - Reworks hero, proof strips, FAQ, CTA, or other major landing page sections.
     - Involves coordinating multiple files (HTML/JSX, CSS, JS, assets) for this page.

2. **Multi-file layout or design-system work**
   - Refactoring hero layouts, neon cards, stats cards, value cards, FAQ accordion behavior, navbar, or footers.
   - Changes that span multiple pages (index, about, book, niches, shared layouts, etc.).

3. **Any task expected to take more than a few tool calls**
   - If the work is multi-step, non-trivial, or easy to get lost in, use an ExecPlan.

You usually **do NOT** need an ExecPlan for:

- A small, single-file bug fix.
- A tiny copy tweak on one page.
- Adding a single CSS rule that is clearly localized and low-risk.

When in doubt, prefer creating a short ExecPlan; they are cheap and keep work legible.


---

## 4. Required sections of an ExecPlan

Every ExecPlan must include the following sections, in this order.

You may add subsections, but do not remove or rename these headings.

```md
# ExecPlan: <short descriptive title>

- **Status**: Draft | In Progress | Complete
- **Owner**: Codex
- **Created**: <YYYY-MM-DD>
- **Last Updated**: <YYYY-MM-DD>
- **Related Issues / Tickets**: <links or “N/A”>

## 1. Purpose / Big Picture

## 2. Context & Orientation for This Repo

## 3. Constraints, Risks & Non-Goals

## 4. Plan of Work (Milestones)

## 5. Concrete Steps (Checklist)

## 6. Progress Log

## 7. Surprises & Discoveries

## 8. Decision Log

## 9. Validation & Acceptance Criteria

## 10. Outcomes & Retrospective

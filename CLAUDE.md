# CLAUDE

Project-level instructions for Claude agents working in this workspace.

## Skill review is mandatory

Immediately after every prompt — before planning or any other action — review all
skills in `.agents/skills/` that could be relevant, shortlist every plausible one
(not just the obvious match), and read their `SKILL.md` before acting. Keep
re-reviewing skills as the work moves through each phase, and use the MCP servers
(see `.mcp.json`) actively throughout. The goal is the most futuristic, high-tech,
premium, professional, and perfectly designed result achievable.

This is binding. The full rules are in **`.agents/SKILL_REVIEW_POLICY.md`** — read
and follow it.

## Repository context

- See `AGENTS.md` for repository architecture and global guardrails.
- See `replit.md` for the Replit operating rules (active app is `/web`; the root
  HTML/CSS/JS site is a frozen legacy reference).
- See `.agents/SKILLS.md` for how skills and MCP servers are wired and reused.

## Model policy

- Sonnet is the main model for investigation, research, copywriting,
  implementation, coding, debugging and testing.
- Use Fable only for a major unresolved decision involving positioning,
  conversion strategy, page structure, substantial webcopy direction, major
  visual direction, a significant redesign or feature architecture.
- Use no more than one combined Fable consultation per substantial task.
- Before consulting Fable, Sonnet must inspect the project and reduce the
  issue to the few decisions requiring strategic judgement.
- Give Fable no more than 500 words of relevant context and request one
  preferred direction in no more than 600 words.
- Do not use Fable for implementation, routine edits, CSS, minor copy
  changes, debugging or general reassurance.
- Do not request a final Fable review unless a major strategic uncertainty
  remains.

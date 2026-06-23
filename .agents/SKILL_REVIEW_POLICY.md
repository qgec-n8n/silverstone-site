# Skill Review Policy — Mandatory

This policy is **binding for every agent** working in this workspace (Replit,
Claude, Codex, and any other agent tooling). Its goal: every result should be the
most futuristic, high-tech, premium, professional, and perfectly designed outcome
achievable — and the way we guarantee that is by always reaching for the right
skills and MCP servers instead of working from memory alone.

The full skill inventory lives in `.agents/skills/` (canonical store, wired into
`.claude/skills/` and Codex). MCP servers are defined in `.mcp.json` and mirrored
into `.codex/config.toml`. See `.agents/SKILLS.md` for the wiring.

## 1. Review skills immediately after every prompt

The moment a new user prompt arrives — before planning, before any other tool
call, before writing a single line — do a skill review:

1. **Scan the skill inventory** in `.agents/skills/` for anything relevant to the
   request. Match on the task domain, not just literal keywords (e.g. a request to
   "make the hero feel alive" should surface animation, design, and frontend
   skills even if the user never says "animation").
2. **Shortlist every plausibly-relevant skill**, not just the single most obvious
   one. Most non-trivial requests benefit from several skills working together
   (e.g. design + a specific animation library + a component library + copywriting).
3. **Read the `SKILL.md`** of each shortlisted skill before acting on its domain.
   Skills are authoritative; their instructions override generic defaults and your
   own assumptions.
4. If you suspect a capability exists but cannot find a matching skill, use the
   `find-skills` skill to search the wider ecosystem before falling back to
   unaided work.

Never skip this step because the task "seems simple." A quick scan is cheap;
shipping a generic result when a premium skill existed is the failure mode this
policy prevents.

## 2. Continuously re-review while working

Skill selection is not a one-time gate at the start — it is continuous:

- **Re-scan at every phase transition** (research → design → implementation →
  polish → testing). Each phase has its own relevant skills.
- When the work **uncovers a new sub-problem** (a chart, a form, an empty state, a
  3D element, an email, an SEO concern), pause and check for a skill covering it
  before hand-rolling a solution.
- When you **change direction** or the user adds a requirement, run the skill
  review again against the new scope.
- Prefer a documented skill workflow over improvising, even mid-task.

## 3. Use the MCP servers throughout

The configured MCP servers (see `.mcp.json`) are part of the toolset, not an
afterthought. Use them actively while building:

- Reach for the relevant MCP server whenever its domain is in play (e.g. the
  component-library registries when building or styling UI components) to pull
  real, current, high-quality components, examples, and metadata rather than
  reconstructing them from memory.
- Re-consult MCP servers as the design evolves, not only at first use.
- If an MCP server is configured but appears unavailable, surface that clearly
  rather than silently degrading to a lower-quality manual approach.

## 4. The quality bar

Every deliverable should read as futuristic, high-tech, premium, professional, and
perfectly designed. Concretely:

- Lead with a deliberate design concept; let it drive every surface, not just the
  hero. Functional surfaces (tables, forms, charts, empty states) must express the
  same level of craft.
- Use the strongest applicable tool for each part: design skills for visual
  direction, animation skills for motion, component-library skills + MCP for UI,
  domain skills (SEO, copywriting, testing, etc.) for their areas.
- Verify the result against the relevant skill's guidance before calling it done.

## 5. Honesty constraint

Only claim to have used a skill or MCP server when you actually did. If a relevant
skill or server does not exist or is unavailable, say so plainly and deliver the
best achievable result — do not fabricate capability.
